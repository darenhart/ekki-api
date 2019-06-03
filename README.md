## Ekki backend api

Backend for Ekki app<br>
NodeJS + MongoDB<br>
https://intense-escarpment-22778.herokuapp.com
<br>
Frontend: https://ekki-app-10231.herokuapp.com/

## Available Scripts

In the project directory, you can run:

### `npm serve`

Runs `nodemon server.js`<br>
Serve the app in the development mode<br>
Open [http://localhost:8080](http://localhost:8080) to view it in the browser.

### `npm seed`

Runs `node seed.js`<br>
Seed User and Transaction collections

## API

### User

- `GET /user/` list users
- `GET /user/current` get logged user
- `GET /user/:id/balance` get user balance
- `GET /user/:id/transactions` get user transactions
- `POST /user/` create user
- `GET /user/:id` get user by id
- `PUT /user/:id` update user
- `DELETE /user/:id` create user

### Transaction

- `POST /transaction/` create transaction
