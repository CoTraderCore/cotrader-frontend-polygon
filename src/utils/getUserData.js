import { APIEnpoint }  from '../config.js'
import axios from 'axios'

const getUserData = async (address) => {
try {
  // Get data from api
  const fund = await axios.get(
    APIEnpoint + "api/user/" + address
  )
  return fund
  } catch (error) {
  // Catch any errors for any of the above operations.
     alert(`can't get data`);
     console.error(error);
   }
 }

 export default getUserData
