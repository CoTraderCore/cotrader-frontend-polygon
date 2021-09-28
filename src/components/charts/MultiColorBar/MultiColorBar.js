import React, { Component } from 'react';
import MultiColorContainer from './MultiColorContainer'


class MultiColorBar extends Component {
  state = {
    propsData:[],
    totalPercent:0
  }

  componentDidMount(){
    this.initData()
  }

  componentDidUpdate(prevProps, prevState){
    if(prevProps.data !== this.props.data)
       this.initData()
  }

  initData(){
    try{
      const propsData = []
      this.props.data.forEach(obj => {
        if(Number(obj.percentInETH).toFixed() > 0){
          const color = obj.color !== '#000000' ? obj.color : "#" + Math.floor(Math.random()*16777215).toString(16)

          propsData.push(
            {name:obj.symbol, value:Number(obj.percentInETH).toFixed(), color}
          )
        }

      })

      const totalPercent = propsData.map(item => item.value).reduce((a, b) => Number(a) + Number(b), 0)

      this.setState({
        propsData:propsData.slice().sort((a,b) => b.value - a.value ), // sort by higher
        totalPercent
      })
    }catch(e){
      console.log(e)
    }
  }

  render() {
    return (
      <>
      {
        this.state.propsData.length > 0 && this.state.totalPercent <= 100
        ?
        (
          <MultiColorContainer readings={this.state.propsData} />
        )
        : null
      }
      </>
    )
  }

}

export default MultiColorBar
