<script lang="ts">
	// ── TYPES ──────────────────────────────────────────────
	interface ForecastPeriod {
		name: string;
		temperature: number;
		temperatureUnit: string;
		windSpeed: string;
		windDirection: string;
		shortForecast: string;
		detailedForecast: string;
		isDaytime: boolean;
		probabilityOfPrecipitation?: { value: number | null };
	}

	interface NWSAlert {
		properties: {
			event: string;
			severity: string;
			certainty: string;
			urgency: string;
			headline: string;
			description: string;
			effective: string;
			expires: string;
			areaDesc: string;
		};
	}

	// ── STATE ──────────────────────────────────────────────
	let status      = $state<'idle' | 'locating' | 'loading' | 'ready' | 'error'>('idle');
	let errorMsg    = $state('');
	let locationName = $state('');
	let lat         = $state<number | null>(null);
	let lon         = $state<number | null>(null);

	// Manual coords input
	let manualLat   = $state('');
	let manualLon   = $state('');
	let showManual  = $state(false);

	// Weather data
	let forecast    = $state<ForecastPeriod[]>([]);
	let alerts      = $state<NWSAlert[]>([]);
	let updatedAt   = $state('');

	// Active tab
	let activeTab = $state<'forecast' | 'alerts' | 'impact'>('forecast');

	// ── NWS API FETCH ──────────────────────────────────────
	const HEADERS = {
		'User-Agent': 'MoonanceApp/1.0 (ranch-finance-platform)',
		'Accept': 'application/json'
	};

	async function loadWeather(latitude: number, longitude: number) {
		status = 'loading';
		errorMsg = '';

		try {
			// Step 1: Resolve grid point
			const pointsRes = await fetch(
				`https://api.weather.gov/points/${latitude.toFixed(4)},${longitude.toFixed(4)}`,
				{ headers: HEADERS }
			);
			if (!pointsRes.ok) throw new Error(`Points lookup failed (${pointsRes.status}). NWS only covers the continental US.`);
			const pointsData = await pointsRes.json();

			const { forecast: forecastUrl, relativeLocation } = pointsData.properties;
			locationName = relativeLocation?.properties
				? `${relativeLocation.properties.city}, ${relativeLocation.properties.state}`
				: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

			// Step 2: 7-day forecast
			const forecastRes = await fetch(forecastUrl, { headers: HEADERS });
			if (!forecastRes.ok) throw new Error(`Forecast fetch failed (${forecastRes.status})`);
			const forecastData = await forecastRes.json();
			forecast = forecastData.properties.periods;

			// Step 3: Active alerts
			const alertsRes = await fetch(
				`https://api.weather.gov/alerts/active?point=${latitude.toFixed(4)},${longitude.toFixed(4)}`,
				{ headers: HEADERS }
			);
			if (alertsRes.ok) {
				const alertsData = await alertsRes.json();
				alerts = alertsData.features ?? [];
			}

			updatedAt = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
			status = 'ready';

		} catch (err: any) {
			errorMsg = err.message ?? 'Unknown error fetching weather data.';
			status = 'error';
		}
	}

	// ── GEOLOCATION ────────────────────────────────────────
	function useMyLocation() {
		if (!navigator.geolocation) {
			errorMsg = 'Geolocation is not supported by your browser. Please enter coordinates manually.';
			status = 'error';
			return;
		}
		status = 'locating';
		navigator.geolocation.getCurrentPosition(
			(pos) => {
				lat = pos.coords.latitude;
				lon = pos.coords.longitude;
				loadWeather(lat, lon);
			},
			(err) => {
				errorMsg = 'Location access denied. Please enter your coordinates manually below.';
				status = 'error';
				showManual = true;
			}
		);
	}

	function submitManual() {
		const la = parseFloat(manualLat);
		const lo = parseFloat(manualLon);
		if (isNaN(la) || isNaN(lo) || la < 24 || la > 50 || lo > -66 || lo < -125) {
			errorMsg = 'Please enter valid US coordinates (e.g. lat: 35.22, lon: -101.83)';
			status = 'error';
			return;
		}
		lat = la; lon = lo;
		loadWeather(la, lo);
	}

	function refresh() {
		if (lat !== null && lon !== null) loadWeather(lat, lon);
	}

	// ── HELPERS ────────────────────────────────────────────
	function alertSeverityColor(severity: string) {
		switch (severity?.toLowerCase()) {
			case 'extreme':  return 'alert-extreme';
			case 'severe':   return 'alert-severe';
			case 'moderate': return 'alert-moderate';
			default:         return 'alert-minor';
		}
	}

	function alertIcon(event: string) {
		const e = event?.toLowerCase() ?? '';
		if (e.includes('tornado'))          return '🌪️';
		if (e.includes('thunderstorm'))     return '⛈️';
		if (e.includes('flood'))            return '🌊';
		if (e.includes('drought'))          return '☀️';
		if (e.includes('frost') || e.includes('freeze')) return '🧊';
		if (e.includes('wind'))             return '💨';
		if (e.includes('snow') || e.includes('blizzard') || e.includes('winter')) return '❄️';
		if (e.includes('fire'))             return '🔥';
		if (e.includes('heat'))             return '🌡️';
		return '⚠️';
	}

	function financialImpact(event: string): string {
		const e = event?.toLowerCase() ?? '';
		if (e.includes('drought'))  return 'High impact: Hay and forage yields at risk. Review feed reserves and consider early herd reduction.';
		if (e.includes('frost') || e.includes('freeze')) return 'High impact: Protect young livestock. Newborn calves especially vulnerable below 32°F.';
		if (e.includes('flood'))    return 'High impact: Pasture and field access may be cut off. Check fence lines and low-lying areas.';
		if (e.includes('tornado'))  return 'Extreme impact: Secure livestock immediately. Move to high-ground pens if possible.';
		if (e.includes('thunderstorm')) return 'Moderate impact: Lightning risk to livestock in open pasture. Consider moving to covered areas.';
		if (e.includes('wind'))     return 'Moderate impact: High winds may damage structures and fencing. Check feedlot windbreaks.';
		if (e.includes('heat'))     return 'High impact: Cattle heat stress reduces gain and reproduction. Ensure shade and water access.';
		if (e.includes('fire'))     return 'Extreme impact: Protect feed stores and structures. Have evacuation plan ready for livestock.';
		if (e.includes('snow') || e.includes('blizzard') || e.includes('winter'))
			return 'High impact: Increase feed rations. Check water sources for freezing. Monitor newborns closely.';
		return 'Monitor conditions. Check livestock water, feed access, and shelter as needed.';
	}

	function precipIcon(prob: number | null | undefined): string {
		if (prob == null) return '';
		if (prob >= 70)   return '🌧️';
		if (prob >= 40)   return '🌦️';
		if (prob >= 10)   return '⛅';
		return '☀️';
	}

	function tempColor(temp: number, unit: string): string {
		const f = unit === 'C' ? temp * 9/5 + 32 : temp;
		if (f >= 100) return 'temp-extreme';
		if (f >= 90)  return 'temp-hot';
		if (f <= 28)  return 'temp-freeze';
		if (f <= 40)  return 'temp-cold';
		return '';
	}

	function fmtExpiry(iso: string): string {
		return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
	}

	// Daytime-only periods for 7-day view
	let daytimeForecast = $derived(forecast.filter(p => p.isDaytime).slice(0, 7));
