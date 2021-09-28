import React, { Component } from 'react'
import { Card, Row, Col } from "react-bootstrap"
import { fromWei } from 'web3-utils'

class UpgradableCard extends Component {
  constructor(props) {
   super(props);
    this.state = {
      profitInETH:this.props.profitInETH,
      profitInUSD:this.props.profitInUSD,
      valueInETH:this.props.valueInETH,
      valueInUSD:this.props.valueInUSD
    }
  }

  UpdateValue = (profitInETH, profitInUSD, valueInETH, valueInUSD) => {
    this.setState({ profitInETH, profitInUSD, valueInETH, valueInUSD });
  }

  render() {
  	return (
      <Card.Footer className="text-muted cardsAdditional">
      <small>
        <Row>
        <Col>Fund profit in BNB: { fromWei(String(this.state.profitInETH)) }</Col>
        <Col>Fund profit in USD: { fromWei(String(this.state.profitInUSD)) }</Col>
        <Col>Fund value in BNB: { fromWei(String(this.state.valueInETH)) }</Col>
        <Col>Fund value in USD: { fromWei(String(this.state.valueInUSD)) }</Col>
        </Row>
      </small>
      </Card.Footer>
    )
  }
}

export default UpgradableCard
