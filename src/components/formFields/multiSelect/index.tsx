import { Select } from 'antd';
import { DefaultOptionType } from 'antd/lib/select';
import React from 'react';

export interface MultiSelectProps {
  options?: DefaultOptionType[];
  onChange?: (event: React.MouseEvent<HTMLElement>) => void;
  defaultValue?: React.MouseEvent<HTMLElement, MouseEvent>;
  placeholder?: string;
  optionLabelProp?: string;
  mode?: 'multiple' | 'tags';
}

const MultiSelect: React.FC<MultiSelectProps> = (props: MultiSelectProps) => {
  const {
    options,
    onChange,
    defaultValue,
    placeholder,
    optionLabelProp,
    mode,
  } = props;
  return (
    <Select
      style={{ width: '100%' }}
      mode={mode ? mode : 'multiple'}
      placeholder={placeholder}
      defaultValue={defaultValue}
      onChange={onChange}
      options={options}
      optionLabelProp={optionLabelProp}
    />
  );
};

export default MultiSelect;
