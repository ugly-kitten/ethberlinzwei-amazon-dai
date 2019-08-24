import Router from "koa-router"

import { Config } from "./config"
import { sayHello } from "./routes/hello"

export default function createRouter(config: Config) {
  const router = new Router()

  router.prefix(config.basePath)

  router.get("/status/live", function(ctx) {
    ctx.status = 200
  })

  router.get("/hello/:name", function(ctx) {
    ctx.body = sayHello(ctx.params.name)
  })

  return router
}
