import React from 'react'
import { Form } from "react-bootstrap"
import { inject, observer } from 'mobx-react'

const changeHandler = (props, expression) => {
  switch (expression) {
    case "Higher value":
      props.MobXStorage.sortFundsByHigherValue()
    break;

    case "Lower value":
      props.MobXStorage.sortFundsByLowerValue()
    break;

    case "Higher profit":
      props.MobXStorage.sortFundsByHigherProfit()
    break;

    case "Lower profit":
      props.MobXStorage.sortFundsByLowerProfit()
    break;

    case "Higher ROI":
      props.MobXStorage.sortFundsByHigherROI()
    break;

    case "Lower ROI":
      props.MobXStorage.sortFundsByLowerROI()
    break;

    default:
      alert("Wrong sort command")
  }
}

const SortFunds = (props) => (
  <div align="center">
  <Form style={{minWidth: "200px", maxWidth: "200px"}}>
  <Form.Label>Sort by:</Form.Label>
  <Form.Control as="select" size="sm" onChange={(e) => changeHandler(props, e.target.value)}>
    <option>Higher value</option>
    <option>Lower value</option>
    <option>Higher profit</option>
    <option>Lower profit</option>
    <option>Higher ROI</option>
    <option>Lower ROI</option>
  </Form.Control>
  </Form>
  </div>
)

export default inject('MobXStorage')(observer(SortFunds))
