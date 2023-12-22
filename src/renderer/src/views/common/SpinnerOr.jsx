import * as React from 'react'

const SpinnerOr = (props) =>
  props.isSpinner ? (
    <div className="d-flex align-items-center">
      <div className="spinner"></div>
      <span className="me-2">{props.msg}</span>
    </div>
  ) : (
    props.children
  )

export default SpinnerOr
