import React, { Component } from 'react'

import axios from 'axios'

import getFundData from '../utils/getFundData'
import { Card, Row, Col, ListGroup, Badge, Alert, Table } from "react-bootstrap"
import { fromWeiByDecimalsInput } from '../utils/weiByDecimals'
import { EtherscanLink, APIEnpoint, NeworkID }  from '../config.js'
import io from "socket.io-client"
import _ from 'lodash'

import TradeModal from './actions/TradeModal/TradeModal'
import WithdrawManager from './actions/WithdrawManager'
import WhiteList from './actions/WhiteList'
import FakeButton from './templates/FakeButton'
import EtherscanButton from './actions/EtherscanButton'
import Withdraw from './actions/Withdraw'
import Deposit from './actions/Deposit/Deposit'
import UserHoldings from './actions/UserHoldings'
import MigrateToV9 from './actions/MigrateToV9'

// import CompoundLoan from './actions/CompoundLoan'
// import YearnLoan from './actions/YearnLoan'
import UpdateUSDAsset from './actions/UpdateUSDAsset'

import Loading from './templates/Spiners/Loading'
import Pending from './templates/Spiners/Pending'
import PopupMsg from './templates/PopupMsg'
// import ViewPageCharts from './charts/ViewPageCharts'
import InvestorsAlocationChart from './charts/InvestorsAlocationChart'
import UserInfo from './templates/UserInfo'
import AssetsAlocationChart from './charts/AssetsAlocationChart'

import Identicon from 'react-identicons'


class ViewFund extends Component {
  constructor(props, context) {
    super(props, context)
    this._popupChild = React.createRef()

     this.state = {
     smartFundAddress: '',
     name: '',
     balance: null,
     owner: '',
     profitInETH: '0',
     profitInUSD: '0',
     valueInETH: '0',
     valueInUSD: '0',
     managerTotalCut: '0',
     managerRemainingCut: '0',
     pending: false,
     popupMsg: false,
     isDataLoad: false,
     txName: '',
     txHash:'',
     lastHash: '',
     shares: [],
     version:0,
     txCount:0,
     mainAsset:'',
     fundSizeType:'full',
     managerFee:0,
     tradeVerification:1
    }
}

 _isMounted = false

 componentDidMount = async () => {
   this._isMounted = true
   await this.loadData()
   this.initSocket()
   this.checkPending()
}

 componentWillUnmount(){
   this._isMounted = false
 }


 // init socket listener
 initSocket = ()=>{
   const socket = io(APIEnpoint)
     socket.on('connect', ()=>{
     socket.on('Deposit', (address, hash) => {
     this.txUpdate('deposit', address, hash)
     })

     socket.on('Withdraw', (address, hash) => {
     this.txUpdate('withdraw', address, hash)
     })

     socket.on('Trade', (address, hash) => {
     this.txUpdate('trade', address, hash)
     })
   })
 }

 // helper for update by socket events
 txUpdate = (txName, address, hash) => {
   if(address === this.props.match.params.address && this.state.lastHash !== hash){
     if(this._isMounted){
      this.setState({ lastHash: hash })
      this.setState({ txName:txName, txHash:hash })

      this.updateBalance()
      this.checkPending()

      if(this._popupChild.current)
        this.showPopup()
   }
   }
 }

 // get data from api
 loadData = async () => {
   const fund = await getFundData(this.props.match.params.address)

   if(this._isMounted){
    this.setState({
      smartFundAddress: fund.data.result.address,
      name: fund.data.result.name,
      balance: JSON.parse(fund.data.result.balance),
      owner: fund.data.result.owner,
      profitInETH: fund.data.result.profitInETH,
      profitInUSD: fund.data.result.profitInUSD,
      valueInETH: fund.data.result.valueInETH,
      valueInUSD: fund.data.result.valueInUSD,
      managerTotalCut: fund.data.result.managerTotalCut,
      managerRemainingCut: fund.data.result.managerRemainingCut,
      //smartBankAddress: fund.data.result.bank,
      shares: fund.data.result.shares,
      isDataLoad:true,
      version:Number(fund.data.result.version),
      mainAsset: fund.data.result.mainAsset,
      fundSizeType: fund.data.result.fundType,
      managerFee:fund.data.result.managerFee,
      tradeVerification:fund.data.result.tradeVerification
     });
    }
 }

 // helper for update balance by socket event
 updateBalance = async () => {
   const fund = await getFundData(this.props.match.params.address)

   if(this._isMounted){
    this.setState({
      balance: JSON.parse(fund.data.result.balance),
      profitInETH: fund.data.result.profitInETH,
      profitInUSD: fund.data.result.profitInUSD,
      valueInETH: fund.data.result.valueInETH,
      valueInUSD: fund.data.result.valueInUSD,
      managerTotalCut: fund.data.result.managerTotalCut,
      managerRemainingCut: fund.data.result.managerRemainingCut,
      shares: fund.data.result.shares
     });
    }
 }

