import React from 'react';
import { Line } from 'react-chartjs-2';
import isMobile from '../../../utils/isMobile'

function LineChart(props){
  return(
    <React.Fragment>
    {
      isMobile()
      ?
      (
        <div style={{ width: 260, height: 180 }}>
        <Line data={props.data} />
        </div>
      )
      :
      (
        <div style={{ width: 320, height: 180 }}>
        <Line data={props.data} />
        </div>
      )
    }
    </React.Fragment>

  )
}

export default LineChart
