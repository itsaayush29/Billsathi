import request from "supertest";
import { beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("../src/config/prisma.js", () => ({
  prisma: {}
}));

let createApp: typeof import("../src/app.js").createApp;

beforeAll(async () => {
  ({ createApp } = await import("../src/app.js"));
});

describe("health route", () => {
  it("returns ok", async () => {
    const response = await request(createApp()).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe("ok");
  });
});
