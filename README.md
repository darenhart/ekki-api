## Available Scripts

In the project directory, you can run:

### `npm serve`

Runs `nodemon server.js`
Serve the app in the development mode
Open [http://localhost:8080](http://localhost:8080) to view it in the browser.

### `npm seed`

Runs `node seed.js`
Seed User and Transaction collections

## API

### User

- `GET /user/` : list users
- `GET /user/current` : get logged user
- `GET /user/:id` : get user by id
- `PUT /user/:id` : update user
- `POST /user/` : create user
