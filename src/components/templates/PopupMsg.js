import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { EtherscanLink }  from '../../config.js'
import "react-toastify/dist/ReactToastify.css"

// {EtherscanLink+"/tx/"+props.txHash}
const HashLink = (props) => {
 const link = EtherscanLink+ "tx/" +props.txHash

 return (
   <React.Fragment>
   <p>Tx {props.txName} done</p>
   <a style={{ "color": "white" }} href={link} target="_blank" rel="noopener noreferrer">
   view
   </a>
   </React.Fragment>
 )
}

class PopupMsg extends Component {
    show(){
        toast.info(<HashLink txName={this.props.txName} txHash={this.props.txHash}/>, {
        position: toast.POSITION.BOTTOM_RIGTH
      })
    }

    render(){
      return (
        <div>
          <ToastContainer />
        </div>
      );
    }
  }

export default PopupMsg
