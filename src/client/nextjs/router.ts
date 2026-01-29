import { Hono } from "hono";

export function createRouter() {
  const app = new Hono();

  app.post("/api/geoplegma/zones-from-bbox", (c) =>
    c.json({ ok: true, runtime: "node" })
  );

//   app.get("/users", async (c) => {
//     return c.json([{ id: 1, name: "Ada" }]);
//   });

//   app.get("/users/:id", (c) => {
//     return c.json({ id: c.req.param("id") });
//   });

  return app;
}