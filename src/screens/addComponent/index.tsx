import { faCubes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Form, Row } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { noop } from 'lodash';
import React from 'react';

import Dropdown from '../../components/formFields/dropdown';
import InputBox from '../../components/formFields/inputBox';
import SearchBox from '../../components/formFields/searchBox';

const AddComponent: React.FC = () => (
  <div>
    <h3>Add Component</h3>
    <div style={{ display: 'flex', marginBottom: '10px' }}>
      <FontAwesomeIcon
        icon={faCubes}
        style={{ height: '15px', color: 'blue' }}
        color="black"
      />
      <h4>Component Condition</h4>
    </div>
    <Form.Item>
      <label>Parent Component</label>
      <InputBox onChange={undefined} placeholder="" maxLength={0} value="" />
    </Form.Item>
    <Form.Item>
      <label>Condition Description</label>
      <TextArea onChange={noop} placeholder="" maxLength={0} value="" />
    </Form.Item>
    <Row gutter={20}>
      <Col span="10">
        <Form.Item>
          <InputBox
            onChange={noop}
            placeholder="RequiredNumber"
            value=""
            disabled
          />
        </Form.Item>
      </Col>
      <Col span="10">
        <Form.Item>
          <InputBox
            onChange={noop}
            placeholder="is equal to"
            value=""
            disabled
          />
        </Form.Item>
      </Col>
      <Col span="3">
        <Form.Item>
          <InputBox onChange={noop} placeholder="0" value="" type="number" />
        </Form.Item>
      </Col>
    </Row>
    <hr />
    <Row gutter={20}>
      <Col span="10">
        <Form.Item>
          <SearchBox placeholder="totalCredit" />
        </Form.Item>
      </Col>
      <Col span="10">
        <Form.Item>
          <Dropdown style={{ width: '100%' }} />
        </Form.Item>
      </Col>
      <Col span="3">
        <Form.Item>
          <InputBox onChange={noop} placeholder="480" value="" type="number" />
        </Form.Item>
      </Col>
    </Row>
  </div>
);

export default AddComponent;
