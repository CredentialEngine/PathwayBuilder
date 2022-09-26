import { faCircleQuestion } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Alert, Col, Row } from 'antd';
import { noop } from 'lodash';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Logo from '../../assets/images/pathwayBuilderLogo.svg';
import {
  approvePathwayRequest,
  saveDataForPathwayRequest,
} from '../../states/actions';

import Button from '../button';
import { Type } from '../button/type';

import styles from './index.module.scss';

interface Props {
  setIsEditPathwayFormVisible: (a: boolean) => void;
}
const Header = (props: Props) => {
  const { setIsEditPathwayFormVisible } = props;
  const pathwayWrapper = useSelector(
    (state: any) => state?.initalReducer?.mappedData
  );
  const savePathwayResult = useSelector(
    (state: any) => state?.initalReducer?.pathwayComponentData
  );

  const dispatch = useDispatch();
  const [hasConflicts, setHasConflicts] = useState<boolean>(false);
  const [conflictMessages, setConflictMessages] = useState<[]>([]);

  useEffect(() => {
    if (savePathwayResult.error) {
      setHasConflicts(true);
      setConflictMessages(savePathwayResult.data);
    }
  }, [savePathwayResult]);

  const onApproverHandler = () => {
    dispatch(approvePathwayRequest('9'));
  };

  const conflictHandler = () => {
    <Alert
      message="Error"
      description={conflictMessages}
      type="error"
      showIcon
    />;
  };
  const ApprovedComponent = (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Button
          type={Type.LINK}
          onClick={() => conflictHandler()}
          text={`show ${conflictMessages.length} conflicts`}
          disabled={!hasConflicts}
        />
      </div>
      <div style={{ display: 'flex', position: 'relative' }}>
        <Button
          type={Type.PRIMARY}
          className={styles.approveButtonSpecification}
          onClick={onApproverHandler}
          iconOnTop={true}
          disabled={conflictMessages.length > 0}
          text="Approve"
        />
      </div>
    </div>
  );

  useEffect(() => {
    const intervalId = setTimeout(() => {
      dispatch(saveDataForPathwayRequest(pathwayWrapper));
    }, 30000);

    return () => clearTimeout(intervalId);
  }, [pathwayWrapper]);

  const savePathwayWrapper = () => {
    dispatch(saveDataForPathwayRequest(pathwayWrapper));
  };

  return (
    <div id="header" className={styles.container + ' header-container'}>
      <div className={styles.productImgLayout + ' logowrapper'}>
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
                <span className={styles.foundation}>
                  {pathwayWrapper?.Pathway?.Organization?.Name}
                </span>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
      <div className={styles.titleDescriptionContainer + ' headermiddle'}>
        <div className={styles.headerCenter}>
          <div className={styles.titleContainer}>
            <span className={styles.title}>
              {pathwayWrapper?.Pathway?.Name}
            </span>
            <span
              className={styles.editPathway}
              onClick={() => setIsEditPathwayFormVisible(true)}
            >
              Edit Pathway Details
            </span>
          </div>
          <div className={styles.saveButtonWrapper}>
            <Button
              type={Type.LINK}
              onClick={noop}
              text="Exit Without Saving"
            />
            <Button
              className={styles.saveButtonSpecification}
              key="save"
              onClick={savePathwayWrapper}
              text="save"
              type="selection"
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
          </div>
        </div>

        <Col className={styles.conflictComponent}>{ApprovedComponent}</Col>
      </div>
      <div className={styles.helpContainer + ' headerright'}>
        <FontAwesomeIcon
          icon={faCircleQuestion}
          className={styles.imgDimensions}
        />
      </div>
    </div>
  );
};

export default Header;
