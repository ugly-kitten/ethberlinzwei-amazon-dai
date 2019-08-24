import { parse, sanitize } from "envfefe"

export type Config = ReturnType<typeof getConfig>

export default function getConfig() {
  return parse({
    basePath: {
      default: "/",
      sanitize: sanitize.string
    },
    port: {
      default: 3001,
      sanitize: sanitize.number
    },
    db: {
      default: "/tmp/voucher.db",
      sanitize: sanitize.string
    },
    localAddress: {
      default: "0xfDdEf72D7Fd2E53E4559e42733485a9B400ACf99",
      sanitize: sanitize.string
    }
  })
}
