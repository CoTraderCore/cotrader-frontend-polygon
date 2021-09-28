// For fully-onchain based funds

import React, { Component } from 'react'
import DepositERC20 from './DepositERC20'
import DepositETH from './DepositETH'

import { Button, Modal, Form, Alert } from "react-bootstrap"



class Deposit extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      Show: false,
      Agree: false
    }
  }


 modalClose = () => this.setState({ Show: false, Agree: false });

 render() {
    return (
      <div>
        <Button variant="outline-primary" className="buttonsAdditional" onClick={() => this.setState({ Show: true })}>
          Deposit
        </Button>

        <Modal
          show={this.state.Show}
          onHide={this.modalClose}
          aria-labelledby="example-modal-sizes-title-sm"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-sm">
              Terms and Conditions
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <p>1. I certify that I'm not a USA citizen or resident.</p>
          <p>2. I understand CoTrader technology is new and is not to be trusted.</p>
          <p>3. I understand that CoTrader aims to protect investors with technology regulation, that aims to prove fees, fair play, and past performance.</p>
          <p>4. I understand I shouldn't deposit anything I can't afford to lose.</p>
          <Form.Check type="checkbox"
           label="I agree to the above Terms and Conditions to use this product. By cancelling you will not gain access to the service."
           onChange={() => this.setState({ Agree: !this.state.Agree})}
           />
          {
            this.state.Agree ? (
              <div>
              <br/>
              <Form>
              {
                this.props.mainAsset === "ETH" || this.props.mainAsset === "BNB"
                ?
                (
                  <DepositETH
                    mainAsset={this.props.mainAsset}
                    accounts={this.props.accounts}
                    address={this.props.address}
                    web3={this.props.web3}
                    pending={this.props.pending}
                    modalClose={this.modalClose}
                  />
                )
                :
                (
                  <DepositERC20
                    mainAsset={this.props.mainAsset}
                    accounts={this.props.accounts}
                    address={this.props.address}
                    web3={this.props.web3}
                    pending={this.props.pending}
                    modalClose={this.modalClose}
                  />
                )
              }
              </Form>
              </div>
            ) : (null)
          }

          {
            this.props.version < 7
            ?
            (
              <>
              <br/>
              <Alert variant="warning">{`We recommend depositing only to funds version 9 and higher, version of this fund is ${this.props.version}`}</Alert>
              </>
            ):null
          }
          </Modal.Body>
        </Modal>

      </div>
    )
  }
}

export default Deposit
