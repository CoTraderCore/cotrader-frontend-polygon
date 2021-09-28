import {
  ERC20ABI,
  ERC20Bytes32ABI,
} from '../config.js'

const getTokenSymbolAndDecimals = async (address, web3) => {
  // ETH case
  if(String(address).toLowerCase() === String('0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE').toLowerCase()){
    return { symbol: 'ETH', decimals: 18}
  }
  else{
    // ERC20 String return case
    try{
      const token = new web3.eth.Contract(ERC20ABI, address)
      const symbol = await token.methods.symbol().call()
      const decimals = await token.methods.decimals().call()
      return { symbol, decimals }
    }
    // EC20 Bytes32 return case
    catch(e){
      const token = new web3.eth.Contract(ERC20Bytes32ABI, address)
      const symbol = await web3.utils.toUtf8(token.methods.symbol().call())
      const decimals = await token.methods.decimals().call()
      return { symbol, decimals }
    }
  }
}

export default getTokenSymbolAndDecimals
