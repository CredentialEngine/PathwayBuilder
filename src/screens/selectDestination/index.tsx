import { Row, Col } from 'antd';
import React from 'react';

import Button from '../../components/button';

const SelectDestination = () => (
  <>
    <h3>Add Component</h3>
    <h4>Lorem ipsum dolor sit amet consectetur adipisicing elit.</h4>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum commodi
      adipisci omnis accusamus velit ad nulla, quisquam, culpa esse nisi unde
      nemo doloremque aut architecto ratione iure nihil impedit ullam!
    </p>
    <Row gutter={20}>
      <Col span="12">
        <img
          src="https://media.istockphoto.com/photos/mountain-landscape-picture-id517188688?k=20&m=517188688&s=612x612&w=0&h=i38qBm2P-6V4vZVEaMy_TaTEaoCMkYhvLCysE7yJQ5Q="
          alt=""
        />
        <div style={{ textAlign: 'center', margin: '15px 0' }}>
          <Button text="Start with Destination" type="primary" />
        </div>
      </Col>
      <Col span="12">
        <img
          src="https://media.istockphoto.com/photos/mountain-landscape-picture-id517188688?k=20&m=517188688&s=612x612&w=0&h=i38qBm2P-6V4vZVEaMy_TaTEaoCMkYhvLCysE7yJQ5Q="
          alt=""
        />
        <div style={{ textAlign: 'center', margin: '15px 0' }}>
          <Button text="Start with Destination" type="primary" />
        </div>
      </Col>
    </Row>
  </>
);

export default SelectDestination;
