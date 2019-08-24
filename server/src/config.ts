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
      default: "0xfddef72d7fd2e53e4559e42733485a9b400acf99",
      sanitize: sanitize.string
    }
  })
}
