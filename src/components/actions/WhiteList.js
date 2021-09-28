import React, { Component } from 'react'
import { SmartFundABIV7 } from '../../config.js'
import { Button, Modal, Form, OverlayTrigger, Tooltip } from "react-bootstrap"

import UserInfo from '../templates/UserInfo'

class WhiteList extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      Show: false,
      WhiteListStatus:false,
      IsDataLoading:false,
      contract: [],
      UserWhiteListAddress: '',
      UserStatus: true
    }
  }

  _isMounted = false

  componentDidMount = async () => {
    this._isMounted = true

    const contract = new this.props.web3.eth.Contract(SmartFundABIV7, this.props.smartFundAddress)
    const status = await contract.methods.onlyWhitelist().call()

    if(this._isMounted){
    this.setState({
      WhiteListStatus: status,
      contract: contract,
      IsDataLoading: true
      });
    }
  }

  componentWillUnmount(){
    this._isMounted = false
  }


  change = e => {
    this.setState({
      [e.target.name]: e.target.value
  })
  }

  setWhitelistOnly(_bool) {
    this.state.contract.methods.setWhitelistOnly(_bool).send({ from: this.props.accounts[0]})
    this.setState({Show:false})
  }

  addToWhitelistOnly(_bool) {
    if(this.props.web3.utils.isAddress(this.state.UserWhiteListAddress)){
    this.state.contract.methods.setWhitelistAddress(this.state.UserWhiteListAddress, this.state.UserStatus).send({ from: this.props.accounts[0]})
    this.setState({Show:false})
  }else{
    alert('Not correct address')
  }
  }

  render() {
    let modalClose = () => this.setState({ Show: false });

    return (
      <div>
        <OverlayTrigger
        placement="bottom"
        overlay={
        <Tooltip id="tooltip">
        This function allow fund manager add user to white list or remove
        </Tooltip>
        }
        >
        <Button variant="outline-primary" onClick={() => this.setState({ Show: true })}>
          White list
        </Button>
        </OverlayTrigger>

        <Modal
          show={this.state.Show}
          onHide={modalClose}
          aria-labelledby="example-modal-sizes-title-sm"
        >
        <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-sm">
        White list
        </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {
          this.state.WhiteListStatus && this.state.IsDataLoading ?
          (
            <Form>
            <Form.Group>
            <Form.Label>User</Form.Label>
            <Form.Control
            type="text"
            placeholder="ETH address"
            name="UserWhiteListAddress"
            onChange={e => this.change(e)}/>
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlSelect1">
            <Form.Label>Add to white list <UserInfo info="if true address will be add in whitelist users, who can do deposit, if false address will be remove"/></Form.Label>
            <Form.Control as="select" name="UserStatus" onChange={e => this.change(e)}>
              <option>true</option>
              <option>false</option>
            </Form.Control>
            </Form.Group>
            <Button variant="outline-primary"
            onClick={() => this.addToWhitelistOnly()}
            >
            Send
            </Button>
            <br />
            <br />
            <Form.Group id="formGridCheckbox">
            <Form.Check
            type="checkbox"
            label="Turn off the white list"
            onChange={() => this.setWhitelistOnly(false)}
            />
            </Form.Group>
            </Form>
          )
          :
          (
            <Form>
            <Form.Group id="formGridCheckbox">
            <Form.Check
            type="checkbox"
            label="Turn on the white list"
            onChange={() => this.setWhitelistOnly(true)}/>
            </Form.Group>
            </Form>
          )
        }

        </Modal.Body>
        </Modal>

      </div>
    )
  }
}

export default WhiteList
