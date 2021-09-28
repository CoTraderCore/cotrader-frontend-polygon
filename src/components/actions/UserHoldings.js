import React, { Component } from 'react'
import { SmartFundABIV7 } from '../../config.js'
import { Button, Modal, ListGroup } from "react-bootstrap"
import { fromWei } from 'web3-utils';

import Loading from '../templates/Spiners/Loading'

class UserHoldings extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      Show: false,
      calculateAddressValue: '0',
      calculateAddressProfit: '0',
      percentOfFundValue: '0',
      isLoad: false
    }
  }


  componentDidUpdate = async() => {
   if(this.state.Show && this.props.address && !this.state.isLoad){
    const fund = new this.props.web3.eth.Contract(SmartFundABIV7, this.props.address)
    const _calculateAddressValue = await fund.methods.calculateAddressValue(this.props.accounts[0]).call()
    const _calculateAddressProfit = await fund.methods.calculateAddressProfit(this.props.accounts[0]).call()
    const _fundValue = await fund.methods.calculateFundValue().call()

    // Percent of fund fundValue
    const percent = fromWei(_fundValue.toString()) / 100
    const _percentOfFundValue = fromWei(_calculateAddressValue.toString()) / percent

    this.setState(
      {
        isLoad: true,
        calculateAddressValue: _calculateAddressValue.toString(),
        calculateAddressProfit: _calculateAddressProfit.toString(),
        percentOfFundValue: _percentOfFundValue
      }
    )
   }
  }



  render() {
    let modalClose = () => this.setState({ Show: false, isLoad: false })

    return (
      <div>
        <Button variant="outline-primary" className="buttonsAdditional" onClick={() => this.setState({ Show: true })}>
          My Holdings
        </Button>

        <Modal
          show={this.state.Show}
          onHide={modalClose}
          aria-labelledby="example-modal-sizes-title-sm"
        >
          <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-sm">
          My funds
          </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          {
            this.state.isLoad
            ?
            (
              <React.Fragment>
              <ListGroup>
              <ListGroup.Item>My deposit in BNB value: { fromWei(this.state.calculateAddressValue) }</ListGroup.Item>
              <ListGroup.Item>My profit : { fromWei(this.state.calculateAddressProfit) }</ListGroup.Item>
              <ListGroup.Item>My holding in percent of fund value: { this.state.percentOfFundValue } %</ListGroup.Item>
              </ListGroup>
              </React.Fragment>
            )
            :
            (
              <Loading />
            )
          }
          </Modal.Body>
        </Modal>

      </div>
    )
  }
}

export default UserHoldings
