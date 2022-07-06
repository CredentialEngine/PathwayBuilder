import React from 'react';

import Header from './components/header';
import CreatePathway from './screens/createPathway/createPathway';

const App = () => (
  <div>
    <Header />
    <CreatePathway visible={true} />
  </div>
);

export default App;
