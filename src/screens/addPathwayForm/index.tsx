import { Row, Col, Form, Divider, Tag } from 'antd';

import _ from 'lodash';
import type { CustomTagProps } from 'rc-select/lib/BaseSelect';
import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import AutoCompleteBox from '../../components/autoComplete';
import Button from '../../components/button';
import { Type } from '../../components/button/type';

import CheckBox from '../../components/formFields/checkbox';
import InputBox from '../../components/formFields/inputBox';
import MultiSelect from '../../components/formFields/multiSelect';
import Textarea from '../../components/formFields/textarea';
import fetchProgressionList from '../../utils/fetchSearchResponse';
import { isValidUrl } from '../../utils/object';
import { SelectAutoCompleteProps } from '../../utils/selectProps';

import DebounceSelect from './debounceSelect';
import styles from './index.module.scss';
import { PathwayEntity } from './model';
import {
  getDataForProgressionLevelSuccess,
  getDataForProgressionModelSuccess,
  saveAddPAthWayFormFields,
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
  addPathwayWrapperFields?: any;
  setAddPathwayWrapeprFields: (a: any) => void;
  isEditPathwayFormVisible?: any;
}

const tagRender = (props: CustomTagProps) => {
  const { label, value, closable, onClose } = props;
  const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  return (
    <Tag
      color={value}
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{ marginRight: 3 }}
    >
      {label}
    </Tag>
  );
};

