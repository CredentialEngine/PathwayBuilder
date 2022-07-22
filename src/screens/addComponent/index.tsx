import { faCubes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Form, Row } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { noop } from 'lodash';
import React from 'react';

import Button from '../../components/button';
import Dropdown from '../../components/formFields/dropdown';
import InputBox from '../../components/formFields/inputBox';
import SearchBox from '../../components/formFields/searchBox';

import Styles from './index.module.scss';

const AddComponent: React.FC = () => {
  const onFinish = (values: any) => {
    console.log('Received values of form:', values);
  };
  return (
    <div className={Styles.addComponentwrapper}>
      <h2>Add Component</h2>
      <div className={Styles.iconheader}>
        <span className={Styles.iconwrapper}>
          <FontAwesomeIcon
            icon={faCubes}
            style={{ height: '15px' }}
            color="black"
          />
        </span>
        <h4>Component Condition</h4>
      </div>
      <Form.Item>
        <label>Parent Component</label>
        <InputBox onChange={undefined} placeholder="" maxLength={0} value="" />
      </Form.Item>
      <Form.Item>
        <label>Condition Description</label>
        <TextArea onChange={noop} placeholder="" maxLength={0} rows={4} />
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
      <hr className="min-top" />
      <Form
        name="dynamic_form_nest_item"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.List name="users">
          {(fields, { add }) => (
            <>
              <Row gutter={20}>
                <Col span="10">
                  <Form.Item>
                    <SearchBox placeholder="totalCredit" />
                  </Form.Item>
                </Col>
                <Col span="10">
                  <Form.Item>
                    <Dropdown />
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
              {fields.map((key, i) => (
                <Row gutter={20} key={i}>
                  <Col span="10">
                    <Form.Item>
                      <SearchBox placeholder="totalCredit" />
                    </Form.Item>
                  </Col>
                  <Col span="10">
                    <Form.Item>
                      <Dropdown />
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
              ))}
              <p>
                <u onClick={() => add()} style={{ cursor: 'pointer' }}>
                  Add another constraint
                </u>
              </p>
            </>
          )}
        </Form.List>
      </Form>

      <hr />
      <Button text="Save Consition" type="primary" />
    </div>
  );
};

export default AddComponent;
