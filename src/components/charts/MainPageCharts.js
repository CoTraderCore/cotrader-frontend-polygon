import React from 'react'
import LineChart from './containers/LineChart'
import Loading from '../templates/Spiners/Loading'
import axios from 'axios'
import { Col, Row } from "react-bootstrap"

const BloxyChartsLink = `https://api.bloxy.info/widget/address_value_daily?price_currency=ETH&key=${process.env.REACT_APP_BLOXY_KEY}&address=`

class MainPageCharts extends React.Component {
  constructor(props){
    super(props)
    this.state = {
    DWdata: {
    labels: [],
    datasets: []
    },
    ROIdata: {
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

  parseData(data){
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

    const daylyValue = data.map(function(v) {
      return v.daily_value
    });

    const commonData = {
      fill: false,
      lineTension: 0.1,
      borderDash: [],
      borderDashOffset: 0.0,
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      borderCapStyle: 'butt',
      pointBackgroundColor: '#fff',
      borderJoinStyle: 'miter',
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
          pointBackgroundColor: '#fff',
          pointHoverBackgroundColor: 'rgba(138,43,226)',
          pointHoverBorderColor: 'rgba(138,43,226)',
          ...commonData,
          data: daylyValue.map(item => Number(item).toFixed(4))
        }
      ]
    }

    if(this._isMounted){
      this.setState({
        DWdata: parsedDWdata,
        ROIdata: parsedROIdata,
        PROFITdata: parsedPROFITdata,
        DAILYVALUEdata: parsedDAILYVALUEdata,
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
         <div>
         {
           this.state.isDataLoad
           ?
           (
           <React.Fragment>
           {
             this.state.DWdata.labels.length > 0
             ?
             (
               <div className="fund-page-charts">
               <div>
               <LineChart data={this.state.DWdata} />

               <LineChart data={this.state.ROIdata}/>

               <LineChart data={this.state.PROFITdata} />

               <LineChart data={this.state.DAILYVALUEdata} />
               </div>
               </div>
             )
             :
             (
               <Row>
               <Col>
               <strong>"No activity"</strong>
               </Col>
               <Col>
               <strong>"No activity"</strong>
               </Col>
               <Col>
               <strong>"No activity"</strong>
               </Col>
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
             <small>Loading Deposit/Withdtaw chart</small>
             </Col>
             <Col>
             <Loading />
             <small>Loading ROI chart</small>
             </Col>
             <Col>
             <Loading />
             <small>Loading Profit charts</small>
             </Col>
             <Col>
             <Loading />
             <small>Loading Daily Value chart</small>
             </Col>
             </Row>
           )
         }
         </div>
       )
       :
       (
         <small>Can not load charts</small>
       )
     }
    </>
  )
}
}

export default MainPageCharts
