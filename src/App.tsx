import React, { useState } from 'react';

import Button from './components/button';
import { Type } from './components/button/type';
import CustomDrawer from './components/customDrawer';
import MainContainer from './components/mainContainer';
import Modal from './components/modal';
import RightPanel from './components/rightPanel';
import AddPathwayForm from './screens/addPathwayForm';
import CreatePathway from './screens/createPathway/createPathway';
import HomePage from './screens/homePage';
import PreSelectResourceCreatePath from './screens/preSelectResourceCreatePath';
import SelectDestination from './screens/selectDestination';
import SelectOrganisation from './screens/selectOrganisation';

const App = () => {
  const [isrightPanelDrawerVisible, setRightPanelDrawerVisible] =
    useState<boolean>(false);
  const [isCreatePathwayVisible, setIsCreatePathwayVisible] =
    useState<boolean>(false);
  const [isAddPathwayFormVisible, setIsAddPathwayFormVisible] =
    useState<boolean>(false);
  const [isAddPathwayDestinationVisible, setIsAddPathwayDestinationVisible] =
    useState<boolean>(false);
  const [isSelectOrganizationsVisble, setsSelectOrganizationsVisble] =
    useState<boolean>(true);
  const [visible, setvisible] = useState<boolean>(false);

  const handlevisible = () => {
    setvisible(!visible);
  };
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
        <div style={{ textAlign: 'center' }}>
          <button onClick={handlevisible}>handlevisible</button>
        </div>
        <Modal
          width={700}
          visible={visible}
          onOk={oncreatePathwayOkHandler}
          onCancel={() => setvisible(false)}
          title="Pre-Select Resource to Create Your Pathway"
          footer={[
            <div className="flex" key="1234">
              <Button
                type={Type.PRIMARY}
                onClick={selectOrgOkHandler}
                text="Done Adding"
              />
              <Button type="outline" onClick={selectOrgOkHandler} text="Skip" />
            </div>,
          ]}
        >
          <PreSelectResourceCreatePath />
        </Modal>
        <Modal
          visible={isCreatePathwayVisible}
          onOk={oncreatePathwayOkHandler}
          onCancel={onCreatePathwayCancelHandler}
          title="Add a Pathway"
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
              />
            </>,
          ]}
        >
          <SelectOrganisation />
        </Modal>
      </MainContainer>
    </div>
  );
};

export default App;
