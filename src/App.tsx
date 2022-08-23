import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.scss';

import Button from './components/button';
import { Type } from './components/button/type';
import CustomDrawer from './components/customDrawer';
import MainContainer from './components/mainContainer';
import Modal from './components/modal';
import RightPanel from './components/rightPanel';
import AddPathwayForm from './screens/addPathwayForm';
import CreatePathway from './screens/createPathway/createPathway';
import HomePage from './screens/homePage';
import SelectDestination from './screens/selectDestination';
import SelectOrganisation from './screens/selectOrganisation';
import { getCurrentUserDataRequest } from './states/actions';

const App = () => {
  const dispatch = useDispatch();
  const appState = useSelector((state: any) => state.app);

  const [isrightPanelDrawerVisible, setRightPanelDrawerVisible] =
    useState<boolean>(false);
  const [isCreatePathwayVisible, setIsCreatePathwayVisible] =
    useState<boolean>(false);
  const [isAddPathwayFormVisible, setIsAddPathwayFormVisible] =
    useState<boolean>(false);
  const [isAddPathwayDestinationVisible, setIsAddPathwayDestinationVisible] =
    useState<boolean>(false);
  const [isSelectOrganizationsVisble, setsSelectOrganizationsVisble] =
    useState<boolean>(false);
  const [selectedOrganisationValue, setSelectedOrganisationValue] =
    useState('');

  const [organisationList, setOrganisationList] = useState<any>([]);

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

  const onAddPathwayOkHandler = () => {
    setIsAddPathwayFormVisible(false);
    setIsAddPathwayDestinationVisible(true);
  };

  const onAddPathwayCancelHandler = () => {
    setIsAddPathwayFormVisible(false);
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

  return (
    <div>
      <MainContainer>
        <HomePage
          isLeftPanelVisible={
            !isrightPanelDrawerVisible &&
            !isCreatePathwayVisible &&
            !isAddPathwayFormVisible &&
            !isAddPathwayDestinationVisible &&
            !isSelectOrganizationsVisble
              ? true
              : false
          }
        />
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
          onOk={onAddPathwayOkHandler}
          onCancel={onAddPathwayCancelHandler}
          title="Add a Pathway"
        >
          <AddPathwayForm />
        </Modal>
        <CustomDrawer
          width="35%"
          visible={isrightPanelDrawerVisible}
          onClose={() => setRightPanelDrawerVisible(false)}
          footer={[]}
        >
          <RightPanel onCloseHandler={onCloseHandler} />
        </CustomDrawer>

        <Modal visible={isAddPathwayDestinationVisible} title="" footer={[]}>
          <SelectDestination
            setIsAddPathwayDestinationVisible={
              setIsAddPathwayDestinationVisible
            }
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
    </div>
  );
};

export default App;
