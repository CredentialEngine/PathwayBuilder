import { Select } from 'antd';
import { DefaultOptionType } from 'antd/lib/select';
import React from 'react';

export interface MultiSelectProps {
  options?: DefaultOptionType[];
  onChange?: (event: React.MouseEvent<HTMLElement>) => void;
  defaultValue?: React.MouseEvent<HTMLElement, MouseEvent>;
  placeholder?: string;
  optionLabelProp?: string;
  onSearch?: (a: any) => void;
  onSelect?: (a: any) => void;
  value?: any;
}

const MultiSelect: React.FC<MultiSelectProps> = (props: MultiSelectProps) => {
  const {
    options,
    onChange,
    defaultValue,
    placeholder,
    optionLabelProp,
    onSearch,
    onSelect,
    value,
  } = props;
  return (
    <Select
      style={{ width: '100%' }}
      mode="multiple"
      placeholder={placeholder}
      defaultValue={defaultValue}
      onChange={onChange}
      options={options}
      optionLabelProp={optionLabelProp}
      onSearch={onSearch}
      onSelect={onSelect}
      value={value}
    />
  );
};

export default MultiSelect;
