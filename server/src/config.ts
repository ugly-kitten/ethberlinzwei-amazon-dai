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
    },
    db: {
      default: "/tmp/voucher.db",
      sanitize: sanitize.string
    },
    localAddress: {
      default: "0xa24df0420de1f3b8d740a52aaeb9d55d6d64478e",
      sanitize: sanitize.string
    }
  })
}
