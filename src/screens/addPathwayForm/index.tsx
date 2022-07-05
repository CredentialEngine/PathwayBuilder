import { Row, Col, Form } from 'antd';
import React from 'react';

import MultiSelect from '../../components/formFields/multiSelect';

import Textarea from '../../components/formFields/textarea';

import Textbox from '../../components/formFields/textbox';
import { Selecteprops } from '../../utils/selectProps';

const AddPathwayForm = () => {
  const companyList = [
    {
      key: 1,
      title: 'Company',
    },
  ];
  return (
    <>
      <Form>
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              label="Pathway Name"
              className="swNoMargin"
              wrapperCol={{ span: 24 }}
              labelCol={{ span: 24 }}
              required={true}
              validateTrigger="onBlur"
            >
              <Textbox
                placeholder="Add a Pathway Name"
                maxLength={75}
                value="Add a Pathway Name"
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Pathway Description"
              className="swNoMargin"
              wrapperCol={{ span: 24 }}
              labelCol={{ span: 24 }}
              required={true}
              validateTrigger="onBlur"
            >
              <Textarea
                placeholder="Add a Pathway Description"
                maxLength={200}
                value="Add a Pathway Description"
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Industry Type"
              className="swNoMargin"
              wrapperCol={{ span: 24 }}
              labelCol={{ span: 24 }}
              required={true}
              validateTrigger="onBlur"
            >
              <MultiSelect
                {...Selecteprops(companyList, 'selectCompany')}
                placeholder="Select Industry Types"
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Keywords"
              className="swNoMargin"
              wrapperCol={{ span: 24 }}
              labelCol={{ span: 24 }}
              required={true}
              validateTrigger="onBlur"
            >
              <MultiSelect
                {...Selecteprops(companyList, 'selectCompany')}
                placeholder="Add Keywords"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default AddPathwayForm;
