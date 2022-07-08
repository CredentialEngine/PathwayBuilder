import {
  faCircleQuestion,
  faExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Row } from 'antd';
import { noop } from 'lodash';
import React, { useState } from 'react';

// import Help from '../../assets/images/circleQuestionSolid.svg';
import Logo from '../../assets/images/pathwayBuilderLogo.svg';

import Button from '../button';
import { Type } from '../button/type';

import styles from './index.module.scss';

const Header = () => {
  const [hasPublishVisible, setHasPublishVisible] = useState<boolean>(true);
  const ApprovedComponent = (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <FontAwesomeIcon
          icon={faExclamation}
          className={styles.exclamationImg}
        />
        <Button type={Type.LINK} onClick={noop} text="Show One Conflict" />
      </div>
      <Button
        type={Type.APPROVE}
        className={styles.approveButtonSpecification}
        onClick={() => setHasPublishVisible(!hasPublishVisible)}
        iconOnTop={true}
        text="Approve"
        iconColor="#f37422"
      />
    </div>
  );

  return (
    <div className={styles.container}>
      <Col span={5} className={styles.productImgLayout}>
        <Col span={6}>
          <img className={styles.logo} src={Logo} alt="logo" />
        </Col>
        <Col span={18}>
          <Row className={styles.createNewContainer}>
            <Col span={24}>
              <span className={styles.newPathway}>Create a New Pathway</span>
            </Col>
            <Col span={24}>
              <span className={styles.foundation}>NRF Foundation</span>
            </Col>
          </Row>
        </Col>
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
    </div>
  );
};

export default Header;
