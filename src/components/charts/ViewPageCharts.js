// TODO refactoring with spred

import React from 'react'
import LineChart from './containers/LineChart'
import Loading from '../templates/Spiners/Loading'
import axios from 'axios'
import { Col, Row } from "react-bootstrap"

const BloxyChartsLink = `https://api.bloxy.info/widget/address_value_daily?price_currency=ETH&key=${process.env.REACT_APP_BLOXY_KEY}&address=`



class ViewPageCharts extends React.Component {
  constructor(props){
    super(props)
    this.state = {
    DWdata: {
    labels: [],
    datasets: []
    },
    unrealizedGainsData: {
    labels: [],
    datasets: []
    },
    totalGainsData: {
    labels: [],
    datasets: []
    },
    realizedGainsData: {
    labels: [],
    datasets: []
    },
    ROIdata: {
    labels: [],
    datasets: []
    },
    ROIDAILYdata: {
    labels: [],
    datasets: []
    },
    PROFITdata: {
    labels: [],
    datasets: []
    },
    DAILYVALUEdata: {
    labels: [],
    datasets: []
    },
    isDataLoad: false,
    reciveddata: null,
    error:false
  }
  }

  _isMounted = false

  componentDidMount = async () => {
    this._isMounted = true
    this.updateChartsData()
  }

  componentWillUnmount(){
    this._isMounted = false
  }

  componentDidUpdate = async (nextProps) => {
  if(nextProps.Data !== this.props.Data){
      this.updateChartsData()
    }
  }

  updateChartsData = async () => {
    try{
      const data = await axios.get(BloxyChartsLink + this.props.address)
      if(!data.data.hasOwnProperty('error')){
        this.parseData(data)
      }else{
        console.log("Can not load charts data ", data.data.error)
        this.setState({ error:true })
      }
    }catch(e){
      console.log("Can not load charts data ", e)
      this.setState({ error:true })
    }
  }

