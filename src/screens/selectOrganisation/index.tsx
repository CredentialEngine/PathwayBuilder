import { Modal, Select as AntSelect, Select } from 'antd';
import { noop } from 'lodash';
import React, { useState } from 'react';

import styles from './index.module.scss';

const { Option } = AntSelect;

interface Props {
  visible?: boolean;
}

const SelectOrganisation: React.FC<Props> = ({ visible = true }) => {
  const [selectedOrganisation, setSelectedOrganisation] = useState(
    'Select an organistaion'
  );
  const organisations = [
    { id: 1, name: 'Organisation 1' },
    { id: 2, name: 'Organisation 2' },
  ];

  return (
    <div className={styles.selectOrganisationWrapper}>
      <Modal onOk={noop} onCancel={noop} closable width={520} visible={visible}>
        <p className={styles.heading}>Please select an organisation.</p>
        <div className={styles.dropdown}>
          <span>Organisation:</span>
          <Select
            style={{ width: '240px' }}
            value={selectedOrganisation}
            onChange={(value: any) => setSelectedOrganisation(value)}
          >
            {organisations?.map((item: any) => (
              <Option value={item?.id} key={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </div>
      </Modal>
    </div>
  );
};

export default SelectOrganisation;
