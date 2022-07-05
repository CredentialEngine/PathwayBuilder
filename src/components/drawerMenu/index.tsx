import { Drawer } from 'antd';
import React from 'react';

import { IconNameType } from '../icon';

export interface Props {
  children?: React.ReactNode;
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
  visible: boolean;
  onClose?: ((e: React.SyntheticEvent<EventTarget>) => void) | undefined;
  placement: 'right' | 'top' | 'bottom' | 'left' | undefined;
  title?: string;
}

const CustomDrawer: React.FC<Props> = ({
  visible,
  onClose,
  placement,
  title,
  children,
}) => (
  <Drawer
    title={title}
    placement={placement}
    onClose={onClose}
    visible={visible}
  >
    {children}
  </Drawer>
);

export default CustomDrawer;
