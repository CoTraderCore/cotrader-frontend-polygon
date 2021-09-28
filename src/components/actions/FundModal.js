import React, { Component } from 'react'
import { Button, Modal } from "react-bootstrap"
import { EtherscanLink }  from '../../config.js'
import { NavLink } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import Identicon from 'react-identicons'

class FundModal extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      Show: false,
    }
  }

  getManagerFunds(){
    this.props.MobXStorage.searchFundByManager(this.props.address)
    this.setState({ Show: false })
  }


  render() {
    let modalClose = () => this.setState({ Show: false });
    return (
      <div>
        <Button style={{minWidth: "200px", maxWidth: "200px"}} variant="outline-primary" onClick={() => this.setState({ Show: true })}>
          Fund: <Identicon size='10' string={this.props.address} />&ensp;
          <small><strong>{ String(this.props.address).replace(String(this.props.address).substring(4,38), "...") }</strong></small>
        </Button>

        <Modal
          show={this.state.Show}
          onHide={modalClose}
          aria-labelledby="example-modal-sizes-title-sm"
        >
          <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-sm">
          View fund info
          </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          {
            this.props.MobXStorage.web3
            ?
            (
              <NavLink to={"/fund/"+this.props.address}><Button variant="outline-primary" className="buttonsAdditional">See fund details</Button></NavLink>
            )
            :
            (
              <NavLink to={"/web3off/fund/"+this.props.address}><Button variant="outline-primary" className="buttonsAdditional">See fund details</Button></NavLink>
            )
          }
          <NavLink to={"/fund-txs/"+this.props.address}><Button variant="outline-primary">Get all txs</Button></NavLink>
          <Button variant="outline-primary" href={EtherscanLink + "address/" + this.props.address} target="_blank" rel="noopener noreferrer">See fund on Etherscan</Button>

          </Modal.Body>
          <Modal.Footer>
          Address: {this.props.address}
          </Modal.Footer>
        </Modal>

      </div>
    )
  }
}

export default inject('MobXStorage')(observer(FundModal))
