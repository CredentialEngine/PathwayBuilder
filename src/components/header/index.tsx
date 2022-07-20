import {
  faCircleQuestion
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Row } from 'antd';
import { noop } from 'lodash';
import React, { useState } from 'react';

import Logo from '../../assets/images/pathwayBuilderLogo.svg';

import Button from '../button';
import { Type } from '../button/type';

import styles from './index.module.scss';

const Header = () => {
  const [hasPublishVisible, setHasPublishVisible] = useState<boolean>(true);
  const ApprovedComponent = (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Button type={Type.LINK} onClick={noop} text="Show 1 Conflict" />
      </div>
      <div style={{ display: 'flex', position: 'relative' }}>
      <Button
        type={Type.APPROVE}
        className={styles.approveButtonSpecification}
        onClick={() => setHasPublishVisible(!hasPublishVisible)}
        iconOnTop={true}
        text="Approve"
        iconColor="#f37422"
      />
      </div>
    </div>
  );

  return (
    <Row className={styles.container}>
      <Col span={5} className={styles.productImgLayout}>
        <Row align="middle">
          <Col span={4}>
            <img src={Logo} alt="logo" />
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
            <span className={styles.editPathway}>Edit Pathway Details</span>
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
              type={Type.PRIMARY}
            />

            <Button
              className={styles.publishButtonSpecification}
              text="Publish Pathway"
              onClick={() => setHasPublishVisible(!hasPublishVisible)}
            />
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
