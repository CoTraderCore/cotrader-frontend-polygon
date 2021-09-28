/*Temporary*/
import React from 'react'
import { Modal } from "react-bootstrap"

function DEXExplanation(props) {
  const handleClose = () => props.setDEXModal(false);
  return (
    <>
    <Modal show={props.show} onHide={handleClose}>
      <Modal.Header closeButton >
      </Modal.Header>
      <Modal.Body>For v1 smart funds we use only  Kyber
      <hr/>
      For v2 and newest versions of smart funds we use DEXs aggregators to split trades to get the better prices from Uniswap, Kyber, Bancor, Oasis, Balancer.
      <hr/>
      CoTrader supports not only trading but also any DeFi dapps such as all Yearn vaults, all Compound lending, etc, as these have their own tokens like 3Crv & cDAI, via direct token acquisition on 1inch. 1inch offers these tokens at the same rates as Yearn and Compound contracts.

      CoTrader also supports staking into pools to earn trading fees earnings on DEXs such as Uniswap, Balancer and Bancor
      </Modal.Body>
    </Modal>
    </>
  );
}


export default DEXExplanation
