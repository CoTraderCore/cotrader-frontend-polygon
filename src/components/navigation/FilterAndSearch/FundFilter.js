import React, { Component } from 'react'
import { Form } from "react-bootstrap"
import Button from '@material-ui/core/Button'
import { inject, observer } from 'mobx-react'
import { fromWei } from 'web3-utils'



class FundFilter extends Component {
  constructor(props, context) {
    super(props, context)
    const initialState = {
      owner: '',
      name: '',
      valueInETH:'',
      valueInUSD:'',
      profitInETH:'',
      profitInUSD:'',
      mainAsset:'',
      address:'',
      timeCreation:0
    }

    this.state = this.props.MobXStorage.filterOptions
    ? this.props.MobXStorage.filterOptions
    : initialState
  }


  // filter smart funds by multi options
  // compare if strings math
  // compare if numbers bigger than
  multiFilter(){
    // get options from states
    const filterOptions = { ...this.state }
    // remove null, undefiend, empty  '' and 0 value
    let filteredOptions = this.removeEmptyValue(filterOptions)

    // get cur funds
    let currentFunds = this.props.MobXStorage.SmartFundsOriginal
    let filtered
    let filterKeys = []

    // don't apply filter if user not select any filter option
    if(Object.keys(filteredOptions).length !== 0){
      // aply multiple filter
      for(let key in filteredOptions){
        // push filter keys
        filterKeys.push(key)
        // filter by time creation
        if(key === 'timeCreation'){
          // this.timeCreationFilter(currentFunds, filteredOptions[key])
          // filtered = currentFunds
          filtered = this.timeCreationFilter(currentFunds, filteredOptions[key])
        }
        // filter by match strings
        else if(typeof filteredOptions[key] === 'string'){
          filtered = currentFunds.filter((item) => this.stringFilter(item, key, filteredOptions[key]))
        }
        // filter by compare numbers (>=)
        else if (typeof filteredOptions[key] === 'number'){
          filtered = currentFunds.filter((item) => this.numberFilter(item, key, filteredOptions[key]))
        }
        else {
          console.log("Unknown filter type")
        }
        currentFunds = filtered
      }
      // update MobxStorage
      this.props.MobXStorage.updateSmartFundsListByFilter(filtered, filterOptions, filterKeys)
    }

    this.props.modalClose()
  }

  // helpers
  stringFilter = (item, key, value) => {
    if(item[key].toLowerCase().includes(value.toLowerCase())){
      return true
    }else {
      return false
    }
  }

  numberFilter = (item, key, value) => {
    if(Number(fromWei(item[key])) >= value){
      return true
    }else {
      return false
    }
  }

  timeCreationFilter = (list, state) => {
    console.log(list[0].timeCreation)
    if(state === 'Newest'){
      return list.slice().sort(function(a,b) {
         return Number(b.timeCreation) - Number(a.timeCreation)
      })
    }
    else if(state === 'Oldest'){
      return list.slice().sort(function(a,b) {
         return Number(a.timeCreation) - Number(b.timeCreation)
      })
    }
    else {
      return list
    }
  }

  // remove null, undefiend, 0, and '' values from object
  removeEmptyValue = (obj) => {
   let newObj = {}
   Object.keys(obj).forEach((prop) => {
     if (obj[prop] && obj[prop] !== '' && obj[prop] !== 0) { newObj[prop] = obj[prop] }
   })
   return newObj
  }

  resetFilter = () => {
    this.props.MobXStorage.AllFunds()
    this.props.modalClose()
  }


  render() {
    return (
      <>
      <br/>
       <Form>
       <Form.Group>
       <Form.Text>
       Fund name
       </Form.Text>
        <Form.Control
        type="string"
        value={this.state.name}
        name="name"
        onChange={(e) => this.setState({ name: e.target.value })}
        />
       </Form.Group>

       <Form.Group>
       <Form.Text>
       Manager address
       </Form.Text>
       <Form.Control
       type="string"
       value={this.state.owner}
       name="owner"
       onChange={(e) => this.setState({ owner: e.target.value })}
       />
      </Form.Group>

       <Form.Group>
        <Form.Text>
        Min value in BNB
        </Form.Text>
        <Form.Control
        type="number"
        value={this.state.valueInETH}
        name="valueInETH"
        onChange={(e) => this.setState({ valueInETH: Number(e.target.value) })}
        />
       </Form.Group>

       <Form.Group>
        <Form.Text>
        Min value in USD
        </Form.Text>
        <Form.Control
        type="number"
        value={this.state.valueInUSD}
        name="valueInUSD"
        onChange={(e) => this.setState({ valueInUSD: Number(e.target.value) })}
        />
       </Form.Group>

       <Form.Group>
        <Form.Text>
        Min profit in BNB
        </Form.Text>
        <Form.Control
        type="number"
        value={this.state.profitInETH}
        name="profitInETH"
        onChange={(e) => this.setState({ profitInETH: Number(e.target.value) })}
        />
       </Form.Group>

       <Form.Group>
        <Form.Text>
        Min profit in USD
        </Form.Text>
        <Form.Control
        type="number"
        value={this.state.profitInUSD}
        name="profitInUSD"
        onChange={(e) => this.setState({ profitInUSD: Number(e.target.value) })}
        />
       </Form.Group>

       <Form.Group>
       <Form.Text>Fund type</Form.Text>
       <Form.Control
       as="select"
       value={this.state.mainAsset}
       onChange={(e) => this.setState({ mainAsset: e.target.value === "ALL" ? '' : e.target.value})}
       >
        <option>All</option>
        <option>ETH</option>
        <option>USD</option>
       </Form.Control>
       </Form.Group>

       <Form.Group>
       <Form.Text>Time creation</Form.Text>
       <Form.Control
       as="select"
       value={this.state.timeCreation}
       onChange={(e) => this.setState({ timeCreation: e.target.value === "ALL" ? '' : e.target.value})}
       >
        <option>All</option>
        <option>Newest</option>
        <option>Oldest</option>
       </Form.Control>
       </Form.Group>

       </Form>
       <Button variant="contained" color="primary" onClick={() => this.multiFilter()}>Apply filter</Button>
       <Button variant="contained" onClick={() => this.resetFilter()}>Reset filter</Button>
       </>
    )
  }

}

export default inject('MobXStorage')(observer(FundFilter))
