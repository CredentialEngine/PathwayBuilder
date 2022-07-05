import { Radio } from 'antd';
import React from 'react';

export interface Props {
  children?: React.ReactNode;
  label?: string;
  className?: string;
  onIconClick?: (event: React.MouseEvent<HTMLElement>) => void;
  buttonTitle?: string;
  buttonVisible?: boolean;
  onEdit?: () => void;
  onChange?: (event: React.MouseEvent<HTMLElement>) => void;
  name?: string;
  checked?: boolean;
  value?: any;
  key?: number;
  disabled?: boolean;
}

const RadioButton: React.FC<Props> = ({
  label,
  onChange,
  name,
  checked,
  value,
  key,
  disabled,
}) => {
  const handleChange = (e: any) => {
    onChange && onChange(e);
  };
  return (
    <Radio
      onChange={(e) => handleChange(e)}
      name={name}
      value={value}
      checked={checked}
      key={key}
      disabled={disabled}
    >
      {label}
    </Radio>
  );
};

export default RadioButton;
