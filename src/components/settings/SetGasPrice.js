// Set gas price in local storage

import React, { Component } from 'react'
import {
  Button,
  ButtonGroup
} from "react-bootstrap"


class SetGasPrice extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      gasPrice: 2000000000,
      gasPriceState: 'high'
    }
  }

  _isMounted = false
  componentDidMount(){
    this._isMounted = true
    this.initData()
  }

  componentWillUnmount(){
    this._isMounted = false
  }

  // get tokens addresses and symbols from paraswap api
  initData = async () => {
    // get gas price
    const gasPrice = await this.props.web3.eth.getGasPrice()
    if(this._isMounted){
      this.setState({ gasPrice })
      localStorage.setItem('gasPrice', gasPrice)
    }
  }

  // set gasPrice for trade
  setGasPrice = async (gasPriceState) => {
    const currentGasPrice = await this.props.web3.eth.getGasPrice()
    let gasPrice = 2000000000

    if(gasPriceState === "high")
      gasPrice = currentGasPrice

    if(gasPriceState === "average")
      // sub 25%
      gasPrice = currentGasPrice - (currentGasPrice / 4) < 1000000000 // if average less than 1 gwei, set 2 gwei
      ? 2000000000
      : Math.round(currentGasPrice - (currentGasPrice / 4))


    if(gasPriceState === "low")
      // sub 50%
      gasPrice = currentGasPrice / 2 < 1000000000 // if low less than 1 gwei, set 1 gwei
      ? 1000000000
      : Math.round(currentGasPrice / 2)

    this.setState({ gasPrice, gasPriceState })
    localStorage.setItem('gasPrice', gasPrice)
  }

  render() {
    return (
      <div align="center">
      <small>select gas price</small>
      <br />
      <ButtonGroup size="sm">
        <Button
        variant={this.state.gasPriceState === "high" ? "info" : "outline-primary"}
        onClick={() => this.setGasPrice("high")}
        >High</Button>

        <Button
        variant={this.state.gasPriceState === "average" ? "info" : "outline-primary"}
        onClick={() => this.setGasPrice("average")}
        >Average</Button>

        <Button
        variant={this.state.gasPriceState === "low" ? "info" : "outline-primary"}
        onClick={() => this.setGasPrice("low")}
        >Low</Button>
      </ButtonGroup>
      <br />
      <small>current {this.state.gasPrice / 1000000000} gwei</small>
      </div>
    )
  }

}

export default SetGasPrice
