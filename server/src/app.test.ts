import test from "ava"
import supertest from "supertest"
import "dotenv/config"

import createApp from "./app"

test("/status/live", async function(t) {
  const app = createApp({
    basePath: "/",
    port: -1 // supertest binds a port for us
  })

  const resh = await supertest(app.callback()).get("/hello/world")
  console.log(resh.body)
  t.is(resh.body, "Hello, world")
})
