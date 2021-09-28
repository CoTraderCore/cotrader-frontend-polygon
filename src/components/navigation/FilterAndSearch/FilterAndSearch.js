import React, { Component } from 'react'
import { Modal, Tabs, Tab } from "react-bootstrap"
import Button from '@material-ui/core/Button'
import FundSearch from './FundSearch'
import FundFilter from './FundFilter'


class FilterAndSearch extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      Show: false,
      isRed: true
    }
  }

  modalClose = () => this.setState({ Show: false })

  render(){
    const isRed = this.state.isRed
    return(
    <React.Fragment>
    <Button variant="contained" color="primary" onClick={() => this.setState({ Show: true })}>
    Filter funds
    </Button>

    <Modal
      show={this.state.Show}
      onHide={() => this.setState({ Show: false })}
      aria-labelledby="example-modal-sizes-title-sm"
      className={isRed ? 'class1' : 'class2'}
    >
      <Modal.Header closeButton>
      <Modal.Title>
      Filter and search smart funds
      </Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Tabs defaultActiveKey="Filter">
       <Tab eventKey="Filter" title="Filter">
         <FundFilter modalClose={this.modalClose}/>
       </Tab>
       <Tab eventKey="Search" title="Search">
         <FundSearch modalClose={this.modalClose}/>
       </Tab>
      </Tabs>
      </Modal.Body>
    </Modal>

    </React.Fragment>
    )
  }
}

export default FilterAndSearch
