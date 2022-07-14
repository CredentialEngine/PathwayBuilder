import { Row, Col } from 'antd';
import React from 'react';
import ReactPlayer from 'react-player';

import SearchBox from '../../components/formFields/searchBox';

const HelpAddingComponent: React.FC = () => (
  <div>
    <Row gutter={20}>
      <Col span="8">
        <SearchBox />
        <h3>Adding First Component</h3>
        <p>Adding a condition</p>
        <p>Approving Pathway</p>
      </Col>
      <Col span="16">
        <h1>Adding First Component</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sint nostrum
          accusamus placeat cum eligendi accusantium recusandae mollitia, amet
          quidem quibusdam sunt rerum dicta odio perferendis dolor at asperiores
          repudiandae omnis?
        </p>
        <ReactPlayer
          height={280}
          url="https://www.youtube.com/watch?v=u2RgGv8WPN0&list=PL37ZVnwpeshGHrl2h_1hm9a03b-GXH0td"
          controls
        />
      </Col>
    </Row>
  </div>
);

export default HelpAddingComponent;
