# MPlace

Full-page, sandboxed personal sites at `/{username}`.

```sh
npm install
npm run dev
```

Set `MPLACE_EDITOR_TOKEN`, then open `/editor` to author and publish a Place using that token. Public Place content is returned only when published and runs in an opaque-origin iframe with `sandbox="allow-scripts"`.

In production, build with `npm run build`, then run `npm start`. The publishing API rejects requests unless their bearer token matches the server-side `MPLACE_EDITOR_TOKEN`; a production account system can replace this middleware with user session authorization.
