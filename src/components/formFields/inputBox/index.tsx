import { Input } from 'antd';
import React from 'react';

export type InputProps = {
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
  defaultValue?: string;
  placeholder?: string;
  maxLength?: number;
  value?: string;
  type?: string;
  disabled?: boolean;
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
  } = props;
  return maxLength ? (
    <Input
      type={type}
      showCount
      onChange={onChange}
      placeholder={placeholder}
      maxLength={maxLength}
      value={value}
      defaultValue={defaultValue}
      disabled={disabled}
    />
  ) : (
    <Input
      type={type}
      onChange={onChange}
      placeholder={placeholder}
      value={value}
      defaultValue={defaultValue}
      disabled={disabled}
    />
  );
};

export default InputBox;
