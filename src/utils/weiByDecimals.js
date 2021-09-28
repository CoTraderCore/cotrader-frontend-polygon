import BigNumber from 'bignumber.js'
import { toWei, fromWei } from 'web3-utils'
import { ERC20ABI } from '../config.js'

const ETH_TOKEN_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'

export const toWeiByDecimalsInput = (decimals, amount) => {
  if(amount === 0)
    return 0

    const factor = 10 ** decimals
    amount = new BigNumber(amount)
    amount = amount.multipliedBy(factor)
    // for avoid e+ or e- scientific notation or decimals
    return BigNumber(BigNumber(amount).integerValue()).toString(10)
}

export const fromWeiByDecimalsInput = (decimals, amount) => {
   if(amount === 0)
     return 0

     const factor = 10 ** decimals
     amount = new BigNumber(amount)
     amount = amount.dividedBy(factor)
     // for avoid e+ or e- scientific notation or decimals
     return String(amount.toPrecision())
}

// convert connector to wei by decimals
export const toWeiByDecimalsDetect = async (connectorAddress, connecorInput, web3) => {
   let amount = 0
   // ERC20 case
   if(String(connectorAddress).toLowerCase() !== String(ETH_TOKEN_ADDRESS).toLowerCase()){
     // get cur token instance
     const token = new web3.eth.Contract(
       ERC20ABI,
       connectorAddress
     )
     // get cur amount in wei by decimals
     amount = toWeiByDecimalsInput(
     await token.methods.decimals().call(),
     connecorInput
     )
   }
   // ETH case
   else{
     amount = toWei(String(connecorInput))
   }

   return amount
}


export const fromWeiByDecimalsDetect = async (connectorAddress, connecorInput, web3) => {
   let amount = 0
   // ERC20 case
   if(String(connectorAddress).toLowerCase() !== String(ETH_TOKEN_ADDRESS).toLowerCase()){
     // get cur token instance
     const token = new web3.eth.Contract(
       ERC20ABI,
       connectorAddress
     )
     // get cur amount in wei by decimals
     amount = fromWeiByDecimalsInput(
     await token.methods.decimals().call(),
     connecorInput
     )
   }
   // ETH case
   else{
     amount = fromWei(String(connecorInput))
   }

   return amount
}
