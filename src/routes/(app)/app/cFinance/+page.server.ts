import { fail } from "@sveltejs/kit";
import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "$lib/server/db";
import {
  financeEntriesTable,
  herdGroupsTable
} from "$lib/server/db/schema";

function toNumber(value: unknown) {
  const num = Number(value);
  return Number.isFinite(num) ? num : NaN;
}

export const load = async ({ locals }) => {
  const user = locals.user;

  if (!user) {
    return {
      incomeEntries: [],
      expenseEntries: [],
      herdGroups: []
    };
  }

  const financeEntries = await db
    .select()
    .from(financeEntriesTable)
    .where(eq(financeEntriesTable.userId, user.id))
    .orderBy(desc(financeEntriesTable.createdAt));

  const herdGroups = await db
    .select()
    .from(herdGroupsTable)
    .where(eq(herdGroupsTable.userId, user.id))
    .orderBy(asc(herdGroupsTable.createdAt));

  return {
    incomeEntries: financeEntries
      .filter((entry) => entry.type === "income")
      .map((entry) => ({
        id: entry.id,
        type: "income" as const,
        category: entry.category,
        description: entry.description,
        amount: Number(entry.amount),
        date: entry.entryDate
      })),

    expenseEntries: financeEntries
      .filter((entry) => entry.type === "expense")
      .map((entry) => ({
        id: entry.id,
        type: "expense" as const,
        category: entry.category,
        description: entry.description,
        amount: Number(entry.amount),
        date: entry.entryDate
      })),

    herdGroups: herdGroups.map((group) => ({
      id: group.id,
      breed: group.breed,
      count: group.count,
      avgWeightLbs: Number(group.avgWeightLbs),
      pricePerCwt: Number(group.pricePerCwt)
    }))
  };
};

export const actions = {
  saveIncome: async ({ request, locals }) => {
    const user = locals.user;
    if (!user) return fail(401, { error: "Unauthorized" });

    const form = await request.formData();

    const category = String(form.get("category") ?? "").trim();
    const description = String(form.get("description") ?? "").trim();
    const amount = toNumber(form.get("amount"));
    const date = String(form.get("date") ?? "").trim();

    if (!category || !description || !date || Number.isNaN(amount) || amount <= 0) {
      return fail(400, { error: "Invalid income entry." });
    }

    await db.insert(financeEntriesTable).values({
      userId: user.id,
      type: "income",
      category,
      description,
      amount: amount.toFixed(2),
      entryDate: date
    });

    return { success: true, type: "income" };
  },

  saveExpense: async ({ request, locals }) => {
    const user = locals.user;
    if (!user) return fail(401, { error: "Unauthorized" });

    const form = await request.formData();

    const category = String(form.get("category") ?? "").trim();
    const description = String(form.get("description") ?? "").trim();
    const amount = toNumber(form.get("amount"));
    const date = String(form.get("date") ?? "").trim();

    if (!category || !description || !date || Number.isNaN(amount) || amount <= 0) {
      return fail(400, { error: "Invalid expense entry." });
    }

    await db.insert(financeEntriesTable).values({
      userId: user.id,
      type: "expense",
      category,
      description,
      amount: amount.toFixed(2),
      entryDate: date
    });

    return { success: true, type: "expense" };
  },

  addHerdGroup: async ({ request, locals }) => {
    const user = locals.user;
    if (!user) return fail(401, { error: "Unauthorized" });

    const form = await request.formData();

    const breed = String(form.get("breed") ?? "").trim();
    const count = toNumber(form.get("count"));
    const avgWeightLbs = toNumber(form.get("avgWeightLbs"));
    const pricePerCwt = toNumber(form.get("pricePerCwt"));

    if (
      !breed ||
      Number.isNaN(count) ||
      Number.isNaN(avgWeightLbs) ||
      Number.isNaN(pricePerCwt) ||
      count < 0 ||
      avgWeightLbs < 0 ||
      pricePerCwt < 0
    ) {
      return fail(400, { error: "Invalid herd group." });
    }

    await db.insert(herdGroupsTable).values({
      userId: user.id,
      breed,
      count: Math.trunc(count),
      avgWeightLbs: avgWeightLbs.toFixed(2),
      pricePerCwt: pricePerCwt.toFixed(2)
    });

    return { success: true, type: "herd-add" };
  },

  updateHerdGroup: async ({ request, locals }) => {
    const user = locals.user;
    if (!user) return fail(401, { error: "Unauthorized" });

    const form = await request.formData();

    const id = String(form.get("id") ?? "").trim();
    const breed = String(form.get("breed") ?? "").trim();
    const count = toNumber(form.get("count"));
    const avgWeightLbs = toNumber(form.get("avgWeightLbs"));
    const pricePerCwt = toNumber(form.get("pricePerCwt"));

    if (
      !id ||
      !breed ||
      Number.isNaN(count) ||
      Number.isNaN(avgWeightLbs) ||
      Number.isNaN(pricePerCwt) ||
      count < 0 ||
      avgWeightLbs < 0 ||
      pricePerCwt < 0
    ) {
      return fail(400, { error: "Invalid herd update." });
    }

    await db
      .update(herdGroupsTable)
      .set({
        breed,
        count: Math.trunc(count),
        avgWeightLbs: avgWeightLbs.toFixed(2),
        pricePerCwt: pricePerCwt.toFixed(2),
        updatedAt: new Date()
      })
      .where(
        and(
          eq(herdGroupsTable.id, id),
          eq(herdGroupsTable.userId, user.id)
        )
      );

    return { success: true, type: "herd-update" };
  },

  deleteHerdGroup: async ({ request, locals }) => {
    const user = locals.user;
    if (!user) return fail(401, { error: "Unauthorized" });

    const form = await request.formData();
    const id = String(form.get("id") ?? "").trim();

    if (!id) {
      return fail(400, { error: "Missing herd group id." });
    }

    await db
      .delete(herdGroupsTable)
      .where(
        and(
          eq(herdGroupsTable.id, id),
          eq(herdGroupsTable.userId, user.id)
        )
      );

    return { success: true, type: "herd-delete" };
  }
};