import { noop } from 'lodash';
import React, { useState } from 'react';

import Button from './components/button';

import Header from './components/header';
import Modal from './components/modal';
import AddPathwayForm from './screens/addPathwayForm';

const App = () => {
  const [isPathwayModalVisible, setPathwayModalVisibilityStatus] =
    useState<boolean>(true);
  return (
    <div>
      <Header />
      <Modal
        onCancel={() => setPathwayModalVisibilityStatus(false)}
        className="confirmModal"
        title="Add a Pathway"
        footer={[
          <div key="1" style={{ padding: '20px 0' }}>
            <Button title="Next" text="Next" onClick={noop} />
          </div>,
        ]}
        visible={isPathwayModalVisible}
      >
        <AddPathwayForm />
      </Modal>
    </div>
  );
};

export default App;
