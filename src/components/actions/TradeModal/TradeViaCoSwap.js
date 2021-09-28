// trade via coswap

import React, { Component } from 'react'
import {
  SmartFundABIV7,
  NeworkID,
  ERC20ABI,
  APIEnpoint,
  UNIRouterABI,
  CoSwapRouter,
  WETH,
  ExchangePortalAddressLight
} from '../../../config.js'

import {
  Button,
  Form,
  Alert,
  InputGroup
} from "react-bootstrap"

import setPending from '../../../utils/setPending'
import getMerkleTreeData from '../../../utils/getMerkleTreeData'
import axios from 'axios'
import { toWeiByDecimalsInput, fromWeiByDecimalsInput } from '../../../utils/weiByDecimals'
import checkTokensLimit from '../../../utils/checkTokensLimit'
import Pending from '../../templates/Spiners/Pending'
import BigNumber from 'bignumber.js'
import SelectToken from './SelectToken'

class TradeViaCoSwap extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      Send: 'BNB',
      Recive:'bCOT',
      AmountSend:0,
      AmountRecive:0,
      slippageFrom:0,
      slippageTo:0,
      ERRORText:'',
      tokens: null,
      symbols: null,
      sendFrom: '',
      sendTo:'',
      decimalsFrom:18,
      decimalsTo:18,
      prepareData:false
    }
  }

  _isMounted = false
  componentDidMount(){
    this._isMounted = true
    this.initData()

  }

  componentWillUnmount(){
    this._isMounted = false
  }

  componentDidUpdate(prevProps, prevState){
    if(prevState.Send !== this.state.Send
      || prevState.Recive !== this.state.Recive
      || prevState.AmountSend !== this.state.AmountSend
      || prevState.AmountRecive !== this.state.AmountRecive
    ){
      this.setState({ ERRORText:'' })
    }
  }

  // get tokens addresses and symbols from paraswap api
  initData = async () => {
    if(NeworkID === 56){
      const tokens = [
        { symbol: "BNB", address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", decimals: 18 },
        { symbol: "bCOT", address: "0x304fc73e86601a61a6c6db5b0eafea587622acdc", decimals: 18 }
      ]
      const symbols = ['BNB', 'bCOT']
      if(this._isMounted)
        this.setState({ tokens, symbols })
    }

    else{
      alert("There are no tokens for your network")
    }
  }

  // Show err msg if there are some msg
  ErrorMsg = () => {
    if(this.state.ERRORText.length > 0) {
      return(
        <Alert variant="danger">
        {this.state.ERRORText}
        </Alert>
      )
    }else {
      return null
    }
  }


  // Check if fund has assets for certain token
  // return true if fund has enougth balance
  checkFundBalance = async () => {
    let fundBalance
    let result = false

    if(String(this.state.sendFrom).toLowerCase() === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'){
      fundBalance = await this.props.web3.eth.getBalance(this.props.smartFundAddress)
      fundBalance = this.props.web3.utils.fromWei(fundBalance)
    }
    else{
      const ERC20 = new this.props.web3.eth.Contract(ERC20ABI, this.state.sendFrom)
      fundBalance = await ERC20.methods.balanceOf(this.props.smartFundAddress).call()
      fundBalance = fromWeiByDecimalsInput(this.state.decimalsFrom, fundBalance)
    }
    if(parseFloat(fundBalance) >= parseFloat(this.state.AmountSend))
      result = true

    return result
  }


  // helper for update state
  change = async e => {
    // Update rate in correct direction order and set state
    if(e.target.name === "AmountSend"){
      this.setState({ shouldUpdatePrice:true, slippageTo:0, slippageFrom:0 })
      // get data
      const targetName = e.target.name
      const targerValue = e.target.value
      const { sendFrom, sendTo, decimalsFrom, decimalsTo } = this.getDirectionInfo()
      // get rate and slippage in current order
      const amountRecive = await this.setRate(sendFrom, sendTo, targerValue, "AmountRecive", decimalsFrom, decimalsTo)
      const slippageFrom = await this.getSlippage(sendFrom, sendTo, targerValue, amountRecive, decimalsFrom, decimalsTo)
      // update states
      this.setState({
        [targetName]: targerValue,
        sendFrom,
        sendTo,
        decimalsFrom,
        decimalsTo,
        slippageFrom,
        slippageTo:0,
        shouldUpdatePrice:false
      })
    }
    // Update rate in reverse order direction and set state
    else if(e.target.name === "AmountRecive"){
      this.setState({ shouldUpdatePrice:true, slippageTo:0, slippageFrom:0 })
      // get data
      const targetName = e.target.name
      const targerValue = e.target.value
      const { sendFrom, sendTo, decimalsFrom, decimalsTo } = this.getDirectionInfo()
      // update rate and slippage in vice versa order
      const amountRecive = await this.setRate(sendTo, sendFrom, targerValue, "AmountSend", decimalsTo, decimalsFrom)
      const slippageTo = await this.getSlippage(sendTo, sendFrom, targerValue, amountRecive, decimalsTo, decimalsFrom)
      // update states
      this.setState({
        [targetName]: targerValue,
        sendFrom,
        sendTo,
        decimalsFrom,
        decimalsTo,
        slippageFrom:0,
        slippageTo,
        shouldUpdatePrice:false
      })
    }
    // Just set state by input
    else{
      this.setState({
      [e.target.name]: e.target.value
      })
    }
  }

  // found addresses and decimals by direction symbols
  getDirectionInfo = () => {
    const From = this.state.tokens.filter(item => item.symbol === this.state.Send)
    const decimalsFrom = From[0].decimals
    const sendFrom = From[0].address

    const To = this.state.tokens.filter(item => item.symbol === this.state.Recive)
    const decimalsTo = To[0].decimals
    const sendTo = To[0].address

    return { sendFrom, sendTo, decimalsFrom, decimalsTo }
  }


  // trade via 1 inch
  tradeViaCoSwap = async () => {
    try{
      const smartFund = new this.props.web3.eth.Contract(SmartFundABIV7, this.props.smartFundAddress)
      const block = await this.props.web3.eth.getBlockNumber()
      // get cur tx count
      let txCount = await axios.get(APIEnpoint + 'api/user-pending-count/' + this.props.accounts[0])
      txCount = txCount.data.result

      const amountInWei = toWeiByDecimalsInput(this.state.decimalsFrom, this.state.AmountSend)

      // TODO allow user select slippage  min return
      const minReturn = this.getMinReturn()

      // get gas price from local storage
      const gasPrice = localStorage.getItem('gasPrice') ? localStorage.getItem('gasPrice') : 2000000000

      // this function will throw execution with alert warning if there are limit
      await checkTokensLimit(this.state.sendTo, smartFund)

      // get merkle tree data
      const { proof, positions } = getMerkleTreeData(this.state.sendTo)

      // trade
      smartFund.methods.trade(
          this.state.sendFrom,
          amountInWei,
          this.state.sendTo,
          1,
          proof,
          positions,
          "0x",
          minReturn
        )
        .send({ from: this.props.accounts[0], gasPrice })
        .on('transactionHash', (hash) => {
        // pending status for spiner
        this.props.pending(true, txCount+1)
        // pending status for DB
        setPending(this.props.smartFundAddress, 1, this.props.accounts[0], block, hash, "Trade")
      })

      this.props.closeModal()
    }catch(e){
      this.setState({ ERRORText:'Can not verify transaction data, please try again in a minute' })
      console.log("error: ",e)
    }
  }


  // Validation input and smart fund balance
  validation = async () => {
    if(this.state.AmountSend === 0){
      this.setState({ ERRORText:'Please input amount'})
    }else if(this.state.Send === this.state.Recive){
      this.setState({ ERRORText:'Token directions can not be the same'})
    }
    else{
      const status = await this.checkFundBalance()
      if(status){
        this.setState({ prepareData:true })
        this.tradeViaCoSwap()
      }else{
        this.setState({ ERRORText:  `Your smart fund don't have enough ${this.state.Send}` })
      }
    }
  }


  /** dev get rate (can calculate by input to or from)
  * params
  * address from and to,
  * input tokens amount
  * type (direction Send or Recieve),
  * decimals token decimals
  */
  setRate = async (from, to, amount, type, decimalsFrom, decimalsTo) => {
    const value = await this.getRate(from, to, amount, decimalsFrom, decimalsTo)
    if(value){
      const result = fromWeiByDecimalsInput(decimalsTo, value)
      this.setState({ [type]: result})
      return result
    }else{
      this.setState({ [type]: 0})
      return 0
    }
  }

  // get ratio from 1inch or Paraswap (dependse of selected type)
  getRate = async (from, to, amount, decimalsFrom, decimalsTo) => {
    let price = 0

    if(amount > 0 && from !== to){
      const src = toWeiByDecimalsInput(decimalsFrom, amount.toString(10))
      // wrap ETH case
      const _from = String(from).toLowerCase() === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
      ? WETH
      : from

      const _to = String(to).toLowerCase() === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
      ? WETH
      : to

      const router = new this.props.web3.eth.Contract(UNIRouterABI, CoSwapRouter)
      const data = await router.methods.getAmountsOut(src, [_from, _to]).call()
      price = data[1]
    }

    return price
  }

  // get slippage percent
  getSlippage = async (sendFrom, sendTo, amountSend, amountRecive, decimalsFrom, decimalsTo) => {
    try{
      const expectedRatio = new BigNumber(
        toWeiByDecimalsInput(decimalsTo, amountRecive)
      )
      const amountSendBN = new BigNumber(amountSend)
      const onePercentFromInput = amountSendBN.minus(amountSendBN.multipliedBy(99).dividedBy(100))
      const ratioForOnePercent = new BigNumber(await this.getRate(
        sendFrom,
        sendTo,
        onePercentFromInput,
        decimalsFrom,
        decimalsTo
      ))

      const realRatio = new BigNumber(ratioForOnePercent.multipliedBy(100))
      const difference = realRatio.minus(expectedRatio)

      const slippage = difference.dividedBy(expectedRatio.dividedBy(100))
      return slippage.dividedBy(2).toFixed(6)
    }catch(e){
      return 0
    }
  }

  // TODO: User can select slipapge percent
  // cut 5% slippage for min return
  getMinReturn(){
    const amountReceive = toWeiByDecimalsInput(this.state.decimalsTo, this.state.AmountRecive)
    const result = new BigNumber(String(amountReceive)).multipliedBy(95).dividedBy(100)
    return BigNumber(BigNumber(result).integerValue()).toString(10)
  }

  // update state only when user stop typing
  delayChange = (e) => {
    e.persist()
    this.setState({ [e.target.name]:e.target.value })
    if(this._timeout){ //if there is already a timeout in process cancel it
        clearTimeout(this._timeout)
    }
    this._timeout = setTimeout(async()=>{
       this._timeout = null
       await this.change(e)
    },1000)
  }

  // extract address from global tokens obj by symbol
  getTokenAddressBySymbol = (symbol) => {
    const From = this.state.tokens.filter(item => item.symbol === symbol)
    return String(From[0].address).toLowerCase()
  }


  // props for SelectToken component
  onChangeTypeHead = (name, param) => {
    this.setState({
      [name]:param,
      AmountSend:0,
      AmountRecive:0
    })
  }

  pushNewTokenInList = (tokenSymbol, tokenData) => {
    const symbols = this.state.symbols
    const tokens = this.state.tokens

    if(!symbols.includes(tokenSymbol)){
      symbols.push(tokenSymbol)
      tokens.push(tokenData)

      this.setState({
        symbols,
        tokens
      })
    }
    else{
      alert(`${tokenSymbol} alredy in list`)
    }
  }


  render() {
    console.log("Send", this.state.Send, "Recive", this.state.Recive)
   return (
      <div>
      <br/>
      <br/>
      {
        this.state.tokens
        ?
        (
          <>
          {/* SEND */}
          <Form.Label>Pay with</Form.Label>
          <InputGroup className="mb-3">
          <SelectToken
           web3={this.props.web3}
           symbols={this.state.symbols}
           tokens={this.state.tokens}
           onChangeTypeHead={this.onChangeTypeHead}
           direction="Send"
           currentSymbol={this.state.Send}
           pushNewTokenInList={this.pushNewTokenInList}
          />
          <Form.Control
          type="number"
          placeholder={this.state.AmountSend}
          min="0"
          name="AmountSend"
          value={this.state.AmountSend}
          onChange={e => this.delayChange(e)}
          />
          </InputGroup>
          {
            this.state.slippageTo > 0
            ?
            (
              <small style={{color:"blue"}}>Slippage: {String(this.state.slippageTo)} %</small>
            ):null
          }

          {
            this.state.shouldUpdatePrice ? (<Pending/>) : null
          }
          <br/>

          {/* RECEIVE */}
          <Form.Label>Receive</Form.Label>
          <InputGroup className="mb-3">
          <SelectToken
           web3={this.props.web3}
           symbols={this.state.symbols}
           tokens={this.state.tokens}
           onChangeTypeHead={this.onChangeTypeHead}
           direction="Recive"
           currentSymbol={this.state.Recive}
           pushNewTokenInList={this.pushNewTokenInList}
          />
          <Form.Control
          type="number"
          placeholder={this.state.AmountRecive}
          min="0"
          name="AmountRecive"
          value={this.state.AmountRecive}
          onChange={e => this.delayChange(e)}
          />
          </InputGroup>
          {
            this.state.slippageFrom > 0
            ?
            (
              <small style={{color:"blue"}}>Slippage: {String(this.state.slippageFrom)} %</small>
            ):null
          }

          {/* Display error */}
          {this.ErrorMsg()}

          {/* Trigger tarde */}
          <br />
          {
            this.props.exchangePortalAddress === ExchangePortalAddressLight
            ?
            (
              <Button variant="outline-primary" onClick={() => this.validation()}>Trade</Button>
            )
            :
            (
              <Alert variant="danger">Please update portal to latest version, for enable CoSwap DEX in your fund</Alert>
            )
          }

          <br />
          {
            this.state.prepareData ? (<small>Preparing transaction data, please wait ...</small>) : null
          }
           </>
        )
        :
        (
          <p>Load data</p>
        )
      }
      </div>
    )
  }
}
export default TradeViaCoSwap
