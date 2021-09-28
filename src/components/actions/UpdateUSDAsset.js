import React, { Component } from 'react'
import { SmartFundABIV7, EtherscanLink } from '../../config.js'
import { Button, Modal, Form, Alert } from "react-bootstrap"
import { isAddress, fromWei } from 'web3-utils'

// permitted stable coins
const symblols = ["BDAI", "BUSD"]
const assets = {
  'BDAI' : '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3',
  'BUSD': '0xe9e7cea3dedca5984780bafc599bd69add087d56'
}


class UpdateUSDAsset extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      newUSDTokenAddress:'',
      currentUSDTokenAddress:'',
      currentUSDTokenSymbol:'',
      symblols:[],
      assets:[],
      fundContract:null,
      Show:false,
      ShowSuccessesMsg:false,
      totalWeiDeposited:0
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

  initData = async () => {
    const fundContract = new this.props.web3.eth.Contract(SmartFundABIV7, this.props.smartFundAddress)
    const currentUSDTokenAddress = await fundContract.methods.coreFundAsset().call()

    const totalWeiDepositedInWei = await fundContract.methods.totalWeiDeposited.call()
    const totalWeiDeposited = Number(fromWei(String(totalWeiDepositedInWei)))
    const currentUSDTokenSymbol = Object.keys(assets).find(
      k => assets[k].toLowerCase() === currentUSDTokenAddress.toLowerCase())

    if(this._isMounted)
      this.setState({
        currentUSDTokenAddress,
        currentUSDTokenSymbol,
        symblols,
        fundContract,
        totalWeiDeposited
      })
  }

  setAddressBySymbol = (e) =>{
    for(let [key, value] of Object.entries(assets)) {
     if(key === e.target.value)
        this.setState({ newUSDTokenAddress: value })
    }
  }

  changeUSDToken = async () => {
    if(isAddress(this.state.newUSDTokenAddress)){
      this.state.fundContract.methods.changeStableCoinAddress(this.state.newUSDTokenAddress)
      .send({ from:this.props.accounts[0] })
      .on('transactionHash', (hash) => {
        this.setState({ ShowSuccessesMsg:true })
      })
    }else{
      alert('Please select token')
    }
  }

  render() {
    let modalClose = () => this.setState({ Show: false });

    return (
      <div>
        <Button variant="outline-primary" className="buttonsAdditional" onClick={() => this.setState({ Show: true })}>
          Stable tokens
        </Button>

        <Modal
          show={this.state.Show}
          onHide={modalClose}
        >
          <Modal.Header closeButton>
          <Modal.Title>
          Update USD asset
          </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Alert variant="secondary">
            Your current fund USD token : &nbsp;
            <strong>
            <a href={EtherscanLink + "token/" + this.state.currentUSDTokenAddress} target="_blank" rel="noopener noreferrer">{this.state.currentUSDTokenSymbol}</a>
            </strong>
          </Alert>
          <Form>
          <Form.Group>
          <Form.Text className="text-muted">
           <strong>Set new USD token</strong>
          </Form.Text>
          <Form.Control
           as="select"
           onChange={(e) => this.setAddressBySymbol(e)}
          >
            <option>...</option>
            { this.state.symblols.map((item, key) => (<option key={key}>{item}</option>))}
          </Form.Control>
          </Form.Group>

          {
            this.state.totalWeiDeposited === 0
            ?
            (
              <Button variant="outline-primary" onClick={() => this.changeUSDToken()}>
                Set new token
              </Button>
            )
            :
            (
              <Alert variant="danger">
              <small>
              You can't change stable coin address, because a deposit has already been made in the current USD token
              </small>
              </Alert>
            )
          }
          {
            this.state.ShowSuccessesMsg
            ?
            (
              <>
              <br/>
              <br/>
              <Alert variant="success">Token will be changed after confirmation of the transaction</Alert>
              </>
            ):null
          }
          </Form>
          </Modal.Body>
        </Modal>

      </div>
    )
  }
}

export default UpdateUSDAsset
