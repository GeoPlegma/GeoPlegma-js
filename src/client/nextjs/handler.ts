// src/handler.ts
import { createRouter } from "./router";

const app = createRouter();

/**
 * This is fetch-compatible.
 * Middleware can call it.
 * Node route handlers could call it too.
 */
export async function handleRequest(req: Request) {
  return app.fetch(req);
}
