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

import DebounceSelect from './debounceSelect';

import styles from './index.module.scss';
import { PathwayWrapperEntity } from './model';
import { getHasProgressionModel } from './state/actions';

interface OccupationValue {
  label: string;
  value: string;
  RowId?: string;
  Id?: number;
  CodedNotation?: string;
  Name?: string;
  Description?: string;
  URI?: string;
}

const AddPathwayForm = () => {
  const [addPathwayFormFields, setAddPathwayFormFields] = useState<any>(
    new PathwayWrapperEntity()
  );
  const [selectedProgressionModelValue, setSelectedProgressionModelValue] =
    useState<string>('');
  const [allProgressionModel, setAllProgressionModel] = useState<[]>([]);
  const [allOccupationTypeData, setAllOccupationTypeData] = useState<[]>([]);
  const [occupationSelectedValue, setOccupationSelectedValue] = useState<
    OccupationValue[]
  >([]);
  const [allIndustryTypeData, setAllIndustryTypeData] = useState<[]>([]);
  const [industrySelectedValue, setIndustrySelectedValue] = useState<
    OccupationValue[]
  >([]);
  const [checkboxValues, setCheckboxvalues] = useState<any>({
    progressionModel: false,
    conceptSchema: false,
    furtherDetails: false,
  });
  const dispatch = useDispatch();

  useEffect(() => {
    const updatedData = { ...addPathwayFormFields };

    if (occupationSelectedValue.length > 0) {
      updatedData.occupationType = occupationSelectedValue;
    }
    if (industrySelectedValue.length > 0) {
      updatedData.industryType = industrySelectedValue;
    }
    setAddPathwayFormFields(updatedData);
  }, [occupationSelectedValue, industrySelectedValue]);

  const allHasProgressionModel = useSelector(
    (state: any) => state.addPathwayFormReducer.allHasProgressionModel
  );

  useEffect(() => {
    if (allHasProgressionModel.valid) {
      setAllProgressionModel(allHasProgressionModel.data?.Results);
    }
  }, [allHasProgressionModel.data]);

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

  console.log('addPathwayFormFields -->', addPathwayFormFields);

  const onSelectChangeHandler = (e: any, name: string) => {
    const updatedData = { ...addPathwayFormFields };
    if (name === 'keyword') {
      updatedData[name] = e;
    }
    if (name === 'subject') {
      updatedData[name] = e;
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

  async function fetchOccupationList(e: string): Promise<any[]> {
    const data = new FormData();
    data.append('json', JSON.stringify({ Keywords: e }));

    return fetch(
      'https://sandbox.credentialengine.org/publisher/PathwayBuilderApi/Search/Codes/OccupationType',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: data,
      }
    )
      .then((response: any) => response.clone().json())
      .then((body: any) => {
        const updatedBody = body.Data.Results.map((dta: any) => ({
          Name: dta.Name,
          Description: dta.Description,
          URI: dta.URI,
          CodedNotation: dta.CodedNotation,
          Id: dta.Id,
          RowId: dta.RowId,
          label: dta.Name,
          value: dta.Name,
        }));
        setAllOccupationTypeData(updatedBody);
        return updatedBody;
      });
  }

  async function fetchIndustryList(e: string): Promise<any[]> {
    const data = new FormData();
    data.append('json', JSON.stringify({ Keywords: e }));

    return fetch(
      'https://sandbox.credentialengine.org/publisher/PathwayBuilderApi/Search/Codes/IndustryType',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: data,
      }
    )
      .then((response: any) => response.clone().json())
      .then((body: any) => {
        const updatedBody = body.Data.Results.map((dta: any) => ({
          Name: dta.Name,
          Description: dta.Description,
          URI: dta.URI,
          CodedNotation: dta.CodedNotation,
          Id: dta.Id,
          RowId: dta.RowId,
          label: dta.Name,
          value: dta.Name,
        }));
        setAllIndustryTypeData(updatedBody);
        return updatedBody;
      });
  }

  const onDebounceSelectHnadler = (e: any, name: string) => {
    if (name === 'occupation') {
      const filteredOccupations = allOccupationTypeData.filter(
        (data: any) => data.Name === e.value
      );

      setOccupationSelectedValue((prevState: any) => [
        ...prevState,
        ...filteredOccupations,
      ]);
    }
    if (name === 'industry') {
      const filteredIndustry = allIndustryTypeData.filter(
        (data: any) => data.Name === e.value
      );

      setIndustrySelectedValue((prevState: any) => [
        ...prevState,
        ...filteredIndustry,
      ]);
    }
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
              <DebounceSelect
                mode="multiple"
                value={industrySelectedValue}
                placeholder="Select Industry"
                fetchOptions={fetchIndustryList}
                onSelect={(e: any) => onDebounceSelectHnadler(e, 'industry')}
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
              <DebounceSelect
                mode="multiple"
                value={occupationSelectedValue}
                placeholder="Select Occupations"
                fetchOptions={fetchOccupationList}
                onSelect={(e: any) => onDebounceSelectHnadler(e, 'occupation')}
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
                mode="tags"
                placeholder="Select Subjects"
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
