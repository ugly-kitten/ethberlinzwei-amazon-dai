import Router from "koa-router"

import { Config } from "./config"
import { sayHello } from "./routes/hello"

export default function createRouter(config: Config) {
  const router = new Router()

  router.prefix(config.basePath)

  router.get("/hello/:name", function(ctx) {
    console.log("context params", ctx.params.name)
    ctx.body = sayHello(ctx.params.name)
  })

  return router
}
