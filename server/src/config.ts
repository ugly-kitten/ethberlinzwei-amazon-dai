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
      default: "0x2cab5720ce6e95fdfda58c1a6c693580324b7109",
      sanitize: sanitize.string
    }
  })
}
