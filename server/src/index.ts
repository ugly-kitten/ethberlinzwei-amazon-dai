import terminus from "@godaddy/terminus"
import createApp from "./app"
import getConfig from "./config"

const config = getConfig()
const app = createApp(config)

const server = app.listen(config.port, function(error?: Error) {
  if (error) {
    console.error("Startup error", error)
    process.exit(1)
  } else {
    console.info(`Listening on port ${config.port}`)
  }
})

terminus(server, {
  signals: ["SIGINT", "SIGTERM"],
  timeout: 10000,
  onShutdown: async () => {
    console.info("Shutting down...")
    process.exit(0)
  }
})
