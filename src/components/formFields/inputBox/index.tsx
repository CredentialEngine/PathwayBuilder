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
  onBlur?: any;
  required?: boolean;
  min?: number;
  Readonly?: boolean;
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
    onBlur,
    required,
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
      onBlur={onBlur}
      required={required}
      {...props}
    />
  ) : (
    <Input
      type={type}
      onChange={onChange ? onChange : noop}
      placeholder={placeholder}
      value={value}
      name={name}
      defaultValue={defaultValue}
      disabled={disabled}
      required={required}
      onBlur={onBlur}
      {...props}
    />
  );
};

export default InputBox;
