import React from 'react'
import './MultiColorBarCSS.css'


function MultiColorContainer(props){
    const parent = props;

  	const values = parent.readings && parent.readings.length && parent.readings.map((item, i) => {
      return(
        <div className="value" style={{'color': item.color, 'width': item.value + '%'}}  key={i}>
          <span>{item.value}%</span>
        </div>
      )
    })

  	// const calibrations = parent.readings && parent.readings.length && parent.readings.map((item, i) => {
    //   return (
    //     <div className="graduation" style={{'color': item.color, 'width': item.value + '%'}}  key={i}>
    //       <span>|</span>
    //     </div>
    //   )
    // })

  	const bars = parent.readings && parent.readings.length && parent.readings.map((item, i) => {
      return (
        <div className="bar" style={{'backgroundColor': item.color, 'width': item.value + '%'}}  key={i}>
        </div>
      )
    });

  	const legends = parent.readings && parent.readings.length && parent.readings.map((item, i) => {
      return (
        <div className="legend" key={i}>
          <span className="dot" style={{'color': item.color}}>●</span>
          <span className="label">{item.name}</span>
        </div>
     )
    });

    return (
      <div className="multicolor-bar">

      	<div className="values">
      	<strong>{values === ''?'':values}</strong>
      	</div>

        {
          /*
          <div className="scale">
            {calibrations === ''?'':calibrations}
          </div>
          */
        }

      	<div className="bars">
      		{bars === ''?'':bars}
      	</div>
      	<div className="legends">
      		<small><strong>{legends === ''?'':legends}</strong></small>
      	</div>
      </div>
    );

}

export default MultiColorContainer
