import TextArea from 'antd/lib/input/TextArea';
import React from 'react';

export type InputProps = {
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  defaultValue?: string;
  placeholder: string;
  maxLength: number;
  value: string;
};

const Textarea: React.FC<InputProps> = (props: InputProps) => {
  const { onChange, maxLength, placeholder, value, defaultValue } = props;
  const handleChange = (e: any) => {
    onChange && onChange(e);
  };

  return (
    <TextArea
      showCount
      placeholder={placeholder}
      maxLength={maxLength}
      onChange={(e) => handleChange(e)}
      value={value}
      defaultValue={defaultValue}
    />
  );
};

export default Textarea;
