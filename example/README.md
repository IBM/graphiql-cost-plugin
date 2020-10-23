# GraphiQL Cost Plugin Example Application

Example application for testing the use of the GraphiQL Cost Plugin. This app consists of an instance of GraphiQL pointed at the public [SWAPI example GraphQL server](https://swapi-graphql.netlify.app).

For actual use, replace dependency `"graphiql-cost-plugin": "file:../"` with `"graphiql-cost-plugin": "0.1.0"` (or another version).

In [`App.js`](App.js), point the `BACKEND_URL` to your actual GraphQL backend and set `USE_COST_ENDPOINT` to `true` to fetch cost data from that endpoint. In addition, overwrite `HEADERS` with custom headers to use.

## Run the example app

First, install dependencies:

```
npm i
```

Then, to run the example application:

```
npm run dev
```

## License

[MIT](../LICENSE.md)
