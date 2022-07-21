import { Row, Col } from 'antd';
import React from 'react';

import StartLeft from '../../assets/images/Start-Left.svg';
import StartRight from '../../assets/images/Start-Right.svg';
import Button from '../../components/button';

const SelectDestination = () => (
  <>
    <h3>Add a Pathway</h3>
    <h5>Choose how you would like to buid your pathway.</h5>
    <br />
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum commodi
      adipisci omnis accusamus velit ad nulla, quisquam, culpa esse nisi unde
      nemo doloremque aut architecto ratione iure nihil impedit ullam!
    </p>
    <Row gutter={20}>
      <Col span="12">
        <img src={StartLeft} alt="Start with Destination" />
        <div style={{ textAlign: 'center', margin: '15px 0' }}>
          <Button
            text="Start with Destination"
            type="primary"
            style={{ width: '100%' }}
          />
        </div>
      </Col>
      <Col span="12">
        <img src={StartRight} alt="Start with Destination" />
        <div style={{ textAlign: 'center', margin: '15px 0' }}>
          <Button
            text="Start with Destination"
            type="primary"
            style={{ width: '100%' }}
          />
        </div>
      </Col>
    </Row>
  </>
);

export default SelectDestination;
