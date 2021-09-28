import {
  SmartFundABIV7,
  SmartFundABIV6,
  SmartFundABIV4,
  SmartFundABI

} from '../config.js'

const getFundFundABIByVersion = (version) => {
  if(version === 1){
    return SmartFundABI
  }else if(version === 5 || version === 6){
    return SmartFundABIV6
  }else if(version >= 7){
    return SmartFundABIV7
  }else{
    return SmartFundABIV4
  }
}

export default getFundFundABIByVersion
