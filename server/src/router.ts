import Router from "koa-router"
var bodyParser = require("koa-bodyparser")

import { Config } from "./config"
import { processVoucherRequest } from "./routes/voucher"

export default function createRouter(config: Config) {
  const router = new Router()
  router.use(bodyParser())
  router.use(async ctx => {
    // the parsed body will store in ctx.request.body
    // if nothing was parsed, body will be an empty object {}
    ctx.body = ctx.request.body
  })
  router.prefix(config.basePath)

  router.post("/voucher", function(ctx) {
    console.log("Request Context", ctx)
    ctx.body = processVoucherRequest(ctx.body)
    ctx.status = 200
    console.log("Response Context", ctx.response)
  })

  return router
}
