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
  mode?: 'multiple' | 'tags';
  tagRender?: any;
  disabled?: boolean;
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
    mode,
    tagRender,
    disabled,
  } = props;
  return (
    <Select
      style={{ width: '100%' }}
      mode={mode ? mode : 'multiple'}
      placeholder={placeholder}
      defaultValue={defaultValue}
      onChange={onChange}
      tagRender={tagRender}
      options={options}
      optionLabelProp={optionLabelProp}
      onSearch={onSearch}
      onSelect={onSelect}
      value={value}
      disabled={disabled}
    />
  );
};

export default MultiSelect;
