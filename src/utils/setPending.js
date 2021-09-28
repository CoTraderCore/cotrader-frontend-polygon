import { APIEnpoint }  from '../config.js'
import axios from 'axios'

const axiosConfig = {
  headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      "Access-Control-Allow-Origin": "*",
      'Authorization': 'Bearer ' + process.env.REACT_APP_API_TOKEN
  }
}

// Set pending status in DB for certain fund address
const setPending = async (address, status, sender, block, tx, txName) => {
  try{
    const body = { address, status, sender, block, tx, txName }
    await axios.post(APIEnpoint + 'api/pending/', body, axiosConfig)
  }catch(err){
    console.log("can't set pending",err)
  }

}
export default setPending
