import { Spin } from 'antd'
import * as React from 'react'

const SpinnerOr = (props) =>
  props.isSpinner ? (
    <>
      <Spin style={{ marginRight: '0.8rem' }} />
      {props.msg}
    </>
  ) : (
    props.children
  )

export default SpinnerOr
