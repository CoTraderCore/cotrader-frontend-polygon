// this trade modal work only with 1 INCH PROTO (fully onchain) and 1 INCH ETH (calldata from api)
// with lovest price
// also this modal work with merkle tree tokens white list verification
// support only for versions >= 7

import React, { Component } from 'react'
import {
  SmartFundABIV7,
  ExchangePortalABIV6
} from '../../../config.js'

import {
  Button,
  Modal,
  Form,
  Tabs,
  Tab
} from "react-bootstrap"

import MigrateToNewPortal from '../MigrateToNewPortal'
import SetGasPrice from '../../settings/SetGasPrice'

// trade modals
import TradeViaOneInch from './TradeViaOneInch'
import TradeViaCoSwap from './TradeViaCoSwap'


class TradeModal extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      ShowModal: false,
      prepareData:false,
      shouldUpdatePrice:false,
      exchangePortalVersion:0,
      exchangePortalAddress:''
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


  // get tokens addresses and symbols from paraswap api
  initData = async () => {
    const {
      exchangePortalAddress,
      exchangePortalVersion
    } = await this.getExchangePortalVersion(this.props.smartFundAddress)


    this.setState({ exchangePortalAddress, exchangePortalVersion })
  }

  // return version of fund Exchange portal
  getExchangePortalVersion = async (fundAddress) => {
    const smartFund = new this.props.web3.eth.Contract(SmartFundABIV7, fundAddress)
    const exchangePortalAddress = await smartFund.methods.exchangePortal().call()
    const exchangePortal = new this.props.web3.eth.Contract(ExchangePortalABIV6, exchangePortalAddress)
    const exchangePortalVersion = Number(await exchangePortal.methods.version().call())
    return { exchangePortalAddress, exchangePortalVersion }
  }


  // reset states after close modal
  closeModal = () => this.setState({
    ShowModal: false
  })

  render() {
   return (
      <div>
        <Button variant="outline-primary" onClick={() => this.setState({ ShowModal: true })}>
          Exchange
        </Button>

          <Modal
          size="lg"
          show={this.state.ShowModal}
          onHide={() => this.closeModal()}
          aria-labelledby="example-modal-sizes-title-lg"
          >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">
              Exchange
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Form>

          <Tabs defaultActiveKey="oneInch" id="trade-tabs">
            <Tab eventKey="oneInch" title="1 inch">
              <TradeViaOneInch
                web3={this.props.web3}
                accounts={this.props.accounts}
                smartFundAddress={this.props.smartFundAddress}
                pending={this.props.pending}
                version={this.props.version}
                exchangePortalAddress={this.state.exchangePortalAddress}
                closeModal={this.closeModal}
              />
            </Tab>
            <Tab eventKey="coSwap" title="CoSwap">
              <TradeViaCoSwap
                web3={this.props.web3}
                accounts={this.props.accounts}
                smartFundAddress={this.props.smartFundAddress}
                pending={this.props.pending}
                version={this.props.version}
                exchangePortalAddress={this.state.exchangePortalAddress}
                closeModal={this.closeModal}
              />
            </Tab>
          </Tabs>


          {/* check if need update portal */}
          <MigrateToNewPortal
            exchangePortalAddress={this.state.exchangePortalAddress}
            web3={this.props.web3}
            accounts={this.props.accounts}
            smartFundAddress={this.props.smartFundAddress}
            closeModal={this.closeModal}
          />

          {/* Update gas price */}
          <br />
          {
            this.props.web3 ? <SetGasPrice web3={this.props.web3}/> : null
          }
           </Form>
          </Modal.Body>
        </Modal>
        </div>
    )
  }
}
export default TradeModal
