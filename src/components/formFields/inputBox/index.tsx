import { Input } from 'antd';
import { noop } from 'lodash';
import React from 'react';

export type InputProps = {
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
  defaultValue?: string;
  placeholder?: string;
  maxLength?: number;
  value?: string;
  type?: string;
  disabled?: boolean;
  name?: string;
};

const InputBox: React.FC<InputProps> = (props: InputProps) => {
  const {
    onChange,
    type,
    disabled,
    maxLength,
    placeholder,
    value,
    defaultValue,
    name,
  } = props;
  return maxLength ? (
    <Input
      type={type}
      showCount
      name={name}
      onChange={onChange ? onChange : noop}
      placeholder={placeholder}
      maxLength={maxLength}
      value={value}
      defaultValue={defaultValue}
      disabled={disabled}
    />
  ) : (
    <Input
      type={type}
      onChange={onChange ? onChange : noop}
      placeholder={placeholder}
      value={value}
      defaultValue={defaultValue}
      disabled={disabled}
    />
  );
};

export default InputBox;
