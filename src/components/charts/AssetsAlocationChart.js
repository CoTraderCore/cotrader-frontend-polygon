import React from 'react'
import { Pie } from 'react-chartjs-2'
import { Badge } from "react-bootstrap"
import { inject } from 'mobx-react'

class AssetsAlocationChart extends React.Component{
  constructor(props, context) {
    super(props, context)
    this.state = {
      data:{
        labels: [],
        datasets: []
      },
      eth_token: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
    }
  }

  _isMounted = false

  componentDidMount = () => {
    this._isMounted = true
    setTimeout(async () => {
      this.updateAssetsData()
    }, 1000)

  }

  componentWillUnmount(){
    this._isMounted = false
  }

  componentDidUpdate = async (nextProps) => {
  if(nextProps.AssetsData !== this.props.AssetsData){
      this.updateAssetsData()
    }
  }

  updateAssetsData = async () => {
    const AssetsData = this.props.AssetsData

    if(AssetsData){
    const filterData = AssetsData.filter(item => parseFloat(item.assetValueInETHFromWei) > 0)

    let labels = filterData.map(item => {
      return item.symbol
    })

    let balance = filterData.map((item) => {
      return item.assetValueInETHFromWei
    })

    if(this._isMounted)
    this.setState({
      data:{
        labels:labels,
        datasets: [{
	    	data: balance,
        hoverBorderWidth:2,
        hoverBorderColor:'rgba(63, 81, 181, 0.8)',
	    	backgroundColor: [
          '#36A2EB',
          '#00f5d1',
          "#4251b0",
          "#50119e",
          "#10cdeb",
          "#00c0aa",
          "#8b25d2",
          "#8b25d3",
          "#10creb",
          "#30creb",
          '#37U3EB',
          '#02d5e1',
          "#441180",
          "#00411e",
          "#135d4b",
          '#36A2EB',
          '#00f5d1',
          "#4251b0",
          "#50119e",
          "#10cdeb",
          "#00c0aa"
	    	],
	    	hoverBackgroundColor: [
          '#36A2EB',
          '#00f5d1',
          "#4251b0",
          "#50119e",
          "#10cdeb",
          "#00c0aa",
          "#8b25d2",
          "#8b25d3",
          "#10creb",
          "#30creb",
          '#37U3EB',
          '#02d5e1',
          "#441180",
          "#00411e",
          "#135d4b",
          '#36A2EB',
          '#00f5d1',
          "#4251b0",
          "#50119e",
          "#10cdeb",
          "#00c0aa"
	    	]
	    }]
      }
     })
    }
  }

  render() {
    return (
      <React.Fragment>
      {
        this.state.data.labels.length > 0
        ?
        (
          <div style={{ width: 320, height: 220}}>
            <Badge>Asset allocation in BNB value</Badge>
            <Pie data={this.state.data} />
          </div>
        )
        :(null)
      }
      </React.Fragment>
    )
  }
}

export default inject('MobXStorage')(AssetsAlocationChart)
