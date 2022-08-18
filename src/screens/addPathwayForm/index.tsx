import { Row, Col, Form, Divider } from 'antd';
import React, { useState } from 'react';

import AutoCompleteBox from '../../components/autoComplete';

import CheckBox from '../../components/formFields/checkbox';
import InputBox from '../../components/formFields/inputBox';

import MultiSelect from '../../components/formFields/multiSelect';

import Textarea from '../../components/formFields/textarea';

import styles from './index.module.scss';
import { PathwayWrapperEntity } from './model';

const AddPathwayForm = () => {
  const [addPathwayFormFields, setAddPathwayFormFields] = useState<any>(
    new PathwayWrapperEntity()
  );
  const [checkboxValues, setCheckboxvalues] = useState<any>({
    progressionModel: false,
    conceptSchema: false,
    furtherDetails: false,
  });

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
  const onCheckBoxChangeHandler = (e: any) => {
    const { name, checked } = e.target;
    setCheckboxvalues({ ...checkboxValues, [name]: checked });
  };

  const onInputChangeHandler = (e: any) => {
    const updatedData = { ...addPathwayFormFields };
    const { name, value } = e.target;
    updatedData[name] = value;
    setAddPathwayFormFields(updatedData);
  };

  const onSelectChangeHandler = (e: any, name: string) => {
    console.log(e, 'asdasdasdas');

    const updatedData = { ...addPathwayFormFields };

    if (name === 'industryType') {
      const filteredIndustry = companyList.filter((company: any) =>
        e.includes(company.key)
      );
      updatedData[name] = filteredIndustry;
    }
    if (name === 'keyword') {
      const filteredKeywords = companyList.filter((company: any) =>
        e.includes(company.key)
      );
      updatedData[name] = filteredKeywords;
    }
    if (name === 'occupationType') {
      const filteredOccupations = companyList.filter((company: any) =>
        e.includes(company.key)
      );
      updatedData[name] = filteredOccupations;
    }
    if (name === 'subject') {
      const filteredOccupations = companyList.filter((company: any) =>
        e.includes(company.key)
      );
      updatedData[name] = filteredOccupations;
    }
    setAddPathwayFormFields(updatedData);
  };

  return (
    <>
      <Form className={styles.addPathwayForm}>
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
                name="name"
                onChange={onInputChangeHandler}
                value={addPathwayFormFields?.pathway?.name}
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
                name="description"
                onChange={onInputChangeHandler}
                value={addPathwayFormFields.description}
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
                placeholder="Select Industry Types"
                options={companyList}
                optionLabelProp="label"
                onChange={(e) => onSelectChangeHandler(e, 'industryType')}
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
                mode="tags"
                placeholder="Add Keywords"
                options={companyList}
                optionLabelProp="label"
                onChange={(e) => onSelectChangeHandler(e, 'keyword')}
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
                placeholder="Select Occupation Types"
                options={companyList}
                optionLabelProp="label"
                onChange={(e) => onSelectChangeHandler(e, 'occupationType')}
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
                placeholder="Select Subjects"
                options={companyList}
                optionLabelProp="label"
                onChange={(e) => onSelectChangeHandler(e, 'subject')}
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
                value={addPathwayFormFields.subjectWebpage}
                name="subjectWebpage"
                onChange={onInputChangeHandler}
              />
            </Form.Item>
          </Col>
          <Divider className={styles.divider} />
          <Col span={24}>
            <CheckBox
              onChange={onCheckBoxChangeHandler}
              checked={checkboxValues.progressionModel}
              name="progressionModel"
              label="This Pathway Contains a Progression Model"
            />
          </Col>
          {!!checkboxValues.progressionModel && (
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
              checked={checkboxValues.conceptSchema}
              name="conceptSchema"
              label="This Pathway Contains a Concept Schemes"
            />
          </Col>
          <Divider className={styles.divider} />
          <Col span={24}>
            <CheckBox
              onChange={onCheckBoxChangeHandler}
              checked={checkboxValues.furtherDetails}
              name="furtherDetails"
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
