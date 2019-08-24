import Router from "koa-router"
import { Context } from "koa"
import bodyParser from "koa-body"

import { Config } from "./config"
import { processVoucherRequest } from "./routes/voucher"

export default function createRouter(config: Config) {
  const router = new Router()
  router.use(bodyParser())
  router.prefix(config.basePath)

  router.post("/voucher", async function(ctx: Context) {
    const { request } = ctx
    const data = JSON.parse(request.body)
    const result = await processVoucherRequest(config.localAddress, config.db, data)
    console.log(result)
    ctx.body = { token: result }
    //response.status = 200
  })

  return router
}
