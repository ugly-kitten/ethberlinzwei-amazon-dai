import test from "ava"
import supertest from "supertest"
import "dotenv/config"

import createApp from "./app"

test("/voucher/request", async function(t) {
  const app = createApp({
    basePath: "/",
    port: -1 // supertest binds a port for us
  })

  const obj = {
    txid: "0x123456",
    email: "very@ugly-kitten.com"
  }

  const res = await supertest(app.callback())
    .post("/voucher")
    .send(obj)
  console.log(res.body)
  t.is(res.body.txid, obj.txid)
  t.is(res.body.email, obj.email)
})
