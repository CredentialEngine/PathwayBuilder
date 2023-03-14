import { Form, Tag, Drawer, Row } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import _ from 'lodash';
import type { CustomTagProps } from 'rc-select/lib/BaseSelect';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  SEARCH_FOR_INDUSTRY_TYPE,
  SEARCH_FOR_OCCUPATION_TYPE,
} from '../../apiConfig/endpoint';
import { TEMP_BASE_URL } from '../../apiConfig/setting';
import Button from '../../components/button';
import Dropdown from '../../components/formFields/dropdown';
import InputBox from '../../components/formFields/inputBox';
import MultiSelect from '../../components/formFields/multiSelect';
import { updateMappedDataRequest } from '../../states/actions';

import DebounceSelect from './debounceSelect';
import Styles from './index.module.scss';
import {
  getCredentialTypesRequest,
  getCreditLevelTypesRequest,
  getCreditUnitTypesRequest,
} from './state/actions';

interface Props {
  visible?: boolean;
  onCloseHandler: (value: boolean) => void;
  panelData?: any;
}

const EditComponent: React.FC<Props> = ({
  onCloseHandler,
  visible,
  panelData,
}) => {
  const ref = useRef(null);
  const [rightPanelData, setRightPanelData] = useState<any>();

  const dispatch = useDispatch();

  const handleOutsideClick = () => {
    onCloseHandler(false);
  };
  const SaveComponent = () => {
    let getCredentialTypeURI = [];
    let getCreditUnitTypeURI = [];
    let getCreditLevelTypeURI = [];
    if (credentialType) {
      getCredentialTypeURI = allCredentialTypes?.CredentialType?.filter(
        (getURI: any) =>
          credentialType == getURI?.Name || credentialType == getURI?.URI
      );
    }
    if (creditUnitType) {
      getCreditUnitTypeURI = allCreditUnitTypes?.CreditUnitType?.filter(
        (getURI: any) =>
          creditUnitType == getURI?.Name || creditUnitType == getURI?.URI
      );
    }
    if (creditLevelType) {
      getCreditLevelTypeURI = allCreditLevelTypes?.CreditValueType?.filter(
        (getURI: any) =>
          creditLevelType == getURI?.Name || creditLevelType == getURI?.URI
      );
    }
    let Identfier = {
      IdentifierTypeName: '',
      IdentifierValueCode: '',
      IdentifierType: '',
    };

    if (
      rightPanelData?.IdentifierName ||
      rightPanelData?.IdentifierCode ||
      rightPanelData?.IdentifierType
    ) {
      Identfier.IdentifierTypeName = rightPanelData.IdentifierName;
      Identfier.IdentifierValueCode = rightPanelData.IdentifierCode;
      Identfier.IdentifierType = rightPanelData.IdentifierType;
    } else {
      if (rightPanelData?.Identifier?.[0] !== undefined) {
        Identfier = rightPanelData?.Identifier?.[0];
      }
    }
    const isemptyIdentifier = Object.values(Identfier).every((x) => x === '');
    const rightediteddata = {
      Description: rightPanelData.Description,
      Name: rightPanelData.Name,
      SubjectWebpage: rightPanelData.SubjectWebpage,
      IndustryType: rightPanelData.IndustryType,
      OccupationType: rightPanelData.OccupationType,
      ComponentDesignation: rightPanelData.ComponentDesignation,
      ComponentCategory: rightPanelData.ComponentCategory,
      CredentialType: getCredentialTypeURI[0]?.URI,
      Identifier: [Identfier],
    };
    setRightPanelData([rightediteddata]);
    if (pathwayWrapper?.mappedData?.PathwayComponents.length > 0) {
      let currentConditionalComponent = _.get(
        pathwayWrapper?.mappedData?.PathwayComponents?.filter(
          (condition_card: any) =>
            condition_card.RowId === _.toString(rightPanelData.RowId)
        ),
        '0'
      );

      if (
        !_.isUndefined(currentConditionalComponent) &&
        !_.isNull(currentConditionalComponent)
      ) {
        currentConditionalComponent = { ...rightPanelData };
      }
      const remainingCompCond =
        pathwayWrapper?.mappedData?.PathwayComponents?.filter(
          (item: any) => item?.RowId !== rightPanelData?.RowId
        );
      const cardsToSend = remainingCompCond?.concat(
        currentConditionalComponent
      );
      pathwayWrapper.mappedData.PathwayComponents = cardsToSend;
      if (
        rightPanelData?.Type?.toLowerCase().includes(
          'credential'.toLocaleLowerCase()
        )
      ) {
        const updatedPathwayComponent =
          pathwayWrapper?.mappedData?.PathwayComponents?.filter(
            (component_card: any) =>
              component_card?.RowId !== currentConditionalComponent?.RowId
          ).concat({
            ...rightPanelData,
            CredentialType: getCredentialTypeURI[0]?.URI,
          });
        pathwayWrapper.mappedData.PathwayComponents = [
          ...updatedPathwayComponent,
        ];
      }
      if (
        rightPanelData?.Type?.toLowerCase().includes(
          'course'.toLocaleLowerCase()
        )
      ) {
        let CreditValue = {
          CreditUnitTypes: null,
          CreditUnitType: null,
          CreditLevelType: null,
          Value: null,
          Description: null,
          Subject: null,
        };
        if (rightPanelData?.Value || rightPanelData?.Creditdescription) {
          CreditValue.CreditUnitType = getCreditUnitTypeURI[0]?.URI;
          CreditValue.CreditLevelType = getCreditLevelTypeURI;
          CreditValue.Value = rightPanelData.Value;
          CreditValue.Description = rightPanelData.Creditdescription;
        } else {
          CreditValue = rightPanelData?.CreditValue?.[0];
          if (getCreditUnitTypeURI.length > 0) {
            CreditValue.CreditUnitType = getCreditUnitTypeURI[0]?.URI;
          }
        }
        if (CreditValue !== undefined) {
          const isemptyCreditValue = Object.values(CreditValue).every(
            (x) => x === ''
          );
          if (!isemptyCreditValue) {
            const updatedPathwayComponent =
              pathwayWrapper?.mappedData?.PathwayComponents?.filter(
                (component_card: any) =>
                  component_card?.RowId !== currentConditionalComponent?.RowId
              ).concat({
                ...rightPanelData,
                CreditValue: [CreditValue],
              });
            pathwayWrapper.mappedData.PathwayComponents = [
              ...updatedPathwayComponent,
            ];
          }
        }
      }
      if (!isemptyIdentifier) {
        const updatedPathwayComponent =
          pathwayWrapper?.mappedData?.PathwayComponents?.filter(
            (component_card: any) =>
              component_card?.RowId !== currentConditionalComponent?.RowId
          ).concat({
            ...rightPanelData,
            Identifier: [Identfier],
          });
        pathwayWrapper.mappedData.PathwayComponents = [
          ...updatedPathwayComponent,
        ];
      }
    }
    dispatch(updateMappedDataRequest(pathwayWrapper.mappedData));
    onCloseHandler(false);
  };

  const [isTouched, setisTouched] = useState({
    CreditValue: false,
    Name: false,
    IdentifierName: false,
    IdentifierType: false,
    IdentifierCode: false,
  });
  const [allIndustryTypeData, setAllIndustryTypeData] = useState<[]>([]);
  const [allOccupationTypeData, setAllOccupationTypeData] = useState<[]>([]);
  const [allCredentialTypes, setAllCredentialTypes] = useState<any>({});
  const [credentialType, setCredentialType] = useState<string>('');
  const getAllCredentialTypes = useSelector(
    (state: any) => state.editComponent.credentialTypeData
  );
  const [allCreditUnitTypes, setAllCreditUnitTypes] = useState<any>({});
  const [creditUnitType, setCreditUnitType] = useState<string>('');
  const getAllCreditUnitTypes = useSelector(
    (state: any) => state.editComponent.creditUnitTypeData
  );
  const [allCreditLevelTypes, setAllCreditLevelTypes] = useState<any>({});
  const [creditLevelType, setCreditLevelType] = useState<string>('');
  const getAllCreditLevelTypes = useSelector(
    (state: any) => state.editComponent.creditLevelTypeData
  );
  useEffect(() => {
    if (!_.isEmpty(panelData) && !_.isNull(panelData)) {
      const currentConditionalComponent = _.get(
        pathwayWrapper?.mappedData?.PathwayComponents?.filter(
          (component_card: any) =>
            component_card.RowId === _.toString(panelData.RowId)
        ),
        '0'
      );
      setRightPanelData(currentConditionalComponent);
      setCredentialType(panelData?.CredentialType);
      setCreditLevelType(panelData?.CreditValue?.[0]?.CreditLevelType?.[0]);
      setCreditUnitType(panelData?.CreditValue?.[0]?.CreditUnitType);
      if (
        panelData?.CreditValue?.[0]?.Value > 0 &&
        panelData?.CreditValue !== undefined
      ) {
        setVisible(!visibleCreditValue);
        currentConditionalComponent.Value = panelData?.CreditValue?.[0]?.Value;
        currentConditionalComponent.Creditdescription =
          panelData?.CreditValue?.[0]?.Creditdescription;
        setRightPanelData(currentConditionalComponent);
      }
      if (panelData?.Identifier?.[0] !== undefined) {
        setVisibleIdentifier(!visibleIdentfier);
        currentConditionalComponent.IdentifierName =
          panelData?.Identifier?.[0]?.IdentifierTypeName;
        currentConditionalComponent.IdentifierType =
          panelData?.Identifier?.[0]?.IdentifierType;
        currentConditionalComponent.IdentifierCode =
          panelData?.Identifier?.[0]?.IdentifierValueCode;
        setRightPanelData(currentConditionalComponent);
      }
    }
  }, [panelData]);
  const extractComponentType = (type: string) => {
    const typeValue = type?.split(':')[1];

    return typeValue;
  };
  const occupationTypes = rightPanelData?.OccupationType?.map(
    (obj: any) => obj.Name
  );
  const industryTypes = rightPanelData?.IndustryType?.map(
    (obj: any) => obj.Name
  );

  const pathwayWrapper = useSelector((state: any) => state.initalReducer);

  async function fetchIndustryList(e: string): Promise<any[]> {
    const data = new FormData();
    data.append('json', JSON.stringify({ Keywords: e }));

    return fetch(`${TEMP_BASE_URL}${SEARCH_FOR_INDUSTRY_TYPE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ Keywords: e }),
    })
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

  async function fetchOccupationList(e: string): Promise<any[]> {
    return fetch(`${TEMP_BASE_URL}${SEARCH_FOR_OCCUPATION_TYPE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ Keywords: e }),
    })
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

  useEffect(
    () => () => {
      setRightPanelData(null);
    },
    []
  );
  const selectedCredentials = (value: any) => {
    setCredentialType(value);
  };
  const selectedCreditUnits = (value: any) => {
    setCreditUnitType(value);
  };
  useEffect(() => {
    dispatch(getCredentialTypesRequest());
    dispatch(getCreditLevelTypesRequest());
    dispatch(getCreditUnitTypesRequest());
  }, []);

  useEffect(() => {
    if (getAllCredentialTypes.valid)
      setAllCredentialTypes({
        CredentialType: getAllCredentialTypes.data?.map((dta: any) => ({
          ...dta,
          value: dta.Name,
          label: dta.Name,
        })),
      });
    if (getAllCreditUnitTypes.valid)
      setAllCreditUnitTypes({
        CreditUnitType: getAllCreditUnitTypes.data?.map((dta: any) => ({
          ...dta,
          value: dta.Name,
          label: dta.Name,
        })),
      });
    if (getAllCreditLevelTypes.valid)
      setAllCreditLevelTypes({
        CreditLevelType: getAllCreditLevelTypes.data?.map((dta: any) => ({
          ...dta,
          value: dta.Name,
          label: dta.Name,
        })),
      });
  }, [getAllCredentialTypes, getAllCreditUnitTypes, getAllCreditLevelTypes]);

  const onDebounceSelectHnadler = (e: any, name: string) => {
    const updatedData = { ...rightPanelData };
    if (name === 'Industry') {
      const filteredIndustry = allIndustryTypeData?.filter(
        (data: any) => data.Name === e.value
      );
      const indData = rightPanelData?.IndustryType ?? [];
      updatedData.IndustryType = [...indData, ...filteredIndustry];
    }
    if (name === 'Occupation') {
      const filteredOccupations = allOccupationTypeData?.filter(
        (data: any) => data.Name === e.value
      );
      const occData = rightPanelData?.OccupationType ?? [];
      updatedData.OccupationType = [...occData, ...filteredOccupations];
    }
    setRightPanelData(updatedData);
  };

  const onDebounceDeSelectHnadler = (e: any, name: string) => {
    const updatedData = { ...rightPanelData };
    if (name === 'Occupation') {
      updatedData.OccupationType = updatedData?.OccupationType?.filter(
        (item: any) => item.Name !== e.key
      );
    }
    if (name === 'Industry') {
      updatedData.IndustryType = updatedData.IndustryType?.filter(
        (item: any) => item.Name !== e.key
      );
    }
    setRightPanelData(updatedData);
  };

  const onSelectChangeHandler = (e: any, name: string) => {
    const updatedData = { ...rightPanelData };
    if (name === 'Identifier') {
      updatedData[name] = e;
    }
    if (name === 'ComponentDesignation') {
      updatedData[name] = e;
    }
    setRightPanelData(updatedData);
  };
  const onChangeHandler = (e: any) => {
    const updatedData = { ...rightPanelData };
    const { name, value } = e.target;
    updatedData[name] = value;
    setRightPanelData(updatedData);
  };
  const [visibleCreditValue, setVisible] = React.useState(false);
  const [visibleIdentfier, setVisibleIdentifier] = React.useState(false);

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
        className={Styles.content}
      >
        {label && label.toString().substring(0, 72)}
      </Tag>
    );
  };
  return (
    <Drawer visible={visible} className={Styles.right_drawer}>
      <div ref={ref} className={Styles.rightPanelContainer}>
        <Form>
          <Row>
            <h2>Edit Component</h2>
            &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
            <Button
              style={{ float: 'right', background: 'White', border: 'none' }}
              text="X"
              onClick={handleOutsideClick}
            />
          </Row>

          <div className={Styles.iconheader}>
            <Row className={Styles.topRow}>
              <Row>
                <div style={{ flexDirection: 'row', display: 'flex' }}>
                  {rightPanelData?.Type?.toLowerCase().includes(
                    'credential'.toLowerCase()
                  ) && (
                    <span className={Styles.iconwrapper + ' credentialCard'}>
                      <img
                        src={`${TEMP_BASE_URL}Images/PathwayBuilder/CredentialComponent.png`}
                        alt="CredentialComponent"
                      />
                    </span>
                  )}
                  {rightPanelData?.Type?.toLowerCase().includes(
                    'course'.toLowerCase()
                  ) && (
                    <span className={Styles.iconwrapper + ' courseCard'}>
                      <img
                        src={`${TEMP_BASE_URL}Images/PathwayBuilder/CourseComponent.png`}
                        alt="courseComponent"
                      />
                    </span>
                  )}
                  {rightPanelData?.Type?.toLowerCase().includes(
                    'Basic'.toLowerCase()
                  ) && (
                    <span className={Styles.iconwrapper + ' basicCard'}>
                      <img
                        src={`${TEMP_BASE_URL}Images/PathwayBuilder/BasicComponent.png`}
                        alt="BasicComponent"
                      />
                    </span>
                  )}
                  {rightPanelData?.Type?.toLowerCase().includes(
                    'competency'.toLocaleLowerCase()
                  ) && (
                    <span className={Styles.iconwrapper + ' competencyCard'}>
                      <img
                        src={`${TEMP_BASE_URL}Images/PathwayBuilder/CompetencyComponent.png`}
                        alt="CompetencyComponent"
                      />
                    </span>
                  )}
                  {rightPanelData?.Type?.toLowerCase().includes(
                    'assessment'.toLowerCase()
                  ) && (
                    <span className={Styles.iconwrapper + ' assessmentCard'}>
                      <img
                        src={`${TEMP_BASE_URL}Images/PathwayBuilder/AssessmentComponent.png`}
                        alt="AssessmentComponent"
                      />
                    </span>
                  )}

                  {rightPanelData?.Type?.toLowerCase().includes(
                    'Cocurricular'.toLowerCase()
                  ) && (
                    <span className={Styles.iconwrapper + ' cocurricularCard'}>
                      <img
                        src={`${TEMP_BASE_URL}Images/PathwayBuilder/CocurricularComponent.png`}
                        alt="CocurricularComponent"
                      />
                    </span>
                  )}
                  {rightPanelData?.Type?.toLowerCase().includes(
                    'Extracurricular'.toLowerCase()
                  ) && (
                    <span
                      className={Styles.iconwrapper + ' extraCurricularCard'}
                    >
                      <img
                        src={`${TEMP_BASE_URL}Images/PathwayBuilder/ExtracurricularComponent.png`}
                        alt="ExtracurricularComponent"
                      />
                    </span>
                  )}
                  {rightPanelData?.Type?.toLowerCase().includes(
                    'selection'.toLowerCase()
                  ) && (
                    <span className={Styles.iconwrapper + ' customicon'}>
                      <img
                        src={`${TEMP_BASE_URL}Images/PathwayBuilder/SelectionComponent.png`}
                        alt="SelectionComponent"
                      />
                    </span>
                  )}
                  {rightPanelData?.Type?.toLowerCase().includes(
                    'WorkExperience'.toLowerCase()
                  ) && (
                    <span
                      className={Styles.iconwrapper + ' workExperienceCard'}
                    >
                      <img
                        src={`${TEMP_BASE_URL}Images/PathwayBuilder/WorkExperienceComponent.png`}
                        alt="WorkExperienceComponent"
                      />
                    </span>
                  )}
                  {rightPanelData?.Type?.toLowerCase().includes(
                    'JobComponent'.toLowerCase()
                  ) && (
                    <span className={Styles.iconwrapper + ' jobCard'}>
                      <img
                        src={`${TEMP_BASE_URL}Images/PathwayBuilder/JobComponent.png`}
                        alt="JobComponent"
                      />
                    </span>
                  )}
                  {rightPanelData?.Type?.toLowerCase().includes(
                    'Addressing'.toLowerCase()
                  ) && (
                    <span className={Styles.iconwrapper + ' customicon'}>
                      <img
                        src={`${TEMP_BASE_URL}Images/PathwayBuilder/AddressingComponent.png`}
                        alt="AddressingConflictComponent"
                      />
                    </span>
                  )}
                  <h1 className={Styles.name}>
                    {rightPanelData &&
                      extractComponentType(rightPanelData?.Type)}
                  </h1>
                </div>
              </Row>
            </Row>
          </div>
          <Form.Item
            required={true}
            wrapperCol={{ span: 24 }}
            labelCol={{ span: 24 }}
            label="Name"
            validateTrigger="onBlur"
            tooltip="Name of the Component."
            help={
              (_.isEmpty(rightPanelData?.Name) ||
                _.isNull(rightPanelData?.Name)) &&
              isTouched.Name
                ? 'Name is Required'
                : null
            }
          >
            <InputBox
              onChange={onChangeHandler}
              placeholder="Name"
              name="Name"
              value={rightPanelData?.Name}
              required={true}
              onBlur={() =>
                isTouched.Name === true
                  ? null
                  : setisTouched({ ...isTouched, Name: true })
              }
            />
          </Form.Item>
          <Form.Item tooltip="Description of the Component.">
            <label>Description</label>
            <TextArea
              onChange={onChangeHandler}
              rows={3}
              name="Description"
              value={rightPanelData?.Description}
              placeholder="Description"
            />
          </Form.Item>
          <Form.Item
            label="Subject Webpage"
            wrapperCol={{ span: 24 }}
            labelCol={{ span: 24 }}
            tooltip="Webpage that describes this entity."
          >
            <InputBox
              onChange={onChangeHandler}
              placeholder="Webpage"
              name="SubjectWebpage"
              value={rightPanelData?.SubjectWebpage}
            />
          </Form.Item>
          <Form.Item>
            <label> CTID</label>
            <InputBox
              name="CTID"
              disabled={true}
              value={rightPanelData?.CTID}
            />
          </Form.Item>
          {rightPanelData?.FinderResource !== undefined ? (
            <Form.Item>
              <label>Finder Link</label>
              <InputBox
                name="FinderLink"
                disabled={true}
                value={rightPanelData?.FinderResource?.URI}
              />
            </Form.Item>
          ) : (
            ''
          )}

          {extractComponentType(rightPanelData?.Type) ==
          'CredentialComponent' ? (
            <Form.Item
              label="Credential Type"
              wrapperCol={{ span: 24 }}
              labelCol={{ span: 24 }}
              tooltip="Type of the Credential, such as certificate, badge, degree etc..."
            >
              {rightPanelData?.CredentialType !== undefined &&
              rightPanelData?.FinderResource !== undefined ? (
                <InputBox
                  name="Credential Type"
                  disabled={true}
                  value={extractComponentType(rightPanelData?.CredentialType)}
                />
              ) : (
                <Dropdown
                  options={allCredentialTypes?.CredentialType}
                  showSearch={false}
                  placeholder="Select Credential Type"
                  value={credentialType}
                  onChange={(e) => selectedCredentials(e)}
                />
              )}
            </Form.Item>
          ) : (
            ''
          )}

          {extractComponentType(rightPanelData?.Type) == 'BasicComponent' ||
          extractComponentType(rightPanelData?.Type) ==
            'ExtraCurricularComponent' ||
          extractComponentType(rightPanelData?.Type) ==
            'CocurricularComponent' ? (
            <Form.Item
              wrapperCol={{ span: 24 }}
              labelCol={{ span: 24 }}
              label="Component Category"
              validateTrigger="onBlur"
              tooltip="Identifies the type of PathwayComponent subclass not explicitly covered in the current array of PathwayComponent subclasses."
            >
              <InputBox
                onChange={onChangeHandler}
                placeholder="Component Category"
                name="ComponentCategory"
                value={rightPanelData?.ComponentCategory}
              />
            </Form.Item>
          ) : (
            ''
          )}

          <Form.Item
            label="Component Designation"
            className="swNoMargin"
            wrapperCol={{ span: 24 }}
            labelCol={{ span: 24 }}
            validateTrigger="onBlur"
            tooltip="Label identifying the category to further distinguish one component from another as designated by the promulgating body."
          >
            <MultiSelect
              mode="tags"
              tagRender={tagRender}
              placeholder="Add Component Designation"
              optionLabelProp="label"
              value={rightPanelData?.ComponentDesignation}
              onChange={(e) => onSelectChangeHandler(e, 'ComponentDesignation')}
            />
          </Form.Item>
          {extractComponentType(rightPanelData?.Type) == 'JobComponent' ? (
            <Form.Item
              label="Industry Type"
              className="swNoMargin"
              wrapperCol={{ span: 24 }}
              labelCol={{ span: 24 }}
              validateTrigger="onBlur"
              tooltip="Type of industry; select from an existing enumeration of such types such as the SIC, NAICS, and ISIC classifications."
            >
              <DebounceSelect
                mode="multiple"
                value={industryTypes}
                placeholder="Select Industry Type"
                fetchOptions={fetchIndustryList}
                onSelect={(e: any) => onDebounceSelectHnadler(e, 'Industry')}
                onDeselect={(e: any) =>
                  onDebounceDeSelectHnadler(e, 'Industry')
                }
              />
            </Form.Item>
          ) : (
            ''
          )}
          {extractComponentType(rightPanelData?.Type) == 'JobComponent' ? (
            <Form.Item
              label="Occupation Type"
              className="swNoMargin"
              wrapperCol={{ span: 24 }}
              labelCol={{ span: 24 }}
              validateTrigger="onBlur"
              tooltip="Type of occupation; select from an existing enumeration of such types."
            >
              <DebounceSelect
                mode="multiple"
                value={occupationTypes}
                placeholder="Select Occupation Type"
                fetchOptions={fetchOccupationList}
                onSelect={(e: any) => onDebounceSelectHnadler(e, 'Occupation')}
                onDeselect={(e: any) =>
                  onDebounceDeSelectHnadler(e, 'Occupation')
                }
              />
            </Form.Item>
          ) : (
            ''
          )}
          {extractComponentType(rightPanelData?.Type) == 'CourseComponent' ? (
            rightPanelData?.CreditValue?.[0]?.Value == undefined &&
            rightPanelData?.FinderResource == undefined ? (
              <u
                style={{ cursor: 'pointer' }}
                onClick={() => setVisible(!visibleCreditValue)}
              >
                Add a Credit Value
                <br />
              </u>
            ) : (
              ''
            )
          ) : (
            ''
          )}
          <div
            className={
              visibleCreditValue ? 'element-visible' : 'element-hidden'
            }
          >
            <style>{`.element-visible { display: block }.element-hidden { display: none }`}</style>
            <Form.Item
              required={true}
              label="Credit Unit Type"
              wrapperCol={{ span: 24 }}
              labelCol={{ span: 24 }}
              tooltip="The type of credit associated with the credit awarded or required."
            >
              <Dropdown
                options={allCreditUnitTypes?.CreditUnitType}
                showSearch={false}
                onChange={(e) => selectedCreditUnits(e)}
                placeholder="Select Credit Unit Type"
                value={creditUnitType}
              />
            </Form.Item>
            {/* <Form.Item
          required={true}
          label="Credit Level Type"
          wrapperCol={{ span: 24 }}
          labelCol={{ span: 24 }}
        >
              <Dropdown
              options={allCreditLevelTypes?.CreditLevelType}
              showSearch={false}
              onChange={(e) => selectedCreditUnits(e)}
              placeholder="Select Credit Level Type"
              value={creditLevelType}
              
            />
             </Form.Item> */}
            <Form.Item
              required={true}
              label="Credit Value"
              wrapperCol={{ span: 24 }}
              labelCol={{ span: 24 }}
              tooltip="A credit-related value."
            >
              <InputBox
                onChange={onChangeHandler}
                placeholder="Credit Value"
                name="Value"
                value={rightPanelData?.Value}
              />
            </Form.Item>
            <Form.Item
              label="Credit Description"
              wrapperCol={{ span: 24 }}
              labelCol={{ span: 24 }}
              tooltip=" Statement, characterization or account of the entity."
            >
              <InputBox
                onChange={onChangeHandler}
                placeholder="Description"
                name="Creditdescription"
                value={rightPanelData?.Creditdescription}
              />
            </Form.Item>
          </div>
          {rightPanelData?.Identifier?.[0] == undefined ? (
            <u
              style={{ cursor: 'pointer' }}
              onClick={() => setVisibleIdentifier(!visibleIdentfier)}
            >
              Add an Identifier
            </u>
          ) : (
            ''
          )}
          <div
            className={visibleIdentfier ? 'element-visible' : 'element-hidden'}
          >
            <style>{`.element-visible { display: block }.element-hidden { display: none }`}</style>
            <Form.Item
              label="Identfier Type"
              wrapperCol={{ span: 24 }}
              labelCol={{ span: 24 }}
              tooltip=" Framework, scheme, type, or other organizing principle of this identifier."
            >
              <InputBox
                onChange={onChangeHandler}
                placeholder="Indentifier Type"
                name="IdentifierType"
                value={rightPanelData?.IdentifierType}
              />
            </Form.Item>
            <Form.Item
              required={true}
              label="Identfier Name"
              wrapperCol={{ span: 24 }}
              labelCol={{ span: 24 }}
              tooltip=" Formal name or acronym of the framework, scheme, type, or other organizing principle of this identifier, such as ISBN or ISSN."
            >
              <InputBox
                onChange={onChangeHandler}
                placeholder="Indentifier Name"
                name="IdentifierName"
                value={rightPanelData?.IdentifierName}
              />
            </Form.Item>

            <Form.Item
              required={true}
              label="Identfier Code"
              wrapperCol={{ span: 24 }}
              labelCol={{ span: 24 }}
              tooltip=" Alphanumeric string identifier of the entity."
            >
              <InputBox
                onChange={onChangeHandler}
                placeholder="Indentifier Code"
                name="IdentifierCode"
                value={rightPanelData?.IdentifierCode}
              />
            </Form.Item>
          </div>
          <hr />
          <Button
            size="medium"
            text="Save Component"
            type="primary"
            disabled={_.isEmpty(rightPanelData?.Name)}
            onClick={SaveComponent}
          />
        </Form>
      </div>
    </Drawer>
  );
};

export default EditComponent;
