import CloseOutlined from '@ant-design/icons/CloseOutlined';
import { faCircle, faQuestion } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Form, Tag, Drawer, Row } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import _ from 'lodash';
import type { CustomTagProps } from 'rc-select/lib/BaseSelect';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import {
  GET_ICON_URL,
  SEARCH_FOR_INDUSTRY_TYPE,
  SEARCH_FOR_OCCUPATION_TYPE,
  SEARCH_FOR_LANGUAGE,
  GET_ORGANIZATION,
  FINDER_URL,
} from '../../apiConfig/endpoint';
import { TEMP_BASE_URL } from '../../apiConfig/setting';
import Button from '../../components/button';
import { Type } from '../../components/button/type';
import Dropdown from '../../components/formFields/dropdown';
import InputBox from '../../components/formFields/inputBox';
import MultiSelect from '../../components/formFields/multiSelect';

import Message from '../../components/message';
import {
  saveResourceRequest,
  saveResourceSuccess,
  updateMappedDataRequest,
} from '../../states/actions';
import { isValidUrl } from '../../utils/object';

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
  isViewMode?: boolean;
}

const EditComponent: React.FC<Props> = ({
  onCloseHandler,
  visible,
  panelData,
  isViewMode,
}) => {
  const ref = useRef(null);
  const [rightPanelData, setRightPanelData] = useState<any>();
  const [resourceData, setResourceData] = useState<any>({
    Name: '',
    Description: '',
    SubjectWebpage: '',
    OwnedBy: '',
    OfferedBy: [],
    CTID: 'ce-' + uuidv4(),
    inLanguage: [],
    AvailabilityAt: '',
    AvailabilityListing: '',
    LifeCycleStatusType: 'Active',
    CredentialType: [],
    CredentialStatusType: '',
    Organization: [],
    EntityType: '',
  });
  const dispatch = useDispatch();

  const handleOutsideClick = () => {
    onCloseHandler(false);
  };

  const saveResourceResult = useSelector(
    (state: any) => state?.initalReducer?.saveResource
  );

  const SaveResource = () => {
    Message({
      description: 'Saving the resource',
      type: 'notice',
    });
    let getCredentialTypeURI = [];
    if (credentialType) {
      getCredentialTypeURI = allCredentialTypes?.CredentialType?.filter(
        (getURI: any) =>
          credentialType == getURI?.Name || credentialType == getURI?.URI
      );
    }
    const editedResourceData = {
      Description: rightPanelData.Description,
      Name: rightPanelData.Name,
      SubjectWebpage: rightPanelData.SubjectWebpage,
      CredentialType: getCredentialTypeURI[0],
      AvailabilityAt: resourceData.AvailabilityAt,
      AvailabilityListing: resourceData.AvailabilityListing,
      OwnedBy: pathwayWrapper?.mappedData?.Pathway?.Organization,
      OfferedBy: resourceData?.OfferedBy,
      inLanguage: resourceData?.inLanguage,
      Organization: pathwayWrapper?.mappedData?.Pathway?.Organization,
      CTID: resourceData.CTID,
      LifeCycleStatusType: resourceData.LifeCycleStatusType,
      EntityType: rightPanelData?.Type,
    };
    //console.log(editedResourceData)
    setResourceData(editedResourceData);
    dispatch(saveResourceRequest(editedResourceData));
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
    // console.log(rightPanelData.FinderResource);
    debugger;
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
      CreditValue: [CreditValue],
      FinderResource: rightPanelData.FinderResource,
      ProxyFor: rightPanelData.ProxyFor,
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
        if (CreditValue !== undefined) {
          const isemptyCreditValue = Object.values(CreditValue).every(
            (x) => x === ''
          );
          if (!isemptyCreditValue) {
            const test = pathwayWrapper?.mappedData?.PathwayComponents?.filter(
              (item: any) => item?.RowId !== rightPanelData?.RowId
            );
            test.push({
              ...rightPanelData,
              CreditValue: [CreditValue],
            });
            // console.log(test);
            pathwayWrapper.mappedData.PathwayComponents = test;
          }
        }
      }
      if (!isemptyIdentifier) {
        const test = pathwayWrapper?.mappedData?.PathwayComponents?.filter(
          (item: any) => item?.RowId !== rightPanelData?.RowId
        );
        test.push({
          ...rightPanelData,
          CreditValue: [CreditValue],
          Identifier: [Identfier],
        });
        //console.log(test);
        pathwayWrapper.mappedData.PathwayComponents = test;
      }
    }
    dispatch(updateMappedDataRequest(pathwayWrapper.mappedData));
    onCloseHandler(false);
  };

  useEffect(() => {
    if (saveResourceResult?.valid) {
      Message({
        description: 'The Resources has been Published successfully',
        type: 'success',
      });
      dispatch(
        saveResourceSuccess({
          loading: false,
          data: [],
          valid: true,
          error: false,
        })
      );
      const FinderResource = rightPanelData?.FinderResource ?? {};
      FinderResource.CTID = resourceData?.CTID;
      FinderResource.URI = FINDER_URL + resourceData?.CTID;
      FinderResource.Name = 'View Resource in Credential Finder';
      rightPanelData.FinderResource = FinderResource;
      rightPanelData.ProxyFor = resourceData?.CTID;
      setIsChecked(false);
    } else if (saveResourceResult?.error) {
      saveResourceResult?.data?.map((message: any) =>
        Message({
          description: message,
          type: 'error',
        })
      );
      saveResourceResult?.data?.map((message: any) => {
        if (message.includes('Failed to Publish')) {
          setIsChecked(false);
          onCloseHandler(false);
        }
      });
    }
  }, [saveResourceResult]);

  const [isTouched, setisTouched] = useState({
    CreditValue: false,
    Name: false,
    IdentifierName: false,
    IdentifierType: false,
    IdentifierCode: false,
    SubjectWebpage: false,
    Description: false,
    InLanguage: false,
  });
  const [allIndustryTypeData, setAllIndustryTypeData] = useState<[]>([]);
  const [allLanguages, setAllLanguages] = useState<[]>([]);
  const [allOrganizations, setAllOrganizations] = useState<[]>([]);
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
  //const [ isSaveDisabled, setIsSavedDisabled,] = useState<boolean>(false);
  useEffect(() => {
    saveResourceResult.data = [];
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
  debugger;
  const industryTypes = rightPanelData?.IndustryType?.map(
    (obj: any) => obj.Name
  );
  const languages = resourceData?.inLanguage?.map(
    (obj: any) => obj.Name || obj
  );
  const organizations = resourceData?.OfferedBy?.map((obj: any) => obj.Name);

  const pathwayWrapper = useSelector((state: any) => state.initalReducer);

  async function fetchOrganizations(e: string): Promise<any[]> {
    const data = new FormData();
    data.append('json', JSON.stringify({ Keywords: e }));

    return fetch(`${TEMP_BASE_URL}${GET_ORGANIZATION}`, {
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
          CTID: dta.CTID,
          label: dta.Name,
          value: dta.CTID,
        }));
        setAllOrganizations(updatedBody);
        return updatedBody;
      });
  }

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
  async function fetchLanguageList(e: string): Promise<any[]> {
    const data = new FormData();
    data.append('json', JSON.stringify({ Keywords: e }));

    return fetch(`${TEMP_BASE_URL}${SEARCH_FOR_LANGUAGE}`, {
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
        setAllLanguages(updatedBody);
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
  const customToolTipIcon = (type: any) => (
    <span
      className={Styles.iconSpacing}
      style={{ position: 'absolute', right: 0, top: -23, zIndex: 200 }}
      onClick={() => onShowCloseToolTip(type, true)}
    >
      <span className="fa-layers fa-fw fa-lg">
        <FontAwesomeIcon icon={faCircle} className={Styles.iconPrimary} />
        <FontAwesomeIcon
          icon={faQuestion}
          transform="shrink-6"
          className={Styles.iconSecondary}
        />
      </span>
    </span>
  );
  const [toolTip, setToolTip] = useState<any>([
    {
      type: 'Name',
      isVisible: false,
    },
    {
      type: 'Description',
      isVisible: false,
    },
    {
      type: 'CredentialType',
      isVisible: false,
    },
    {
      type: 'Designation',
      isVisible: false,
    },
    {
      type: 'ComponentCategory',
      isVisible: false,
    },
    {
      type: 'OwnedBy',
      isVisible: false,
    },
    {
      type: 'OfferedBy',
      isVisible: false,
    },
    {
      type: 'Language',
      isVisible: false,
    },
    {
      type: 'AvailabilityAt',
      isVisible: false,
    },
    {
      type: 'Listing',
      isVisible: false,
    },
    {
      type: 'SubjectWebpage',
      isVisible: false,
    },
    {
      type: 'IdentifierCode',
      isVisible: false,
    },
    {
      type: 'IdentifierType',
      isVisible: false,
    },
    {
      type: 'IdentifierName',
      isVisible: false,
    },
    {
      type: 'IdentifierCode',
      isVisible: false,
    },
    {
      type: 'CreditValue',
      isVisible: false,
    },
    {
      type: 'CreditUnit',
      isVisible: false,
    },
    {
      type: 'Creditdescription',
      isVisible: false,
    },
    {
      type: 'Industry',
      isVisible: false,
    },
    {
      type: 'Occupation',
      isVisible: false,
    },
  ]);

  const getToolTipText = (value: string) => {
    let text = '';
    switch (value) {
      case 'Name':
        text = 'Name of the Component.';
        break;
      case 'Description':
        text = 'Statement, characterization or account of the entity.';
        break;
      case 'SubjectWebpage':
        text = 'Webpage that describes this entity';
        break;
      case 'Occupation':
        text =
          'Identify the specific occupations that apply to this pathway. We recommend using the SOC codes.';
        break;
      case 'Industry':
        text =
          'Type of industry; select from an existing enumeration of such types such as the SIC, NAICS, and ISIC classifications.';
        break;
      case 'CredentialType':
        text =
          'Type of the Credential, such as certificate, badge, degree etc...';
        break;
      case 'Designation':
        text =
          'Label identifying the category to further distinguish one component from another as designated by the promulgating body.';
        break;
      case 'ComponentCategory':
        text =
          'Identifies the type of PathwayComponent subclass not explicitly covered in the current array of PathwayComponent subclasses.';
        break;
      case 'CreditValue':
        text = 'A credit-related value.';
        break;
      case 'OwnedBy':
        text = 'Owning Organization for the resource.';
        break;
      case 'OfferedBy':
        text =
          'Organizations that offer the resource, you can select multiple organizations      .';
        break;
      case 'Language':
        text =
          'The primary language or languages of the entity, even if it makes use of other languages; e.g., a course offered in English to teach Spanish would have an inLanguage of English, while a credential in Quebec could have an inLanguage of both French and English.';
        break;
      case 'Listing':
        text =
          'Physical location where the credential, assessment, or learning opportunity can be pursued.';
        break;
      case 'AvailabilityAt':
        text =
          'Physical location where the credential, assessment, or learning opportunity can be pursued.';
        break;
      case 'CreditUnit':
        text =
          'The type of credit associated with the credit awarded or required.';
        break;
      case 'IdentifierType':
        text =
          ' Framework, scheme, type, or other organizing principle of this identifier.';
        break;
      case 'IdentifierName':
        text =
          'Formal name or acronym of the framework, scheme, type, or other organizing principle of this identifier, such as ISBN or ISSN.';
        break;
      case 'Creditdescription':
        text = 'Statement, characterization or account of the entity.';
        break;
      case 'IdentifierCode':
        text = 'Alphanumeric string identifier of the entity.';
        break;
    }
    return text;
  };

  const customToolTip = (type: any) => (
    <Tag
      color="rgb(220,250,249)"
      style={{
        width: '100%',
        padding: 10,
        paddingRight: 20,
        marginTop: 10,
        blockOverflow: 'ellipsis',
        whiteSpace: 'pre-wrap',
        position: 'relative',
      }}
    >
      <>
        <CloseOutlined
          style={{
            marginLeft: 3,
            fontSize: '10',
            position: 'absolute',
            right: 5,
            top: 5,
            cursor: 'pointer',
          }}
          onClick={() => onShowCloseToolTip(type, false)}
        />
        {getToolTipText(type)}
      </>
    </Tag>
  );
  const openInNewTab = () => {
    window.open(
      rightPanelData?.FinderResource?.URI,
      '_blank',
      'noopener,noreferrer'
    );
  };
  const onShowCloseToolTip = (type: any, visibility: boolean) => {
    const toolTipArray =
      toolTip &&
      toolTip.map((item: any) =>
        item.type === type ? { ...item, isVisible: visibility } : item
      );
    setToolTip(toolTipArray);
  };
  // useEffect(() => {
  //   if(isChecked){
  //     setIsSavedDisabled(
  //       !_.isEmpty(rightPanelData?.Name) &&
  //     !_.isEmpty(rightPanelData?.Description)  &&
  //     (!_.isEmpty(rightPanelData?.SubjectWebpage) && isValidUrl(rightPanelData?.SubjectWebpage))  &&
  //     !_.isEmpty(languages)  &&
  //     ((!_.isEmpty(resourceData?.AvailabilityAt)&& isValidUrl(resourceData?.AvailabilityAt))||(!_.isEmpty(resourceData?.AvailabilityListing)&& isValidUrl(resourceData?.AvailabilityListing))) &&
  //     (!_.isEmpty(resourceData?.OwnedBy)||!_.isEmpty(organizations))
  //     )
  //   }else{
  //       setIsSavedDisabled(!_.isEmpty(rightPanelData?.Name)
  //       )
  //   }
  // }, [rightPanelData,resourceData]);

  useEffect(() => {
    if (getAllCredentialTypes.valid)
      if (getAllCredentialTypes.data != undefined) {
        //   setAllCredentialTypes({
        //     CredentialType: getAllCredentialTypes.data?.map((dta: any) => ({
        //       ...dta,
        //       value: dta.Name,
        //       label: dta.Name,
        //     })),
        //   });
        const CredentialTypes = getAllCredentialTypes.data?.map((dta: any) => ({
          ...dta,
          value: dta.Name,
          label: dta.Name,
        }));
        const sorted = [...CredentialTypes].sort((a, b) =>
          a.value.localeCompare(b.value)
        );
        setAllCredentialTypes({
          CredentialType: sorted,
        });
      }
    if (getAllCreditUnitTypes.valid)
      if (getAllCreditUnitTypes.data != undefined) {
        const CreditUnitTypes = getAllCreditUnitTypes.data?.map((dta: any) => ({
          ...dta,
          value: dta.Name,
          label: dta.Name,
        }));
        const sorted = [...CreditUnitTypes].sort((a, b) =>
          a.value.localeCompare(b.value)
        );
        setAllCreditUnitTypes({
          CreditUnitType: sorted,
        });
      }
    // setAllCreditUnitTypes({
    //   CreditUnitType: getAllCreditUnitTypes.data?.map((dta: any) => ({
    //     ...dta,
    //     value: dta.Name,
    //     label: dta.Name,
    //   })),
    // });
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
    const updatedResource = { ...resourceData };
    if (name === 'Language') {
      const filteredLanguages = allLanguages?.filter(
        (data: any) => data.Name === e.value
      );
      const occData = resourceData?.inLanguage ?? [];
      updatedResource.inLanguage = [...occData, ...filteredLanguages];
    }
    if (name === 'Organization') {
      const filteredOrgs = allOrganizations?.filter(
        (data: any) => data.CTID === e.value
      );
      const occData = resourceData?.OfferedBy ?? [];
      updatedResource.OfferedBy = [...occData, ...filteredOrgs];
    }
    setResourceData(updatedResource);
    setRightPanelData(updatedData);
  };

  const onDebounceDeSelectHnadler = (e: any, name: string) => {
    const updatedData = { ...rightPanelData };
    const updatedResource = { ...resourceData };
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
    if (name === 'Language') {
      updatedResource.inLanguage = updatedResource.inLanguage?.filter(
        (item: any) => item.Name !== e.key
      );
    }
    if (name === 'Organization') {
      updatedResource.OfferedBy = updatedResource.OfferedBy?.filter(
        (item: any) => item.Name !== e.key
      );
    }
    setResourceData(updatedResource);
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
    const resourceupdated = { ...resourceData };
    const { name, value } = e.target;
    updatedData[name] = value;
    resourceupdated[name] = value;
    setResourceData(resourceupdated);
    setRightPanelData(updatedData);
  };
  const [visibleCreditValue, setVisible] = React.useState(false);
  const [visibleIdentfier, setVisibleIdentifier] = React.useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const handleToggle = () => {
    setIsChecked(!isChecked);
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
    <Drawer visible={visible} className={Styles.right_drawer} width={500}>
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
                        src={`${GET_ICON_URL}CredentialComponent.png`}
                        alt="CredentialComponent"
                      />
                    </span>
                  )}
                  {rightPanelData?.Type?.toLowerCase().includes(
                    'course'.toLowerCase()
                  ) && (
                    <span className={Styles.iconwrapper + ' courseCard'}>
                      <img
                        src={`${GET_ICON_URL}CourseComponent.png`}
                        alt="courseComponent"
                      />
                    </span>
                  )}
                  {rightPanelData?.Type?.toLowerCase().includes(
                    'Basic'.toLowerCase()
                  ) && (
                    <span className={Styles.iconwrapper + ' basicCard'}>
                      <img
                        src={`${GET_ICON_URL}BasicComponent.png`}
                        alt="BasicComponent"
                      />
                    </span>
                  )}
                  {rightPanelData?.Type?.toLowerCase().includes(
                    'competency'.toLocaleLowerCase()
                  ) && (
                    <span className={Styles.iconwrapper + ' competencyCard'}>
                      <img
                        src={`${GET_ICON_URL}CompetencyComponent.png`}
                        alt="CompetencyComponent"
                      />
                    </span>
                  )}
                  {rightPanelData?.Type?.toLowerCase().includes(
                    'assessment'.toLowerCase()
                  ) && (
                    <span className={Styles.iconwrapper + ' assessmentCard'}>
                      <img
                        src={`${GET_ICON_URL}AssessmentComponent.png`}
                        alt="AssessmentComponent"
                      />
                    </span>
                  )}

                  {rightPanelData?.Type?.toLowerCase().includes(
                    'Cocurricular'.toLowerCase()
                  ) && (
                    <span className={Styles.iconwrapper + ' cocurricularCard'}>
                      <img
                        src={`${GET_ICON_URL}CocurricularComponent.png`}
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
                        src={`${GET_ICON_URL}ExtracurricularComponent.png`}
                        alt="ExtracurricularComponent"
                      />
                    </span>
                  )}
                  {rightPanelData?.Type?.toLowerCase().includes(
                    'selection'.toLowerCase()
                  ) && (
                    <span className={Styles.iconwrapper + ' customicon'}>
                      <img
                        src={`${GET_ICON_URL}SelectionComponent.png`}
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
                        src={`${GET_ICON_URL}WorkExperienceComponent.png`}
                        alt="WorkExperienceComponent"
                      />
                    </span>
                  )}
                  {rightPanelData?.Type?.toLowerCase().includes(
                    'JobComponent'.toLowerCase()
                  ) && (
                    <span className={Styles.iconwrapper + ' jobCard'}>
                      <img
                        src={`${GET_ICON_URL}JobComponent.png`}
                        alt="JobComponent"
                      />
                    </span>
                  )}
                  {rightPanelData?.Type?.toLowerCase().includes(
                    'Addressing'.toLowerCase()
                  ) && (
                    <span className={Styles.iconwrapper + ' customicon'}>
                      <img
                        src={`${GET_ICON_URL}AddressingComponent.png`}
                        alt="AddressingConflictComponent"
                      />
                    </span>
                  )}
                  <h1 className={Styles.name}>
                    {rightPanelData &&
                      extractComponentType(rightPanelData?.Type)}
                  </h1>
                </div>
                <span>&emsp;&emsp;&emsp;{rightPanelData?.CTID}</span>
              </Row>
            </Row>
          </div>
          {(extractComponentType(rightPanelData?.Type) == 'CourseComponent' ||
            extractComponentType(rightPanelData?.Type) ==
              'CredentialComponent' ||
            extractComponentType(rightPanelData?.Type) ==
              'AssessmentComponent') &&
          rightPanelData?.FinderResource == null &&
          !isViewMode ? (
            <>
              <label className="toggle-slider">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={handleToggle}
                />
                <div className="slider" />
              </label>
              <span>
                <b> Create a Registry Resource</b>
              </span>
            </>
          ) : (
            ''
          )}
          {isViewMode ? (
            rightPanelData?.Name !== null && (
              <Form.Item
                label="Name"
                wrapperCol={{ span: 24 }}
                labelCol={{ span: 24 }}
              >
                {rightPanelData?.Name}
              </Form.Item>
            )
          ) : (
            <Form.Item
              required={true}
              wrapperCol={{ span: 24 }}
              labelCol={{ span: 24 }}
              label="Name"
              validateTrigger="onBlur"
              tooltip=""
              help={
                (_.isEmpty(rightPanelData?.Name) ||
                  _.isNull(rightPanelData?.Name)) &&
                isTouched.Name
                  ? 'Name is Required'
                  : null
              }
            >
              {customToolTipIcon('Name')}
              <InputBox
                disabled={isViewMode}
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
              {toolTip.find((item: any) => item.type === 'Name').isVisible &&
                customToolTip('Name')}
            </Form.Item>
          )}
          {extractComponentType(rightPanelData?.Type) ==
          'CredentialComponent' ? (
            isViewMode ? (
              rightPanelData?.CredentialType !== null && (
                <Form.Item
                  label="Credential Type"
                  wrapperCol={{ span: 24 }}
                  labelCol={{ span: 24 }}
                >
                  {credentialType}
                </Form.Item>
              )
            ) : (
              <Form.Item
                required={true}
                label="Credential Type"
                wrapperCol={{ span: 24 }}
                labelCol={{ span: 24 }}
              >
                {customToolTipIcon('CredentialType')}
                {rightPanelData?.CredentialType !== undefined &&
                rightPanelData?.FinderResource !== undefined ? (
                  <InputBox
                    disabled={isViewMode}
                    name="Credential Type"
                    //disabled={true}
                    value={credentialType}
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
                {toolTip.find((item: any) => item.type === 'CredentialType')
                  .isVisible && customToolTip('CredentialType')}
              </Form.Item>
            )
          ) : (
            ''
          )}
          {isViewMode ? (
            rightPanelData?.Description !== null &&
            rightPanelData?.Description !== '' && (
              <Form.Item
                label="Description"
                wrapperCol={{ span: 24 }}
                labelCol={{ span: 24 }}
              >
                {rightPanelData?.Description}
              </Form.Item>
            )
          ) : (
            <Form.Item
              label="Description"
              wrapperCol={{ span: 24 }}
              labelCol={{ span: 24 }}
              required={isChecked ? true : false}
              help={
                isChecked &&
                (_.isEmpty(rightPanelData?.Description) ||
                  _.isNull(rightPanelData?.Description)) &&
                isTouched.Description
                  ? 'Description is Required'
                  : null
              }
            >
              {customToolTipIcon('Description')}
              <TextArea
                disabled={isViewMode}
                onChange={onChangeHandler}
                rows={3}
                name="Description"
                value={rightPanelData?.Description}
                placeholder="Description"
                onBlur={() =>
                  isTouched.Description === true
                    ? null
                    : setisTouched({ ...isTouched, Name: true })
                }
              />
              {toolTip.find((item: any) => item.type === 'Description')
                .isVisible && customToolTip('Description')}
            </Form.Item>
          )}
          {isViewMode ? (
            rightPanelData?.SubjectWebpage !== null && (
              <Form.Item
                label="SubjectWebpage"
                wrapperCol={{ span: 24 }}
                labelCol={{ span: 24 }}
              >
                {rightPanelData?.SubjectWebpage}
              </Form.Item>
            )
          ) : (
            <Form.Item
              label="Subject Webpage"
              wrapperCol={{ span: 24 }}
              labelCol={{ span: 24 }}
              required={isChecked ? true : false}
              help={
                isChecked &&
                (!_.isNil(rightPanelData.SubjectWebpage) ||
                  rightPanelData.SubjectWebpage !== '') &&
                !isValidUrl(rightPanelData.SubjectWebpage) &&
                !rightPanelData?.SubjectWebpage?.includes('http') &&
                isTouched.SubjectWebpage
                  ? 'Subject Webpage is Required in Correct Format'
                  : null
              }
            >
              {customToolTipIcon('SubjectWebpage')}
              <InputBox
                disabled={isViewMode}
                onChange={onChangeHandler}
                placeholder="Webpage"
                name="SubjectWebpage"
                value={rightPanelData?.SubjectWebpage}
                onBlur={() =>
                  isTouched.SubjectWebpage === true
                    ? null
                    : setisTouched({ ...isTouched, Name: true })
                }
              />
              {toolTip.find((item: any) => item.type === 'SubjectWebpage')
                .isVisible && customToolTip('SubjectWebpage')}
            </Form.Item>
          )}
          {/* <Form.Item>
            <label> CTID</label>
            <InputBox
              disabled={isViewMode}
              name="CTID"
              value={rightPanelData?.CTID}
            />
          </Form.Item> */}
          {isChecked &&
          (extractComponentType(rightPanelData?.Type) == 'CourseComponent' ||
            extractComponentType(rightPanelData?.Type) ==
              'CredentialComponent' ||
            extractComponentType(rightPanelData?.Type) ==
              'AssessmentComponent') ? (
            <Form.Item
              wrapperCol={{ span: 24 }}
              labelCol={{ span: 24 }}
              label="Owned By"
              validateTrigger="onBlur"
              tooltip=""
              required={true}
            >
              {customToolTipIcon('OwnedBy')}
              <InputBox
                disabled={isViewMode}
                onChange={onChangeHandler}
                placeholder="Owning Organization"
                name="Owned By"
                value={pathwayWrapper?.mappedData?.Pathway?.Organization?.Name}
              />
              {toolTip.find((item: any) => item.type === 'OwnedBy').isVisible &&
                customToolTip('OwnedBy')}
            </Form.Item>
          ) : (
            ''
          )}
          {isChecked &&
          (extractComponentType(rightPanelData?.Type) == 'CourseComponent' ||
            extractComponentType(rightPanelData?.Type) ==
              'CredentialComponent' ||
            extractComponentType(rightPanelData?.Type) ==
              'AssessmentComponent') ? (
            <Form.Item
              wrapperCol={{ span: 24 }}
              labelCol={{ span: 24 }}
              label="Offered By"
              validateTrigger="onBlur"
              tooltip=""
              required={true}
            >
              {customToolTipIcon('OfferedBy')}
              <DebounceSelect
                disabled={isViewMode}
                mode="multiple"
                value={organizations}
                placeholder="Start typing to select organizations"
                fetchOptions={fetchOrganizations}
                onSelect={(e: any) =>
                  onDebounceSelectHnadler(e, 'Organization')
                }
                onDeselect={(e: any) =>
                  onDebounceDeSelectHnadler(e, 'Organization')
                }
              />
              {toolTip.find((item: any) => item.type === 'OfferedBy')
                .isVisible && customToolTip('OfferedBy')}
            </Form.Item>
          ) : (
            ''
          )}
          {isChecked &&
          (extractComponentType(rightPanelData?.Type) == 'CourseComponent' ||
            extractComponentType(rightPanelData?.Type) ==
              'CredentialComponent' ||
            extractComponentType(rightPanelData?.Type) ==
              'AssessmentComponent') ? (
            <Form.Item
              wrapperCol={{ span: 24 }}
              labelCol={{ span: 24 }}
              label="In Language"
              validateTrigger="onBlur"
              tooltip=""
              required={true}
              help={
                isChecked &&
                (languages == undefined || languages.length == 0) &&
                isTouched.InLanguage
                  ? 'Language is Required '
                  : null
              }
            >
              {customToolTipIcon('Language')}
              <DebounceSelect
                disabled={isViewMode}
                mode="multiple"
                value={languages}
                placeholder="Start typing to select the languagee"
                fetchOptions={fetchLanguageList}
                onSelect={(e: any) => onDebounceSelectHnadler(e, 'Language')}
                onDeselect={(e: any) =>
                  onDebounceDeSelectHnadler(e, 'Language')
                }
                onBlur={() =>
                  isTouched.InLanguage === true
                    ? null
                    : setisTouched({ ...isTouched, Name: true })
                }
              />
              {toolTip.find((item: any) => item.type === 'Language')
                .isVisible && customToolTip('Language')}
            </Form.Item>
          ) : (
            ''
          )}
          {isChecked &&
          (extractComponentType(rightPanelData?.Type) == 'CourseComponent' ||
            extractComponentType(rightPanelData?.Type) ==
              'AssessmentComponent') ? (
            <Form.Item
              wrapperCol={{ span: 24 }}
              labelCol={{ span: 24 }}
              label="Available At"
              validateTrigger="onBlur"
              tooltip=""
              required={true}
            >
              {customToolTipIcon('AvailabilityAt')}
              <InputBox
                disabled={isViewMode}
                onChange={onChangeHandler}
                placeholder="Available at"
                name="AvailabilityAt"
                value={resourceData?.AvailabilityAt}
              />
              {toolTip.find((item: any) => item.type === 'AvailabilityAt')
                .isVisible && customToolTip('AvailabilityAt')}
            </Form.Item>
          ) : (
            ''
          )}
          {isChecked &&
          (extractComponentType(rightPanelData?.Type) == 'CourseComponent' ||
            extractComponentType(rightPanelData?.Type) ==
              'AssessmentComponent') ? (
            <Form.Item
              wrapperCol={{ span: 24 }}
              labelCol={{ span: 24 }}
              label="Available Listing"
              validateTrigger="onBlur"
              tooltip=""
              required={true}
            >
              {customToolTipIcon('Listing')}
              <InputBox
                disabled={isViewMode}
                onChange={onChangeHandler}
                placeholder="Available Listing"
                name="AvailabilityListing"
                value={resourceData?.AvailabilityListing}
              />
              {toolTip.find((item: any) => item.type === 'Listing').isVisible &&
                customToolTip('Listing')}
            </Form.Item>
          ) : (
            ''
          )}
          {extractComponentType(rightPanelData?.Type) == 'BasicComponent' ||
          extractComponentType(rightPanelData?.Type) ==
            'ExtraCurricularComponent' ||
          extractComponentType(rightPanelData?.Type) ==
            'CocurricularComponent' ? (
            isViewMode ? (
              rightPanelData?.ComponentCategory !== null && (
                <Form.Item
                  label="Component Category"
                  wrapperCol={{ span: 24 }}
                  labelCol={{ span: 24 }}
                >
                  {rightPanelData?.ComponentCategory}
                </Form.Item>
              )
            ) : (
              <Form.Item
                wrapperCol={{ span: 24 }}
                labelCol={{ span: 24 }}
                label="Component Category"
                validateTrigger="onBlur"
                tooltip=""
              >
                {customToolTipIcon('ComponentCategory')}
                <InputBox
                  disabled={isViewMode}
                  onChange={onChangeHandler}
                  placeholder="Component Category"
                  name="ComponentCategory"
                  value={rightPanelData?.ComponentCategory}
                />
                {toolTip.find((item: any) => item.type === 'ComponentCategory')
                  .isVisible && customToolTip('ComponentCategory')}
              </Form.Item>
            )
          ) : (
            ''
          )}
          {isViewMode ? (
            rightPanelData?.ComponentDesignation.length > 0 && (
              <Form.Item
                label="Component Designation"
                wrapperCol={{ span: 24 }}
                labelCol={{ span: 24 }}
              >
                {rightPanelData?.ComponentDesignation}
              </Form.Item>
            )
          ) : (
            <Form.Item
              label="Component Designation"
              className="swNoMargin"
              wrapperCol={{ span: 24 }}
              labelCol={{ span: 24 }}
              validateTrigger="onBlur"
              tooltip=""
            >
              {customToolTipIcon('Designation')}
              <MultiSelect
                disabled={isViewMode}
                mode="tags"
                tagRender={tagRender}
                placeholder="Add Component Designation"
                optionLabelProp="label"
                value={rightPanelData?.ComponentDesignation}
                onChange={(e) =>
                  onSelectChangeHandler(e, 'ComponentDesignation')
                }
              />
              {toolTip.find((item: any) => item.type === 'Designation')
                .isVisible && customToolTip('Designation')}
            </Form.Item>
          )}

          {extractComponentType(rightPanelData?.Type) == 'JobComponent' ? (
            isViewMode ? (
              rightPanelData?.IndustryType.length > 0 && (
                <Form.Item
                  label="Industry Type"
                  wrapperCol={{ span: 24 }}
                  labelCol={{ span: 24 }}
                >
                  {industryTypes}
                </Form.Item>
              )
            ) : (
              <Form.Item
                label="Industry Type"
                className="swNoMargin"
                wrapperCol={{ span: 24 }}
                labelCol={{ span: 24 }}
                validateTrigger="onBlur"
              >
                {customToolTipIcon('Industry')}
                <DebounceSelect
                  disabled={isViewMode}
                  mode="multiple"
                  value={industryTypes}
                  placeholder="Select Industry Type"
                  fetchOptions={fetchIndustryList}
                  onSelect={(e: any) => onDebounceSelectHnadler(e, 'Industry')}
                  onDeselect={(e: any) =>
                    onDebounceDeSelectHnadler(e, 'Industry')
                  }
                />
                {toolTip.find((item: any) => item.type === 'Industry')
                  .isVisible && customToolTip('Industry')}
              </Form.Item>
            )
          ) : (
            ''
          )}

          {extractComponentType(rightPanelData?.Type) == 'JobComponent' ? (
            isViewMode ? (
              rightPanelData?.OccupationType.length > 0 && (
                <Form.Item
                  label="Occupation Type"
                  wrapperCol={{ span: 24 }}
                  labelCol={{ span: 24 }}
                >
                  {occupationTypes}
                </Form.Item>
              )
            ) : (
              <Form.Item
                label="Occupation Type"
                className="swNoMargin"
                wrapperCol={{ span: 24 }}
                labelCol={{ span: 24 }}
                validateTrigger="onBlur"
              >
                {customToolTipIcon('Occupation')}
                <DebounceSelect
                  disabled={isViewMode}
                  mode="multiple"
                  value={occupationTypes}
                  placeholder="Select Occupation Type"
                  fetchOptions={fetchOccupationList}
                  onSelect={(e: any) =>
                    onDebounceSelectHnadler(e, 'Occupation')
                  }
                  onDeselect={(e: any) =>
                    onDebounceDeSelectHnadler(e, 'Occupation')
                  }
                />
                {toolTip.find((item: any) => item.type === 'Occupation')
                  .isVisible && customToolTip('Occupation')}
              </Form.Item>
            )
          ) : (
            ''
          )}
          {extractComponentType(rightPanelData?.Type) == 'CourseComponent'
            ? rightPanelData?.CreditValue?.[0]?.Value == undefined &&
              rightPanelData?.FinderResource == undefined
              ? !isViewMode && (
                  <u
                    style={{ cursor: 'pointer' }}
                    onClick={() => setVisible(!visibleCreditValue)}
                  >
                    Add a Credit Value
                    <br />
                  </u>
                )
              : ''
            : ''}
          <div
            className={
              visibleCreditValue ? 'element-visible' : 'element-hidden'
            }
          >
            <style>{`.element-visible { display: block }.element-hidden { display: none }`}</style>
            {isViewMode && rightPanelData?.CreditValue?.[0]?.Value !== null ? (
              <>
                <Form.Item
                  label="Credit Unit Type"
                  wrapperCol={{ span: 24 }}
                  labelCol={{ span: 24 }}
                >
                  {
                    rightPanelData?.CreditValue?.[0]?.CreditUnitType?.Items?.[0]
                      ?.Name
                  }
                </Form.Item>
                <Form.Item
                  label="Credit Value"
                  wrapperCol={{ span: 24 }}
                  labelCol={{ span: 24 }}
                >
                  {rightPanelData?.Value}
                </Form.Item>
                <Form.Item
                  label="Credit Description"
                  wrapperCol={{ span: 24 }}
                  labelCol={{ span: 24 }}
                >
                  {rightPanelData?.Creditdescription}
                </Form.Item>
              </>
            ) : (
              <>
                <Form.Item
                  required={true}
                  label="Credit Unit Type"
                  wrapperCol={{ span: 24 }}
                  labelCol={{ span: 24 }}
                  tooltip=""
                >
                  {customToolTipIcon('CreditUnit')}
                  <Dropdown
                    disabled={isViewMode}
                    options={allCreditUnitTypes?.CreditUnitType}
                    showSearch={false}
                    onChange={(e) => selectedCreditUnits(e)}
                    placeholder="Select Credit Unit Type"
                    value={creditUnitType}
                  />
                  {toolTip.find((item: any) => item.type === 'CreditUnit')
                    .isVisible && customToolTip('CreditUnit')}
                </Form.Item>
                <Form.Item
                  required={true}
                  label="Credit Value"
                  wrapperCol={{ span: 24 }}
                  labelCol={{ span: 24 }}
                  tooltip=""
                >
                  {customToolTipIcon('CreditValue')}
                  <InputBox
                    disabled={isViewMode}
                    onChange={onChangeHandler}
                    placeholder="Credit Value"
                    name="Value"
                    value={rightPanelData?.Value}
                  />
                  {toolTip.find((item: any) => item.type === 'CreditValue')
                    .isVisible && customToolTip('CreditValue')}
                </Form.Item>
                <Form.Item
                  label="Credit Description"
                  wrapperCol={{ span: 24 }}
                  labelCol={{ span: 24 }}
                  tooltip=" "
                >
                  {customToolTipIcon('Creditdescription')}
                  <InputBox
                    disabled={isViewMode}
                    onChange={onChangeHandler}
                    placeholder="Description"
                    name="Creditdescription"
                    value={rightPanelData?.Creditdescription}
                  />
                  {toolTip.find(
                    (item: any) => item.type === 'Creditdescription'
                  ).isVisible && customToolTip('Creditdescription')}
                </Form.Item>
              </>
            )}
          </div>

          {rightPanelData?.Identifier?.[0] == undefined
            ? !isViewMode && (
                <u
                  style={{ cursor: 'pointer' }}
                  onClick={() => setVisibleIdentifier(!visibleIdentfier)}
                >
                  Add an Identifier
                </u>
              )
            : ''}
          <div
            className={visibleIdentfier ? 'element-visible' : 'element-hidden'}
          >
            <style>{`.element-visible { display: block }.element-hidden { display: none }`}</style>
            {isViewMode && rightPanelData?.Identifier?.[0] !== null ? (
              <>
                <Form.Item
                  label="Identifier Type"
                  wrapperCol={{ span: 24 }}
                  labelCol={{ span: 24 }}
                >
                  {rightPanelData?.IdentifierType}
                </Form.Item>
                <Form.Item
                  label="Identifier Name"
                  wrapperCol={{ span: 24 }}
                  labelCol={{ span: 24 }}
                >
                  {rightPanelData?.IdentifierName}
                </Form.Item>
                <Form.Item
                  label="Identifier Code"
                  wrapperCol={{ span: 24 }}
                  labelCol={{ span: 24 }}
                >
                  {rightPanelData?.IdentifierCode}
                </Form.Item>
              </>
            ) : (
              <>
                <Form.Item
                  label="Identfier Type"
                  wrapperCol={{ span: 24 }}
                  labelCol={{ span: 24 }}
                >
                  {customToolTipIcon('IdentifierType')}
                  <InputBox
                    disabled={isViewMode}
                    onChange={onChangeHandler}
                    placeholder="Indentifier Type"
                    name="IdentifierType"
                    value={rightPanelData?.IdentifierType}
                  />
                  {toolTip.find((item: any) => item.type === 'IdentifierType')
                    .isVisible && customToolTip('IdentifierType')}
                </Form.Item>
                <Form.Item
                  required={true}
                  label="Identfier Name"
                  wrapperCol={{ span: 24 }}
                  labelCol={{ span: 24 }}
                  tooltip=" "
                >
                  {customToolTipIcon('IdentifierName')}
                  <InputBox
                    disabled={isViewMode}
                    onChange={onChangeHandler}
                    placeholder="Indentifier Name"
                    name="IdentifierName"
                    value={rightPanelData?.IdentifierName}
                  />
                  {toolTip.find((item: any) => item.type === 'IdentifierName')
                    .isVisible && customToolTip('IdentifierName')}
                </Form.Item>
                <Form.Item
                  required={true}
                  label="Identfier Code"
                  wrapperCol={{ span: 24 }}
                  labelCol={{ span: 24 }}
                  tooltip=" "
                >
                  {customToolTipIcon('IdentifierCode')}
                  <InputBox
                    disabled={isViewMode}
                    onChange={onChangeHandler}
                    placeholder="Indentifier Code"
                    name="IdentifierCode"
                    value={rightPanelData?.IdentifierCode}
                  />
                  {toolTip.find((item: any) => item.type === 'IdentifierCode')
                    .isVisible && customToolTip('IdentifierCode')}
                </Form.Item>
              </>
            )}
          </div>
          {isViewMode ? (
            rightPanelData?.FinderResource !== null && (
              <Form.Item>
                <Button
                  className={Styles.button}
                  onClick={openInNewTab}
                  type={Type.LINK}
                  text="View in Finder"
                />
              </Form.Item>
            )
          ) : rightPanelData?.FinderResource !== undefined ? (
            <Form.Item>
              <Button
                className={Styles.button}
                onClick={openInNewTab}
                type={Type.LINK}
                text="View in Finder"
              />
            </Form.Item>
          ) : (
            ''
          )}
          <hr />
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            {!isViewMode && (
              <Button
                size="medium"
                text={isChecked ? 'Publish Resource' : 'Save Component'}
                type="primary"
                disabled={_.isEmpty(rightPanelData?.Name)}
                onClick={isChecked ? SaveResource : SaveComponent}
              />
            )}
            <Button
              type={Type.PRIMARY}
              size="small"
              onClick={handleOutsideClick}
              key="Cancel"
              text="Cancel"
            />
          </div>
        </Form>
      </div>
    </Drawer>
  );
};

export default EditComponent;
