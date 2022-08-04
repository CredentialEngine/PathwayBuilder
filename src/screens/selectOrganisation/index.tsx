import { Select as AntSelect, Select } from 'antd';
import React, { useEffect, useState } from 'react';

import { selectOrganisationTexts } from './constants';

import styles from './index.module.scss';

const { Option } = AntSelect;

interface Props {
  visible?: boolean;
  organisationList?: any;
  getSelectedOrganisation?: (value: string) => void;
}

const SelectOrganisation: React.FC<Props> = ({
  organisationList,
  getSelectedOrganisation,
}) => {
  const [selectedOrganisation, setSelectedOrganisation] = useState(
    'Select an organization'
  );

  useEffect(() => {
    getSelectedOrganisation && getSelectedOrganisation(selectedOrganisation);
  }, [selectedOrganisation]);

  return (
    <div className={styles.selectOrganisationWrapper}>
      <div>
        <p className={styles.heading}>{selectOrganisationTexts.heading}</p>
        <div className={styles.dropdown}>
          <span>{selectOrganisationTexts.dropdownLabel}</span>
          <Select
            style={{ width: '240px' }}
            value={selectedOrganisation}
            onChange={(value: any) => {
              setSelectedOrganisation(value);
            }}
          >
            {organisationList?.map((item: any) => (
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
