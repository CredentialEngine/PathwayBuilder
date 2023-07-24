import { faCircleQuestion } from '@fortawesome/free-regular-svg-icons';
import { faShare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Row } from 'antd';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { TEMP_BASE_URL, IS_LOCALHOST } from '../../apiConfig/setting';

import Logo from '../../assets/images/pathwayBuilderLogo.svg';
import HelpAddingComponent from '../../screens/helpAddingComponent';
import {
  approvePathwayRequest,
  getDataForPathwayAndComponentsRequest,
  saveDataForPathwayRequest,
  savePathwaySuccess,
} from '../../states/actions';
import Button from '../button';
import { Type } from '../button/type';
import Message from '../message';
import Modal from '../modal';

import styles from './index.module.scss';

interface Props {
  setIsEditPathwayFormVisible: (a: boolean) => void;
  isLeftPanelVisible: boolean;
  isViewMode: boolean;
  extraCss: (a: boolean) => void;
  setCollapsed: (a: boolean) => void;
}
const Header = (props: Props) => {
  const {
    setIsEditPathwayFormVisible,
    isLeftPanelVisible,
    isViewMode,
    extraCss,
    setCollapsed,
  } = props;
  const pathwayWrapper = useSelector(
    (state: any) => state?.initalReducer?.mappedData
  );
  const approvePathwayResult = useSelector(
    (state: any) => state?.initalReducer?.approvePathway
  );
  const savePathwayResult = useSelector(
    (state: any) => state?.initalReducer?.savePathway
  );
  const dispatch = useDispatch();
  const [hasConflicts, setHasConflicts] = useState<boolean>(false);
  const [approveDisable, setApproveDisable] = useState<boolean>(true);
  const [conflictMessages, setConflictMessages] = useState<[]>([]);
  const [GridName, setGridName] = useState<any>();
  const [visible, setVisible] = useState(false);
  // const [loadings, setLoadings] = useState<boolean>(false);
  const [visibleHelpAddingComponent, setHelpAddingComponent] =
    useState<boolean>(false);
  const [extraCSS, setExtraCSS] = useState(false);
  // const delay = 10;
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handlePrint = () => {
    setCollapsed(true);
    setTimeout(() => window.print(), 1000);
    // window.print();
  };
  const handleCopy = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL);
    Message({
      description: 'Share URL has been copied to the clipboard.',
      type: 'success',
    });
  };

  useEffect(() => {
    if (
      savePathwayResult?.valid &&
      pathwayWrapper?.PathwayComponents?.length > 0
    ) {
      // setLoadings(false);
      Message({
        description: 'The Pathway has been saved successfully',
        type: 'success',
      });
      setHasConflicts(false);
      setConflictMessages(savePathwayResult?.data || []);
      dispatch(
        savePathwaySuccess({
          loading: false,
          data: [],
          PathwayId: savePathwayResult?.PathwayId,
          valid: true,
          error: false,
        })
      );
      setApproveDisable(false);
    } else if (savePathwayResult?.error) {
      // setLoadings(false);
      // savePathwayResult?.data?.map((message: any) =>
      //   Message({
      //     description: message,
      //     type: 'error',
      //   })
      // );
      setHasConflicts(true);
      setConflictMessages(savePathwayResult?.data || []);
      setApproveDisable(true);
    }
  }, [savePathwayResult]);

  // setTimeout(() => setLoadings(false), delay * 1000);

  useEffect(() => {
    if (approvePathwayResult?.error) {
      approvePathwayResult?.data?.Messages?.map((message: any) =>
        Message({
          description: message,
          type: 'error',
        })
      );
    } else if (approvePathwayResult?.valid) {
      Message({
        description: 'The Pathway has been Approved successfully',
        type: 'success',
      });
    }
  }, [approvePathwayResult]);
  const ApprovePathway = () => {
    if (!hasConflicts) {
      dispatch(approvePathwayRequest(pathwayWrapper?.Pathway?.Id)),
        setVisible(false);
    }
  };

  const onApproverHandler = () => {
    dispatch(saveDataForPathwayRequest(pathwayWrapper));
    setTimeout(() => {
      if (!hasConflicts) {
        Modal.confirm({
          cancelText: 'No',
          okText: 'Yes',
          visible,
          title: 'Are you sure you want to Approve the Pathway?',
          onOk: () => ApprovePathway(),
        });
      }
    }, 25);
  };

  const conflictHandler = () => {
    conflictMessages?.map((message: any) =>
      Message({
        description: message,
        type: 'error',
      })
    );
  };
  const ApprovedComponent = (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Button
          type={Type.PRIMARY}
          onClick={() => conflictHandler()}
          text={`show ${conflictMessages?.length} conflicts`}
          disabled={!hasConflicts}
        />
      </div>
      <div style={{ display: 'flex', position: 'relative' }}>
        <Button
          type={Type.PRIMARY}
          className={styles.approveButtonSpecification}
          onClick={onApproverHandler}
          iconOnTop={conflictMessages?.length > 0 ? true : false}
          disabled={approveDisable || isViewMode}
          text="Approve"
        />
      </div>
    </div>
  );
  function addExtraCSSClick() {
    if (extraCSS !== true) {
      extraCss(true);
      setExtraCSS(true);
    } else {
      extraCss(false);
      setExtraCSS(false);
    }
  }
  useEffect(() => {
    if (extraCSS == true) {
      setGridName('Grid Off');
    } else {
      setGridName('Grid On');
    }
  });

  useEffect(() => {
    if (!isViewMode && !IS_LOCALHOST) {
      let interval: any;
      const counter = 50000;
      if (pathwayWrapper?.Pathway?.Name !== '' && isLeftPanelVisible) {
        interval = setTimeout(() => {
          const pathwayModel =
            pathwayWrapper?.Pathway?.HasProgressionModel?.length > 0;
          if (pathwayModel) {
            dispatch(saveDataForPathwayRequest(pathwayWrapper));
          } else {
            const updatedPathwayWrapper = { ...pathwayWrapper };
            updatedPathwayWrapper.PathwayComponents =
              updatedPathwayWrapper.PathwayComponents.map((card: any) => {
                const { HasProgressionLevel, ...restProps } = card;
                HasProgressionLevel;
                return { ...restProps };
              });
            dispatch(saveDataForPathwayRequest(updatedPathwayWrapper));
          }
          //dispatch(saveDataForPathwayRequest(pathwayWrapper));
        }, counter);
        return () => clearTimeout(interval);
      }
    }
  }, [JSON.stringify(pathwayWrapper)]);

  const savePathwayWrapper = () => {
    Message({
      description: 'Saving the pathway',
      type: 'notice',
    });
    // setLoadings(true);
    const pathwayModel =
      pathwayWrapper?.Pathway?.HasProgressionModel?.length > 0;
    if (pathwayModel) {
      debugger;
      dispatch(saveDataForPathwayRequest(pathwayWrapper));
    } else {
      const updatedPathwayWrapper = { ...pathwayWrapper };
      updatedPathwayWrapper.PathwayComponents =
        updatedPathwayWrapper.PathwayComponents.map((card: any) => {
          const { HasProgressionLevel, ...restProps } = card;
          HasProgressionLevel;
          return { ...restProps };
        });
      dispatch(saveDataForPathwayRequest(updatedPathwayWrapper));
    }
  };

  const onEditPathwayClick = () => {
    savePathwayResult?.PathwayId &&
      dispatch(
        getDataForPathwayAndComponentsRequest(savePathwayResult?.PathwayId)
      );
    setIsEditPathwayFormVisible(true);
    //setViewModeEdit(isViewMode)
  };
  const redicrectTO = () => {
    location.href = TEMP_BASE_URL + '/pathways';
    // window.open(TEMP_BASE_URL+'/pathways', '_blank');
  };
  // const exitWithoutSaving = () => {
  //   Modal.confirm({
  //     cancelText: 'Cancel',
  //     okText: 'Exit',
  //     title:
  //       'You have unsaved changes. If you continue those changes will be lost.',
  //     onOk: () => redicrectTO(),
  //   });
  // };
  const exitWithSaving = () => {
    Modal.confirm({
      cancelText: 'No',
      okText: 'Yes',
      title:
        'Are you sure you want to exit the Pathway Builder, unsaved changes will be lost.',
      onOk: () => redicrectTO(),
    });
  };

  return (
    <>
      <div id="header" className={styles.container + ' header-container'}>
        <div className={styles.productImgLayout + ' logowrapper'}>
          <Row align="middle" style={{ width: '100%' }}>
            <Col span={4}>
              <img
                src={Logo}
                alt="logo"
                style={{ mixBlendMode: 'normal', maxWidth: '39px' }}
              />
            </Col>
            <Col span={20}>
              <Row className={styles.createNewContainer}>
                <Col span={24}>
                  <span className={styles.newPathway}>
                    {!isViewMode ? 'Pathway Builder ' : 'Pathway Viewer'}
                  </span>
                </Col>
                <Col span={24}>
                  <span className={styles.foundation}>
                    {/* {pathwayWrapper?.Pathway?.Organization?.Name} */}
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
                {pathwayWrapper?.Pathway?.Organization?.Name} -
                {pathwayWrapper?.Pathway?.Name}
              </span>
              <button
                className={styles.editPathway}
                onClick={onEditPathwayClick}
              >
                {!isViewMode ? 'Edit Pathway Details' : 'View Pathway Details'}
              </button>
            </div>
            <div className={styles.saveButtonWrapper}>
              {/* {!isViewMode && (
                <Button
                  disabled={isViewMode}
                  type={Type.LINK}
                  onClick={exitWithoutSaving}
                  text="Exit Without Saving"
                />
              )} */}
              {!isViewMode && (
                <Button
                  className={styles.saveButtonSpecification}
                  disabled={isViewMode}
                  type={Type.PRIMARY}
                  size="small"
                  onClick={() => savePathwayWrapper()}
                  key="save"
                  text="Save"
                ></Button>
              )}
              {!isViewMode && (
                <Button
                  className={styles.saveButtonSpecification}
                  disabled={isViewMode || hasConflicts}
                  type={Type.PRIMARY}
                  size="small"
                  onClick={exitWithSaving}
                  key="Exit"
                  text="Exit"
                ></Button>
              )}
            </div>
          </div>
          {!isViewMode && (
            <Col className={styles.conflictComponent}>{ApprovedComponent}</Col>
          )}
          {!isViewMode && (
            <div className={styles.dropdown}>
              <Button
                onClick={toggleDropdown}
                className={styles.approveButtonSpecification}
                type={Type.PRIMARY}
                text="Settings"
              />
              <div className={styles.dropdownOptions}>
                <div
                  className={styles.dropdownOption}
                  onClick={addExtraCSSClick}
                >
                  {GridName}
                </div>
                <div
                  className={styles.dropdownOption}
                  title="Set the Layout to landscape mode,Under more settings, set the Scale to custom and adjust the percentage to fit the pathway into a single page "
                  onClick={handlePrint}
                >
                  {' '}
                  Print <FontAwesomeIcon icon={faCircleQuestion} />
                </div>
              </div>
            </div>
          )}
          <div
            className={styles.helpContainer + ' headerright'}
            onClick={() => handleCopy()}
          >
            <FontAwesomeIcon icon={faShare} className={styles.imgDimensions} />
          </div>
        </div>
        {!isViewMode && (
          <div
            className={styles.helpContainer + ' headerright'}
            onClick={() => setHelpAddingComponent(true)}
          >
            <FontAwesomeIcon
              icon={faCircleQuestion}
              className={styles.imgDimensions}
            />
          </div>
        )}
      </div>

      <Modal
        visible={visibleHelpAddingComponent}
        title=""
        footer={[]}
        width={750}
        onCancel={() => setHelpAddingComponent(false)}
      >
        <HelpAddingComponent />
      </Modal>
    </>
  );
};
export default Header;
