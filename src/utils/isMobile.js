const isMobile = () => {
  if(typeof window.orientation !== 'undefined'){
    return true
  }else{
    return false
  }
}

export default isMobile
