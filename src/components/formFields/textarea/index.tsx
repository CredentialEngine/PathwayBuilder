import TextArea from 'antd/lib/input/TextArea';
import React from 'react';

export type InputProps = {
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  defaultValue?: string;
  placeholder: string;
  maxLength?: number;
  value: string;
  name?: string;
  onBlur?: any;
  required?: boolean;
  rows?: number;
  showCount?: boolean;
};
const Textarea: React.FC<InputProps> = (props: InputProps) => {
  const {
    onChange,
    maxLength,
    placeholder,
    value,
    defaultValue,
    name,
    required,
    onBlur,
    rows,
    showCount,
  } = props;
  const handleChange = (e: any) => {
    onChange && onChange(e);
  };
  return (
    <TextArea
      showCount={showCount}
      placeholder={placeholder}
      maxLength={maxLength}
      name={name}
      onChange={(e) => handleChange(e)}
      value={value}
      defaultValue={defaultValue}
      rows={rows}
      required={required}
      onBlur={onBlur}
    />
  );
};

export default Textarea;