const AddPathwayForm: React.FC<Props> = ({
  getAllPathwayFormFields,
  addPathwayWrapperFields,
  setAddPathwayWrapeprFields,
  isEditPathwayFormVisible,
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
  const [
    isAddPathwayFormNextButtonDisable,
    setIsAddPathwayFormNextButtonDisable,
  ] = useState<boolean>(false);

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

  const pathwayWrapper = useSelector((state: any) => state.initalReducer);
  const addPathwayFormFieldsValue = useSelector(
    (state: any) => state.addPathwayFormReducer.allFormFields
  );

  const { mappedData: ProgressionModels } = pathwayWrapper;

  const dispatch = useDispatch();

  const userOrganizations = useSelector(
    (state: any) => state.initalReducer?.currentUserData?.data?.Organizations
  );

  useEffect(() => {
    if (!_.isNull(addPathwayFormFieldsValue)) {
      const updatedPathwayFormFields = { ...addPathwayFormFieldsValue };
      updatedPathwayFormFields.Id = addPathwayFormFieldsValue.Id;
      updatedPathwayFormFields.Name = addPathwayFormFieldsValue.Name;

      updatedPathwayFormFields.Organization =
        addPathwayFormFieldsValue.Organization;
      updatedPathwayFormFields.Description =
        addPathwayFormFieldsValue.Description;
      updatedPathwayFormFields.CTID = addPathwayFormFieldsValue.CTID;
      updatedPathwayFormFields.HasDestinationComponent =
        addPathwayFormFieldsValue.HasDestinationComponent;
      updatedPathwayFormFields.HasProgressionModel =
        addPathwayFormFieldsValue.HasProgressionModel;
      updatedPathwayFormFields.IndustryType =
        addPathwayFormFieldsValue.IndustryType;
      updatedPathwayFormFields.OccupationType =
        addPathwayFormFieldsValue.OccupationType;
      updatedPathwayFormFields.SubjectWebpage =
        addPathwayFormFieldsValue.SubjectWebpage;
      updatedPathwayFormFields.Keyword = addPathwayFormFieldsValue.Subject;
      updatedPathwayFormFields.Subject = addPathwayFormFieldsValue.ID;
      updatedPathwayFormFields.LastUpdated =
        addPathwayFormFieldsValue.LastUpdated;
      setAddPathwayFormFields({
        ...addPathwayFormFields,
        ...updatedPathwayFormFields,
      });
    }

    if (ProgressionModels?.ProgressionModels?.length > 0) {
      setSelectedProgressionModelValue(
        _.get(ProgressionModels.ProgressionModels, '0').Name
      );
    }
  }, [addPathwayFormFieldsValue]);

  useEffect(() => {
    setIsAddPathwayFormNextButtonDisable(
      !_.isEmpty(addPathwayFormFields.Name) &&
        !_.isEmpty(addPathwayFormFields.Description) &&
        !_.isEmpty(addPathwayFormFields.SubjectWebpage) &&
        isValidUrl(addPathwayFormFields.SubjectWebpage)
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
    if (instructionalProgramSelectedValue.length > 0) {
      updatedData.InstructionalType = industrySelectedValue;
    }
    if (!isEditPathwayFormVisible) {
      setAddPathwayFormFields(updatedData);
    }
  }, [occupationSelectedValue, industrySelectedValue]);

  const allHasProgressionModel = useSelector(
    (state: any) => state.addPathwayFormReducer.allHasProgressionModel
  );

  useEffect(() => {
    if (allHasProgressionModel.valid) {
      setAllProgressionModel(allHasProgressionModel.data?.Results);
    }
    if (!isEditPathwayFormVisible) {
      if (userOrganizations?.length > 0) {
        setAddPathwayFormFields({
          ...addPathwayFormFields,
          Organization: userOrganizations[0],
        });
      }
    }
  }, [
    allHasProgressionModel.data,
    userOrganizations,
    isEditPathwayFormVisible,
  ]);

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
    // const data = new FormData();
    // data.append('json', JSON.stringify({ Keywords: e }));

    return fetch(
      'https://sandbox.credentialengine.org/publisher/PathwayBuilderApi/Search/Codes/OccupationType',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Keywords: e }),
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
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Keywords: e }),
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
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Keywords: e }),
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

  const onAddPathwayOkHandler = () => {
    if (!_.isEmpty(addPathwayFormFields))
      getAllPathwayFormFields(addPathwayFormFields, 'Pathway');

    dispatch(saveAddPAthWayFormFields(addPathwayFormFields));
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
                value={addPathwayFormFields?.Name}
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
                value={addPathwayFormFields.Description}
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
              tooltip="This is a required field"
            >
              <DebounceSelect
                mode="multiple"
                tagRender={tagRender}
                value={addPathwayFormFields?.IndustryType}
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
                tagRender={tagRender}
                placeholder="Add Keywords"
                optionLabelProp="label"
                value={addPathwayFormFields?.Keyword}
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
                tagRender={tagRender}
                value={addPathwayFormFields?.OccupationType}
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
                tagRender={tagRender}
                value={addPathwayFormFields?.InstructionalProgram}
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
                tagRender={tagRender}
                placeholder="Select Subjects"
                optionLabelProp="label"
                value={addPathwayFormFields?.Subject}
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
                (!_.isNil(addPathwayFormFields.SubjectWebpage) ||
                  addPathwayFormFields.SubjectWebpage !== '') &&
                !isValidUrl(addPathwayFormFields.SubjectWebpage) &&
                isTouched.SubjectWebpage
                  ? 'Subject Webpage is Required in Correct Format'
                  : null
              }
            >
              <InputBox
                placeholder="add a URL"
                maxLength={75}
                value={addPathwayFormFields?.SubjectWebpage}
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
              checked={
                checkboxValues.progressionModel ||
                addPathwayFormFields?.HasProgressionModel?.length > 0
              }
              name="progressionModel"
              label="This Pathway Contains a Progression Model"
            />
          </Col>
          {(!!checkboxValues.progressionModel ||
            addPathwayFormFields?.HasProgressionModel?.length > 0) && (
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
                  value={selectedProgressionModelValue}
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
          <Col span={24}>
            <Button
              type={Type.PRIMARY}
              onClick={onAddPathwayOkHandler}
              text="Next"
              disabled={!isAddPathwayFormNextButtonDisable}
            />
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default AddPathwayForm;
