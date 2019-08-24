import Koa from "koa"
import { Config } from "./config"
import createRouter from "./router"
import kcors from "kcors"

const low = require("lowdb")
const FileSync = require("lowdb/adapters/FileSync")

export default function createApp(config: Config) {
  const app = new Koa()
  const router = createRouter(config)

  const adapter = new FileSync(config.db)
  const db = low(adapter)
  db.defaults({ vouchers: [], count: 0 }).write()

  const cors = kcors({
    origin: "*",
    allowMethods: "GET,POST"
  })

  return app
    .use(cors)
    .use(router.routes())
    .use(router.allowedMethods())
}
