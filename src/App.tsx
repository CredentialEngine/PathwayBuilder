import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.scss';

import Button from './components/button';
import { Type } from './components/button/type';
import CustomDrawer from './components/customDrawer';
import MainContainer from './components/mainContainer';
import Modal from './components/modal';
import RightPanel from './components/rightPanel';
import AddConditionalComponent from './screens/addComponent';
// import AddConditionalComponent from './screens/addComponent';
import AddPathwayForm from './screens/addPathwayForm';
import { PathwayWrapperEntity } from './screens/addPathwayForm/model';
import CreatePathway from './screens/createPathway/createPathway';
import HomePage from './screens/homePage';
import PreSelectResourceCreatePath from './screens/preSelectResourceCreatePath';
import SelectDestination from './screens/selectDestination';
import SelectOrganisation from './screens/selectOrganisation';
import {
  getCurrentUserDataRequest,
  updateMappedDataRequest,
} from './states/actions';

const App = () => {
  const dispatch = useDispatch();
  const appState = useSelector((state: any) => state?.initalReducer);
  const [addPathwayWrapperFields, setAddPathwayWrapeprFields] = useState<any>(
    new PathwayWrapperEntity()
  );
  const [isDestinationColumnSelected, setIsDestinationColumnSelected] =
    useState<boolean>(false);

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
  const [isSelectOrganizationsVisble, setsSelectOrganizationsVisble] =
    useState<boolean>(false);
  const [selectedOrganisationValue, setSelectedOrganisationValue] =
    useState('');

  const [organisationList, setOrganisationList] = useState<any>([]);
  const [
    isAddPathwayFormNextButtonDisable,
    setIsAddPathwayFormNextButtonDisable,
  ] = useState<boolean>(false);
  const {
    currentUserData: { data: userData },
  } = appState || {};

  useEffect(() => {
    dispatch(getCurrentUserDataRequest());
  }, []);

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
    setIsCreatePathwayVisible(false);
  };

  const onCloseHandler = () => {
    const element = document.getElementById('left-frame');
    if (element != null) {
      element.style.display = 'none';
    }
    setRightPanelDrawerVisible(false);
  };

  const selectOrgOkHandler = () => {
    setsSelectOrganizationsVisble(false);
    setIsCreatePathwayVisible(true);
  };

  useEffect(() => {
    if (organisationList && organisationList?.length > 1) {
      setsSelectOrganizationsVisble(true);
    } else {
      setIsCreatePathwayVisible(true);
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
        onClick={onCreatePathwayCancelHandler}
        text="Cancel"
        type={Type.CANCEL}
      />
    </div>
  );

  const onPreSelectResourceOkHandler = () => {
    setIsPreSelectedCreateResourceVisible(false);
    setIsAddPathwayDestinationVisible(true);
  };

  const onPreSelectResourceCancelHandler = () => {
    setIsCreatePathwayVisible(false);
  };
  const getAllPathwayFormFields = (value: any, name: string) => {
    setAddPathwayWrapeprFields({ ...addPathwayWrapperFields, [name]: value });
  };

  const onPathwaySaveHandler = () => {
    setIsPreSelectedCreateResourceVisible(false);
    setIsAddPathwayDestinationVisible(true);
    dispatch(updateMappedDataRequest(addPathwayWrapperFields));
  };

  const onAddPathwayOkHandler = () => {
    setIsAddPathwayFormVisible(false);
    setIsPreSelectedCreateResourceVisible(true);
  };

  return (
    <div>
      <MainContainer>
        <HomePage
          isLeftPanelVisible={
            // true
            !isrightPanelDrawerVisible &&
            !isCreatePathwayVisible &&
            !isAddPathwayFormVisible &&
            // !isAddPathwayDestinationVisible &&
            !isSelectOrganizationsVisble &&
            !isPreSelectedCreateResourceVisible
              ? true
              : false
          }
          setIsEditPathwayFormVisible={setIsAddPathwayFormVisible}
          isDestinationColumnSelected={isDestinationColumnSelected}
        />
        <Modal visible={false} title="" footer={[]} width={650}>
          <AddConditionalComponent />
        </Modal>
        <Modal
          visible={isCreatePathwayVisible}
          title="Add a Pathway"
          footer={createPathwayFooter()}
          width={550}
        >
          <CreatePathway />
        </Modal>
        <Modal
          visible={isAddPathwayFormVisible}
          title="Add a Pathway"
          onCancel={() => setIsAddPathwayFormVisible(false)}
          footer={[
            <>
              <Button
                type={Type.PRIMARY}
                onClick={onAddPathwayOkHandler}
                text="Next"
                disabled={!isAddPathwayFormNextButtonDisable}
              />
            </>,
          ]}
        >
          <AddPathwayForm
            getAllPathwayFormFields={getAllPathwayFormFields}
            setIsAddPathwayFormNextButtonDisable={
              setIsAddPathwayFormNextButtonDisable
            }
            addPathwayWrapperFields={addPathwayWrapperFields}
            setAddPathwayWrapeprFields={setAddPathwayWrapeprFields}
          />
        </Modal>
        <Modal
          visible={isPreSelectedCreateResourceVisible}
          onOk={onPreSelectResourceOkHandler}
          onCancel={onPreSelectResourceCancelHandler}
          width="650px"
          footer={[
            <>
              <div style={{ display: 'flex' }}>
                <Button
                  type={Type.PRIMARY}
                  onClick={onPathwaySaveHandler}
                  text="Done Adding"
                  disabled={
                    addPathwayWrapperFields.PendingComponent?.length === 0
                  }
                />
                <Button
                  type={Type.CANCEL}
                  onClick={onPreSelectResourceCancelHandler}
                  text="Skip"
                />
              </div>
            </>,
          ]}
          title="Pre-Select Resources to Create Your Pathway"
        >
          <PreSelectResourceCreatePath
            getAllPathwayFormFields={getAllPathwayFormFields}
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
            setIsAddPathwayDestinationVisible={
              setIsAddPathwayDestinationVisible
            }
            setIsDestinationColumnSelected={setIsDestinationColumnSelected}
          />
        </Modal>
        <Modal
          width={520}
          visible={isSelectOrganizationsVisble}
          onOk={selectOrgOkHandler}
          closable={false}
          footer={[
            <>
              <Button
                type={Type.PRIMARY}
                onClick={selectOrgOkHandler}
                text="Confirm"
                disabled={
                  selectedOrganisationValue === 'Select an organization'
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
          />
        </Modal>
      </MainContainer>
      {/* <Modal
        visible={isAddPathwayDestinationVisible}
        title="Add a Pathway"
        footer={[]}
      >
        <AddConditionalComponent />
      </Modal> */}
    </div>
  );
};

export default App;
