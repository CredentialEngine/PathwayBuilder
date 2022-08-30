import { Row, Col, Form, Divider } from 'antd';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import AutoCompleteBox from '../../components/autoComplete';

import CheckBox from '../../components/formFields/checkbox';
import InputBox from '../../components/formFields/inputBox';
import MultiSelect from '../../components/formFields/multiSelect';
import Textarea from '../../components/formFields/textarea';
import fetchProgressionList from '../../utils/fetchSearchResponse';
import { SelectAutoCompleteProps } from '../../utils/selectProps';

import DebounceSelect from './debounceSelect';

import styles from './index.module.scss';
import { PathwayEntity } from './model';
import {
  getDataForProgressionLevelSuccess,
  getDataForProgressionModelSuccess,
} from './state/actions';

interface ComponentTypesValue {
  label: string;
  value: string;
  RowId?: string;
  Id?: number;
  CodedNotation?: string;
  Name?: string;
  Description?: string;
  URI?: string;
}

export interface Props {
  getAllPathwayFormFields: (a: any, b: string) => void;
  setIsAddPathwayFormNextButtonDisable: (a: boolean) => void;
  addPathwayWrapperFields?: any;
  setAddPathwayWrapeprFields: (a: any) => void;
}

const AddPathwayForm: React.FC<Props> = ({
  getAllPathwayFormFields,
  setIsAddPathwayFormNextButtonDisable,
  addPathwayWrapperFields,
  setAddPathwayWrapeprFields,
}) => {
  const [addPathwayFormFields, setAddPathwayFormFields] = useState<any>(
    new PathwayEntity()
  );
  const [selectedProgressionModelValue, setSelectedProgressionModelValue] =
    useState<string>('');

  const [allProgressionModel, setAllProgressionModel] = useState<[]>([]);
  const [allProgressionLevel, setAllProgressionLevel] = useState<[]>([]);
  const [allOccupationTypeData, setAllOccupationTypeData] = useState<[]>([]);
  const [occupationSelectedValue, setOccupationSelectedValue] = useState<
    ComponentTypesValue[]
  >([]);
  const [allIndustryTypeData, setAllIndustryTypeData] = useState<[]>([]);
  const [industrySelectedValue, setIndustrySelectedValue] = useState<
    ComponentTypesValue[]
  >([]);
  const [allInstructionalProgramTypeData, setAllInstructionalProgramTypeData] =
    useState<[]>([]);
  const [
    instructionalProgramSelectedValue,
    setInstructionalProgramSelectedValue,
  ] = useState<ComponentTypesValue[]>([]);

  const [checkboxValues, setCheckboxvalues] = useState<any>({
    progressionModel: false,
    conceptSchema: false,
    furtherDetails: false,
  });

  const [isTouched, setisTouched] = useState({
    Name: false,
    Description: false,
    SubjectWebpage: false,
    Organization: false,
  });

  const [searchFilterValue, setSearchFilterValue] = useState<any>({
    keywords: '',
    skip: 0,
    Take: 20,
    sort: '',
    filters: [
      {
        URI: 'meta:pathwayComponentType',
        ItemsText: [],
      },
    ],
  });

  const dispatch = useDispatch();

  const userOrganizations = useSelector(
    (state: any) => state.initalReducer?.currentUserData?.data?.Organizations
  );

  useEffect(() => {
    if (!_.isEmpty(addPathwayFormFields))
      getAllPathwayFormFields(addPathwayFormFields, 'Pathway');

    setIsAddPathwayFormNextButtonDisable(
      !_.isEmpty(addPathwayFormFields.Name) &&
        !_.isEmpty(addPathwayFormFields.Description) &&
        !_.isEmpty(addPathwayFormFields.SubjectWebpage)
    );
  }, [addPathwayFormFields]);

  useEffect(() => {
    const updatedData = { ...addPathwayFormFields };

    if (occupationSelectedValue.length > 0) {
      updatedData.OccupationType = occupationSelectedValue;
    }
    if (industrySelectedValue.length > 0) {
      updatedData.IndustryType = industrySelectedValue;
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
    if (userOrganizations?.length > 0) {
      setAddPathwayFormFields({
        ...addPathwayFormFields,
        Organization: userOrganizations[0],
      });
    }
  }, [allHasProgressionModel.data, userOrganizations]);

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
    if (name === 'Keyword') {
      updatedData[name] = e;
    }
    if (name === 'Subject') {
      updatedData[name] = e;
    }
    setAddPathwayFormFields(updatedData);
  };

  const onProgressionModelSearchHandler = (e: any) => {
    setSearchFilterValue({ ...searchFilterValue, keywords: e });
  };

  useEffect(() => {
    if (searchFilterValue.keywords !== '') {
      getHasProgressionModel();
    }
  }, [searchFilterValue]);

  const getHasProgressionModel = async () => {
    const result = await fetchProgressionList(searchFilterValue);
    if (result?.updatedProgressionModel.length > 0) {
      dispatch(
        getDataForProgressionModelSuccess(result?.updatedProgressionModel)
      );
      setAllProgressionModel(result?.updatedProgressionModel);
    }
    if (result?.updatedProgressionLevel.length > 0) {
      dispatch(
        getDataForProgressionLevelSuccess(result?.updatedProgressionLevel)
      );
      setAllProgressionLevel(result?.updatedProgressionLevel);
    }
  };

  const onProgressionModelSelectHandler = (e: any) => {
    const selectedProgressionModel = allProgressionModel.filter(
      (model: any) => model.Name === e
    );
    const selectedProgressionModelCTID = _.get(
      selectedProgressionModel,
      '0'
    ).CTID;

    const selectedProgressionLevel = allProgressionLevel.filter(
      (level: any) => level.InProgressionModel === selectedProgressionModelCTID
    );

    const updatedAddPathwayWrapperFields = { ...addPathwayWrapperFields };
    updatedAddPathwayWrapperFields.ProgressionModels = selectedProgressionModel;
    updatedAddPathwayWrapperFields.ProgressionLevels = selectedProgressionLevel;
    setAddPathwayWrapeprFields(updatedAddPathwayWrapperFields);
    setSelectedProgressionModelValue(_.get(selectedProgressionModel, '0').Name);
    setAddPathwayFormFields({
      ...addPathwayFormFields,
      HasProgressionModel: [_.get(selectedProgressionModel, '0').RowId],
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

  async function fetchInstructionalProgramList(e: string): Promise<any[]> {
    const data = new FormData();
    data.append('json', JSON.stringify({ Keywords: e }));

    return fetch(
      'https://sandbox.credentialengine.org/publisher/PathwayBuilderApi/Search/Codes/InstructionalProgramType',
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
        setAllInstructionalProgramTypeData(updatedBody);
        return updatedBody;
      });
  }
  const onDebounceSelectHnadler = (e: any, name: string) => {
    if (name === 'Occupation') {
      const filteredOccupations = allOccupationTypeData.filter(
        (data: any) => data.Name === e.value
      );

      setOccupationSelectedValue((prevState: any) => [
        ...prevState,
        ...filteredOccupations,
      ]);
    }
    if (name === 'Industry') {
      const filteredIndustry = allIndustryTypeData.filter(
        (data: any) => data.Name === e.value
      );

      setIndustrySelectedValue((prevState: any) => [
        ...prevState,
        ...filteredIndustry,
      ]);
    }
    if (name === 'instructionalProgram') {
      const filteredInstructionalProgram =
        allInstructionalProgramTypeData.filter(
          (data: any) => data.Name === e.value
        );

      setInstructionalProgramSelectedValue((prevState: any) => [
        ...prevState,
        ...filteredInstructionalProgram,
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
              wrapperCol={{ span: 24 }}
              labelCol={{ span: 24 }}
              required={true}
              validateTrigger="onBlur"
              help={
                (_.isNil(addPathwayFormFields.Name) ||
                  addPathwayFormFields.Name === '') &&
                isTouched.Name
                  ? 'Name is Required'
                  : null
              }
            >
              <InputBox
                placeholder="Add a Pathway Name"
                name="Name"
                required={true}
                onChange={onInputChangeHandler}
                value={addPathwayFormFields?.Pathway?.Name}
                onBlur={() =>
                  isTouched.Name === true
                    ? null
                    : setisTouched({ ...isTouched, Name: true })
                }
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
              help={
                (_.isNil(addPathwayFormFields.Description) ||
                  addPathwayFormFields.Description === '') &&
                isTouched.Description
                  ? 'Description is Required'
                  : null
              }
            >
              <Textarea
                placeholder="Add a Pathway Description"
                name="Description"
                onChange={onInputChangeHandler}
                value={addPathwayFormFields.description}
                required={true}
                onBlur={() =>
                  isTouched.Description === true
                    ? null
                    : setisTouched({ ...isTouched, Description: true })
                }
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Industry Type"
              className="swNoMargin"
              wrapperCol={{ span: 24 }}
              labelCol={{ span: 24 }}
              validateTrigger="onBlur"
            >
              <DebounceSelect
                mode="multiple"
                value={industrySelectedValue}
                placeholder="Select Industry"
                fetchOptions={fetchIndustryList}
                onSelect={(e: any) => onDebounceSelectHnadler(e, 'Industry')}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Keywords"
              className="swNoMargin"
              wrapperCol={{ span: 24 }}
              labelCol={{ span: 24 }}
              validateTrigger="onBlur"
            >
              <MultiSelect
                mode="tags"
                placeholder="Add Keywords"
                optionLabelProp="label"
                onChange={(e) => onSelectChangeHandler(e, 'Keyword')}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Occupation Types"
              className="swNoMargin"
              wrapperCol={{ span: 24 }}
              labelCol={{ span: 24 }}
              validateTrigger="onBlur"
            >
              <DebounceSelect
                mode="multiple"
                value={occupationSelectedValue}
                placeholder="Select Occupations"
                fetchOptions={fetchOccupationList}
                onSelect={(e: any) => onDebounceSelectHnadler(e, 'Occupation')}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Instructional Program Type"
              className="swNoMargin"
              wrapperCol={{ span: 24 }}
              labelCol={{ span: 24 }}
              validateTrigger="onBlur"
            >
              <DebounceSelect
                mode="multiple"
                value={instructionalProgramSelectedValue}
                placeholder="Select Instructional Program"
                fetchOptions={fetchInstructionalProgramList}
                onSelect={(e: any) =>
                  onDebounceSelectHnadler(e, 'InstructionalProgram')
                }
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Subjects"
              className="swNoMargin"
              wrapperCol={{ span: 24 }}
              labelCol={{ span: 24 }}
              validateTrigger="onBlur"
            >
              <MultiSelect
                mode="tags"
                placeholder="Select Subjects"
                optionLabelProp="label"
                onChange={(e) => onSelectChangeHandler(e, 'Subject')}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Subject Webpage"
              className="swNoMargin"
              wrapperCol={{ span: 24 }}
              labelCol={{ span: 24 }}
              required={true}
              validateTrigger="onBlur"
              help={
                (_.isNil(addPathwayFormFields.SubjectWebpage) ||
                  addPathwayFormFields.SubjectWebpage === '') &&
                isTouched.SubjectWebpage
                  ? 'Subject Webpage is Required'
                  : null
              }
            >
              <InputBox
                placeholder="add a URL"
                maxLength={75}
                value={addPathwayFormFields.SubjectWebpage}
                name="SubjectWebpage"
                onChange={onInputChangeHandler}
                onBlur={() =>
                  isTouched.SubjectWebpage === true
                    ? null
                    : setisTouched({ ...isTouched, SubjectWebpage: true })
                }
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
