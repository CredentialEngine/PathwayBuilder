import { Row, Col, Form, Divider } from 'antd';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import AutoCompleteBox from '../../components/autoComplete';

import CheckBox from '../../components/formFields/checkbox';
import InputBox from '../../components/formFields/inputBox';

import MultiSelect from '../../components/formFields/multiSelect';

import Textarea from '../../components/formFields/textarea';
import { SelectAutoCompleteProps } from '../../utils/selectProps';

import styles from './index.module.scss';
import { PathwayWrapperEntity } from './model';
import {
  getHasProgressionModel,
  getIndustryTypeCodeRequest,
  getOccupationTypeCodeRequest,
} from './state/actions';

const AddPathwayForm = () => {
  const [addPathwayFormFields, setAddPathwayFormFields] = useState<any>(
    new PathwayWrapperEntity()
  );
  const [selectedProgressionModelValue, setSelectedProgressionModelValue] =
    useState<string>('');
  const [allProgressionModel, setAllProgressionModel] = useState<[]>([]);
  const [allOccupationTypeData, setAllOccupationTypeData] = useState<[]>([]);

  const [checkboxValues, setCheckboxvalues] = useState<any>({
    progressionModel: false,
    conceptSchema: false,
    furtherDetails: false,
  });
  const dispatch = useDispatch();
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

  const allHasProgressionModel = useSelector(
    (state: any) => state.addPathwayFormReducer.allHasProgressionModel
  );

  const allOccupationTypeCode = useSelector(
    (state: any) => state.addPathwayFormReducer.allOccupationTypeCode
  );

  useEffect(() => {
    if (allHasProgressionModel.valid) {
      setAllProgressionModel(allHasProgressionModel.data?.Results);
    }
    if (allOccupationTypeCode.valid) {
      setAllOccupationTypeData(
        allOccupationTypeCode.data?.Results.map((dta: any) => ({
          ...dta,
          label: dta.Name,
          title: dta.Name,
        }))
      );
    }
  }, [allHasProgressionModel.data, allOccupationTypeCode.data]);

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
    const updatedData = { ...addPathwayFormFields };

    if (name === 'industryType') {
      dispatch(getIndustryTypeCodeRequest(e));

      const filteredIndustry = companyList.filter((company: any) =>
        e.includes(company.key)
      );
      updatedData[name] = filteredIndustry;
    }
    if (name === 'keyword') {
      const filteredKeywords = companyList.filter((company: any) =>
        e.includes(company.key)
      );
      if (!_.isEmpty(filteredKeywords)) {
        updatedData[name] = e;
      } else {
        updatedData[name] = filteredKeywords;
      }
    }
    if (name === 'occupationType') {
      // dispatch(getOccupationTypeCodeRequest(e));

      const filteredOccupations = allOccupationTypeData.filter((company: any) =>
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

  const onProgressionModelSearchHandler = (e: any) => {
    dispatch(getHasProgressionModel(e));
  };

  const onProgressionModelSelectHandler = (e: any) => {
    const selectedProgressionModel = allProgressionModel.filter(
      (model: any) => model.Name === e
    );
    setSelectedProgressionModelValue(_.get(selectedProgressionModel, '0').Name);
    setAddPathwayFormFields({
      ...addPathwayFormFields,
      hasProgressionModel: selectedProgressionModel,
    });
  };

  const onSelectSearchHandler = (e: any, name: string) => {
    if (name === 'occupationType') {
      dispatch(getOccupationTypeCodeRequest(e));
    }
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
                onSearch={(e) => onSelectChangeHandler(e, 'industryType')}
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
                options={allOccupationTypeData}
                optionLabelProp="label"
                // value={['abc', 'xyz']}
                onSelect={(e: any) =>
                  onSelectChangeHandler(e, 'occupationType')
                }
                onSearch={(e) => onSelectSearchHandler(e, 'occupationType')}
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
                <AutoCompleteBox
                  {...SelectAutoCompleteProps(
                    allProgressionModel,
                    selectedProgressionModelValue,
                    'Name',
                    'Name'
                  )}
                  placeholder="Start typing to choose a Progression Model"
                  onSearch={onProgressionModelSearchHandler}
                  onSelect={(e: any) => onProgressionModelSelectHandler(e)}
                />
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