</script>

<svelte:head>
	<title>Weather Intelligence — Moonance</title>
</svelte:head>

<div class="page">

	<!-- ── PAGE HEADER ── -->
	<header class="page-header">
		<div>
			<div class="eyebrow">Risk & Weather Intelligence</div>
			<h1 class="page-title">Weather Intelligence</h1>
		</div>
		{#if status === 'ready'}
			<div class="header-meta">
				<span class="location-badge">📍 {locationName}</span>
				<button class="btn-ghost-sm" onclick={refresh}>↻ Refresh</button>
			</div>
		{/if}
	</header>

	<!-- ════════════════════════════════════ -->
	<!--  IDLE / ENTRY STATE                 -->
	<!-- ════════════════════════════════════ -->
	{#if status === 'idle' || status === 'error'}

		<div class="entry-card">
			<div class="entry-icon">🌦️</div>
			<h2 class="entry-title">Get Weather for Your Operation</h2>
			<p class="entry-desc">
				Pull live NWS forecasts, active alerts, and ranch-relevant risk analysis for your exact location.
				No account or API key required — powered by the National Weather Service.
			</p>

			{#if errorMsg}
				<div class="error-banner">⚠️ {errorMsg}</div>
			{/if}

			<button class="btn-primary wide" onclick={useMyLocation}>
				📍 Use My Location
			</button>

			<button class="link-btn" onclick={() => showManual = !showManual}>
				{showManual ? '− Hide' : '+ Enter'} coordinates manually
			</button>

			{#if showManual}
				<div class="manual-form">
					<div class="form-row">
						<div class="form-group">
							<label class="form-label" for="mlat">Latitude</label>
							<input class="form-input" id="mlat" type="number" placeholder="35.2271" step="0.0001" bind:value={manualLat} />
						</div>
						<div class="form-group">
							<label class="form-label" for="mlon">Longitude</label>
							<input class="form-input" id="mlon" type="number" placeholder="-101.8313" step="0.0001" bind:value={manualLon} />
						</div>
					</div>
					<p class="manual-hint">U.S. continental coordinates only. Example: Amarillo, TX → 35.2271, -101.8313</p>
					<button class="btn-primary" onclick={submitManual}>Load Weather</button>
				</div>
			{/if}
		</div>

		<div class="notice">
			🇺🇸 The NWS API covers the continental United States only. International locations are not supported.
		</div>

	<!-- ════════════════════════════════════ -->
	<!--  LOADING STATES                     -->
	<!-- ════════════════════════════════════ -->
	{:else if status === 'locating' || status === 'loading'}

		<div class="loading-card">
			<div class="spinner"></div>
			<div class="loading-text">
				{status === 'locating' ? 'Detecting your location…' : 'Fetching NWS weather data…'}
			</div>
			<div class="loading-sub">Connecting to api.weather.gov</div>
		</div>

	<!-- ════════════════════════════════════ -->
	<!--  READY — WEATHER DATA               -->
	<!-- ════════════════════════════════════ -->
	{:else if status === 'ready'}

		<!-- Alert banner if active alerts exist -->
		{#if alerts.length > 0}
			<div class="alert-banner">
				<span class="alert-banner-icon">🚨</span>
				<span>
					<strong>{alerts.length} active NWS {alerts.length === 1 ? 'alert' : 'alerts'}</strong>
					for your area — {alerts.map(a => a.properties.event).join(', ')}
				</span>
				<button class="alert-banner-btn" onclick={() => activeTab = 'alerts'}>View Alerts →</button>
			</div>
		{/if}

		<!-- Current conditions (first period) -->
		{#if forecast.length > 0}
			{@const now = forecast[0]}
			{@const precip = now.probabilityOfPrecipitation?.value}
			<div class="current-card">
				<div class="current-left">
					<div class="section-label">Current Conditions · {now.name}</div>
					<div class="current-temp {tempColor(now.temperature, now.temperatureUnit)}">
						{now.temperature}°{now.temperatureUnit}
					</div>
					<div class="current-desc">{now.shortForecast}</div>
					<div class="current-meta">
						{#if precip != null}<span>🌧 {precip}% precip</span>{/if}
						<span>💨 {now.windSpeed} {now.windDirection}</span>
					</div>
				</div>
				<div class="current-right">
					<div class="current-detail">{now.detailedForecast}</div>
				</div>
			</div>
		{/if}

		<!-- Tabs -->
		<div class="tabs">
			<button class="tab" class:active={activeTab === 'forecast'} onclick={() => activeTab = 'forecast'}>
				7-Day Forecast
			</button>
			<button class="tab" class:active={activeTab === 'alerts'} onclick={() => activeTab = 'alerts'}>
				Active Alerts {#if alerts.length > 0}<span class="tab-badge">{alerts.length}</span>{/if}
			</button>
			<button class="tab" class:active={activeTab === 'impact'} onclick={() => activeTab = 'impact'}>
				Ranch Impact
			</button>
		</div>

		<!-- ── 7-DAY FORECAST ── -->
		{#if activeTab === 'forecast'}

			<div class="forecast-grid">
				{#each daytimeForecast as period}
					{@const precip = period.probabilityOfPrecipitation?.value}
					<div class="forecast-card">
						<div class="forecast-day">{period.name}</div>
						<div class="forecast-icon">{precipIcon(precip)}</div>
						<div class="forecast-temp {tempColor(period.temperature, period.temperatureUnit)}">
							{period.temperature}°{period.temperatureUnit}
						</div>
						<div class="forecast-short">{period.shortForecast}</div>
						{#if precip != null}
							<div class="forecast-precip">💧 {precip}%</div>
						{/if}
						<div class="forecast-wind">💨 {period.windSpeed}</div>
					</div>
				{/each}
			</div>

			<!-- Full period list (day + night) -->
			<div class="card">
				<div class="section-label">Full 7-Day Detail</div>
				<div class="period-list">
					{#each forecast.slice(0, 14) as period}
						{@const precip = period.probabilityOfPrecipitation?.value}
						<div class="period-row" class:night={!period.isDaytime}>
							<div class="period-name">{period.name}</div>
							<div class="period-temp {tempColor(period.temperature, period.temperatureUnit)}">
								{period.temperature}°{period.temperatureUnit}
							</div>
							{#if precip != null}
								<div class="period-precip mono">💧 {precip}%</div>
							{/if}
							<div class="period-wind mono muted">{period.windSpeed} {period.windDirection}</div>
							<div class="period-short muted">{period.shortForecast}</div>
						</div>
					{/each}
				</div>
			</div>

		<!-- ── ACTIVE ALERTS ── -->
		{:else if activeTab === 'alerts'}

			{#if alerts.length === 0}
				<div class="no-alerts">
					<div class="no-alerts-icon">✅</div>
					<div class="no-alerts-title">No active alerts for your area</div>
					<div class="no-alerts-sub">The NWS has issued no watches, warnings, or advisories for {locationName} at this time.</div>
				</div>
			{:else}
				<div class="alerts-list">
					{#each alerts as alert}
						{@const p = alert.properties}
						<div class="alert-card {alertSeverityColor(p.severity)}">
							<div class="alert-header">
								<div class="alert-title">
									<span class="alert-icon-lg">{alertIcon(p.event)}</span>
									<div>
										<div class="alert-event">{p.event}</div>
										<div class="alert-area muted">{p.areaDesc}</div>
									</div>
								</div>
								<div class="alert-badges">
									<span class="sev-badge sev-{p.severity?.toLowerCase()}">{p.severity}</span>
									<span class="sev-badge urg-{p.urgency?.toLowerCase()}">{p.urgency}</span>
								</div>
							</div>
							{#if p.headline}
								<div class="alert-headline">{p.headline}</div>
							{/if}
							<div class="alert-body">{p.description}</div>
							<div class="alert-expiry mono muted">
								Expires: {fmtExpiry(p.expires)}
							</div>
						</div>
					{/each}
				</div>
			{/if}

		<!-- ── RANCH IMPACT ── -->
		{:else if activeTab === 'impact'}

			<!-- Alert impacts -->
			{#if alerts.length > 0}
				<div class="card">
					<div class="section-label">Active Alert Impact on Your Operation</div>
					<div class="impact-list">
						{#each alerts as alert}
							{@const p = alert.properties}
							<div class="impact-row">
								<div class="impact-header">
									<span class="impact-icon">{alertIcon(p.event)}</span>
									<span class="impact-event">{p.event}</span>
								</div>
								<div class="impact-body">{financialImpact(p.event)}</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Forecast-based ranch notes -->
			<div class="card">
				<div class="section-label">7-Day Ranch Outlook</div>
				<div class="outlook-list">
					{#each daytimeForecast as period}
						{@const precip = period.probabilityOfPrecipitation?.value ?? 0}
						{@const isHot = (period.temperatureUnit === 'F' ? period.temperature : period.temperature * 9/5 + 32) >= 95}
						{@const isFreezing = (period.temperatureUnit === 'F' ? period.temperature : period.temperature * 9/5 + 32) <= 32}
						{@const isRainy = precip >= 60}
						<div class="outlook-row">
							<div class="outlook-day">{period.name}</div>
							<div class="outlook-temp {tempColor(period.temperature, period.temperatureUnit)}">
								{period.temperature}°{period.temperatureUnit}
							</div>
							<div class="outlook-notes">
								{#if isHot}
									<span class="ranch-tag tag-warn">🌡️ Heat stress risk — ensure shade & water</span>
								{/if}
								{#if isFreezing}
									<span class="ranch-tag tag-freeze">🧊 Freeze risk — monitor newborns & water lines</span>
								{/if}
								{#if isRainy}
									<span class="ranch-tag tag-rain">🌧️ High precip — limit field equipment use</span>
								{:else if precip < 20}
									<span class="ranch-tag tag-dry">☀️ Dry — good for hay cutting & curing</span>
								{/if}
								{#if !isHot && !isFreezing && !isRainy && precip >= 20}
									<span class="ranch-tag tag-ok">✅ Favorable conditions</span>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			</div>

			<div class="notice">
				Ranch impact notes are generated from NWS forecast data. Always verify conditions locally before making operational decisions.
			</div>

		{/if}

		<div class="data-credit">
			Data from <a href="https://api.weather.gov" target="_blank" rel="noopener">api.weather.gov</a> · National Weather Service · Updated {updatedAt}
		</div>

	{/if}

</div>

<style>
	/* ── TOKENS ── */
	:root {
		--soil:  #0F0A04;
		--earth: #1C1208;
		--bark:  #2E1E0A;
		--rust:  #C4541A;
		--amber: #D4922A;
		--wheat: #E8C87A;
		--cream: #F0E8D5;
		--muted: #8A7A62;
		--sage:  #6B8F5E;
		--green: #5A9E5A;
		--red:   #C44040;
		--sky:   #7FB5C8;
		--blue:  #4A8FB5;
	}

	/* ── PAGE ── */
	.page { display: flex; flex-direction: column; gap: 24px; max-width: 1000px; }

	/* ── HEADER ── */
	.page-header {
		display: flex; align-items: flex-end;
		justify-content: space-between; flex-wrap: wrap; gap: 12px;
		padding-bottom: 24px;
		border-bottom: 1px solid rgba(212,146,42,.12);
	}
	.eyebrow {
		font-family: 'DM Mono', monospace; font-size: 11px;
		letter-spacing: .18em; text-transform: uppercase; color: var(--amber); margin-bottom: 6px;
	}
	.page-title {
		font-family: 'Lora', serif; font-size: clamp(22px, 3vw, 32px);
		font-weight: 700; color: var(--cream); line-height: 1.1;
	}
	.header-meta { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
	.location-badge {
		font-family: 'DM Mono', monospace; font-size: 12px;
		color: var(--wheat); background: rgba(232,200,122,.1);
		border: 1px solid rgba(232,200,122,.2);
		padding: 5px 12px; border-radius: 4px;
	}
	.btn-ghost-sm {
		background: none; border: 1px solid rgba(138,122,98,.3);
		color: var(--muted); padding: 7px 14px; border-radius: 5px;
		font-size: 12px; cursor: pointer; transition: color .18s, border-color .18s;
		font-family: 'DM Mono', monospace;
	}
	.btn-ghost-sm:hover { color: var(--cream); border-color: var(--muted); }

	/* ── ENTRY CARD ── */
	.entry-card {
		background: var(--bark);
		border: 1px solid rgba(212,146,42,.15);
		border-radius: 10px; padding: 40px 36px;
		display: flex; flex-direction: column;
		align-items: center; gap: 18px;
		max-width: 520px; margin: 0 auto; width: 100%; text-align: center;
	}
	.entry-icon { font-size: 48px; }
	.entry-title { font-family: 'Lora', serif; font-size: 22px; font-weight: 700; color: var(--cream); }
	.entry-desc  { font-size: 14px; color: var(--muted); line-height: 1.7; }

	.btn-primary {
		background: var(--rust); color: var(--cream); border: none;
		border-radius: 5px; padding: 12px 24px;
		font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500;
		cursor: pointer; transition: background .18s, transform .15s;
	}
	.btn-primary:hover { background: #D4621F; transform: translateY(-1px); }
	.btn-primary.wide  { width: 100%; }

	.link-btn {
		background: none; border: none; cursor: pointer;
		color: var(--amber); font-size: 13px;
		font-family: 'DM Mono', monospace; letter-spacing: .06em;
		text-decoration: underline; text-underline-offset: 3px;
		transition: color .18s;
	}
	.link-btn:hover { color: var(--wheat); }

	/* ── MANUAL FORM ── */
	.manual-form {
		width: 100%; display: flex; flex-direction: column; gap: 12px;
		border-top: 1px solid rgba(212,146,42,.12); padding-top: 18px;
	}
	.form-row   { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; width: 100%; }
	.form-group { display: flex; flex-direction: column; gap: 7px; text-align: left; }
	.form-label {
		font-family: 'DM Mono', monospace; font-size: 10px;
		letter-spacing: .12em; text-transform: uppercase; color: var(--muted);
	}
	.form-input {
		background: rgba(255,255,255,.04); border: 1px solid rgba(212,146,42,.18);
		color: var(--cream); padding: 10px 14px; border-radius: 5px;
		font-size: 14px; font-family: 'DM Sans', sans-serif;
		transition: border-color .18s; width: 100%;
	}
	.form-input:focus { outline: none; border-color: var(--amber); }
	.manual-hint { font-size: 11px; color: var(--muted); font-family: 'DM Mono', monospace; text-align: left; }

	/* ── ERRORS & NOTICES ── */
	.error-banner {
		background: rgba(196,64,64,.1); border: 1px solid rgba(196,64,64,.3);
		color: #E08080; border-radius: 6px; padding: 12px 16px;
		font-size: 13px; width: 100%; text-align: left; line-height: 1.6;
	}
	.notice {
		font-family: 'DM Mono', monospace; font-size: 11px; color: var(--muted);
		background: rgba(212,146,42,.05); border: 1px solid rgba(212,146,42,.12);
		border-radius: 6px; padding: 12px 16px; line-height: 1.65;
	}

	/* ── LOADING ── */
	.loading-card {
		display: flex; flex-direction: column; align-items: center;
		justify-content: center; gap: 18px;
		background: var(--bark); border: 1px solid rgba(212,146,42,.12);
		border-radius: 10px; padding: 60px 40px;
	}
	.spinner {
		width: 36px; height: 36px; border-radius: 50%;
		border: 3px solid rgba(212,146,42,.2);
		border-top-color: var(--amber);
		animation: spin .8s linear infinite;
	}
	@keyframes spin { to { transform: rotate(360deg); } }
	.loading-text { font-family: 'Lora', serif; font-size: 17px; color: var(--cream); }
	.loading-sub  { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--muted); }

	/* ── ALERT BANNER ── */
	.alert-banner {
		display: flex; align-items: center; gap: 14px; flex-wrap: wrap;
		background: rgba(196,64,64,.12);
		border: 1px solid rgba(196,64,64,.35);
		border-radius: 7px; padding: 14px 18px;
		font-size: 14px; color: #E08080;
	}
	.alert-banner-icon { font-size: 18px; flex-shrink: 0; }
	.alert-banner strong { color: var(--cream); }
	.alert-banner-btn {
		margin-left: auto; background: none;
		border: 1px solid rgba(196,64,64,.4);
		color: #E08080; padding: 6px 14px; border-radius: 4px;
		font-size: 12px; cursor: pointer; white-space: nowrap;
		transition: background .18s;
	}
	.alert-banner-btn:hover { background: rgba(196,64,64,.15); }

	/* ── CURRENT CONDITIONS ── */
	.current-card {
		background: var(--bark);
		border: 1px solid rgba(212,146,42,.2);
		border-radius: 10px; padding: 28px 28px;
		display: grid; grid-template-columns: auto 1fr; gap: 40px;
		align-items: start;
	}
	.current-temp {
		font-family: 'Lora', serif; font-size: 64px;
		font-weight: 700; color: var(--cream); line-height: 1;
		margin: 8px 0 6px;
	}
	.current-desc { font-size: 16px; color: var(--wheat); margin-bottom: 10px; }
	.current-meta { display: flex; gap: 18px; font-family: 'DM Mono', monospace; font-size: 12px; color: var(--muted); flex-wrap: wrap; }
	.current-detail { font-size: 14px; color: var(--muted); line-height: 1.75; padding-top: 32px; }

	/* ── TEMP COLORS ── */
	:global(.temp-extreme) { color: #FF4444 !important; }
	:global(.temp-hot)     { color: #FF8C44 !important; }
	:global(.temp-freeze)  { color: #7FB5C8 !important; }
	:global(.temp-cold)    { color: #A8CFDC !important; }

	/* ── TABS ── */
	.tabs {
		display: flex; gap: 2px;
		border-bottom: 1px solid rgba(212,146,42,.12); flex-wrap: wrap;
	}
	.tab {
		background: none; border: none;
		border-bottom: 2px solid transparent;
		padding: 10px 18px; margin-bottom: -1px;
		font-family: 'DM Sans', sans-serif; font-size: 14px;
		color: var(--muted); cursor: pointer;
		transition: color .18s, border-color .18s;
		display: flex; align-items: center; gap: 7px;
	}
	.tab:hover  { color: var(--cream); }
	.tab.active { color: var(--wheat); border-bottom-color: var(--amber); }
	.tab-badge {
		background: var(--red); color: white;
		font-size: 10px; font-weight: 700;
		padding: 1px 6px; border-radius: 10px;
	}

	/* ── FORECAST GRID ── */
	.forecast-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
		gap: 12px;
	}
	.forecast-card {
		background: var(--bark);
		border: 1px solid rgba(212,146,42,.12);
		border-radius: 8px; padding: 16px 12px;
		display: flex; flex-direction: column;
		align-items: center; gap: 7px; text-align: center;
		transition: border-color .2s, transform .2s;
	}
	.forecast-card:hover { border-color: rgba(212,146,42,.3); transform: translateY(-2px); }
	.forecast-day {
		font-family: 'DM Mono', monospace; font-size: 10px;
		letter-spacing: .1em; text-transform: uppercase; color: var(--muted);
	}
	.forecast-icon  { font-size: 22px; }
	.forecast-temp  { font-family: 'Lora', serif; font-size: 24px; font-weight: 700; color: var(--cream); }
	.forecast-short { font-size: 11px; color: var(--muted); line-height: 1.4; }
	.forecast-precip { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--sky); }
	.forecast-wind   { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--muted); }

	/* ── PERIOD LIST ── */
	.card {
		background: var(--bark); border: 1px solid rgba(212,146,42,.12);
		border-radius: 8px; padding: 22px 24px;
		display: flex; flex-direction: column; gap: 14px;
	}
	.section-label {
		font-family: 'DM Mono', monospace; font-size: 10px;
		letter-spacing: .18em; text-transform: uppercase; color: var(--amber);
	}
	.period-list { display: flex; flex-direction: column; }
	.period-row {
		display: grid;
		grid-template-columns: 120px 60px 60px 100px 1fr;
		align-items: center; gap: 12px;
		padding: 10px 0;
		border-bottom: 1px solid rgba(255,255,255,.04);
		font-size: 13px; color: var(--cream);
	}
	.period-row:last-child { border-bottom: none; }
	.period-row.night { opacity: .7; }
	.period-name { font-weight: 500; }

	/* ── ALERTS ── */
	.alerts-list { display: flex; flex-direction: column; gap: 14px; }
	.alert-card {
		border-radius: 8px; padding: 22px 22px;
		display: flex; flex-direction: column; gap: 12px;
	}
	.alert-extreme { background: rgba(196,64,64,.12); border: 1px solid rgba(196,64,64,.4); }
	.alert-severe  { background: rgba(196,120,40,.12); border: 1px solid rgba(196,120,40,.4); }
	.alert-moderate{ background: rgba(212,146,42,.1);  border: 1px solid rgba(212,146,42,.3); }
	.alert-minor   { background: rgba(107,143,94,.08); border: 1px solid rgba(107,143,94,.25); }

	.alert-header { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px; }
	.alert-title  { display: flex; align-items: flex-start; gap: 14px; }
	.alert-icon-lg { font-size: 24px; flex-shrink: 0; margin-top: 2px; }
	.alert-event  { font-family: 'Lora', serif; font-size: 17px; font-weight: 600; color: var(--cream); }
	.alert-area   { font-size: 12px; margin-top: 3px; }
	.alert-badges { display: flex; gap: 8px; flex-wrap: wrap; }
	.sev-badge {
		font-family: 'DM Mono', monospace; font-size: 9px;
		letter-spacing: .1em; text-transform: uppercase;
		padding: 3px 9px; border-radius: 3px;
	}
	.sev-extreme { background: rgba(196,64,64,.2);  color: #E08080; border: 1px solid rgba(196,64,64,.4); }
	.sev-severe  { background: rgba(196,120,40,.2); color: #E0A060; border: 1px solid rgba(196,120,40,.4); }
	.sev-moderate{ background: rgba(212,146,42,.2); color: var(--amber); border: 1px solid rgba(212,146,42,.4); }
	.sev-minor   { background: rgba(107,143,94,.2); color: var(--sage); border: 1px solid rgba(107,143,94,.4); }
	.urg-immediate{ background: rgba(196,64,64,.15);  color: #E08080; border: 1px solid rgba(196,64,64,.3); }
	.urg-expected { background: rgba(212,146,42,.15); color: var(--amber); border: 1px solid rgba(212,146,42,.3); }
	.urg-future   { background: rgba(107,143,94,.12); color: var(--sage); border: 1px solid rgba(107,143,94,.25); }
	.urg-unknown  { background: rgba(138,122,98,.12); color: var(--muted); border: 1px solid rgba(138,122,98,.25); }

	.alert-headline { font-size: 14px; font-weight: 500; color: var(--wheat); line-height: 1.5; }
	.alert-body     { font-size: 13px; color: var(--muted); line-height: 1.75; white-space: pre-wrap; max-height: 180px; overflow-y: auto; }
	.alert-expiry   { font-size: 11px; }

	/* ── NO ALERTS ── */
	.no-alerts {
		display: flex; flex-direction: column; align-items: center;
		gap: 12px; text-align: center; padding: 60px 40px;
		background: var(--bark); border: 1px solid rgba(107,143,94,.2); border-radius: 10px;
	}
	.no-alerts-icon  { font-size: 40px; }
	.no-alerts-title { font-family: 'Lora', serif; font-size: 18px; color: var(--cream); }
	.no-alerts-sub   { font-size: 13px; color: var(--muted); max-width: 400px; line-height: 1.7; }

	/* ── RANCH IMPACT ── */
	.impact-list { display: flex; flex-direction: column; gap: 12px; }
	.impact-row {
		padding: 16px; background: rgba(212,146,42,.04);
		border: 1px solid rgba(212,146,42,.1); border-radius: 6px;
		display: flex; flex-direction: column; gap: 8px;
	}
	.impact-header { display: flex; align-items: center; gap: 10px; }
	.impact-icon  { font-size: 18px; }
	.impact-event { font-family: 'Lora', serif; font-size: 15px; font-weight: 600; color: var(--wheat); }
	.impact-body  { font-size: 13px; color: var(--muted); line-height: 1.7; }

	.outlook-list { display: flex; flex-direction: column; gap: 2px; }
	.outlook-row {
		display: flex; align-items: center; flex-wrap: wrap; gap: 12px;
		padding: 12px 0;
		border-bottom: 1px solid rgba(255,255,255,.04);
	}
	.outlook-row:last-child { border-bottom: none; }
	.outlook-day {
		font-family: 'DM Mono', monospace; font-size: 11px;
		color: var(--muted); text-transform: uppercase; letter-spacing: .1em;
		width: 80px; flex-shrink: 0;
	}
	.outlook-temp {
		font-family: 'Lora', serif; font-size: 18px; font-weight: 600;
		color: var(--cream); width: 56px; flex-shrink: 0;
	}
	.outlook-notes { display: flex; flex-wrap: wrap; gap: 8px; }
	.ranch-tag {
		font-family: 'DM Mono', monospace; font-size: 10px;
		padding: 4px 10px; border-radius: 4px;
	}
	.tag-warn   { background: rgba(196,64,64,.12);  color: #E08080; border: 1px solid rgba(196,64,64,.25); }
	.tag-freeze { background: rgba(127,181,200,.12); color: var(--sky); border: 1px solid rgba(127,181,200,.25); }
	.tag-rain   { background: rgba(74,143,181,.12);  color: #7BAEC8; border: 1px solid rgba(74,143,181,.25); }
	.tag-dry    { background: rgba(212,146,42,.1);   color: var(--amber); border: 1px solid rgba(212,146,42,.22); }
	.tag-ok     { background: rgba(107,143,94,.12);  color: var(--sage); border: 1px solid rgba(107,143,94,.25); }

	/* ── DATA CREDIT ── */
	.data-credit {
		font-family: 'DM Mono', monospace; font-size: 10px;
		color: rgba(138,122,98,.4); text-align: right;
	}
	.data-credit a { color: rgba(138,122,98,.6); }

	/* ── UTILS ── */
	.mono  { font-family: 'DM Mono', monospace; font-size: 12px; }
	.muted { color: var(--muted); }

	/* ── RESPONSIVE ── */
	@media (max-width: 640px) {
		.current-card { grid-template-columns: 1fr; gap: 20px; }
		.period-row   { grid-template-columns: 90px 50px 1fr; }
		.period-row > :nth-child(4) { display: none; }
		.forecast-grid { grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); }
		.form-row { grid-template-columns: 1fr; }
	}
</style>