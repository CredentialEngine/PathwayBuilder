import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dropdown, Menu, Space } from 'antd';
import React from 'react';

import Styles from './index.module.scss';

type Props = {
  menu?: { label: React.ReactNode; key: string }[];
  text?: string;
};

const ArrowDropDown = (props: Props) => {
  const { menu, text } = props;
  const countMenuItem = menu?.length;

  return (
    <Dropdown
      overlay={
        <Menu
          items={menu?.map((v) => ({
            label: v.label,
            key: v.key,
          }))}
        />
      }
      trigger={['click']}
      className={Styles.arrowDropdown}
    >
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          <FontAwesomeIcon icon={faCaretDown} color="black" />
          {text}
        </Space>
        {' (' + countMenuItem + ')'}
      </a>
    </Dropdown>
  );
};

export default ArrowDropDown;
