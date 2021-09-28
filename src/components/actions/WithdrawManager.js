// For fully onchain based funds

import React, { Component } from 'react'
import { SmartFundABIV7, APIEnpoint } from '../../config.js'
import setPending from '../../utils/setPending'
import axios from 'axios'
import { Button, Modal, Form } from "react-bootstrap"
import { fromWei } from 'web3-utils'


class WithdrawManager extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      Show: false,
      isConvert: false,
      managerCut: 0
    }
  }

  _isMounted = false

  componentDidMount = async () => {
    this._isMounted = true
    const contract = new this.props.web3.eth.Contract(SmartFundABIV7, this.props.smartFundAddress)
    let managerCut

    try{
      const { fundManagerRemainingCut } = await contract.methods.calculateFundManagerCut().call()
      managerCut = parseFloat(fromWei(String(fundManagerRemainingCut)))
    }catch(e){
      managerCut = 0
    }

    if(this._isMounted)
      this.setState({ managerCut })
  }

  componentWillUnmount(){
    this._isMounted = false
  }

  // take cut action
  withdrawManager = async () => {
    try{
      // get correct ABI for a certain version
      // Only v6 can try convert assets
      const contractABI = SmartFundABIV7
      const contract = new this.props.web3.eth.Contract(contractABI, this.props.smartFundAddress)
      const block = await this.props.web3.eth.getBlockNumber()

      // get cur tx count
      let txCount = await axios.get(APIEnpoint + 'api/user-pending-count/' + this.props.accounts[0])
      txCount = txCount.data.result

      contract.methods.fundManagerWithdraw().send({ from: this.props.accounts[0]})
      .on('transactionHash', (hash) => {
        this.updatePendingStatus(txCount, block, hash)
      })
    }
    catch(e){
     alert('Can not verify transaction data, please try again in a minute')
    }
  }

  // update pending status after recieve hash
  updatePendingStatus(txCount, block, hash){
    // pending status for spiner
    this.props.pending(true, txCount+1)
    // pending status for DB
    setPending(this.props.smartFundAddress, 1, this.props.accounts[0], block, hash, "Withdraw")
    // close modal
    this.modalClose()
  }

  // close modal
  modalClose = () => this.setState({ Show: false, isConvert: false, managerCut:0 })

  render() {
    return (
      <div>
        <Button variant="outline-primary" className="buttonsAdditional" onClick={() => this.setState({ Show: true })}>
          Take cut
        </Button>

        <Modal
          show={this.state.Show}
          onHide={() => this.modalClose()}
        >
          <Modal.Header closeButton>
          <Modal.Title>
          Take cut from smart fund
          </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          {
            this.props.version === 8
            ?
            (
              <p>Please update fund value</p>
            )
            :
            (
              <p>Your current cut : {this.state.managerCut}</p>
            )
          }
          {
            parseFloat(this.state.managerCut) > 0 || this.props.version > 7
            ?
            (
              <Form>
               <Form.Group>
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
                 onClick={() => this.withdrawManager()}
                 >
                 Take cut
                 </Button>
               }
              </Form>
            )
            :null
          }
          </Modal.Body>
        </Modal>

      </div>
    )
  }
}

export default WithdrawManager