 // prop for components Deposit, Withdraw, Trade, FundManagerWinthdraw
 pending = (_bool, _txCount) => {
   this.setState({ pending:_bool, txCount:_txCount })
 }

 // check if there are no more transactions hide peding info
 checkPending = async () => {
   if(this.props.accounts){
     let txCount = await axios.get(APIEnpoint + 'api/user-pending-count/' + this.props.accounts[0])
     txCount = txCount.data.result

     const pending = Number(txCount) === 0 ? false : true
     if(this._isMounted)
        this.setState({ pending, txCount })
   }
 }

 // helper for parse pool connectors data
 parsePoolConnectors = (data) => {
   const poolConnectors = data.map((item) => item.symbol)
   return(
    <UserInfo  info={`Pool tokens : ${poolConnectors}`}/>
   )
 }

 // show toast info
 showPopup() {
   if(this._popupChild.current)
     this._popupChild.current.show()
 }


 render() {
    return (
    <React.Fragment>
    <MigrateToV9
      version={this.state.version}
      owner={this.state.owner}
      web3={this.props.web3}
      accounts={this.props.accounts}
      smartFundAddress={this.state.smartFundAddress}
    />
    {
      this.props.web3 && this.state.isDataLoad
      ?
      (
        <React.Fragment>
        <PopupMsg txName={this.state.txName} txHash={this.state.txHash} ref={this._popupChild} />
        {
          this.state.pending
          ?
          (
            <>
              <div align="center">
              <small>
              Pending transitions : {this.state.txCount}
              </small>
              </div>
              <Pending />
            </>
          )
          :
          (
            null
          )
        }
        <Card className="text-center">
        <Card.Header className="cardsAdditional">
        <Badge variant="ligth">Fund name: {this.state.name}</Badge>
        <br/>
        <small>
        type: {this.state.fundSizeType},
        core asset : {this.state.mainAsset} ,
        version: {String(this.state.version)},
        manager fee: {Number(this.state.managerFee/100).toFixed(2)} %,
        limit tokens: { Number(this.state.tradeVerification) === 1 ? "enabled" : "disabled" }
        </small>
        </Card.Header>
        <Card.Body>
        <Alert variant="dark">
        <small>
        <Row>
         <Col>Fund profit: { this.props.web3.utils.fromWei(String(this.state.profitInETH))} in BNB</Col>
         <Col>Fund profit: { this.props.web3.utils.fromWei(String(this.state.profitInUSD))} in USD</Col>
         <Col>Fund value: {this.props.web3.utils.fromWei(String(this.state.valueInETH))} in BNB</Col>
         <Col>Fund value: {this.props.web3.utils.fromWei(String(this.state.valueInUSD))} in USD</Col>
        </Row>
        </small>
        </Alert>
        <br />
        <div className="fund-page-btns">
        <div align="center"><strong>Investor actions</strong></div>
          <ul>
            <li>
            <Deposit
              web3={this.props.web3}
              address={this.state.smartFundAddress}
              accounts={this.props.accounts}
              mainAsset={this.state.mainAsset}
              pending={this.pending}
              version={this.state.version}
            />
            </li>
            <li>
            <Withdraw
              web3={this.props.web3}
              address={this.state.smartFundAddress}
              accounts={this.props.accounts}
              pending={this.pending}
              version={this.state.version}
              mainAsset={this.state.mainAsset}
            />
            </li>
            <li><EtherscanButton address={this.state.smartFundAddress}/></li>
            <li><UserHoldings web3={this.props.web3} address={this.state.smartFundAddress} accounts={this.props.accounts} pending={this.pending}/></li>
          </ul>
       </div>
        <br />
        <Badge variant="ligth">Manager info</Badge>
        <div style={{ textAlign: 'center'}}>
        <ListGroup style={{ display: 'inline-block', margin: '10px 0'}}>
         <ListGroup.Item>Total Cut: {this.props.web3.utils.fromWei(this.state.managerTotalCut)}</ListGroup.Item>
         <ListGroup.Item>Remaining cut: {this.props.web3.utils.fromWei(this.state.managerRemainingCut)}</ListGroup.Item>
        </ListGroup>
        </div>
        <br />
        <div className="fund-page-charts">
          <div>
            {
              this.state.shares
              ?
              (
                <InvestorsAlocationChart Data={this.state.shares}/>
              )
              : null
            }

            {
              NeworkID === 56 && !_.isEmpty(this.state.balance)
              ?
              (
                <AssetsAlocationChart AssetsData={this.state.balance} version={this.state.version}/>
              )
              :null
            }
          </div>
        </div>

        <br />
        <Badge variant="ligth">Fund balance</Badge>
        <br />
        <div style={{ textAlign: 'center'}}>
        <ListGroup style={{ display: 'inline-block', margin: '10px 0'}}>

        <Table striped bordered hover style={{
          textAlign:"left"
        }}>

        <thead style={{"color":"grey"}}>
         <tr>
           <th>Token</th>
           <th>% from fund</th>
           <th>Value in BNB</th>
           <th>Balance</th>
         </tr>
       </thead>
        {
          this.state.balance.length > 0 ?
          (
            <tbody style={{"color":"grey"}}>
            {
              this.state.balance.slice().sort(function(a,b) {
                 return Number(b.percentInETH) - Number(a.percentInETH)
               }).map((item, key) => {
                 if(item["percentInETH"] > 0){
                   return (
                     <tr key={key}>
                     <th>
                      {
                        <img
                        style={{height: "20px", width: "20px"}}
                        src={`https://tokens.1inch.exchange/${String(item["address"]).toLowerCase()}.png`}
                        alt="Logo"
                        onError={(e)=>{e.target.onerror = null; e.target.src="https://etherscan.io/images/main/empty-token.png"}}/>
                      }
                      &nbsp;
                      {<a href={EtherscanLink + "token/" + item["address"]} target="_blank" rel="noopener noreferrer">{item["symbol"]}</a>}
                      &nbsp;
                      {
                        item["tokensAdditionalData"].length > 0
                        ?
                        (
                          <>
                          {this.parsePoolConnectors(item["tokensAdditionalData"])}
                          </>
                        ):null
                      }
                      </th>

                      <th>
                      { item["percentInETH"] > 0 ? Number(item["percentInETH"]).toFixed(4) : 0 } %
                      </th>

                      <th>
                      { item["assetValueInETHFromWei"] > 0 ? Number(item["assetValueInETHFromWei"]).toFixed(6) : 0 }
                      </th>

                      <th>
                      {Number(fromWeiByDecimalsInput(item["decimals"], item["balance"].toString())).toFixed(4)}
                      </th>
                     </tr>
                   )
                 }
                 else{
                   return null
                 }
               }
              )
            }
            </tbody>
          )
          :
          (
            <p>No assets in this fund</p>
          )
        }
        </Table>
        </ListGroup>
        </div>
        <br />
        <div align="center">
        {
          /*
          NeworkID === 56 && !_.isEmpty(this.state.balance)
          ?
          (
            <ViewPageCharts address={this.state.smartFundAddress} Data={this.state.balance}/>
          )
          : null
          */
        }
        </div>
        <br />


        <div className="fund-page-btns">
        <div align="center"><strong>Manager actions</strong></div>
          <ul>
          {
           this.props.accounts[0] === this.state.owner ?
           (
             <React.Fragment>
             {
               <li>
                <TradeModal
                  web3={this.props.web3}
                  accounts={this.props.accounts}
                  smartFundAddress={this.state.smartFundAddress}
                  pending={this.pending}
                  version={this.state.version}
                />
               </li>
             }

             <li>
             <WithdrawManager
               web3={this.props.web3}
               accounts={this.props.accounts}
               smartFundAddress={this.state.smartFundAddress}
               owner={this.state.owner}
               pending={this.pending}
               version={this.state.version}
             />
             </li>

             <li>
             <WhiteList
             web3={this.props.web3}
             accounts={this.props.accounts}
             smartFundAddress={this.state.smartFundAddress}
             owner={this.state.owner}/>
             </li>

             {
               this.state.mainAsset === 'USD'
               ?
               (
                  <UpdateUSDAsset
                    web3={this.props.web3}
                    accounts={this.props.accounts}
                    smartFundAddress={this.state.smartFundAddress}
                    version={this.state.version}
                  />
               )
               : null
             }

             </React.Fragment>
           )
           :
           (
             <React.Fragment>
             <li>
             <FakeButton buttonName={"Exchange"} info={"You can't use this button because You are not owner of this smart fund"}/>
             </li>
             <li>
             <FakeButton buttonName={"Take cut"} info={"You can't use this button because You are not owner of this smart fund"}/>
             </li>
             <li>
             <FakeButton buttonName={"White list"} info={"You can't use this button because You are not owner of this smart fund"}/>
             </li>
             {
               this.state.mainAsset === 'USD'
               ?
               (
                <li>
                <FakeButton buttonName={"Stable tokens"} info={"You can't use this button because You are not owner of this smart fund"}/>
                </li>
               )
               : null
             }
             </React.Fragment>
           )
         }
         </ul>
         </div>

        </Card.Body>
        <Card.Footer className="text-muted cardsAdditional">
        <Row>
         <Col>Smart fund: <Identicon size='10' string={this.state.smartFundAddress} />&nbsp;
         <a href={EtherscanLink + "address/" + this.state.smartFundAddress} target="_blank" rel="noopener noreferrer"> {String(this.state.smartFundAddress).replace(String(this.state.smartFundAddress).substring(6,36), "...")}</a>
         </Col>
         <Col>
         Owner: <Identicon size='10' string={this.state.owner} />&nbsp;
         <a href={EtherscanLink + "address/" + this.state.owner} target="_blank" rel="noopener noreferrer">{String(this.state.owner).replace(String(this.state.owner).substring(6,36), "...")}</a>
         </Col>
        </Row>
        </Card.Footer>
        </Card>
        </React.Fragment>

      )
      :
      (<Loading />)
    }
    </React.Fragment>
    )
  }
}

export default ViewFund
