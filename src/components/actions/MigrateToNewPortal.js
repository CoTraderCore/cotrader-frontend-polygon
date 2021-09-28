import React, { useState } from 'react'

import {
  SmartFundABIV7,
  ExchangePortalAddressLight,
  PricePortalPancakeABI,
  PricePortalPancake,
  WETH
} from '../../config.js'

import {
  Button,
  Alert
} from "react-bootstrap"


async function verifyConnector(tokenTo, web3) {
  const pricePortal = new web3.eth.Contract(PricePortalPancakeABI, PricePortalPancake)
  const connector = await pricePortal.methods.findConnector(tokenTo).call()
  return connector
}

async function verifyСompatibility(web3, accounts, smartFundAddress, closeModal, setIssueAddresses){
  const zerroAddress = "0x0000000000000000000000000000000000000000"
  const ethAddress = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
  const fund = new web3.eth.Contract(SmartFundABIV7, smartFundAddress)
  const tokens = await fund.methods.getAllTokenAddresses().call()

  // replace ETH with WETH
  tokens.forEach(function(item, i) {
    if (String(item).toLowerCase() === String(ethAddress).toLowerCase()) tokens[i] = WETH
  })

  const issueAddresses = []
  for(let i = 0; i < tokens.length; i++){
    const connector = await verifyConnector(tokens[i], web3)
    if(String(connector).toLowerCase(connector) === String(zerroAddress).toLowerCase()){
      issueAddresses.push(tokens[i])
    }

  }

  if(issueAddresses.length === 0){
    updateTradePortal(web3, accounts, smartFundAddress, closeModal)
  }else{
    setIssueAddresses(issueAddresses)
  }
}
// provide to fund latest version of trade portal
function updateTradePortal(web3, accounts, smartFundAddress, closeModal){
  const smartFund = new web3.eth.Contract(SmartFundABIV7, smartFundAddress)
  smartFund.methods.setNewExchangePortal(ExchangePortalAddressLight)
  .send({ from:accounts[0] })
  closeModal()
}

function MigrateToNewPortal(props) {
  const [issueAddresses, setIssueAddresses] = useState([])
  return (
    <>
    {
      String(props.exchangePortalAddress).toLowerCase() !== String(ExchangePortalAddressLight).toLowerCase()
      ?
      (
        <>
        <br/>
        <Alert variant="warning">
        <strong>Your trade portal version is deprecated, please update for get best options</strong>
        <hr/>
        <Button
        variant="outline-dark"
        size="sm"
        onClick={() => verifyСompatibility(
          props.web3,
          props.accounts,
          props.smartFundAddress,
          props.closeModal,
          setIssueAddresses
        )}
        >
        Update
        </Button>
        <hr/>
        <small style={{color: "red"}}><strong>NOTE: If your update transaction was confirmed, but you still see this message, please reload the page</strong></small>
        </Alert>

        {
          issueAddresses.length > 0
          ?
          (
            <Alert variant="danger">
            New portal not support this tokens, please sell, then update
            <hr/>
            {issueAddresses.map((item, key) => <p key={key}>{item}</p>)}
            </Alert>
          )
          : null
        }
        </>
      )
      :
      (
        null
      )
    }
    </>
  )
}

export default MigrateToNewPortal
