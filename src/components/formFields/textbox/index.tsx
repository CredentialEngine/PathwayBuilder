import { Input } from 'antd';
import React from 'react';

export type InputProps = {
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
  defaultValue?: string;
  placeholder: string;
  maxLength: number;
  value: string;
};

const Textbox: React.FC<InputProps> = (props: InputProps) => {
  const { onChange, maxLength, placeholder, value, defaultValue } = props;

  return (
    <Input
      showCount
      onChange={onChange}
      placeholder={placeholder}
      maxLength={maxLength}
      value={value}
      defaultValue={defaultValue}
    />
  );
};

export default Textbox;
