import React, { Component } from 'react'
import { NeworkID, EtherscanLink }  from '../../config.js'
import getFundData from '../../utils/getFundData'
import { Card, Row, Col, ListGroup, Badge, Alert, Table } from "react-bootstrap"
import { fromWei } from 'web3-utils'
import { fromWeiByDecimalsInput } from '../../utils/weiByDecimals'
import _ from 'lodash'


// Components
import Web3Allert from './Web3Allert'
import FakeButton from '../templates/FakeButton'
import EtherscanButton from '../actions/EtherscanButton'
// import ViewPageCharts from '../charts/ViewPageCharts'
import InvestorsAlocationChart from '../charts/InvestorsAlocationChart'
import UserInfo from '../templates/UserInfo'
import Identicon from 'react-identicons'
import AssetsAlocationChart from '../charts/AssetsAlocationChart'

import Loading from '../templates/Spiners/Loading'

class ViewFundWithoutWeb3 extends Component {
  state = {
   smartFundAddress: '',
   name: '',
   balance: [],
   owner: '',
   profitInETH: '0',
   profitInUSD: '0',
   valueInETH: '0',
   valueInUSD: '0',
   managerTotalCut: '0',
   managerRemainingCut: '0',
   shares: [],
   isDataLoad: false,
   mainAsset:'',
   tradeVerification:0,
   fundSizeType:'light',
   version:0,
   managerFee:0
  }

 _isMounted = false;

 componentDidMount = async () => {
    this._isMounted = true;
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
        shares: fund.data.result.shares,
        mainAsset: fund.data.result.mainAsset,
        isDataLoad:true,
        tradeVerification: fund.data.result.tradeVerification,
        fundSizeType: fund.data.result.fundType,
        managerFee:fund.data.result.managerFee,
        version: fund.data.result.version
     });
   }
  }

 componentWillUnmount(){
    this._isMounted = false;
 }

  // if coonected to web3 go out from web3off
 componentDidUpdate(nextProps){
    if(nextProps.web3){
      window.location = "/"
    }
 }

 // helper for parse pool connectors data
 parsePoolConnectors = (data) => {
   const poolConnectors = data.map((item) => item.symbol)
   return(
    <UserInfo  info={`Pool tokens : ${poolConnectors}`}/>
   )
 }

 render() {
  return (
    <React.Fragment>
    {
      this.state.isDataLoad
      ?
      (
      <div>
      <Web3Allert/>
      <Card className="text-center">
        <Card.Header className="cardsAdditional"> <Badge variant="ligth">{this.state.name}</Badge>
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
         <Col>Fund profit in BNB: { fromWei(String(this.state.profitInETH), 'ether')}</Col>
         <Col>Fund profit in USD: { fromWei(String(this.state.profitInUSD), 'ether')}</Col>
         <Col>Fund value in BNB: {fromWei(String(this.state.valueInETH), 'ether')}</Col>
         <Col>Fund value in USD: {fromWei(String(this.state.valueInUSD), 'ether')}</Col>
        </Row>
        </small>
        </Alert>
        <br />
        <div className="fund-page-btns">
        <div align="center"><strong>Investor actions</strong></div>
          <ul>
            <li><FakeButton buttonName={"Deposit"} info={"please connect to web3"}/></li>
            <li><FakeButton buttonName={"Withdraw"} info={"please connect to web3"}/></li>
            <li><EtherscanButton address={this.state.smartFundAddress}/></li>
            <li><FakeButton buttonName={"My profile"} info={"please connect to web3"}/></li>
          </ul>
       </div>
       <br />

        <Badge variant="ligth">Manager info</Badge>
        <div style={{ textAlign: 'center'}}>
        <ListGroup style={{ display: 'inline-block', margin: '10px 0'}}>
         <ListGroup.Item>Total Cut: {fromWei(this.state.managerTotalCut, 'ether')}</ListGroup.Item>
         <ListGroup.Item>Remaining cut: {fromWei(this.state.managerRemainingCut, 'ether')}</ListGroup.Item>
        </ListGroup>
        </div>
        <br />

        <div className="fund-page-charts">
          <div>
            <InvestorsAlocationChart Data={this.state.shares}/>
            {
              NeworkID === 1 && !_.isEmpty(this.state.balance)
              ?
              (
                <AssetsAlocationChart AssetsData={this.state.balance} version={this.state.version}/>
              )
              :null
            }
          </div>
        </div>


        <Badge variant="ligth">Fund balance</Badge>
        <br/>
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
                   return(
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
         <ViewPageCharts address={this.state.smartFundAddress}/>
         */
       }
       </div>
       <br />

       <div className="fund-page-btns">
       <div align="center"><strong>Manager actions</strong></div>
         <ul>
         <li><FakeButton className="buttonsAdditional" buttonName={"Exchange"} info={"please connect to web3"}/></li>
         <li><FakeButton className="buttonsAdditional" buttonName={"Pool"} info={"please connect to web3"}/></li>
         <li><FakeButton className="buttonsAdditional" buttonName={"Take cut"} info={"please connect to web3"}/></li>
         <li><FakeButton className="buttonsAdditional"  buttonName={"White list"} info={"please connect to web3"}/></li>
         {
           this.state.mainAsset === 'USD'
           ?
           (
            <li>
            <FakeButton buttonName={"Stable tokens"} info={"please connect to web3"}/>
            </li>
           )
           : null
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
        </div>
      )
      :
      (
        <Loading />
      )
    }

    </React.Fragment>
    )
  }
}

export default ViewFundWithoutWeb3
