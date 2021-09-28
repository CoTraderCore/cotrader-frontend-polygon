import React, { Component } from 'react'
import { Form, InputGroup } from "react-bootstrap"
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import Search from '@material-ui/icons/Search'


class FundSearch extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      userAddress:''
    }
  }

  redirectToUserPage() {
    window.location = "/#/user/" + this.state.userAddress
  }


  render(){
    return(
      <>
      <Form>
      {/* Search data by user address */}
      <Form.Group>
      <InputGroup>
      <TextField
        label="Search total data for user address"
        value={ this.state.userAddress }
        onChange={e => this.setState({ userAddress: e.target.value })}
        name="userAddress"
        type="string"
        margin="normal"
        variant="outlined"
        style={{flex:1}}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                edge="end"
                style={{color:"#6A5ACD"}}
                aria-label="Find"
                onClick={() => this.redirectToUserPage()}
              >
                <Search />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      </InputGroup>
      </Form.Group>
      </Form>
      </>
    )
  }
}

export default FundSearch
