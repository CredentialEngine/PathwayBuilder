import { Select } from 'antd';
import React from 'react';

const { Option } = Select;

export interface Props {
  value: string;
  name?: string;
  children: React.ReactNode;
}

export const Options: React.FC<Props> = (props: Props) => (
  <Option value={props.value}>{props.children}</Option>
);

export default Options;
