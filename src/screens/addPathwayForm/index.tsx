import { Row, Col, Form, Divider } from 'antd';
import React, { useState } from 'react';

import AutoCompleteBox from '../../components/autoComplete';

import CheckBox from '../../components/formFields/checkbox';
import InputBox from '../../components/formFields/inputBox';

import MultiSelect from '../../components/formFields/multiSelect';

import Textarea from '../../components/formFields/textarea';

import { Selecteprops } from '../../utils/selectProps';

import styles from './index.module.scss';

const AddPathwayForm = () => {
  const [isProgressionFieldVisible, setProgressionFieldVisible] =
    useState<boolean>(false);
  const companyList = [
    {
      key: 1,
      title: 'Company',
    },
  ];

  const onCheckBoxChangeHandler = () => {
    setProgressionFieldVisible(!isProgressionFieldVisible);
  };

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
              <InputBox
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
          <Col span={24}>
            <Form.Item
              label="Occupation Types"
              className="swNoMargin"
              wrapperCol={{ span: 24 }}
              labelCol={{ span: 24 }}
              required={true}
              validateTrigger="onBlur"
            >
              <MultiSelect
                {...Selecteprops(companyList, 'selectOccupation')}
                placeholder="Select Oppucation Types"
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Subjects"
              className="swNoMargin"
              wrapperCol={{ span: 24 }}
              labelCol={{ span: 24 }}
              required={true}
              validateTrigger="onBlur"
            >
              <MultiSelect
                {...Selecteprops(companyList, 'selectOccupation')}
                placeholder="Select Subjects"
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Subject Website"
              className="swNoMargin"
              wrapperCol={{ span: 24 }}
              labelCol={{ span: 24 }}
              required={true}
              validateTrigger="onBlur"
            >
              <InputBox
                placeholder="add a URL"
                maxLength={75}
                value="add a URL"
              />
            </Form.Item>
          </Col>
          <Divider className={styles.divider} />
          <Col span={24}>
            <CheckBox
              onChange={onCheckBoxChangeHandler}
              checked={isProgressionFieldVisible}
              label="This Pathway Contains a Progression Model"
            />
          </Col>
          {!!isProgressionFieldVisible && (
            <Col span={24}>
              <Form.Item
                label="Progression Model"
                className="swNoMargin"
                wrapperCol={{ span: 24 }}
                labelCol={{ span: 24 }}
                required={true}
                validateTrigger="onBlur"
              >
                <AutoCompleteBox placeholder="Start typing to choose a Progression Model" />
              </Form.Item>
            </Col>
          )}
          <Divider className={styles.divider} />
          <Col span={24}>
            <CheckBox
              onChange={onCheckBoxChangeHandler}
              checked={isProgressionFieldVisible}
              label="This Pathway Contains a Concept Schemes"
            />
          </Col>
          <Divider className={styles.divider} />
          <Col span={24}>
            <CheckBox
              onChange={onCheckBoxChangeHandler}
              checked={isProgressionFieldVisible}
              label="This Pathway Contains further Details"
            />
          </Col>
          <Divider className={styles.divider} />
        </Row>
      </Form>
    </>
  );
};

export default AddPathwayForm;
