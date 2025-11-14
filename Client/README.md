# Date Factor Client

## Environment Setup

Create a `client/.env` with:

```
VITE_API_BASE_URL=http://localhost:4000
```

Create a `server/.env` with:

```
PORT=4000
MONGODB_URI=your_mongodb_connection_string_without_database
MONGODB_DB_NAME=DATEFACTOR
JWT_SECRET=use_a_long_random_secret
```

Restart both apps any time you change these variables.

## Development

```
cd server
npm install
npm run start
```

```
cd client
npm install
npm run dev
```

The Vite dev server will proxy requests to the configured API base URL.
