import { Select as AntSelect, Select } from 'antd';
import React, { useState } from 'react';

import { organisations, selectOrganisationTexts } from './constants';

import styles from './index.module.scss';

const { Option } = AntSelect;

interface Props {
  visible?: boolean;
}

const SelectOrganisation: React.FC<Props> = () => {
  const [selectedOrganisation, setSelectedOrganisation] = useState(
    'Select an organistaion'
  );

  return (
    <div className={styles.selectOrganisationWrapper}>
      <div>
        <p className={styles.heading}>{selectOrganisationTexts.heading}</p>
        <div className={styles.dropdown}>
          <span>{selectOrganisationTexts.dropdownLabel}</span>
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
      </div>
    </div>
  );
};

export default SelectOrganisation;
