// For fully-onchain based funds

import React, { Component } from 'react'
import { SmartFundABIV7, APIEnpoint } from '../../config.js'
import { Button, Modal, Form } from "react-bootstrap"
import axios from 'axios'
import setPending from '../../utils/setPending'


class Withdraw extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      Show: false,
      Percent: 50,
      isConvert:false
    }
  }

  withdraw = async (address, percent) => {
  if(percent >= 0 && percent <= 100){
    // get corerct ABI for a certain version
    // version 6 support convert assets
    const contractABI = SmartFundABIV7
    const contract = new this.props.web3.eth.Contract(contractABI, address)
    const shares = await contract.methods.balanceOf(this.props.accounts[0]).call()

    if(shares > 0){
      try{
        const totalPercentage = await contract.methods.TOTAL_PERCENTAGE().call()
        const curentPercent = totalPercentage / 100 * percent

        this.setState({ Show:false })

        const block = await this.props.web3.eth.getBlockNumber()

        // get cur tx count
        let txCount = await axios.get(APIEnpoint + 'api/user-pending-count/' + this.props.accounts[0])
        txCount = txCount.data.result

        // get corerct params for a certain version
        const params = this.props.version === 6 ? [curentPercent, this.state.isConvert] : [curentPercent]

        contract.methods.withdraw(...params).send({ from: this.props.accounts[0] })
        .on('transactionHash', (hash) => {
        // pending status for spiner
        this.props.pending(true, txCount+1)
        // pending status for DB
        setPending(address, 1, this.props.accounts[0], block, hash, "Withdraw")
        })
      }
      catch(e){
       alert('Can not verify transaction data, please try again in a minute')
      }
    }else{
      alert('Empty deposit')
    }
   }
  }

  change = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  render() {
    let modalClose = () => this.setState({ Show: false });

    return (
      <div>
        <Button variant="outline-primary" className="buttonsAdditional" onClick={() => this.setState({ Show: true })}>
          Withdraw
        </Button>

        <Modal
          show={this.state.Show}
          onHide={modalClose}
          aria-labelledby="example-modal-sizes-title-sm"
        >
          <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-sm">
          Withdraw from smart fund
          </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Form>
           <Form.Group controlId="formBasicRange">
             <Form.Label>Percent {this.state.Percent} %</Form.Label>
             <Form.Control
             type="range"
             value={this.state.Percent}
             min="1"
             name="Percent"
             max="100"
             onChange={e => this.change(e)}
             />
             {
               this.props.version === 6
               ?
               (
                 <Form.Check
                  type="checkbox"
                  onChange={() => this.setState({ isConvert: !this.state.isConvert })}
                  checked={this.state.isConvert}
                  label={`Try convert assets to ${this.props.mainAsset}`}
                  />
               )
               :null
             }
           </Form.Group>
           {
             <Button
             variant="outline-primary"
             type="button"
             onClick={() => this.withdraw(this.props.address, this.state.Percent)}
             >
             Withdraw
             </Button>
           }
          </Form>
          </Modal.Body>
        </Modal>

      </div>
    )
  }
}

export default Withdraw
