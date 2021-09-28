import React from 'react';
import clsx from 'clsx';
// import { NavLink } from 'react-router-dom'
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import About from '@material-ui/icons/Comment';

import Shop from '@material-ui/icons/ShoppingBasket';

import Stake from '@material-ui/icons/Share';
import Twitter from '@material-ui/icons/Twitter';
import Telegram from '@material-ui/icons/Telegram';
//import Fullscreen from '@material-ui/icons/CropFree';
import Desktop from '@material-ui/icons/DesktopMac';
import Laptop from '@material-ui/icons/LaptopMac';

import Tablet from '@material-ui/icons/Tablet';
import { Link } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import DEXExplanation from './DEXExplanation'

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  themeSwitch:{
    flex:1,
    textAlign:'right',
  },
  logo:{

  },
  nested: {
    color:'inherit',
    "&:hover": {
      color:'inherit',
    }
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    //width: `calc(100% - ${drawerWidth}px)`,
    //marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    height:'64px',
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

export default function PersistentDrawerLeft(props) {
  const classes = useStyles()
  const theme = useTheme()
  const [open, setOpen] = React.useState(false)

  /*Temporary*/
  const [showDEXModal, setDEXModal] = React.useState(false)

  function handleDrawerOpen() {
    setOpen(true);
  }

  function handleDrawerClose() {
    setOpen(false);
  }

  function changeTheme(){
    if (document.body.classList.contains('dark_theme')){
      document.body.classList.add('light_theme');
      document.body.classList.remove('dark_theme');
    } else {
      document.body.classList.add('dark_theme');
      document.body.classList.remove('light_theme');
    }
  }

  function fullWidth(){
    if (!document.body.classList.contains('fullWidth_container')){
      document.body.classList.remove('tablet_container');
      document.body.classList.remove('laptop_container');
      document.body.classList.add('fullWidth_container');
    }
  }

  function laptopWidth(){
    if (!document.body.classList.contains('laptop_container')){
      document.body.classList.remove('fullWidth_container');
      document.body.classList.remove('tablet_container');
      document.body.classList.add('laptop_container');
    }
  }

  function tabletWidth(){
    if (!document.body.classList.contains('tablet_container')){
      document.body.classList.remove('fullWidth_container');
      document.body.classList.remove('laptop_container');
      document.body.classList.add('tablet_container');
    }
  }



  return (
    <React.Fragment>
    <div className={classes.root}>
      <CssBaseline />

      {/*Temporary*/}
      <DEXExplanation show={showDEXModal} setDEXModal={setDEXModal}/>

      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
      <Container maxWidth="md">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="inherit" className={classes.logo} noWrap>
            <Link to={props.web3 ? "/" : "/web3off"} style={{ textDecoration: 'none' }} className={classes.nested}>
            <img style={{width: 'auto', height: '24px'}} src="/logo.png" alt="CoTrader"/>
            </Link>
          </Typography>

          <Typography variant="inherit" className={'theme-toggle-btn ' + classes.themeSwitch} noWrap>
            <img onClick={changeTheme} style={{maxHeight: '24px', cursor: 'pointer'}} src="/themeicon.svg" alt="Change Theme" title="Change Theme" />
          </Typography>
        </Toolbar>
        </Container>
        <div className="screen-toggle-bar">
        <Desktop className={'fullscreen-toggle'} onClick={fullWidth} title="Full Screen" style={{fontSize: '25px', cursor: 'pointer', float: 'right', marginLeft: '10px'}}/>
        <Laptop className={'fullscreen-toggle'} onClick={laptopWidth} title="Medium Screen" style={{fontSize: '25px', cursor: 'pointer', float: 'right', marginLeft: '10px'}}/>
        <Tablet className={'fullscreen-toggle'} onClick={tabletWidth} title="Small Screen" style={{fontSize: '25px', cursor: 'pointer', float: 'right', marginLeft: '10px'}}/>
        </div>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>

          <ListItem button key="About" component="a" href="https://cotrader.com/" target="_blank" className={classes.nested}>
            <ListItemIcon><About /></ListItemIcon>
            <ListItemText primary="About" />
          </ListItem>

          <ListItem button key="Stake" component="a" href="https://cotrader.com/" target="_blank" className={classes.nested}>
            <ListItemIcon><Stake /></ListItemIcon>
            <ListItemText primary="Stake COT" />
          </ListItem>

          <ListItem button key="Buy" component="a" href="https://app.1inch.io/#/1/swap/ETH/COT" target="_blank" className={classes.nested}>
            <ListItemIcon><Shop /></ListItemIcon>
            <ListItemText primary="Buy COT" />
          </ListItem>



          <ListItem button component="a" key="Telegram" href="https://t.me/cotrader" target="_blank" className={classes.nested}>
            <ListItemIcon><Telegram /></ListItemIcon>
            <ListItemText primary="Telegram" />
          </ListItem>

          <ListItem button component="a" key="Twitter" href="https://twitter.com/cotrader_com" target="_blank" className={classes.nested}>
            <ListItemIcon><Twitter /></ListItemIcon>
            <ListItemText primary="Twitter" />
          </ListItem>

        </List>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >


      </main>
    </div>
    </React.Fragment>
  );
}
