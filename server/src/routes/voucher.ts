const low = require("lowdb")
const FileSync = require("lowdb/adapters/FileSync")
const Web3Eth = require("web3-eth")

export async function processVoucherRequest(localAddress: string, dbs: string, obj) {
  obj.dev = true
  console.log("Processing Voucher request with data", obj, "on", dbs)
  const weth = new Web3Eth("https://kovan.infura.io/v3/b999b0e08a564d9d8fa7f6e94c125153")
  const txr = await weth.getTransactionReceipt(obj.txid)
  if (!txr.status) {
    console.log("tx error", localAddress)
    return ""
  }
  if (txr.to != localAddress) {
    console.log("Recipient address doesn't match with tx recipient", txr.to, localAddress)
    return ""
  }
  //const value = obj.value // change to tx.value
  const adapter = new FileSync(dbs)
  const db = low(adapter)
  let vouchers = db.get("vouchers").value()
  let voucherFound = undefined
  for (var key in vouchers) {
    if (
      vouchers[key].email == obj.email &&
      //vouchers[key].value > value &&
      !vouchers[key].redeemed
    ) {
      voucherFound = vouchers[key]
      break
    }
  }
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
