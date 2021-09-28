import React from 'react'
import { Pie } from 'react-chartjs-2'
import { Badge } from "react-bootstrap"
import { fromWei } from 'web3-utils'

class InvestorsAlocationChart extends React.Component{
  constructor(props, context) {
    super(props, context)
    this.state = {
      data:{
        labels: [],
        datasets: []
      }
    }
  }

  _isMounted = false

  componentDidMount = async() => {
    this._isMounted = true
    setTimeout(async () => {
      await this.updateInvestorsData()
    }, 1000)
  }

  componentWillUnmount(){
    this._isMounted = false
  }

  componentDidUpdate = async (nextProps) => {
  if(nextProps.Data !== this.props.Data){
    await this.updateInvestorsData()
    }
  }

  updateInvestorsData = async () => {
    const Data = JSON.parse(this.props.Data)

    if(Data){
    const filteredData = Data.filter(item => Number(fromWei(String(item["shares"]))).toFixed(6) > 0)

    let labels = filteredData.map(item => {
     return String(item["user"]).replace(String(item["user"]).substring(6,36), "...")
    })

    let balance = filteredData.map(item => {
      return Number(fromWei(String(item["shares"]))).toFixed(6)
    })

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
        "#8b25d2"
        ],
        hoverBackgroundColor: [
        '#36A2EB',
        '#00f5d1',
        "#4251b0",
        "#50119e",
        "#10cdeb",
        "#00c0aa",
        "#8b25d2"
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
        this.state.data.labels.length > 0 ?
        (
          <div style={{ width: 320, height: 220 }}>
            <Badge>Investors shares</Badge>
            <Pie data={this.state.data} />
          </div>
        )
        :
        (
          null
        )
      }
      </React.Fragment>
    )
  }
}

export default InvestorsAlocationChart
