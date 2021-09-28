import React, { Component } from 'react'
import Identicon from 'react-identicons'
import { fromWei } from 'web3-utils'

class WalletInfo extends Component {

  state = {
    ETHBalance:0
  }

  componentDidMount = () => {
    setTimeout(async () => {

      if(this.props.accounts && this.props.web3) {
        const ETHBalance = parseFloat(fromWei(await this.props.web3.eth.getBalance(this.props.accounts[0]))).toFixed(4)
        this.setState({ ETHBalance })
      }
    }, 1000)
  }

  render() {
    return (
      <div>
      {
        this.props.accounts && this.props.web3
        ?
        (
          <div className={'top-notice'} style={{ padding: '7px 10px', backgroundColor:'transparent', lineHeight: '1.3', margin: '8px auto',textAlign:'center' }}>
          {
            this.state.ETHBalance > 0
            ?
            (
              <small> <strong>{this.state.ETHBalance} : BNB</strong></small>
            ): null
          }
          &nbsp;
          &nbsp;
          <Identicon size='10' string={this.props.accounts[0]} /> <small> <strong>{String(this.props.accounts[0]).replace(String(this.props.accounts[0]).substring(6,36), "...")} </strong></small>
          </div>
        )
        : null
      }
      </div>
    )
  }

}

export default WalletInfo
