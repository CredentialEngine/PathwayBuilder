import { faCubes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Form, Row } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { noop } from 'lodash';
import React from 'react';

import Button from '../../components/button';
import Dropdown from '../../components/formFields/dropdown';
import Options from '../../components/formFields/dropdown/lib/options';
import InputBox from '../../components/formFields/inputBox';
import MultiSelect from '../../components/formFields/multiSelect';

import Styles from './index.module.scss';

const companyList = [
  {
    key: 1,
    value: 'company',
    label: 'company',
    title: 'Company',
  },
  {
    key: 2,
    title: 'New Company',
    value: 'Newcompany',
    label: 'New company',
  },
];

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
        <Col span="12">
          <Form.Item>
            <label>Required Number</label>
            <InputBox
              type="number"
              onChange={undefined}
              placeholder=""
              maxLength={0}
              value=""
            />
          </Form.Item>
        </Col>
        <Col span="12">
          <Form.Item>
            <label>Logical Operator</label>
            <Dropdown defaultValue="And" showSearch={false}>
              <Options value="And">And</Options>
              <Options value="OR">OR</Options>
            </Dropdown>
          </Form.Item>
        </Col>
      </Row>
      <div className={Styles.divider}>
        <label>Constraints</label>
        <hr className="min-top" />
      </div>
      <Form
        name="dynamic_form_nest_item"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.List name="users">
          {(fields, { add }) => (
            <>
              <Row gutter={20}>
                <Col span="9">
                  <Form.Item>
                    <MultiSelect
                      placeholder="Select Industry Types"
                      options={companyList}
                      optionLabelProp="label"
                      // onChange={(e) => onSelectChangeHandler(e, 'industryType')}
                    />
                  </Form.Item>
                </Col>
                <Col span="6">
                  <Form.Item>
                    <Dropdown defaultValue="Equals" showSearch={false}>
                      <Options value="Equals">Equals</Options>
                      <Options value="Greaterthan">Greater than</Options>
                    </Dropdown>
                  </Form.Item>
                </Col>
                <Col span="9">
                  <Form.Item>
                    <MultiSelect
                      placeholder="Select Industry Types"
                      options={companyList}
                      optionLabelProp="label"
                      // onChange={(e) => onSelectChangeHandler(e, 'industryType')}
                    />
                  </Form.Item>
                </Col>
              </Row>
              {fields.map((v, i) => (
                <Row gutter={20} key={i}>
                  <Col span="9">
                    <Form.Item>
                      <MultiSelect
                        placeholder="Select Industry Types"
                        options={companyList}
                        optionLabelProp="label"
                        // onChange={(e) => onSelectChangeHandler(e, 'industryType')}
                      />
                    </Form.Item>
                  </Col>
                  <Col span="6">
                    <Form.Item>
                      <Dropdown defaultValue="Equals" showSearch={false}>
                        <Options value="Equals">Equals</Options>
                        <Options value="Greaterthan">Greater than</Options>
                      </Dropdown>
                    </Form.Item>
                  </Col>
                  <Col span="9">
                    <Form.Item>
                      <MultiSelect
                        placeholder="Select Industry Types"
                        options={companyList}
                        optionLabelProp="label"
                        // onChange={(e) => onSelectChangeHandler(e, 'industryType')}
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
