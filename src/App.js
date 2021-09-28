// TODO Move all props web3 and accounts to mobX
// TODO remove web3 off version, just allow user read contract data from default web3, and require connect for write

import React, { Component } from 'react'
import { inject } from 'mobx-react'
import ReactGA from 'react-ga'

import Footer from './components/static/Footer'
//import Header from './components/static/Header'
import HowToStart from './components/static/HowToStart'

import getWeb3 from "./utils/getWeb3"
import getFundsList from "./utils/getFundsList"

import { HashRouter, Route, Switch } from 'react-router-dom'
import { NeworkID, SmartFundRegistryADDRESS }  from './config.js'

import { Alert } from "react-bootstrap"

import SmartFundsList from './components/SmartFundsList'
import ViewFund from './components/ViewFund'
import ViewUserTx from './components/ViewUserTx'
import ViewFundTx from './components/ViewFundTx'
import ViewUser from './components/ViewUser'

import SmartFundsListWithoutWeb3 from './components/web3off/SmartFundsListWithoutWeb3'
import ViewFundWithoutWeb3 from './components/web3off/ViewFundWithoutWeb3'

import { Button } from "@material-ui/core";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles"
// import lightblue from "@material-ui/core/colors/lightBlue"
import Navbar2 from './components/static/Navbar'
import WalletInfo from './components/static/WalletInfo'
// import { Row, Col } from "react-bootstrap"
import Container from '@material-ui/core/Container'


class App extends Component {
  constructor(props, context) {
  super(props, context);
  this.state = {
    web3: null,
    accounts: null,
    isReactGarbagetytyweyety: false,
    network: 0,
    isLoadNetID:false,
    timeOut: false,
    isDataLoad: false,
    themeType : 'light'
    }
    document.body.classList.add('light_theme')
    document.body.classList.add('fullWidth_container')
  }

  changeTheme2(){
    if (this.state.themeType === 'dark'){
      this.setState({themeType:'light'});
      document.body.classList.add('light_theme');
      document.body.classList.remove('dark_theme');
    } else {
      this.setState({themeType:'dark'});
      document.body.classList.add('dark_theme');
      document.body.classList.remove('light_theme');
    }
  }

  initializeReactGA() {
    ReactGA.initialize('UA-141893089-1');
    ReactGA.pageview('/');
  }

  _isMounted = false
  componentDidMount = async () => {
    this._isMounted = true
    this.initializeReactGA()
    // Time for checking web3 status
    setTimeout(() => {this.setState({
      timeOut:true
    })}, 1000)

    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3()

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts()

      // Set web3 and accounts to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts })

      this.props.MobXStorage.initWeb3AndAccounts(web3, accounts)
    } catch (error) {
      // Catch any errors for any of the above operations.
      // alert(
      //   `Failed to load web3, accounts, or contract. Check console for details.`,
      // )
      console.error(error)
    }

    this.initData()

    // Get network ID
    if(this.state.web3)
    this.state.web3.eth.net.getId().then(netId => {
      this.setState({
        network:netId,
        isLoadNetID:true
      })
    })

    // relaod app if accout was changed
    if(window.ethereum)
    window.ethereum.on('accountsChanged', () => window.location.reload())
  }

  componentWillUnmount(){
    this._isMounted = false
  }

  // init smart funds list
  initData = async () => {
    if(this._isMounted && this.props.MobXStorage.SmartFundsOriginal.length === 0){
      const smartFunds = await getFundsList()
      this.props.MobXStorage.initSFList(smartFunds)
      // view current registry address
      console.log("SmartFundRegistryADDRESS: ", SmartFundRegistryADDRESS, "!___version 28/04/21___!")
      this.setState({ isDataLoad: true })
    }
  }

  checkWeb3OffRedirect = () => {
    // redirect to web3off version if client has no web3
    if(this.state.timeOut && !this.state.web3){
    // if current location web3off, how-to-start no need redirect to web3 off
    const redirectOff = ['web3off', 'how-to-start', 'user-txs', 'fund-txs', 'user']
    const isIncludes = redirectOff.some((el) => String(window.location.href).includes(el))

    if(!isIncludes){
      // replace current address with web3 off
      const web3offAddress = String(window.location.href).replace('#/', '#/web3off/')
      console.log(web3offAddress)
      window.location = web3offAddress
      }
    }
  }

  render() {
    this.checkWeb3OffRedirect()
    let theme = createMuiTheme({
      palette: {
        primary: {
          light: '#039be5',
          main: '#039be5',
          dark: '#039be5',
        },
        secondary: {
          light: '#3f51b5',
          main: '#00f1d1',
          dark: '#00f1d1',
        },
        background: {
          default: this.state.themeType === 'light' ? '#fff' : '#000',
        },
        type: this.state.themeType
      }
    });

    return (
      <HashRouter>
      <MuiThemeProvider theme={theme}>
      <Navbar2 web3={this.state.web3}/>
      <Container maxWidth="md">
      <div className={'top-notice'} style={{ padding: '7px 10px', backgroundColor:'transparent', lineHeight: '1.3', margin: '8px auto',textAlign:'center' }}>
      <strong>DeFi investment funds - create or join the best smart funds on the blockchain</strong>
      </div>
      <WalletInfo web3={this.state.web3} accounts={this.state.accounts}/>

      <Button variant="contained" color="primary" className={'d-none'} onClick={()=>{this.changeTheme2()}}><img style={{maxHeight: '24px'}} src="/themeicon.svg" alt="Change Theme" title="Change Theme" /></Button>

      {
        // Check network ID
        NeworkID !== this.state.network && this.state.isLoadNetID && this.state.web3 ?
        (
          <Alert variant="danger">
          Wrong network ID
          </Alert>
        ):
        (
          null
        )
      }

      <Switch>
         <Route path="/web3off/fund/:address" render={(props) => <ViewFundWithoutWeb3 {...props} web3={this.state.web3}/>} />
         <Route exact path="/" render={(props) => <SmartFundsList {...props} web3={this.state.web3} accounts={this.state.accounts} isDataLoad={this.state.isDataLoad}/>} />
         <Route path="/web3off" render={(props) => <SmartFundsListWithoutWeb3 {...props} web3={this.state.web3} isDataLoad={this.state.isDataLoad}/>}/>
         <Route path="/fund/:address" render={(props) => <ViewFund {...props} web3={this.state.web3} accounts={this.state.accounts}/>} />
         <Route path="/user-txs/:address" render={(props) => <ViewUserTx {...props} />} />
         <Route path="/fund-txs/:address" render={(props) => <ViewFundTx {...props} />} />
         <Route path="/user/:address" render={(props) => <ViewUser {...props} />} />
         <Route path="/how-to-start" render={(props) => <HowToStart {...props} />} />
      </Switch>
      </Container>
      <br />
      <Footer />
      </MuiThemeProvider>
      </HashRouter>
    )
  }
}

//export default App
export default inject('MobXStorage')(App);
