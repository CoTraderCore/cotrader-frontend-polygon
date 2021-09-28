/*
* Just component without web3
*/

import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import getFundsList from "../../utils/getFundsList"
import { fromWei } from 'web3-utils'

import { Card, ListGroup, Row, Col, Badge, Button, ButtonGroup } from "react-bootstrap"
import { NavLink } from 'react-router-dom'

// import MainPageCharts from '../charts/MainPageCharts'

import FakeButton from '../templates/FakeButton'
import FakeMaterializeButton from '../templates/FakeMaterializeButton'
import Web3Allert from './Web3Allert'
import EtherscanButton from '../actions/EtherscanButton'
import Loading from '../templates/Spiners/Loading'
import ManagerModal from '../actions/ManagerModal'
import FundModal from '../actions/FundModal'

import PagePagination from '../navigation/PagePagination'
import FilterAndSearch from '../navigation/FilterAndSearch/FilterAndSearch'
import FundsNav from '../navigation/FundsNav'
import SortFunds from '../navigation/SortFunds'

import MultiColorBar from '../charts/MultiColorBar/MultiColorBar'

class SmartFundsListWithoutWeb3 extends Component{
  constructor(state, context) {
     super(state, context);

     this.state = {
       isDataLoad:false
     }
   }

   _isMounted = false;

   componentDidMount = async () =>{
     this._isMounted = true

     if(this.props.MobXStorage.SmartFundsOriginal.length === 0){
     // Get fata for web3 off  component
     const smartFunds = await getFundsList()
     this.props.MobXStorage.initSFList(smartFunds)
     }

     if(this._isMounted)
      this.setState({
       isDataLoad:true
      })
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

  render() {
   return(
     <React.Fragment>
      {
        this.props.MobXStorage.SmartFundsOriginal.length > 0 ? (
          <React.Fragment>
            <Web3Allert />
            <Row className="justify-content-md-center">

            <div className="col-lg-6 col-sm-6 col createfund-btn">
               <FakeMaterializeButton buttonName={"Create fund"} info={"please connect to web3"}/>
            </div>

            <div className="col-lg-6 col-sm-6 col filter-fund">
               <FilterAndSearch />
            </div>

            <div className="col-lg-12 col-sm-12">
            <div className="total-found">
            {
             !this.props.MobXStorage.FilterActive ?
             (
               <>
               <h4>
               <Badge variant="ligth">
               <span>Total funds: {this.props.MobXStorage.SmartFundsOriginal.length}</span>
               </Badge>
               </h4>
               <small>Total value: ${this.props.MobXStorage.TotalValue}</small>
               <br/>
               <small>Total profit: ${this.props.MobXStorage.TotalProfit}</small>
               <br/>
               <small>History total profit: ${this.props.MobXStorage.HistoryTotalProfit}</small>
               <br/>
               </>
             ):
             (
               <div align="center">
               <strong>
               Found </strong>
               <br/>
               <small>
               {this.props.MobXStorage.SmartFunds.length}
               &nbsp;
               of
               &nbsp;
               {this.props.MobXStorage.SmartFundsOriginal.length}
               &nbsp;
               funds.
               &nbsp;
               </small>
               <br/>
               <small style={{color:"green"}}>{this.props.MobXStorage.FilterInfo}</small>
               <br/>
               <small>Total value: ${this.props.MobXStorage.userTotalValue}</small>
               <br/>
               <small>Total profit: ${this.props.MobXStorage.userTotalProfit}</small>
               <br/>
               <small>History total profit: ${this.props.MobXStorage.userHistoryTotalProfit}</small>
               <br/>
               </div>
             )
            }
            </div>
            </div>
            </Row>
            <br/>
            <SortFunds/>
            <br/>
            <FundsNav />

             <ListGroup variant="flush">
             {
             this.props.MobXStorage.SmartFunds.map((item, key) =>
             <Card className="text-center mb-3" bg="ligth" key={item.address}>
             <Card.Header className="cardsAdditional">
             <Badge variant="ligth">{item.name}</Badge>
             <br/>
             <small>
             type: {item.fundType},
             core asset : {item.mainAsset},
             version: {String(item.version)},
             manager fee: {Number(item.managerFee/100).toFixed(2)} %,

             total assets:
             {
               // get total assets count
               (() => {
               if(item && item.balance && item.hasOwnProperty('balance')){
                 try{
                  const addresses = JSON.parse(item.balance).map(i => i.address)
                  return addresses.length
                 }catch(e){
                   return 0
                 }
               }else{
                 return 0
               }
               })()
             },

             active assets:
             {
               // get active assets count
               (() => {
               if(item && item.balance && item.hasOwnProperty('balance')){
                 try{
                  const addresses = JSON.parse(item.balance).filter(i => i.percentInETH > 0)
                  return addresses.length
                 }catch(e){
                  return 0
                 }
               }else{
                 return 0
               }
               })()
             },

             investors:
             {
               // get total investors count
               (() => {
               if(item && item.shares && item.hasOwnProperty('shares')){
                 try{
                  const investors = JSON.parse(item.shares).map(i => i.user)
                  return investors.length
                }catch(e){
                  return 0
                }
               }else{
                 return 0
               }
               })()
             },

             trade verification: { Number(item.tradeVerification) === 1 ? "enabled" : "disabled" }

             {
               item.balance.length > 0
               ?
               (<MultiColorBar data={JSON.parse(item.balance)}/>)
               : null
             }
             </small>
             </Card.Header>
             <Card.Body className="cardsAdditional">
             <Row className="justify-content-md-center">
             <Col><FundModal address={item.address}/></Col>
             <Col><ManagerModal address={item.owner}/></Col>
             </Row>
             {
               /*
               NeworkID === 56 ?
               (
                 <div align="center">
                 <MainPageCharts address={item.address} />
                 </div>
               )
               :
               (
                 <strong>Charts available only in mainnet</strong>
               )
               */
             }
             <div>
             <ButtonGroup horizontal="true">
             <FakeButton buttonName={"Deposit"} info={"please connect to web3"}/>
             <FakeButton buttonName={"Withdraw"} info={"please connect to web3"}/>
             <NavLink to={"/web3off/fund/"+ item.address}><Button variant="outline-primary" className="buttonsAdditional">Fund Page</Button></NavLink>
             <FakeButton buttonName={"My Funds"} info={"please connect to web3"}/>
             <EtherscanButton address={item.address}/>
             </ButtonGroup>
             </div>
             </Card.Body>
             <Card.Footer className="text-muted cardsAdditional">
             <small>
               <Row>
               <Col>Fund profit in BNB: { fromWei(String(item.profitInETH), 'ether')}</Col>
               <Col>Fund profit in USD: { fromWei(String(item.profitInUSD), 'ether')}</Col>
               <Col>Fund value in BNB: { fromWei(String(item.valueInETH), 'ether') }</Col>
               <Col>Fund value in USD: { fromWei(String(item.valueInUSD), 'ether') }</Col>
               </Row>
             </small>
             </Card.Footer>
             </Card>
             )
             }
             </ListGroup>
             {
               !this.props.MobXStorage.FilterActive
               ?
               (
                <PagePagination/>
               )
               :(null)
             }
             </React.Fragment>
        ):(<Loading />)
      }

     </React.Fragment>
   )
 }
}

export default inject('MobXStorage')(observer(SmartFundsListWithoutWeb3));
