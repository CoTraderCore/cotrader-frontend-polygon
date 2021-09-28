import React, { Component } from 'react'
import { Pagination } from "react-bootstrap"
import isMobile from '../../utils/isMobile'
import { inject, observer } from 'mobx-react'


class PagePagination extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      currentPage: 1,
      perPage: (isMobile()) ? 5 : 10,
      isMobile: isMobile()
    }
  }

  // Pagination click by number
  paginationClick(event) {
    this.setState({
      currentPage: Number(event.target.id),
    })

    this.props.MobXStorage.paginationChange(this.paginationCalculate(event.target.id))
  }

  // Pagination Next and Back
  // param 1 - next 0 - back
  paginationStep(step) {
    let currentPage = this.state.currentPage
    this.setState({
      currentPage: (step === 1) ? currentPage +=1 : currentPage -= 1
    })

    let current = this.state.currentPage
    if(step === 1){
      this.props.MobXStorage.paginationChange(this.paginationCalculate(current +=1))
    }else{
      this.props.MobXStorage.paginationChange(this.paginationCalculate(current -=1))
    }
  }

  calculatePageNumbers() {
    let _pageNumbers = []
    for (let i = 1; i <= Math.ceil(this.props.MobXStorage.SmartFundsOriginal.length / this.state.perPage); i++) {
       _pageNumbers.push(i)
    }

    return _pageNumbers
  }

  // Logic for sort smart funds list
  paginationCalculate(curentPage){
    const indexOfLastTodo = curentPage * this.state.perPage;
    const indexOfFirstTodo = indexOfLastTodo - this.state.perPage;
    return this.props.MobXStorage.SmartFundsOriginal.slice(indexOfFirstTodo, indexOfLastTodo)
  }

 render() {
   // Logic for displaying pagination page numbers
   const pageNumbers = this.calculatePageNumbers();
   const renderPageNumbers = pageNumbers.map(number => {
      return (
        <Pagination.Item
          key={number}
          id={number}
          active={number === this.state.currentPage}
          onClick={(e) => this.paginationClick(e)}
        >
          {number}
        </Pagination.Item>
      )
   })

    return (
      <Pagination>
      {
        !this.state.isMobile
        ?
        (
          <React.Fragment>{ renderPageNumbers }</React.Fragment>
        )
        :
        (
          <React.Fragment>
          {
            this.state.currentPage !== 1
            ?
            (
              <Pagination.Prev onClick={() => this.paginationStep(0)}/>
            )
            :
              (null)
          }
          { renderPageNumbers.slice(0, 2) }
          <Pagination.Ellipsis />
          { renderPageNumbers.slice(-2) }

          {
            this.state.currentPage !== pageNumbers.length
            ?
            (
              <Pagination.Next onClick={() => this.paginationStep(1)}/>
            )
            :
            (null)
          }
        </React.Fragment>
        )
      }
      </Pagination>
    )
  }
}

export default inject('MobXStorage')(observer(PagePagination));
