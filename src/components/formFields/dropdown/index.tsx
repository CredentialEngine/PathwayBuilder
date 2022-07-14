import { Select } from 'antd';
import { LabeledValue } from 'antd/lib/select';
import React from 'react';

export type DropdownProps = {
  onClick?: (event: any) => void;
  children?: React.ReactNode;
  defaultValue?: string[] | number[] | LabeledValue;
  style?: any;
};

export const Dropdown = (props: DropdownProps) => {
  const { onClick, children, defaultValue, style } = props;

  return (
    <>
      <Select onChange={onClick} defaultValue={defaultValue} style={style}>
        {children}
      </Select>
    </>
  );
};

export default Dropdown;
