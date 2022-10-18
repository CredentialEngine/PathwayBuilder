import CloseOutlined from '@ant-design/icons/CloseOutlined';
import { faCircle, faQuestion } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
import {
  saveDataForPathwayRequest,
  savePathwaySuccess,
  updateMappedDataRequest,
} from '../../states/actions';
import fetchProgressionList from '../../utils/fetchSearchResponse';
import { isValidUrl } from '../../utils/object';
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
  addPathwayWrapperFields?: any;
  setAddPathwayWrapeprFields: (a: any) => void;
  isEditPathwayFormVisible?: any;
  setIsPreSelectedCreateResourceVisible: (a: boolean) => void;
  setIsAddPathwayFormVisible: (a: boolean) => void;
  setIsEditPathwayFormVisible: (a: boolean) => void;
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
      className={styles.content}
    >
      {label && label.toString().substring(0, 72)}
    </Tag>
  );
};

const AddPathwayForm: React.FC<Props> = ({
  addPathwayWrapperFields,
  setAddPathwayWrapeprFields,
  isEditPathwayFormVisible,
  setIsPreSelectedCreateResourceVisible,
  setIsAddPathwayFormVisible,
  setIsEditPathwayFormVisible,
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

  const [toolTip, setToolTip] = useState<any>([
    {
      type: 'Industry',
      isVisible: false,
    },
    {
      type: 'Keywords',
      isVisible: false,
    },
    {
      type: 'Occupations',
      isVisible: false,
    },
    {
      type: 'Instructional',
      isVisible: false,
    },
    {
      type: 'Subjects',
      isVisible: false,
    },
    {
      type: 'Website',
      isVisible: false,
    },
    {
      type: 'Model',
      isVisible: false,
    },
    {
      type: 'Schemes',
      isVisible: false,
    },
    {
      type: 'Details',
      isVisible: false,
    },
  ]);

  const [searchFilterValue, setSearchFilterValue] = useState<any>({
    keywords: '',
    skip: 0,
    Take: 20,
    sort: '',
    filters: [
      {
        URI: 'meta:pathwayComponentType',
        ItemTexts: [],
      },
    ],
  });

  const pathwayWrapper = useSelector((state: any) => state.initalReducer);

  const savePathwayResult = useSelector(
    (state: any) => state?.initalReducer?.savePathway
  );

  useEffect(() => {
    if (savePathwayResult.valid) {
      setIsAddPathwayFormVisible(false);
      setIsEditPathwayFormVisible(false);
      dispatch(
        savePathwaySuccess({
          loading: false,
          data: [],
          PathwayId: savePathwayResult?.PathwayId,
          valid: false,
          error: false,
        })
      );
      !isEditPathwayFormVisible && setIsPreSelectedCreateResourceVisible(true);
    }
  }, [savePathwayResult]);

  let { mappedData: PathwayWrapper } = pathwayWrapper;
  const dispatch = useDispatch();

  const userOrganizations = useSelector(
    (state: any) => state.initalReducer?.currentUserData?.data?.Organizations
  );

  const pathwayData = useSelector(
    (state: any) => state.initalReducer?.pathwayComponentData
  );
  useEffect(() => {
    if (pathwayData?.data) {
      PathwayWrapper = pathwayData?.data;
    }
  }, [pathwayData]);

  useEffect(() => {
    if (!_.isNull(PathwayWrapper.Pathway)) {
      const updatedPathwayFormFields = { ...PathwayWrapper.Pathway };
      updatedPathwayFormFields.Id = PathwayWrapper.Pathway.Id;
      updatedPathwayFormFields.Name = PathwayWrapper.Pathway.Name;
      updatedPathwayFormFields.Organization =
        PathwayWrapper.Pathway.Organization;
      updatedPathwayFormFields.Description = PathwayWrapper.Pathway.Description;
      updatedPathwayFormFields.CTID = PathwayWrapper.Pathway.CTID;
      updatedPathwayFormFields.HasDestinationComponent =
        PathwayWrapper.Pathway.HasDestinationComponent;
      updatedPathwayFormFields.HasProgressionModel =
        PathwayWrapper.Pathway.HasProgressionModel;
      updatedPathwayFormFields.IndustryType =
        PathwayWrapper.Pathway.IndustryType;
      updatedPathwayFormFields.OccupationType =
        PathwayWrapper.Pathway.OccupationType;
      updatedPathwayFormFields.SubjectWebpage =
        PathwayWrapper.Pathway.SubjectWebpage;
      updatedPathwayFormFields.Keyword = PathwayWrapper.Pathway.Keyword;
      updatedPathwayFormFields.Subject = PathwayWrapper.Pathway.Subject;
      updatedPathwayFormFields.LastUpdated = PathwayWrapper.Pathway.LastUpdated;
      setAddPathwayFormFields({
        ...addPathwayFormFields,
        ...updatedPathwayFormFields,
      });
    }

    setCheckboxvalues({
      ...checkboxValues,
      progressionModel: PathwayWrapper?.ProgressionModels?.length,
    });

    if (PathwayWrapper?.ProgressionModels?.length > 0) {
      setSelectedProgressionModelValue(
        _.get(PathwayWrapper?.ProgressionModels, '0').Name
      );
    }
  }, [PathwayWrapper.Pathway]);

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

  const { selectedOrganization } = pathwayWrapper;

  useEffect(() => {
    if (allHasProgressionModel.valid) {
      setAllProgressionModel(allHasProgressionModel.data?.Results);
    }
    if (!isEditPathwayFormVisible) {
      if (userOrganizations?.length > 0 && selectedOrganization) {
        setAddPathwayFormFields({
          ...addPathwayFormFields,
          ...addPathwayFormFields?.Pathway,
          Organization: selectedOrganization,
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
    if (name === 'progressionModel' && !checked) {
      setAddPathwayWrapeprFields({
        ...addPathwayWrapperFields,
        ProgressionModels: [],
        ProgressionLevels: [],
      });
      setAddPathwayFormFields({
        ...addPathwayFormFields,
        HasProgressionModel: [],
      });
    }
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
  const onProgressionModelHandler = (e: any) => {
    setSelectedProgressionModelValue(e);
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
    updatedAddPathwayWrapperFields.ProgressionModels =
      checkboxValues.progressionModel ? selectedProgressionModel : [];
    updatedAddPathwayWrapperFields.ProgressionLevels =
      checkboxValues.progressionModel ? selectedProgressionLevel : [];
    setAddPathwayWrapeprFields(updatedAddPathwayWrapperFields);

    setSelectedProgressionModelValue(_.get(selectedProgressionModel, '0').Name);
    setAddPathwayFormFields({
      ...addPathwayFormFields,
      HasProgressionModel: [_.get(selectedProgressionModel, '0').CTID],
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
    dispatch(
      saveDataForPathwayRequest({
        ...addPathwayWrapperFields,
        Pathway: addPathwayFormFields,
      })
    );

    dispatch(
      updateMappedDataRequest({
        ...addPathwayWrapperFields,
        Pathway: addPathwayFormFields,
      })
    );
  };

  const customToolTipIcon = (type: any) => (
    <span
      className={styles.iconSpacing}
      style={{ position: 'absolute', right: 0, top: -23, zIndex: 200 }}
      onClick={() => onShowCloseToolTip(type, true)}
    >
      <span className="fa-layers fa-fw fa-lg">
        <FontAwesomeIcon icon={faCircle} className={styles.iconPrimary} />
        <FontAwesomeIcon
          icon={faQuestion}
          transform="shrink-6"
          className={styles.iconSecondary}
        />
      </span>
    </span>
  );

  const customToolTip = (type: any) => (
    <Tag
      color="rgb(220,250,249)"
      style={{
        width: '100%',
        wordWrap: 'break-word',
        padding: 10,
        paddingRight: 20,
        marginTop: 10,
        blockOverflow: 'ellipsis',
        whiteSpace: 'pre-wrap',
      }}
    >
      <CloseOutlined
        style={{
          marginLeft: 3,
          fontSize: '10',
          position: 'absolute',
          right: 5,
          top: 55,
          cursor: 'pointer',
        }}
        onClick={() => onShowCloseToolTip(type, false)}
      />
      {`Lorem Ipsum is simply dummy text of the printing and typesetting industry.
      Lorem Ipsum has been the industry's standard dummy text ever since the
      1500s, when an unknown printer took a galley of type and scrambled it to
      make a type specimen book. It has survived not only five centuries, but
      also the leap into electronic typesetting, remaining essentially
      unchanged.`}
    </Tag>
  );

  const onShowCloseToolTip = (type: any, visibility: boolean) => {
    const toolTipArray =
      toolTip &&
      toolTip.map((item: any) =>
        item.type === type ? { ...item, isVisible: visibility } : item
      );
    setToolTip(toolTipArray);
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
              // tooltip="This is a required field"
            >
              {customToolTipIcon('Industry')}
              <DebounceSelect
                mode="multiple"
                tagRender={tagRender}
                // value={addPathwayFormFields?.IndustryType}
                defaultValue={addPathwayFormFields?.IndustryType}
                placeholder="Select Industry"
                fetchOptions={fetchIndustryList}
                onSelect={(e: any) => onDebounceSelectHnadler(e, 'Industry')}
              />

              {toolTip.find((item: any) => item.type === 'Industry')
                .isVisible && customToolTip('Industry')}
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
              {customToolTipIcon('Keywords')}
              <MultiSelect
                mode="tags"
                tagRender={tagRender}
                placeholder="Add Keywords"
                optionLabelProp="label"
                value={addPathwayFormFields?.Keyword}
                onChange={(e) => onSelectChangeHandler(e, 'Keyword')}
              />
              {toolTip.find((item: any) => item.type === 'Keywords')
                .isVisible && customToolTip('Keywords')}
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
              {customToolTipIcon('Occupations')}
              <DebounceSelect
                mode="multiple"
                tagRender={tagRender}
                //value={addPathwayFormFields?.OccupationType}
                defaultValue={addPathwayFormFields?.OccupationType}
                placeholder="Select Occupations"
                fetchOptions={fetchOccupationList}
                onSelect={(e: any) => onDebounceSelectHnadler(e, 'Occupation')}
              />
              {toolTip.find((item: any) => item.type === 'Occupations')
                .isVisible && customToolTip('Occupations')}
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
              <>
                {customToolTipIcon('Instructional')}
                <DebounceSelect
                  mode="multiple"
                  tagRender={tagRender}
                  //value={addPathwayFormFields?.InstructionalProgram}
                  defaultValue={addPathwayFormFields?.InstructionalProgram}
                  placeholder="Select Instructional Program"
                  fetchOptions={fetchInstructionalProgramList}
                  onSelect={(e: any) =>
                    onDebounceSelectHnadler(e, 'InstructionalProgram')
                  }
                />
              </>
              {toolTip.find((item: any) => item.type === 'Instructional')
                .isVisible && customToolTip('Instructional')}
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
              {customToolTipIcon('Subjects')}
              <MultiSelect
                mode="tags"
                tagRender={tagRender}
                placeholder="Select Subjects"
                optionLabelProp="label"
                value={addPathwayFormFields?.Subject}
                onChange={(e) => onSelectChangeHandler(e, 'Subject')}
              />
              {toolTip.find((item: any) => item.type === 'Subjects')
                .isVisible && customToolTip('Subjects')}
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
                !addPathwayFormFields?.SubjectWebpage?.includes('http') &&
                isTouched.SubjectWebpage
                  ? 'Subject Webpage is Required in Correct Format'
                  : null
              }
            >
              {/* {customToolTipIcon("Website")} */}
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
              {/* {toolTip.find((item:any) => item.type === 'Website').isVisible &&
              customToolTip("Website")} */}
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
                  allowClear={true}
                  value={selectedProgressionModelValue}
                  placeholder="Start typing to choose a Progression Model"
                  onSearch={onProgressionModelSearchHandler}
                  onSelect={(e: any) => onProgressionModelSelectHandler(e)}
                  onChange={(e: any) => onProgressionModelHandler(e)}
                />
              </Form.Item>
            </Col>
          )}

          <Col span={24}>
            <Button
              type={Type.PRIMARY}
              onClick={() => onAddPathwayOkHandler()}
              text={isEditPathwayFormVisible ? 'Save' : 'Next'}
              disabled={!isAddPathwayFormNextButtonDisable}
            />
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default AddPathwayForm;
