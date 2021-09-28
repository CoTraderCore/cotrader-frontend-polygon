// Props
// web3
// currentSymbol
// symbols
// tokens
// onChangeTypeHead function
// direction
// pushNewTokenInList function

import React, { Component } from 'react'
import {
  Modal,
  Button,
  InputGroup
} from "react-bootstrap"

import { Typeahead } from 'react-bootstrap-typeahead'
import getTokenSymbolAndDecimals from '../../../utils/getTokenSymbolAndDecimals'
import { isAddress } from 'web3-utils'


class SelectToken extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      ShowModal: false,
      symbol:'',
      decimals:0,
      address:'',
      detectNewToken:false
    }
  }

  // extract address from global tokens obj by symbol
  getTokenAddressBySymbol = (symbol) => {
    const From = this.props.tokens.filter(item => item.symbol === symbol)
    return String(From[0].address).toLowerCase()
  }

  // reset states after close modal
  closeModal = () => this.setState({
    ShowModal: false,
    symbol:'',
    decimals:0,
    address:'',
    detectNewToken:false
  })

  onChangeTypeHead = (name, param) => {
    this.props.onChangeTypeHead(name, param)
    this.closeModal()
  }

  // new function
  typeHeadHandler = async (address) => {
    if(isAddress(address)){
      await this.fetchNewToken(address)
    }
  }

  // feth token data by address
  fetchNewToken = async (address) => {
    try{
      const {
        symbol,
        decimals
      } = await getTokenSymbolAndDecimals(address, this.props.web3)

      this.setState({
        symbol,
        decimals,
        address,
        detectNewToken:true
      })
    }
    catch(e){
      alert("No standard token")
      console.log("err", e)
    }
  }

  addNewToken = async () => {
    const tokenData = {
      symbol:this.state.symbol,
      address:this.state.address,
      decimals:this.state.decimals
    }
    this.props.pushNewTokenInList(this.state.symbol, tokenData)
    this.props.onChangeTypeHead(this.props.direction, this.state.symbol)
    this.closeModal()
  }

  render() {
   return (
      <div>
      <InputGroup.Text>
        <Button
          variant="light"
          onClick={() => this.setState({ ShowModal: true })}
          style={{minWidth: "160px", maxWidth: "160px"}}
        >
          {this.props.currentSymbol}
        </Button>
      </InputGroup.Text>

      <Modal
      size="lg"
      show={this.state.ShowModal}
      onHide={() => this.closeModal()}
      >
      <Modal.Header closeButton>
        <Modal.Title>
          Exchange
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
      {
        this.props.tokens
        ?
        (
          <>
          <br/>
            {
              this.state.detectNewToken
              ?
              (
                <Button variant="primary" onClick={() => this.addNewToken()}>
                  Import {this.state.symbol} to list
                </Button>
              )
              : null
            }
            <br/>
            <br/>
            <Typeahead
              defaultOpen={true}
              labelKey="selectTokens"
              multiple={false}
              id="sendTokens"
              options={this.props.symbols}
              onChange={(s) => this.onChangeTypeHead(this.props.direction, s[0])}
              onInputChange={async (s) => this.typeHeadHandler(s)}
              placeholder="Type symbol or paste token address"
              renderMenuItemChildren={(options, props) => (
                <div>
                  <img style={{height: "35px", width: "35px"}}src={`https://tokens.1inch.exchange/${this.getTokenAddressBySymbol(options)}.png`} alt="TOKEN" />
                  &nbsp; &nbsp;
                  {options}
                </div>
              )}
            />
            <br/>
            <br/>
          </>
        )
        :
        (
          <p>Load data</p>
        )
      }
      </Modal.Body>
      </Modal>
      </div>
    )
  }
}
export default SelectToken
