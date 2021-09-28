import { APIEnpoint }  from '../config.js'
import axios from 'axios'

const getFundsList = async () => {
  try {
     const smartFunds = await axios
    .get(APIEnpoint + "api/smartfunds/")
    return smartFunds.data.result

  }catch (error) {
    // Catch any errors for any of the above operations.
    alert(
      `can't get data`,
    )
    console.error(error)
  }
}

export default getFundsList
