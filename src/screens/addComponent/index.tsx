import { Col, Form, Row } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { noop } from 'lodash';
import React from 'react';

import Button from '../../components/button';
import Dropdown from '../../components/formFields/dropdown';
import InputBox from '../../components/formFields/inputBox';
import SearchBox from '../../components/formFields/searchBox';
import Modal from '../../components/modal';

const AddComponent: React.FC = () => {
  const [state, setState] = React.useState(false);
  const stateOpen = () => {
    setState(!state);
  };
  const stateClose = () => {
    setState(false);
  };
  return (
    <div>
      <Button
        type="selection"
        text="state Open"
        onClick={stateOpen}
        disabled={false}
      />
      <Modal
        title="Add Component"
        visible={state}
        okText="Save Condition"
        cancelText=""
        onOk={stateClose}
        onCancel={stateClose}
        closeIcon
      >
        <Form.Item>
          <label>Parent Component</label>
          <InputBox
            onChange={undefined}
            placeholder=""
            maxLength={0}
            value=""
          />
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
          <Col span="">
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
              <InputBox
                onChange={noop}
                placeholder="0"
                value=""
                type="number"
              />
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
          <Col span="">
            <Form.Item>
              <Dropdown style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span="3">
            <Form.Item>
              <InputBox
                onChange={noop}
                placeholder="480"
                value=""
                type="number"
              />
            </Form.Item>
          </Col>
        </Row>
      </Modal>
    </div>
  );
};

export default AddComponent;
