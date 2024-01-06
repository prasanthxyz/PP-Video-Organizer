import * as React from 'react'
import { Loader } from 'rsuite'

const SpinnerOr = (props) =>
  props.isSpinner ? <Loader content={props.msg} size="sm" /> : props.children

export default SpinnerOr
