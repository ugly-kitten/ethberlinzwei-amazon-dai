import test from "ava"
import supertest from "supertest"
import "dotenv/config"
const fs = require("fs")
const FileSync = require("lowdb/adapters/FileSync")
const low = require("lowdb")

import createApp from "./app"

test("/voucher/request", async function(t) {
  const dbsuffix = Math.random()
    .toString(36)
    .substring(2, 15)
  const dbpath = "/tmp/voucher-" + dbsuffix + ".db"
  const app = createApp({
    basePath: "/",
    port: -1, // supertest binds a port for us
    db: dbpath,
    localAddress: "0xa24df0420de1f3b8d740a52aaeb9d55d6d64478e"
  })

  const adapter = new FileSync(dbpath)
  const db = low(adapter)

  const voucherA = {
    id: 1,
    token: "12345-6789",
    value: 100,
    email: "very@ugly-kitten.com",
    redeemed: false
  }
  const voucherB = {
    id: 2,
    token: "12345-0000",
    value: 30,
    email: "very@ugly-kitten.com",
    redeemed: false
  }

  // Populate DB with vouchers
  db.get("vouchers")
    .push(voucherA)
    .write()
  db.update("count", n => n + 1).write()
  db.get("vouchers")
    .push(voucherB)
    .write()
  db.update("count", n => n + 1).write()

  const obj = {
    txid: "0x4aea87b1763ef33127bb8cf5c80f5fdb7f7207a1a59df274265a49e0261e140a",
    email: "very@ugly-kitten.com",
    value: 55,
    dev: false
  }

  const res = await supertest(app.callback())
    .post("/voucher")
    .send(obj)
  t.is(res.status, 200)
  t.is(res.text, voucherA.token)

  console.log(db.get("vouchers").value())
  fs.unlinkSync(dbpath)
})
