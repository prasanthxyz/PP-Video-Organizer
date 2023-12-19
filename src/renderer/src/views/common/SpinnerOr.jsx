import * as React from 'react'
import { Spinner } from 'react-bootstrap'

const SpinnerOr = (props) =>
  props.isSpinner ? (
    <div className="d-flex align-items-center">
      <Spinner className="me-2" />
      <span className="me-2">{props.msg}</span>
    </div>
  ) : (
    props.children
  )

export default SpinnerOr
