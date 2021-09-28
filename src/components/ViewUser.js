import React, { Component } from 'react'
import getFundsList from "../utils/getFundsList"
import { fromWei } from 'web3-utils'
import { Table, Alert } from "react-bootstrap"
import { Link } from 'react-router-dom';
import { EtherscanLink }  from '../config.js'

class ViewUser extends Component {
  constructor(props, context) {
   super(props, context)
   this.state = {
     userFunds:[],
     userFundsAddresses:[],
     userFundsNames:[],
     totalValue:0,
     totalProfit:0
   }
  }


  componentDidMount = async () => {
    this._isMounted = true
    await this.initData()
  }

  componentWillUnmount(){
    this._isMounted = false
  }

  // init smart funds list
  initData = async () => {
    // get funds
    const smartFunds = await getFundsList()
    // filter user funds
    const userFunds = smartFunds.filter(
      fund => fund.owner.toLowerCase().includes(String(this.props.match.params.address).toLowerCase())
    )

    // continue if user exist
    if(userFunds.length > 0){
      // reducer template
      const reducer = (accumulator, currentValue) => Number(accumulator) + Number(currentValue)

      // get value
      const value = userFunds.map(fund => Number(fromWei(fund.valueInUSD)))
      const totalValue = Number(value.reduce(reducer)).toFixed(2)

      // get profit
      const profit = userFunds.map((fund) => {
        if(fund.profitInUSD > 0){
          return Number(fromWei(fund.profitInUSD))
        }else{
          return 0
        }
      })
      const totalProfit = Number(profit.reduce(reducer)).toFixed(2)

      // get all user funds addresses
      const userFundsAddresses = userFunds.map(fund => fund.address)
      const userFundsNames = userFunds.map(fund => fund.name)

      if(this._isMounted)
        this.setState({ userFunds, totalValue, totalProfit, userFundsAddresses, userFundsNames })
    }
  }

  render() {
    return (
      <>
      {
        this.state.userFunds.length > 0
        ?
        (
          <>
          <Alert variant='secondary'>
            <div align="center">
            <small><strong>Info for user address:
            <a href={EtherscanLink + "address/" + this.props.match.params.address} target="_blank" rel="noopener noreferrer">
            {this.props.match.params.address}</a>
            </strong>
            </small>
            <hr/>
            <strong>
            Total value : ${this.state.totalValue},
            Total profit : ${this.state.totalProfit},
            Total funds : {this.state.userFunds.length}
            </strong>
            </div>
          </Alert>

          <Table striped bordered hover>
          <thead>
           <tr>
            <th>#</th>
            <th>Fund name</th>
            <th>Address</th>
            <th>Value in USD</th>
            <th>Profit in USD</th>
           </tr>
          </thead>
          <tbody>
          {
            this.state.userFunds.map((fund, key) => {
              key++
              return (
                <tr key={key}>
                <td>{key}</td>
                <td>{fund.name}</td>
                <td><Link to={'/fund/'+fund.address}>{fund.address}</Link></td>
                <td>{fromWei(String(fund.valueInUSD))}</td>
                <td>{fromWei(String(fund.profitInUSD))}</td>
                </tr>)
            })
          }
          </tbody>
          </Table>
          </>
        )
        :
        (
          <div align="center">
          <Alert variant="danger">Can't find data for this {this.props.match.params.address} address</Alert>
          </div>
        )
      }
      </>
    )
  }

}

export default ViewUser
