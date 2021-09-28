import React, { Component } from 'react'
import { Card } from "react-bootstrap"
import Navbar2 from './Navbar'
class Header extends Component {
  render() {
    return (
    <React.Fragment>
    <Navbar2/>
    <Card className="text-center" style={{ padding: '15px', backgroundColor:'transparent', border: '1px solid #eee', margin: '10px auto' }}>
    <small>World's first non-custodial crypto investments funds marketplace - create or join the best smart funds</small>
    </Card>
    </React.Fragment>
    )
  }
}

export default Header
