import { AutoComplete } from 'antd';
import { DefaultOptionType } from 'antd/lib/select';
import React from 'react';

export interface Props {
  options?: DefaultOptionType[];
  onSearch?: any;
  onSelect?: (a: any) => void;
  defaultValue?: React.MouseEvent<HTMLElement, MouseEvent>;
  placeholder: string;
  className?: any;
  allowClear?: boolean;
  dropdownClassName?: any;
  value?: string;
  onChange?: any;
}

const AutoCompleteBox = (props: Props) => {
  const {
    options,
    onSearch,
    onSelect,
    placeholder,
    className,
    allowClear,
    dropdownClassName,
    value,
    onChange,
  } = props;
  return (
    <AutoComplete
      className={className}
      options={options}
      placeholder={placeholder}
      onSelect={onSelect}
      value={value}
      onSearch={onSearch}
      onChange={onChange}
      dropdownClassName={dropdownClassName}
      allowClear={allowClear}
    />
  );
};

export default AutoCompleteBox;
