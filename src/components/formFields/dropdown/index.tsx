import { Select } from 'antd';
import React from 'react';

import Styles from './index.module.scss';

export type DropdownProps = {
  onClick?: (event: any) => void;
  children?: React.ReactNode;
  defaultValue?: string;
  style?: any;
  placeholder?: string;
};

export const Dropdown = (props: DropdownProps) => {
  const { children, placeholder, defaultValue, style } = props;

  const onChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  const onSearch = (value: string) => {
    console.log('search:', value);
  };
  return (
    <>
      <Select
        showSearch
        onChange={onChange}
        onSearch={onSearch}
        defaultValue={defaultValue}
        placeholder={placeholder}
        style={style}
        className={Styles.dropdownwrapper}
        filterOption={(input, option) =>
          (option!.children as unknown as string)
            .toLowerCase()
            .includes(input.toLowerCase())
        }
      >
        {children}
      </Select>
    </>
  );
};

export default Dropdown;
