# moonance

Moonance is the premier financial platform for cattle ranchers.

## Developing
1. Have docker 
2. Run this: `docker-compose up` to start db container.
    - If you can't get a port because you already have a postgres database on docker, maybe stop it: `docker stop $(docker ps -a -q)
3. Run the database migrations: `npx drizzle-kit migrate`
4. Start the web app baby: `pnpm run dev` 
    -  No pnpm? [Install It.](https://pnpm.io/)

## Q&A
Why not run the app in a docker container why is it run locally. 
- Really slow disk performance when using docker on windows.
