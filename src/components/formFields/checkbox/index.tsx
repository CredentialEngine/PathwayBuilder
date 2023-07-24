import Checkbox from 'antd/lib/checkbox';
import React, { ReactNode } from 'react';

import { IconNameType } from '../../../components/icon/types';

export interface Props {
  children?: ReactNode;
  label?: string;
  className?: string;
  iconName?: IconNameType;
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

const CheckBox: React.FC<Props> = ({
  label,
  onChange,
  name,
  checked,
  value,
  key,
  disabled,
  className,
}) => {
  const handleChange = (e: any) => {
    onChange && onChange(e);
  };
  return (
    <Checkbox
      onChange={(e) => handleChange(e)}
      name={name}
      value={value}
      checked={checked}
      key={key}
      disabled={disabled}
      className={className}
    >
      {label}
    </Checkbox>
  );
};

export default CheckBox;
