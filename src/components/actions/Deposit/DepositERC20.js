// For fully-onchain based funds

import React, { Component } from 'react'

import {
  SmartFundABIV7,
  ERC20ABI,
  APIEnpoint
} from '../../../config.js'
import { Button, Form, Alert } from "react-bootstrap"
import setPending from '../../../utils/setPending'
import {
  toWeiByDecimalsInput,
  fromWeiByDecimalsInput
} from '../../../utils/weiByDecimals'
import axios from 'axios'

class DepositERC20 extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      DepositValue:0,
      ValueError: "",
      ercAssetContract:null,
      userWalletBalance:'0',
      isApproved:true,
      aprovePending:false
    }
  }

  componentDidUpdate = async (prevProps, prevState) => {
    if(prevState.DepositValue !== this.state.DepositValue){
      await this.updateERC20DepositInfo()
    }
  }

  checkAllowanceInterval(){
    let timerId = setInterval(async () => {
      const isApproved = await this.updateERC20DepositInfo()
      console.log("isApproved", isApproved)
      if(isApproved){
        clearInterval(timerId)
        this.setState({ aprovePending:false })
      }
    }, 3000)
  }

  validation = async () => {
    if(this.state.DepositValue <= 0){
      this.setState({ ValueError:"Value can't be 0 or less" })
      return
    }

    const ercAssetDecimals = await this.state.ercAssetContract.methods.decimals().call()
    const userWalletBalance = await this.state.ercAssetContract.methods.balanceOf(
      this.props.accounts[0]
    ).call()
    const userBalanceFromWei = fromWeiByDecimalsInput(ercAssetDecimals, userWalletBalance)

    if(Number(this.state.DepositValue) > Number(userBalanceFromWei)){
      this.setState({ ValueError:`Not enough ${this.props.mainAsset}` })
      return
    }

    this.depositERC20()
  }

  updateERC20DepositInfo = async() => {
    const fund = new this.props.web3.eth.Contract(SmartFundABIV7, this.props.address)
    const ercAssetAddress = await fund.methods.coreFundAsset().call()
    const ercAssetContract = new this.props.web3.eth.Contract(ERC20ABI, ercAssetAddress)

    const allowance = await ercAssetContract.methods.allowance(
      this.props.accounts[0],
      this.props.address
    ).call()

    const allowanceFromWei = fromWeiByDecimalsInput(
      await ercAssetContract.methods.decimals().call(),
      allowance
    )

    const isApproved = Number(allowanceFromWei) > Number(this.state.DepositValue)

    this.setState({
      ercAssetAddress,
      ercAssetContract,
      isApproved
    })

    return isApproved
  }

  unlockERC20 = async () => {
    try{
      // get cur tx count
      let txCount = await axios.get(APIEnpoint + 'api/user-pending-count/' + this.props.accounts[0])
      txCount = txCount.data.result

      let block = await this.props.web3.eth.getBlockNumber()

      // Approve max ERC to smart fund
      this.state.ercAssetContract.methods.approve(
        this.props.address,
        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      )
      .send({ from: this.props.accounts[0]})
      .on('transactionHash', (hash) => {
      // pending status for spiner
      this.props.pending(true, txCount+1)
      // pending status for DB
      setPending(this.props.address, 1, this.props.accounts[0], block, hash, "Deposit")
      // run interval
      this.checkAllowanceInterval()
      // show pending
      this.setState({ aprovePending:true })
      })
    }
    catch(e){
    alert("Can not verify transaction data, please try again in a minute")
    console.log("err: ",e)
    }
  }


  depositERC20 = async () => {
    try{
      // convert input to wei by decimals
      const ercAssetDecimals = await this.state.ercAssetContract.methods.decimals().call()
      const amount = toWeiByDecimalsInput(ercAssetDecimals, this.state.DepositValue)

      // get fund contract
      const fundERC20 = new this.props.web3.eth.Contract(SmartFundABIV7, this.props.address)

      // get cur tx count
      let txCount = await axios.get(APIEnpoint + 'api/user-pending-count/' + this.props.accounts[0])
      txCount = txCount.data.result

      let block = await this.props.web3.eth.getBlockNumber()

      this.props.modalClose()

      // Deposit ERC20
      fundERC20.methods.deposit(amount)
      .send({ from: this.props.accounts[0]})
      .on('transactionHash', (hash) => {
      // pending status for spiner
      this.props.pending(true, txCount+1)
      // pending status for DB
      setPending(this.props.address, 1, this.props.accounts[0], block, hash, "Deposit")
      })
    }
    catch(e){
    alert("Can not verify transaction data, please try again in a minute")
    console.log("err: ",e)
    }
 }

 modalClose = () => this.setState({ Show: false, Agree: false });

 render() {
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

      {
        !this.state.isApproved
        ?
        (
          <>
          <Button
            variant="warning"
            type="button"
            onClick={() => this.unlockERC20()}
          >
          Unlock
          </Button>
          <br/>
          <br/>
          {
            this.state.aprovePending
            ?
            (
              <small>Please wait for the transaction to be confirmed ...</small>
            )
            :
            null
          }
          </>
        )
        :
        (
          <Button
            variant="outline-primary"
            type="button"
            onClick={() => this.validation()}
          >
          Deposit
          </Button>
        )
      }
      </>
    )
  }
}

export default DepositERC20
