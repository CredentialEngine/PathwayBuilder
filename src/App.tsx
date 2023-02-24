import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { IS_LOCALHOST, TEMP_BASE_URL } from './apiConfig/setting';
import './App.scss';

import Button from './components/button';
import { Type } from './components/button/type';
import CustomDrawer from './components/customDrawer';
import MainContainer from './components/mainContainer';
import Modal from './components/modal';
import RightPanel from './components/rightPanel';
import AddPathwayForm from './screens/addPathwayForm';
import { PathwayWrapperEntity } from './screens/addPathwayForm/model';
import CreatePathway from './screens/createPathway/createPathway';
import EnterDevCredentials from './screens/enterDevCredentials';
import HomePage from './screens/homePage';
import PreSelectResourceCreatePath from './screens/preSelectResourceCreatePath';
import SelectDestination from './screens/selectDestination';
import SelectOrganisation from './screens/selectOrganisation';

import TokenManager from './services/tokenManager';

import {
  getCurrentUserDataRequest,
  getDataForPathwayAndComponentsRequest,
  onFirstLoad,
  saveSelectedOrganization,
} from './states/actions';

const App = () => {
  const dispatch = useDispatch();
  const pathwayWrapper = useSelector((state: any) => state?.initalReducer);
  const [addPathwayWrapperFields, setAddPathwayWrapeprFields] = useState<any>(
    new PathwayWrapperEntity()
  );
  const [isDestinationColumnSelected, setIsDestinationColumnSelected] =
    useState<boolean>(false);
  const [
    isStartFromInitialColumnSelected,
    setIsStartFromInitialColumnSelected,
  ] = useState<boolean>(false);

  const [isrightPanelDrawerVisible, setRightPanelDrawerVisible] =
    useState<boolean>(false);
  const [isCreatePathwayVisible, setIsCreatePathwayVisible] =
    useState<boolean>(false);
  const [isAddPathwayFormVisible, setIsAddPathwayFormVisible] =
    useState<boolean>(false);
  const [
    isPreSelectedCreateResourceVisible,
    setIsPreSelectedCreateResourceVisible,
  ] = useState<boolean>(false);
  const [isAddPathwayDestinationVisible, setIsAddPathwayDestinationVisible] =
    useState<boolean>(false);
  const [isSelectOrganizationsVisible, setsSelectOrganizationsVisible] =
    useState<boolean>(false);
  const [selectedOrganisationValue, setSelectedOrganisationValue] =
    useState<any>();
  const [fromPreSelect, setFromPreselect] = useState<any>(false);
  const [skipPreSelect, setSkipPreSelect] = useState<any>(false);
  const [destinationColumnSelect, setDestinationColumnSelected] =
    useState<any>(false);

  const [organisationList, setOrganisationList] = useState<any>([]);

  const [isEditPathwayFormVisible, setIsEditPathwayFormVisible] =
    useState<boolean>(false);
  const [isDropCardAfterEditingForm, setIsDropCardAfterEditingForm] =
    useState<boolean>(false);

  const [isDevCredFormVisible, setIsDevCredFormVisible] =
    useState<boolean>(false);
  const [enteredDevCredsValue, setEnteredDevCredsValue] = useState('');
  const [isEdit, setIsEdit] = useState(false);

  const {
    currentUserData: { data: userData },
    mappedData: pathwayWrapperData,
    pathwaDataFromEdit: pathwayLoad,
  } = pathwayWrapper || {};

  const savePathwayResult = useSelector(
    (state: any) => state?.initalReducer?.savePathway
  );

  useEffect(() => {
    /* On Save Pathway We are getting PathwayId as a response so here we are set PathwayId in dataModel so 
     we can hit save endPoint on this same PathwayId */

    if (savePathwayResult.valid) {
      const updatedPathwayWrapperData = { ...pathwayWrapperData };
      const updatedPathwayData = { ...updatedPathwayWrapperData.Pathway };
      updatedPathwayData.Id = savePathwayResult.PathwayId;
      updatedPathwayWrapperData.Pathway = updatedPathwayData;
      setAddPathwayWrapeprFields(updatedPathwayWrapperData);
    }
  }, [savePathwayResult]);
  useEffect(() => {
    const url = window.location.href;
    if (url?.toLowerCase().includes('?id=')) {
      const pathwayIdFromUrl = url?.toLowerCase().split('id=').pop();
      if (pathwayIdFromUrl) {
        dispatch(
          getDataForPathwayAndComponentsRequest(parseInt(pathwayIdFromUrl))
        );
      }
      setIsEdit(true);
    } else if (IS_LOCALHOST && !enteredDevCredsValue) {
      setsSelectOrganizationsVisible(false);
      setIsDevCredFormVisible(true);
      dispatch(onFirstLoad());
    } else {
      dispatch(getCurrentUserDataRequest());
      dispatch(onFirstLoad());
    }
  }, []);

  const enterDevCredOkHandler = () => {
    // save value in TokenManager
    TokenManager.setToken(enteredDevCredsValue);
    setIsDevCredFormVisible(false);
    setsSelectOrganizationsVisible(true);

    dispatch(getCurrentUserDataRequest());
  };

  useEffect(() => {
    if (userData) {
      setOrganisationList(userData?.Organizations);
    }
  }, [userData]);

  const oncreatePathwayOkHandler = () => {
    setIsAddPathwayFormVisible(true);
    setIsCreatePathwayVisible(false);
  };

  const onCreatePathwayCancelHandler = () => {
    window.location.href = TEMP_BASE_URL;
  };

  const onCloseHandler = () => {
    const element = document.getElementById('left-frame');
    if (element != null) {
      element.style.display = 'none';
    }
    setRightPanelDrawerVisible(false);
  };

  const selectOrgOkHandler = () => {
    if (selectedOrganisationValue) {
      dispatch(saveSelectedOrganization(selectedOrganisationValue));
    }
    setsSelectOrganizationsVisible(false);
    setIsCreatePathwayVisible(true);
  };

  useEffect(() => {
    if (organisationList && organisationList?.length > 1) {
      setsSelectOrganizationsVisible(true);
    }
  }, [organisationList?.length]);

  const createPathwayFooter = () => (
    <div style={{ display: 'flex' }}>
      <Button
        onClick={oncreatePathwayOkHandler}
        text="Start Your Pathway"
        type={Type.PRIMARY}
      />
      <Button
        onClick={closeCreatePathwayModal}
        text="Cancel"
        type={Type.CANCEL}
      />
    </div>
  );

  const onPreSelectResourceCancelHandler = () => {
    setIsPreSelectedCreateResourceVisible(false);
    !fromPreSelect &&
      !!setIsDestinationColumnSelected &&
      setIsDestinationColumnSelected(true);
  };

  const closeCreatePathwayModal = () => {
    Modal.confirm({
      cancelText: 'No',
      okText: 'Yes',
      title: 'Are you sure you want to cancel.',
      onOk: () => onCreatePathwayCancelHandler(),
    });
  };

  const getSkipValueOfPreSelectResources = (skipedValue: boolean) => {
    setSkipPreSelect(skipedValue);
  };
  const destinationColumnSelected = (value: boolean) => {
    setDestinationColumnSelected(value);
  };
  return pathwayLoad?.valid ? (
    <>
      <div>
        <MainContainer>
          <HomePage
            isLeftPanelVisible={
              !isrightPanelDrawerVisible &&
              !isCreatePathwayVisible &&
              !isAddPathwayFormVisible &&
              !isSelectOrganizationsVisible &&
              !isPreSelectedCreateResourceVisible &&
              !isEditPathwayFormVisible &&
              !isDevCredFormVisible
                ? true
                : false
            }
            onClickPreselectComponent={() => {
              setIsPreSelectedCreateResourceVisible(true);
              setFromPreselect(true);
            }}
            setIsEditPathwayFormVisible={setIsEditPathwayFormVisible}
            isDestinationColumnStatus={isDestinationColumnSelected}
            isStartFromInitialColumnSelected={isStartFromInitialColumnSelected}
            setIsStartFromInitialColumnSelected={
              setIsStartFromInitialColumnSelected
            }
            setIsDestinationColumnSelected={setIsDestinationColumnSelected}
            skipPreSelect={skipPreSelect}
            destinationColumnSelect={destinationColumnSelect}
            isEditPathwayFormVisible={isEditPathwayFormVisible}
            isDropCardAfterEditingForm={isDropCardAfterEditingForm}
            setIsDropCardAfterEditingForm={setIsDropCardAfterEditingForm}
            isEdit={isEdit}
            setIsEdit={setIsEdit}
          />
          <Modal
            visible={isCreatePathwayVisible}
            title="Add a Pathway"
            footer={createPathwayFooter()}
            width={550}
            onCancel={closeCreatePathwayModal}
          >
            <CreatePathway />
          </Modal>
          <Modal
            visible={isAddPathwayFormVisible || isEditPathwayFormVisible}
            title="Add a Pathway"
            onCancel={() => {
              setIsAddPathwayFormVisible(false);
              setIsEditPathwayFormVisible(false);
            }}
            maskClosable={false}
            footer={[]}
          >
            <AddPathwayForm
              isEditPathwayFormVisible={isEditPathwayFormVisible}
              addPathwayWrapperFields={addPathwayWrapperFields}
              setAddPathwayWrapeprFields={setAddPathwayWrapeprFields}
              setIsPreSelectedCreateResourceVisible={
                setIsPreSelectedCreateResourceVisible
              }
              setIsAddPathwayFormVisible={setIsAddPathwayFormVisible}
              setIsEditPathwayFormVisible={setIsEditPathwayFormVisible}
              setIsDropCardAfterEditingForm={setIsDropCardAfterEditingForm}
            />
          </Modal>
          <Modal
            visible={isPreSelectedCreateResourceVisible}
            width="650px"
            footer={[]}
            onCancel={onPreSelectResourceCancelHandler}
            title="Pre-Select Resources to Create Your Pathway"
          >
            <PreSelectResourceCreatePath
              setIsPreSelectedCreateResourceVisible={
                setIsPreSelectedCreateResourceVisible
              }
              setIsDestinationColumnSelected={setIsDestinationColumnSelected}
              fromPreSelect={fromPreSelect}
              addPathwayWrapperFields={addPathwayWrapperFields}
              setIsAddPathwayDestinationVisible={
                setIsAddPathwayDestinationVisible
              }
              getSkipValueOfPreSelectResources={
                getSkipValueOfPreSelectResources
              }
            />
          </Modal>
          <CustomDrawer
            width="35%"
            visible={isrightPanelDrawerVisible}
            onClose={() => setRightPanelDrawerVisible(false)}
            footer={[]}
          >
            <RightPanel onCloseHandler={onCloseHandler} />
          </CustomDrawer>

          <Modal
            visible={isAddPathwayDestinationVisible}
            title="Add a Pathway"
            footer={[]}
          >
            <SelectDestination
              destinationColumnSelected={destinationColumnSelected}
              setIsAddPathwayDestinationVisible={
                setIsAddPathwayDestinationVisible
              }
              setIsDestinationColumnSelected={setIsDestinationColumnSelected}
              setIsStartFromInitialColumnSelected={
                setIsStartFromInitialColumnSelected
              }
            />
          </Modal>

          <Modal
            width={520}
            visible={isSelectOrganizationsVisible}
            onOk={selectOrgOkHandler}
            onCancel={() => {
              window.location.href = TEMP_BASE_URL;
            }}
            footer={[
              <>
                <Button
                  type={Type.PRIMARY}
                  onClick={selectOrgOkHandler}
                  text="Confirm"
                  disabled={
                    !(
                      !_.isUndefined(selectedOrganisationValue) ||
                      _.isNull(selectedOrganisationValue)
                    )
                  }
                />
              </>,
            ]}
          >
            <SelectOrganisation
              organisationList={organisationList}
              getSelectedOrganisation={(value: string) =>
                setSelectedOrganisationValue(value)
              }
              // pathwayId={pathwayId}
            />
          </Modal>

          <Modal
            visible={isDevCredFormVisible}
            title="Enter Developer Credentials"
            onOk={enterDevCredOkHandler}
            footer={[
              <>
                <Button
                  type={Type.PRIMARY}
                  onClick={enterDevCredOkHandler}
                  text="Save"
                  disabled={
                    !(
                      !_.isUndefined(enteredDevCredsValue) ||
                      _.isNull(enteredDevCredsValue)
                    )
                  }
                />
              </>,
            ]}
          >
            <EnterDevCredentials
              getEnteredDevCreds={(value: string) =>
                setEnteredDevCredsValue(value)
              }
            />
          </Modal>
        </MainContainer>
      </div>
    </>
  ) : null;
};

export default App;
