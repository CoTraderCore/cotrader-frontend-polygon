// For fully-onchain based funds

import React, { Component } from 'react'

import {
  SmartFundABI,
  APIEnpoint
} from '../../../config.js'
import { Button, Form, Alert } from "react-bootstrap"
import setPending from '../../../utils/setPending'
import { fromWei, toWei } from 'web3-utils'

import axios from 'axios'


class DepositETH extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      DepositValue:0,
      ValueError: ''
    }
  }

  validation = async () => {
    if(this.state.DepositValue <= 0){
      this.setState({ ValueError:"Value can't be 0 or less" })
      return
    }

    const userBalance = await this.props.web3.eth.getBalance(this.props.accounts[0])
    if(Number(this.state.DepositValue) > Number(fromWei(userBalance))){
      this.setState({ ValueError:`Not enough ${this.props.mainAsset}` })
      return
    }

    this.depositETH()
  }

  depositETH = async () => {
    try{
      const _value = this.state.DepositValue
      const fundETH = new this.props.web3.eth.Contract(SmartFundABI, this.props.address)
      const amount = toWei(_value, 'ether')
      // get cur tx count
      let txCount = await axios.get(APIEnpoint + 'api/user-pending-count/' + this.props.accounts[0])
      txCount = txCount.data.result

      let block = await this.props.web3.eth.getBlockNumber()

      this.props.modalClose()

      fundETH.methods.deposit().send({ from: this.props.accounts[0], value:amount})
      .on('transactionHash', (hash) => {
      // pending status for spiner
      this.props.pending(true, txCount+1)
      // pending status for DB
      setPending(this.props.address, 1, this.props.accounts[0], block, hash, "Deposit")
      })
    }catch(e){
      alert("Can not verify transaction data, please try again in a minute")
    }
 }


 render() {
   console.log(this.state.DepositValue)
    return (
      <>
      <Form.Group>
      <Form.Label>Amount of {this.props.mainAsset}</Form.Label>
      <Form.Control
      type="number"
      min="0"
      placeholder="Amount"
      name="DepositValue"
      onChange={e => this.setState({ DepositValue:e.target.value })}
      />
      {
        this.state.ValueError !== ""
        ?
        (
          <Alert variant="danger">{this.state.ValueError}</Alert>
        )
        :
        (null)
      }
      </Form.Group>

      <Button
        variant="outline-primary"
        type="button"
        onClick={() => this.validation()}
      >
      Deposit
      </Button>
      </>
    )
  }
}

export default DepositETH
