import { faCircleQuestion } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Row } from 'antd';
import { noop } from 'lodash';
import React, { useState } from 'react';

import Logo from '../../assets/images/pathwayBuilderLogo.svg';

import Button from '../button';
import { Type } from '../button/type';

import styles from './index.module.scss';

interface Props {
  setIsEditPathwayFormVisible: (a: boolean) => void;
}
const Header = (props: Props) => {
  const { setIsEditPathwayFormVisible } = props;
  const [hasPublishVisible, setHasPublishVisible] = useState<boolean>(true);
  const ApprovedComponent = (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Button type={Type.LINK} onClick={noop} text="Show 1 Conflict" />
      </div>
      <div style={{ display: 'flex', position: 'relative' }}>
        <Button
          type={Type.DISABLED}
          className={styles.approveButtonSpecification}
          onClick={() => setHasPublishVisible(!hasPublishVisible)}
          iconOnTop={true}
          text="Approve"
        />
      </div>
    </div>
  );

  return (
    <Row className={styles.container}>
      <Col span={5} className={styles.productImgLayout}>
        <Row align="middle" style={{ width: '100%' }}>
          <Col span={4}>
            <img src={Logo} alt="logo" style={{ maxWidth: '39px' }} />
          </Col>
          <Col span={20}>
            <Row className={styles.createNewContainer}>
              <Col span={24}>
                <span className={styles.newPathway}>Create a New Pathway</span>
              </Col>
              <Col span={24}>
                <span className={styles.foundation}>NRF Foundation</span>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
      <Col span={18} className={styles.titleDescriptionContainer}>
        <Row className={styles.headerCenter}>
          <Col span={10} className={styles.titleContainer}>
            <span className={styles.title}>
              National Retail Federation Foundation RISE Up Pathway
            </span>
            <span
              className={styles.editPathway}
              onClick={() => setIsEditPathwayFormVisible(true)}
            >
              Edit Pathway Details
            </span>
          </Col>
          <Col span={4} className={styles.saveButtonWrapper}>
            <Button
              type={Type.LINK}
              onClick={noop}
              text="Exit Without Saving"
            />
            <Button
              className={styles.saveButtonSpecification}
              key="save"
              onClick={noop}
              text="save"
            />

            {/*
            Commenting this code for now,
            may be in future we need this
            
            <Button
              className={styles.publishButtonSpecification}
              text="Publish Pathway"
              onClick={() => setHasPublishVisible(!hasPublishVisible)}
            /> 

            */}
          </Col>
        </Row>
        {hasPublishVisible && (
          <Col className={styles.conflictComponent}>{ApprovedComponent}</Col>
        )}
      </Col>
      <Col span={1} className={styles.helpContainer}>
        <FontAwesomeIcon
          icon={faCircleQuestion}
          className={styles.imgDimensions}
        />
      </Col>
    </Row>
  );
};

export default Header;
