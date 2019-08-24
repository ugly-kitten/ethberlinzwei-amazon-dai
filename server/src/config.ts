import { parse, sanitize } from "envfefe"

export type Config = ReturnType<typeof getConfig>

export default function getConfig() {
  return parse({
    basePath: {
      default: "/",
      sanitize: sanitize.string
    },
    port: {
      default: 3000,
      sanitize: sanitize.number
    }
  })
}
