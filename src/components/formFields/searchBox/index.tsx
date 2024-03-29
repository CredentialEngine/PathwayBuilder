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
  styleType?: 'outline' | 'grey' | string;
  onKeyUp?: (value: React.KeyboardEvent<HTMLInputElement>) => void;
  onChange?: (value: string) => void;
}

const SearchBox: React.FC<Props> = ({
  onSearch,
  placeholder,
  className,
  styleType,
  onKeyUp,
}) => (
  <Search
    placeholder={placeholder}
    onSearch={onSearch}
    className={Styles.searchbox + ' ' + className + ' ' + styleType}
    onKeyUp={onKeyUp}
  />
);

export default SearchBox;
