import test from "ava"
import supertest from "supertest"
import "dotenv/config"

import createApp from "./app"

test("/status/live", async function(t) {
  const app = createApp({
    basePath: "/",
    port: -1 // supertest binds a port for us
  })
  const res = await supertest(app.callback()).get("/status/live")
  t.is(res.status, 200)
  t.regex(res.text, /OK/)
})

test("mounts under base path", async function(t) {
  const app = createApp({
    basePath: "/test-path",
    port: -1 // supertest binds a port for us
  })

  const prefixRes = await supertest(app.callback()).get("/test-path/status/live")
  t.is(prefixRes.status, 200)
  t.regex(prefixRes.text, /OK/)

  const baseRes = await supertest(app.callback()).get("/status/live")
  t.is(baseRes.status, 404)
})
