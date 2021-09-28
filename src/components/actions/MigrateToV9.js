import React from 'react'

import {
  SmartFundABIV7,
  MockExchangePortal
} from '../../config.js'

import {
  Button,
  Alert
} from "react-bootstrap"

function update(web3, account, smartFundAddress) {
  const contract = new web3.eth.Contract(SmartFundABIV7, smartFundAddress)
  contract.methods.setNewExchangePortal(MockExchangePortal)
  .send({ from:account })
}

function MigrateToV9(props) {
  return (
    <div>
    {
      props.accounts
      ?
      (
        <>
        {
          props.version < 9 && props.accounts[0] === props.owner
          ?
          (
            <Alert variant="warning">
            <strong>
            You smart fund version is outdated. We recommend withdrawing assets and creating a new version of the fund with greatly reduced transaction fees.
            <hr/>
            <p style={{color:"red"}}>If you have issues withdrawing assets, please click <Button
              variant="dark"
              size="sm"
              onClick={() => update(props.web3, props.accounts[0], props.smartFundAddress)}
            >
            HERE
            </Button>, then withdraw after the transaction is confirmed.</p>
            </strong>
            </Alert>
          )
          : null
        }
        </>
      )
      : null
    }
    </div>
  )
}

export default MigrateToV9
