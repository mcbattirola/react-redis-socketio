# React-Socket.io-Redis POC

This is a project to play around with socket.io, keeping data on Redis and consuming in a React front end.

The project has an Express backend with Postgres as database

## How to Run

1. Install dependencies

    cd into ```/client``` and run:

    ```bash
    yarn install
    ```

    cd into ```/server``` and run

    ```bash
    yarn install
    ```

2. Start Redis and Postgres

    ```bash
    docker-compose up
    ```

3. Start both client and server

    ```bash
    cd server && yarn start
    cd client && yarn start
    ```
    (server will start in 3000, client in 3001)

Now we can access ```localhost:3001``` and test it.