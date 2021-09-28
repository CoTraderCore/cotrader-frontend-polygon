import React, { Component } from 'react'
import { OverlayTrigger, Tooltip, Badge } from "react-bootstrap"

class UserInfo extends Component {
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
      <Badge variant="info"> info</Badge>
      </OverlayTrigger>
    )
  }
}

export default UserInfo
