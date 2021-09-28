import {
  SmartFundABIV8,
  CoTraderConfigABI,
  CoTraderConfig
}  from '../config.js'

const checkDWFrezeeTime = async (fundAddress, web3) => {
  const fund = new web3.eth.Contract(SmartFundABIV8, fundAddress)
  const config = new web3.eth.Contract(CoTraderConfigABI, CoTraderConfig)

  const LatestOracleCaller = await fund.methods.latestOracleCaller().call()
  const latestOracleCallOnTime = Number(await fund.methods.latestOracleCallOnTime().call())
  const DW_FREEZE_TIME = Number(await config.methods.DW_FREEZE_TIME().call())
  const now = Math.round((new Date()).getTime() / 1000)

  const status = latestOracleCallOnTime + DW_FREEZE_TIME >= now ? true : false
  const date = new Date((latestOracleCallOnTime + DW_FREEZE_TIME) * 1000).toLocaleString()

  return { DWFrezee:status, DWDate:date, LatestOracleCaller }
}

export default checkDWFrezeeTime
