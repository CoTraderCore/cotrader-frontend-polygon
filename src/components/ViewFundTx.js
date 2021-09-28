/*
* Logic
* 1) Get all users in fund
* 2) get all tx from users
* 3) render only tx for this fund
*/

import React, { Component } from 'react'
import getFundData from '../utils/getFundData'
import getUserData from '../utils/getUserData'
import { EtherscanLink }  from '../config.js'
import { Card, ListGroup, Dropdown } from "react-bootstrap"

class ViewManager extends Component {
  constructor(props, context) {
   super(props, context)
   this.state = {
     data: [],
     funds: [],
     deposit: [],
     trade:[],
     withdarw:[],
     showFundsTX:true,
     showDepositTX:true,
     showTradeTX:true,
     showWithdrawTX:true
   }
  }

  _isMounted = false

  componentDidMount = async () => {
    this._isMounted = true
    this.getAllFundTxs()
  }

  componentWillUnmount(){
    this._isMounted = false
  }

  getAllFundTxs = async () => {
    if(this._isMounted){
    // Get all users in fund
    const data = await getFundData(this.props.match.params.address)
    const owner = data.data.result.owner

    // Create users array
    let users = []
    let _users = data.data.result.shares
    if(_users){
    users = JSON.parse(_users)
    users = users.map((index) => index.user)
    users.push(owner)
    // Remove duplicete in case if owner of fund make deposit
    users = Array.from(new Set(users))
    }
    // In case if no shares
    else{
    users.push(owner)
    }

    let fund = []
    let deposit = []
    let withdraw = []
    let trade = []

    // get all txs
    for(let i=0; i<users.length; i++){
      const txData = await getUserData(users[i])

      if(JSON.parse(txData.data.result[0].funds) !== null )
      fund.push([...JSON.parse(txData.data.result[0].funds)])

      if(JSON.parse(txData.data.result[0].withdraw) !== null)
      withdraw.push([...JSON.parse(txData.data.result[0].withdraw)])

      if(JSON.parse(txData.data.result[0].deposit) !== null)
      deposit.push([...JSON.parse(txData.data.result[0].deposit)])

      if(JSON.parse(txData.data.result[0].trade)!== null)
      trade.push([...JSON.parse(txData.data.result[0].trade)])
    }

    if(this._isMounted)
    this.setState({
      funds: fund.flat(),
      deposit: deposit.flat(),
      trade:trade.flat(),
      withdraw: withdraw.flat()
    })
   }
  }

  toogle = (name) => {
    this.setState({
      [name]:!this.state[name]
    })
  }

  renderTx = (data, stateName) => {
    return(
      <React.Fragment>
      {
        data && data.length > 0
        ?
        (
          <React.Fragment>
          {data.map((item, key) =>

              item.fund === this.props.match.params.address
              ?
              (
                <ListGroup key={item.transactionHash}>
                <ListGroup.Item>blockNumber: <a href={EtherscanLink +"/block/"+ item.blockNumber} target="_blank" rel="noopener noreferrer">{item.blockNumber}</a></ListGroup.Item>
                <ListGroup.Item>Tx hash: <a href={EtherscanLink + "/tx/" + item.transactionHash} target="_blank" rel="noopener noreferrer">{item.transactionHash}</a></ListGroup.Item>
                <ListGroup.Item>Fund address: <a href={EtherscanLink + "/address/" +item.fund} target="_blank" rel="noopener noreferrer">{item.fund}</a></ListGroup.Item>
                { this.additionalData(item, stateName) }
                </ListGroup>
              )
              :(null)

          )}
          </React.Fragment>
        )
        :
        (
          <ListGroup.Item>no tx</ListGroup.Item>
        )
      }
      </React.Fragment>
    )
  }

  additionalData = (data, state) => {
  switch(state){
    case 'funds':
    return(null)

    case 'deposit':
    return(
      <React.Fragment>
      <ListGroup.Item>Aditional data</ListGroup.Item>
      <ListGroup.Item>Deposit amount: {data.additionalData.amount} ETH in wei</ListGroup.Item>
      <ListGroup.Item>Total shares: {data.additionalData.totalShares} </ListGroup.Item>
      <ListGroup.Item>Shares received: {data.additionalData.sharesReceived} </ListGroup.Item>
      </React.Fragment>
    )

    case 'trade':
    return(
      <React.Fragment>
      <ListGroup.Item>Aditional data</ListGroup.Item>
      <ListGroup.Item>src token address: {data.additionalData.src}</ListGroup.Item>
      <ListGroup.Item>amount send: {data.additionalData.srcAmount} </ListGroup.Item>
      <ListGroup.Item>dest token address: {data.additionalData.dest} </ListGroup.Item>
      <ListGroup.Item>dest recived amount: {data.additionalData.destReceived}</ListGroup.Item>
      </React.Fragment>
    )

    case 'withdraw':
    return(
      <React.Fragment>
      <ListGroup.Item>Aditional data</ListGroup.Item>
      <ListGroup.Item>Shares removed: {data.additionalData.sharesRemoved} </ListGroup.Item>
      <ListGroup.Item>Total shares: {data.additionalData.totalShares} </ListGroup.Item>
      </React.Fragment>
    )

    default:
    return null
  }
  }

  render(){
  return(
    <React.Fragment>
    <Dropdown>
    <Dropdown.Toggle variant="outline-primary" id="dropdown-basic">
    Sorting tx
    </Dropdown.Toggle>

    <Dropdown.Menu>
    <Dropdown.Item onClick={() => this.toogle("showFundsTX")}>{this.state.showFundsTX ? "Disable" : "Enable"} funds tx</Dropdown.Item>
    <Dropdown.Item onClick={() => this.toogle("showDepositTX")}>{this.state.showDepositTX ? "Disable" : "Enable"} deposit tx</Dropdown.Item>
    <Dropdown.Item onClick={() => this.toogle("showTradeTX")}>{this.state.showTradeTX ? "Disable" : "Enable"} trade tx</Dropdown.Item>
    <Dropdown.Item onClick={() => this.toogle("showWithdrawTX")}>{this.state.showWithdrawTX ? "Disable" : "Enable"} withdraw tx</Dropdown.Item>
    </Dropdown.Menu>
    </Dropdown>

    <Card className="text-center">
    <Card.Header> All transactions for address: <a href={EtherscanLink +"/address/"+ this.props.match.params.address} target="_blank" rel="noopener noreferrer">{this.props.match.params.address}</a></Card.Header>
    <br />
    {
      this.state.showFundsTX ?
      (
        <React.Fragment>
        <h5>create fund tx</h5>
        {this.renderTx(this.state.funds, "funds")}
        <br />
        </React.Fragment>
      )
      :(null)
    }
    {
      this.state.showDepositTX ?
      (
        <React.Fragment>
        <h5>deposit tx</h5>
        {this.renderTx(this.state.deposit, "deposit")}
        <br />
        </React.Fragment>
      )
      :(null)
    }

    {
      this.state.showTradeTX ?
      (
        <React.Fragment>
        <h5>trade tx</h5>
        {this.renderTx(this.state.trade, "trade")}
        <br />
        </React.Fragment>
      )
      :(null)
    }
    {
      this.state.showWithdrawTX ?
      (
        <React.Fragment>
        <h5>withdarw tx</h5>
        {this.renderTx(this.state.withdraw, "withdraw")}
        <br />
        </React.Fragment>
      )
      :(null)
    }
    </Card>
    </React.Fragment>
  )
}
}

export default ViewManager
