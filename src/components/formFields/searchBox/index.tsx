import { Input } from 'antd';
import React from 'react';

import Styles from './index.module.scss';

const { Search } = Input;

export interface Props {
  children?: React.ReactNode;
  label?: string;
  className?: string;
  onIconClick?: (event: React.MouseEvent<HTMLElement>) => void;
  buttonTitle?: string;
  buttonVisible?: boolean;
  onEdit?: () => void;
  name?: string;
  checked?: boolean;
  value?: any;
  key?: number;
  disabled?: boolean;
  onSearch?:
    | ((
        value: string,
        event?:
          | React.MouseEvent<HTMLElement, MouseEvent>
          | React.ChangeEvent<HTMLInputElement>
          | React.KeyboardEvent<HTMLInputElement>
          | undefined
      ) => void)
    | undefined;
  direction?: 'horizontal' | 'vertical' | undefined;
  placeholder?: string;
}

const SearchBox: React.FC<Props> = ({ onSearch, placeholder, className }) => (
  <Search
    placeholder={placeholder}
    onSearch={onSearch}
    className={Styles.searchbox + ' ' + className}
  />
);

export default SearchBox;
