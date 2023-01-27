import { Form, Tag, Drawer, Row } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import type { CustomTagProps } from 'rc-select/lib/BaseSelect';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  SEARCH_FOR_INDUSTRY_TYPE,
  SEARCH_FOR_OCCUPATION_TYPE,
} from '../../apiConfig/endpoint';
import { TEMP_BASE_URL } from '../../apiConfig/setting';
import Button from '../../components/button';
import InputBox from '../../components/formFields/inputBox';
import MultiSelect from '../../components/formFields/multiSelect';
import { updateMappedDataRequest } from '../../states/actions';

import DebounceSelect from './debounceSelect';
import Styles from './index.module.scss';

interface Props {
  visible?: boolean;
  onCloseHandler: (value: boolean) => void;
  panelData?: any;
}

const RightPanel: React.FC<Props> = ({
  onCloseHandler,
  visible,
  panelData,
}) => {
  const ref = useRef(null);
  const [rightPanelData, setRightPanelData] = useState<any>();

  const dispatch = useDispatch();
  useEffect(() => {
    document?.addEventListener('click', handleOutsideClick, true);
  }, []);

  const handleOutsideClick = (e: any) => {
    if (ref && ref?.current) {
      //@ts-ignore
      if (!ref?.current?.contains(e.target)) {
        onCloseHandler(false);
      }
    }
  };
  const SaveComponent = () => {
    const rightediteddata = {
      Description: rightPanelData.Description,
      Name: rightPanelData.Name,
      Webpage: rightPanelData.Webpage,
      IndustryType: rightPanelData.IndustryType,
      OccupationType: rightPanelData.OccupationType,
      Identifiers: rightPanelData.Identifier,
      Designation: rightPanelData.Designation,
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
    }
    dispatch(updateMappedDataRequest(pathwayWrapper.mappedData));
  };
  const onChangeHandler = (e: any) => {
    const updatedData = { ...rightPanelData };
    const { name, value } = e.target;
    updatedData[name] = value;

    setRightPanelData(updatedData);
  };
  const [isTouched, setisTouched] = useState({
    requiredNumber: false,
    Name: false,
  });
  const [allIndustryTypeData, setAllIndustryTypeData] = useState<[]>([]);
  const [allOccupationTypeData, setAllOccupationTypeData] = useState<[]>([]);

  useEffect(() => {
    if (!_.isEmpty(panelData) && !_.isNull(panelData)) {
      setRightPanelData(panelData);
    }
  }, [panelData]);
  const extractComponentType = (type: string) => {
    const typeValue = type?.split(':')[1];

    return typeValue;
  };

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
    if (name === 'Designation') {
      updatedData[name] = e;
    }
    setRightPanelData(updatedData);
  };

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
    <Drawer visible={visible} closable={true} className={Styles.right_drawer}>
      <div ref={ref} className={Styles.rightPanelContainer}>
        <Form>
          <h2>Edit Component</h2>
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
                      rightPanelData?.Type.replace('ceterms:', '')}
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
          <Form.Item>
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
            label="Webpage"
            wrapperCol={{ span: 24 }}
            labelCol={{ span: 24 }}
          >
            <InputBox
              onChange={onChangeHandler}
              placeholder="Webpage"
              name="Webpage"
              value={rightPanelData?.Webpage}
            />
          </Form.Item>
          <Form.Item>
            <label> CTID</label>
            <InputBox name="CTID" value={rightPanelData?.CTID} />
          </Form.Item>
          <Form.Item>
            <label>Finder Link</label>
            <InputBox
              name="FinderLink"
              value={rightPanelData?.FinderResource?.URI}
            />
          </Form.Item>

          {extractComponentType(rightPanelData?.Type) ==
          'CredentialComponent' ? (
            <Form.Item>
              <label>Credential Type</label>
              <InputBox
                name="CredentialType"
                value={extractComponentType(rightPanelData?.CredentialType)}
              />
            </Form.Item>
          ) : (
            ''
          )}
          {extractComponentType(rightPanelData?.Type) == 'CourseComponent' ? (
            <Form.Item>
              <label>Credit Value</label>
              <InputBox
                name="CreditValue"
                value={rightPanelData?.CreditValue?.[0]?.Value || 0}
              />
            </Form.Item>
          ) : (
            ''
          )}
          <Form.Item
            wrapperCol={{ span: 24 }}
            labelCol={{ span: 24 }}
            label="Component Category"
            validateTrigger="onBlur"
          >
            <InputBox
              onChange={onChangeHandler}
              placeholder="Component Category"
              name="ComponentCategory"
              value={rightPanelData?.Category}
            />
          </Form.Item>
          <Form.Item
            label="Identfier"
            className="swNoMargin"
            wrapperCol={{ span: 24 }}
            labelCol={{ span: 24 }}
            validateTrigger="onBlur"
          >
            <MultiSelect
              mode="tags"
              tagRender={tagRender}
              placeholder="Add Identifier"
              optionLabelProp="label"
              value={rightPanelData?.Identifier}
              onChange={(e) => onSelectChangeHandler(e, 'Identifier')}
            />
          </Form.Item>
          <Form.Item
            label="Component Designation"
            className="swNoMargin"
            wrapperCol={{ span: 24 }}
            labelCol={{ span: 24 }}
            validateTrigger="onBlur"
          >
            <MultiSelect
              mode="tags"
              tagRender={tagRender}
              placeholder="Add Designation"
              optionLabelProp="label"
              value={rightPanelData?.Designation}
              onChange={(e) => onSelectChangeHandler(e, 'Designation')}
            />
          </Form.Item>
          <Form.Item
            label="Industry Type"
            className="swNoMargin"
            wrapperCol={{ span: 24 }}
            labelCol={{ span: 24 }}
            validateTrigger="onBlur"
          >
            <DebounceSelect
              mode="multiple"
              value={rightPanelData?.IndustryType}
              placeholder="Select Industry Type"
              fetchOptions={fetchIndustryList}
              onSelect={(e: any) => onDebounceSelectHnadler(e, 'Industry')}
              onDeselect={(e: any) => onDebounceDeSelectHnadler(e, 'Industry')}
            />
          </Form.Item>
          <Form.Item
            label="Occupation Type"
            className="swNoMargin"
            wrapperCol={{ span: 24 }}
            labelCol={{ span: 24 }}
            validateTrigger="onBlur"
          >
            <DebounceSelect
              mode="multiple"
              value={rightPanelData?.OccupationType}
              placeholder="Select Occupation Type"
              fetchOptions={fetchOccupationList}
              onSelect={(e: any) => onDebounceSelectHnadler(e, 'Occupation')}
              onDeselect={(e: any) =>
                onDebounceDeSelectHnadler(e, 'Occupation')
              }
            />
          </Form.Item>
          <hr />
          <Button
            size="medium"
            text="Save Component"
            type="primary"
            onClick={SaveComponent}
          />
        </Form>
      </div>
    </Drawer>
  );
};

export default RightPanel;
