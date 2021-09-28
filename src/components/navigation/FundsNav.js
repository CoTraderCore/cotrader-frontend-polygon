import React, { Component } from 'react'
import { OverlayTrigger, Tooltip } from "react-bootstrap"
import { inject, observer } from 'mobx-react'

import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

class FundsNav extends Component {
  state = {
    activeTab: 0,
  };
  handleChange = (event, activeTab) => {
    this.setState( (state) => ({activeTab}));
  };
 render(){
   const { activeTab } = this.state;
    return(
      <Paper className="mb-2">
      <Tabs
        value={activeTab} onChange={this.handleChange}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
      <Tab label="All funds" onClick={() => this.props.MobXStorage.AllFunds()}/>
        {
          this.props.MobXStorage.web3
          ?
          (
            <Tab label="My funds" onClick={() => this.props.MobXStorage.myFunds(this.props.MobXStorage.account[0])}/>
          )
          :
          (
          <OverlayTrigger
            overlay={
            <Tooltip>
            Please connect to web3
            </Tooltip>
            }
            >
            <Tab label="My funds"/>
            </OverlayTrigger>
          )
        }

        {
          this.props.MobXStorage.web3 ?
          (
            <Tab label="My investments" onClick={() => this.props.MobXStorage.myInvestments(this.props.MobXStorage.account[0])}/>
          )
          :
          (
            <OverlayTrigger
            overlay={
            <Tooltip>
            Please connect to web3
            </Tooltip>
            }
            >
            <Tab label="My investments"/>
            </OverlayTrigger>
          )
        }
      </Tabs>
    </Paper>
    )
  }
}
export default inject('MobXStorage')(observer(FundsNav));
