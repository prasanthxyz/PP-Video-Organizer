import * as React from 'react';
import { Loader } from 'rsuite';

const SpinnerOr = (props: {
  msg: string;
  isSpinner: boolean;
  children: React.ReactNode;
}) =>
  props.isSpinner ? <Loader content={props.msg} size="sm" /> : props.children;

export default SpinnerOr;
