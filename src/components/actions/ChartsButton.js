import React, { Component } from 'react'
import { Button } from "react-bootstrap"
import { BloxyLink } from '../../config.js'

class ChartsButton extends Component {

  render() {
    return (
    <Button variant="outline-primary" className="buttonsAdditional" href={BloxyLink + this.props.address} target="_blank">Bloxy</Button>
    )
  }
}

export default ChartsButton
