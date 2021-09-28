import React, { Component } from 'react'

import {
  APIEnpoint,
  SmartFundRegistryABIV9,
  SmartFundRegistryADDRESS,
} from '../../config.js'

import { Modal, Form } from "react-bootstrap"
import setPending from '../../utils/setPending'
import UserInfo from '../templates/UserInfo'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import axios from 'axios'

const ETH_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
const USD_ADDRESS = '0xe9e7cea3dedca5984780bafc599bd69add087d56'

class CreateNewFund extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      Show: false,
      Percent: 20,  // NOTE: this number should be mul by 100 !!!
      FundAsset: 'BNB',
      FundName: '',
      TradeVerification: true
    }
  }

  createNewFund = async () =>{
  if(this.state.Percent > 0 && this.state.Percent <= 30){
  const contract = new this.props.web3.eth.Contract(SmartFundRegistryABIV9, SmartFundRegistryADDRESS)
    if(this.state.FundName !== ''){
      try{
        const name = this.state.FundName
        const percent = this.state.Percent * 100 // MUL Percent by 100
        const verifiacton = this.state.TradeVerification
        const block = await this.props.web3.eth.getBlockNumber()
        const coreAsset = this.state.FundAsset === "BNB" ? ETH_ADDRESS : USD_ADDRESS

        console.log(name, percent, coreAsset, verifiacton, this.state.FundAsset)

        // get cur tx count
        let txCount = await axios.get(APIEnpoint + 'api/user-pending-count/' + this.props.accounts[0])
        txCount = txCount.data.result

        // create fund
        contract.methods.createSmartFund(name, percent, coreAsset, verifiacton)
        .send({ from: this.props.accounts[0] })
        .on('transactionHash', (hash) => {
        // pending status for DB
        setPending(null, 1, this.props.accounts[0], block, hash, "SmartFundCreated")
        this.props.pending(true, txCount+1)
        })
        // close modal
        this.modalClose()
      }
      catch(e){
        // for case if user reject transaction
        this.props.pending(false)
        alert('Can not verify transaction data, please try again in a minute')
        console.log("Error", e)
      }
    }else{
      alert('Please input fund name')
    }
  }else{
    alert('Please select correct percent, we support from 0.01% to 30%')
  }
  }

  // helper for set state
  change = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  modalClose = () => {
    this.setState({
      Show: false,
      Percent: 20,
      FundAsset: 'BNB',
      FundName: '',
      TradeVerification: true
    })
  }

  render() {
    return (
      <div>
        <Button variant="contained" color="primary" onClick={() => this.setState({ Show: true })}>
          Create fund
        </Button>

        <Modal
          show={this.state.Show}
          onHide={() => this.modalClose()}
          aria-labelledby="example-modal-sizes-title-sm"
        >
          <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-sm">
          Create new fund <small>(with multi DEX support)</small>
          </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Form>

          <Form.Group>
          <TextField
            id="outlined-name"
            label="Fund name"
            value={this.state.searchByName}
            name="FundName"
            onChange={e => this.change(e)}
            margin="normal"
            variant="outlined"
            style={{width:'100%'}}
          />
          </Form.Group>

          <hr/>

          <Form.Group>
          <Form.Label>Performance Fee % <UserInfo  info="This is the % the fund manager earns for the profits earned, relative to main fund asset (BNB, USD or COT)."/></Form.Label>
          <TextField
            id="outlined-name"
            label="Performance Fee"
            value={this.state.searchByName}
            name="Percent"
            onChange={e => this.change(e)}
            margin="normal"
            variant="outlined"
            type="number"
            placeholder="20"
            style={{width:'100%'}}
            InputProps={{
              inputProps: { min: 1 },
              startAdornment: (
                <InputAdornment position="start">
                  %
                </InputAdornment>
              ),
            }}
          />
          </Form.Group>

          <hr/>

          <Form.Group controlId="exampleForm.ControlSelect1">
          <Form.Label>Main fund asset % <UserInfo  info="With the help of this asset, investors will invest, calculate fund value ect"/></Form.Label>
          <Form.Control as="select" name="FundAsset" onChange={e => this.change(e)}>
            <option>BNB</option>
            <option>USD</option>
          </Form.Control>
          </Form.Group>


          <hr/>

          <Form.Label>Limit Tokens <UserInfo  info="This gives investors confidence that even if the trader's key is stolen, the worst a hacker can do is trade to legit tokens, not likely to a token just created by the trader to exit scam the fund, leaving it without value."/></Form.Label>
          <Form.Group>
            <Form.Check
            type="checkbox"
            label="Use trade verifiaction"
            checked={this.state.TradeVerification}
            onChange={() => this.setState({ TradeVerification:!this.state.TradeVerification })}
            />
          </Form.Group>

           <Button
           variant="contained"
           color="primary"
           onClick={() => this.createNewFund()}
           >
           Create
           </Button>
          </Form>
          </Modal.Body>
        </Modal>

      </div>
    )
  }
}

export default CreateNewFund
