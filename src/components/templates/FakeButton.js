import React, { Component } from 'react'
import { OverlayTrigger, Tooltip, Button } from "react-bootstrap"

class FakeButton extends Component {
  render() {
    return (
      <OverlayTrigger
      placement="bottom"
      overlay={
      <Tooltip id="tooltip">
      { this.props.info }
      </Tooltip>
      }
      >
      <Button className="buttonsAdditional" variant="outline-primary">{ this.props.buttonName }</Button>
      </OverlayTrigger>
    )
  }
}

export default FakeButton
