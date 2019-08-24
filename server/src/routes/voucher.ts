const low = require("lowdb")
const FileSync = require("lowdb/adapters/FileSync")
const Web3Eth = require("web3-eth")
//const web3utils = require("web3-utils")

export async function processVoucherRequest(localAddress: string, dbs: string, obj) {
  obj.dev = true
  console.log("Processing Voucher request with data", obj, "on", dbs)
  const weth = new Web3Eth("https://mainnet.infura.io/v3/b999b0e08a564d9d8fa7f6e94c125153")
  const txr = await weth.getTransactionReceipt(obj.txid)
  if (!txr.status) {
    console.log("tx error", localAddress)
    return ""
  }
  /*
  const tx = await weth.getTransaction(obj.txid)
  const str = tx.input
  const toAddr = "0x" + str.substring(74 + 24, 74 + 64)
  const amount = web3utils.toDecimal(str.substring(74 + 65, 74 + 65 + 64))
  if (toAddr != localAddress) {
    console.log("Recipient address doesn't match with tx recipient", toAddr, localAddress)
    return ""
  }*/
  const adapter = new FileSync(dbs)
  const db = low(adapter)
  let vouchers = db.get("vouchers").value()

  console.log(obj.email)

  /*
  for (var key in vouchers) {
    console.log(vouchers[key].email, vouchers[key].value, vouchers[key].redeemed, obj.email, amount)
    if (
      vouchers[key].email == obj.email &&
      vouchers[key].value > amount &&
      !vouchers[key].redeemed
    ) {
      voucherFound = vouchers[key]
      break
    }
  }*/

  let voucherFound = vouchers[0]
  if (voucherFound == undefined) {
    console.log("no voucher found")
    return ""
  }

  if (!obj.dev) {
    console.log("Redeeming!")
    let res = db
      .get("vouchers")
      .find({ id: voucherFound.id })
      .assign({ redeemed: true })
      .write()
    console.log("result: ", res)
  }

  return voucherFound.token
}
