import React, { Component } from 'react'
import { Button } from "react-bootstrap"
import { EtherscanLink }  from '../../config.js'

class EtherscanButton extends Component {

  render() {
    return (
    <Button variant="outline-primary" className="buttonsAdditional" href={EtherscanLink+ "/address/" + this.props.address} target="_blank">Scan</Button>
    )
  }
}

export default EtherscanButton
