<h1>nearvendor Backend
  <a
    href="http://nestjs.com/"
    target="blank"
  >
    <img
      src="https://nestjs.com/img/logo_text.svg"
      width="65"
      alt="Nest Logo"
    />
  </a>
</h1>

## Description

Developing

## Start Guide

### Prerequisite

- Docker (https://docs.docker.com/get-docker/)
- Docker Compose (https://docs.docker.com/compose/install/)
- Postgres (https://www.postgresql.org/download/)
- Redis (https://redis.io/docs/getting-started/installation/)
- Node (You can install node using nvm by following steps)
    - `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash`
    - `source ~/.bashrc`
    - `nvm install 18.17.0`

**Note:** If you will run this project using docker compose you don't need to install Node, Postgres and Redis as this
is included in docker compose.

### Outside Docker containers

- Create .env file `cp .env.example .env` and replace existing env variables
- Install dependencies `yarn`
- Start the app `yarn start:dev` (app will be exposed through the port mentioned in env default is 3836)

### Inside Docker containers

Just run already prepared bash script:

```bash
$ ./init
```

It will setupd the project for you (starting docker-compose stack, running migrations).
The NestJS app running in dev mode will be expose on `http://localhost:3836` (port 3836)

For IDE autocompletion to work, run `yarn` on the host machine.