  parseData = async (data) => {
    if(this._isMounted){
    data = data.data.map((v) => v)
    // remove wrong day
    const wrongDay = data.length > 1 ? data[data.length - 2].date : null
    data = data.map((v) => v.date !== wrongDay && v)

    const date = data.map(function(v) {
      return v.date
    });

    const deposit_value = data.map(function(v) {
      return v.deposit_value
    });

    const withdraw_value = data.map(function(v) {
      return -v.withdraw_value
    });

    const profit = data.map(function(v) {
      return v.profit
    });

    const roi = data.map(function(v) {
      return v.profit / v.deposited
    });

    const roiDaily = data.map(function(v) {
      return v.roi_daily
    });

    const daylyValue = data.map(function(v) {
      return v.daily_value
    });

    const realizedGains = data.map(function(v) {
      const withdraw_value = v.deposit_value + v.daily_value
      return v.withdraw_value - withdraw_value
    });

    const unrealizedGains = data.map(function(v) {
      const depositSubWithdraw = v.deposit_value - v.withdraw_value
      return v.daily_value - depositSubWithdraw
    });

    const totalGains = data.map(function(v) {
      const depositSubWithdraw = v.deposit_value - v.withdraw_value
      const UnrealizedGains = v.daily_value - depositSubWithdraw
      const withdraw_value = v.deposit_value + v.daily_value
      const RealizedGains = v.withdraw_value - withdraw_value
      return RealizedGains + UnrealizedGains
    });

    const commonData = {
      fill: false,
      lineTension: 0.1,
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10
    }

    const parsedDWdata = {
      labels:date,
      datasets: [{
      label: 'Deposit',
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      ...commonData,
      data: deposit_value.map(item => Number(item).toFixed(4))
    },
    {
      label: 'Withdraw',
      backgroundColor: 'rgba(219,112,147, 0.4)',
      borderColor: 'rgba(219,112,147)',
      pointBorderColor: 'rgba(219,112,147)',
      pointHoverBackgroundColor: 'rgba(219,112,147)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      ...commonData,
      data: withdraw_value.map(item => Number(item).toFixed(4))
    }
      ]
    }
    const parsedRealizedGains = {
      labels:date,
      datasets: [
        {
          label: 'Realized gains',
          backgroundColor: 'rgba(18,237,20, 0.4)',
          borderColor: 'rgba(18,237,20)',
          pointBorderColor: 'rgba(18,237,20)',
          pointHoverBackgroundColor: 'rgba(18,237,20)',
          pointHoverBorderColor: 'rgba(18,237,20)',
          ...commonData,
          data: realizedGains.map(item => Number(item).toFixed(4))
        }
      ]
    }

    const parsedUnrealizedGains = {
      labels:date,
      datasets: [
        {
          label: 'Unrealized gains',
          backgroundColor: 'rgba(229,222,19, 0.4)',
          borderColor: 'rgba(229,222,19)',
          pointBorderColor: 'rgba(229,222,19)',
          pointHoverBackgroundColor: 'rgba(229,222,19)',
          pointHoverBorderColor: 'rgba(229,222,19)',
          ...commonData,
          data: unrealizedGains.map(item => Number(item).toFixed(4))
        }
      ]
    }

    const parsedROIdata = {
      labels:date,
      datasets: [
        {
          label: 'ROI',
          backgroundColor: 'rgba(135,206,250, 0.4)',
          borderColor: 'rgba(135,206,250)',
          pointBorderColor: 'rgba(135,206,250)',
          pointHoverBackgroundColor: 'rgba(135,206,250)',
          pointHoverBorderColor: 'rgba(135,206,250)',
          ...commonData,
          data: roi.map(item => Number(item).toFixed(4))
        }
      ]
    }

    const parsedPROFITdata = {
      labels:date,
      datasets: [
        {
          label: 'Profit',
          backgroundColor: 'rgba(95,158,160, 0.4)',
          borderColor: 'rgba(95,158,160)',
          pointBorderColor: 'rgba(95,158,160)',
          pointHoverBackgroundColor: 'rgba(95,158,160)',
          pointHoverBorderColor: 'rgba(95,158,160)',
          ...commonData,
          data: profit.map(item => Number(item).toFixed(4))
        }
      ]
    }

    const parsedDAILYVALUEdata = {
      labels:date,
      datasets: [
        {
          label: 'Daily Value',
          backgroundColor: 'rgba(138,43,226, 0.4)',
          borderColor: 'rgba(138,43,226)',
          pointBorderColor: 'rgba(138,43,226)',
          pointHoverBackgroundColor: 'rgba(138,43,226)',
          pointHoverBorderColor: 'rgba(138,43,226)',
          ...commonData,
          data: daylyValue.map(item => Number(item).toFixed(4))
        }
      ]
    }

    const parsedTotalGains = {
      labels:date,
      datasets: [
        {
          label: 'Total gains',
          backgroundColor: 'rgba(237, 104, 9, 0.4)',
          borderColor: 'rgba(237, 104, 9)',
          pointBorderColor: 'rgba(237, 104, 9)',
          pointHoverBackgroundColor: 'rgba(237, 104, 9)',
          pointHoverBorderColor: 'rgba(237, 104, 9)',
          ...commonData,
          data: totalGains.map(item => Number(item).toFixed(4))
        }
      ]
    }

    const parsedRoiDaily = {
      labels:date,
      datasets: [
        {
          label: 'ROI Daily',
          backgroundColor: 'rgba(240, 26, 144, 0.4)',
          borderColor: 'rgba(240, 26, 144)',
          pointBorderColor: 'rgba(240, 26, 144)',
          pointHoverBackgroundColor: 'rgba(240, 26, 144)',
          pointHoverBorderColor: 'rgba(240, 26, 144)',
          ...commonData,
          data: roiDaily.map(item => Number(item).toFixed(4))
        }
      ]
    }

    if(this._isMounted)
    this.setState({
      DWdata: parsedDWdata,
      unrealizedGainsData:parsedUnrealizedGains,
      realizedGainsData:parsedRealizedGains,
      ROIdata: parsedROIdata,
      PROFITdata: parsedPROFITdata,
      DAILYVALUEdata: parsedDAILYVALUEdata,
      totalGainsData:parsedTotalGains,
      ROIDAILYdata:parsedRoiDaily,
      isDataLoad: true
    })
  }
  }

  render(){
  return(
    <>
    {
      !this.state.error
      ?
      (
        <>
        {
          this.state.isDataLoad
          ?
          (
          <React.Fragment>
          {
            this.state.DWdata.labels.length > 0
            ?
            (
              <React.Fragment>
              <div className="fund-page-charts">
                <div>
                  <LineChart data={this.state.totalGainsData} />
                  <LineChart data={this.state.unrealizedGainsData} />
                  <LineChart data={this.state.realizedGainsData} />
                  <LineChart data={this.state.ROIDAILYdata} />
                  <LineChart data={this.state.DWdata} />
                  <LineChart data={this.state.ROIdata}/>
                  <LineChart data={this.state.PROFITdata} />
                  <LineChart data={this.state.DAILYVALUEdata} />
                </div>
              </div>
              </React.Fragment>
            )
            :
            (
              <Row>
              <Col>
              <strong>"No activity"</strong>
              </Col>
              </Row>
            )
          }
          </React.Fragment>
          )
          :
          (
            <Row>
            <Col>
            <Loading />
            <small>Loading charts data</small>
            </Col>
            </Row>
          )
        }
        </>
      )
      : <small>Can't load charts</small>
    }
    </>
  )
}


}

export default ViewPageCharts
