import CloseOutlined from '@ant-design/icons/CloseOutlined';
import { faCircle, faQuestion } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Row, Col, Form, Divider, Tag, Modal } from 'antd';

import _, { noop } from 'lodash';
import type { CustomTagProps } from 'rc-select/lib/BaseSelect';
import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import {
  SEARCH_FOR_HAS_SUPPORT_SERVICE,
  SEARCH_FOR_INDUSTRICAL_PROGRAM_TYPE,
  SEARCH_FOR_INDUSTRY_TYPE,
  SEARCH_FOR_OCCUPATION_TYPE,
} from '../../apiConfig/endpoint';
import { TEMP_BASE_URL, progressionModelUrl } from '../../apiConfig/setting';

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
//import { isValidUrl } from '../../utils/object';
import { SelectAutoCompleteProps } from '../../utils/selectProps';

import DebounceSelect from './debounceSelect';
import styles from './index.module.scss';
import { PathwayEntity } from './model';
import {
  getDataForProgressionLevelSuccess,
  getDataForProgressionModelSuccess,
} from './state/actions';

export interface Props {
  addPathwayWrapperFields?: any;
  setAddPathwayWrapeprFields: (a: any) => void;
  isEditPathwayFormVisible?: any;
  setIsPreSelectedCreateResourceVisible: (a: boolean) => void;
  setIsAddPathwayFormVisible: (a: boolean) => void;
  setIsEditPathwayFormVisible: (a: boolean) => void;
  setIsDropCardAfterEditingForm: (a: boolean) => void;
  isViewMode: boolean;
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
  setIsDropCardAfterEditingForm,
  isViewMode,
}) => {
  const [addPathwayFormFields, setAddPathwayFormFields] = useState<any>(
    new PathwayEntity()
  );
  const [selectedProgressionModelValue, setSelectedProgressionModelValue] =
    useState<string>('');

  const [allProgressionModel, setAllProgressionModel] = useState<[]>([]);
  const [allProgressionLevel, setAllProgressionLevel] = useState<[]>([]);
  const [allOccupationTypeData, setAllOccupationTypeData] = useState<[]>([]);
  const [allSupportServicesData, setAllSupportServicesData] = useState<[]>([]);

  const [allIndustryTypeData, setAllIndustryTypeData] = useState<[]>([]);

  const [allInstructionalProgramTypeData, setAllInstructionalProgramTypeData] =
    useState<[]>([]);

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
    //SubjectWebpage: false,
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
      type: 'Progression',
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
    {
      type: 'Support',
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

  const { mappedData: PathwayWrapper } = pathwayWrapper;
  const dispatch = useDispatch();

  const userOrganizations = useSelector(
    (state: any) => state.initalReducer?.currentUserData?.data?.Organizations
  );

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
      updatedPathwayFormFields.InstructionalProgramType =
        PathwayWrapper.Pathway.InstructionalProgramType;
      updatedPathwayFormFields.HasSupportService =
        PathwayWrapper.Pathway.HasSupportService;
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
      progressionModel: PathwayWrapper.Pathway?.HasProgressionModel?.length > 0,
    });

    if (
      PathwayWrapper.Pathway?.HasProgressionModel &&
      PathwayWrapper.Pathway?.HasProgressionModel[0] !==
        _.get(PathwayWrapper?.ProgressionModels, '0')?.CTID
    ) {
      const selectedProgressionModel = allProgressionModel?.filter(
        (model: any) =>
          model.CTID === PathwayWrapper.Pathway?.HasProgressionModel[0]
      );

      setSelectedProgressionModelValue(
        _.get(selectedProgressionModel, '0')?.Name
      );
      setAddPathwayFormFields({
        ...PathwayWrapper.Pathway,
        HasProgressionModel: [_.get(selectedProgressionModel, '0')?.CTID],
      });
    } else {
      if (PathwayWrapper?.ProgressionModels?.length > 0) {
        setSelectedProgressionModelValue(
          _.get(PathwayWrapper?.ProgressionModels, '0').Name
        );
      }
    }
  }, [PathwayWrapper.Pathway]);

  useEffect(() => {
    setIsAddPathwayFormNextButtonDisable(
      !_.isEmpty(addPathwayFormFields.Name) &&
        !_.isEmpty(addPathwayFormFields.Description)
      //!_.isEmpty(addPathwayFormFields.SubjectWebpage) &&
      // isValidUrl(addPathwayFormFields.SubjectWebpage)
    );
  }, [addPathwayFormFields]);

  const allHasProgressionModel = useSelector(
    (state: any) => state.addPathwayFormReducer.allHasProgressionModel
  );

  const { selectedOrganization } = pathwayWrapper;

  useEffect(() => {
    if (allHasProgressionModel.data?.length > 0) {
      setAllProgressionModel(allHasProgressionModel.data);
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
    //debugger;
    setSearchFilterValue({ ...searchFilterValue, keywords: e });
  };
  const onProgressionModelHandler = (e: any) => {
    setSelectedProgressionModelValue(e);
  };

  useEffect(() => {
    if (searchFilterValue.keywords !== '') {
      getHasProgressionModel(searchFilterValue);
    } else {
      getHasProgressionModel('');
    }
  }, [searchFilterValue]);

  const getHasProgressionModel = async (val: any) => {
    const result = await fetchProgressionList(val);
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
    setSearchFilterValue('');
  };

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

  async function fetchInstructionalProgramList(e: string): Promise<any[]> {
    const data = new FormData();
    data.append('json', JSON.stringify({ Keywords: e }));

    return fetch(`${TEMP_BASE_URL}${SEARCH_FOR_INDUSTRICAL_PROGRAM_TYPE}`, {
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
        setAllInstructionalProgramTypeData(updatedBody);
        return updatedBody;
      });
  }

  async function fetchSupportServices(e: string): Promise<any[]> {
    return fetch(`${TEMP_BASE_URL}${SEARCH_FOR_HAS_SUPPORT_SERVICE}`, {
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
        setAllSupportServicesData(updatedBody);
        return updatedBody;
      });
  }
  const onDebounceSelectHnadler = (e: any, name: string) => {
    const updatedData = { ...addPathwayFormFields };
    if (!e.label) {
      // if(addPathwayFormFields.hasOwnProperty('OccupationType')){
      //   name='OccupationType';
      // }else if(addPathwayFormFields.hasOwnProperty('IndustryType')){
      //   name='IndustryType'
      // }else if(addPathwayFormFields.hasOwnProperty('InstructionalProgramType')){
      //   name='InstructionalProgramType'
      // }
      const newType = [
        {
          CodedNotation: null,
          Description: '',
          Id: null,
          Name: e.value,
          RowId: undefined,
          URI: undefined,
          label: e.value,
          value: e.value,
        },
      ];

      if (name === 'Occupation') {
        const occData = addPathwayFormFields?.OccupationType ?? [];
        updatedData.OccupationType = [...occData, ...newType];
      }
      if (name === 'Industry') {
        const indData = addPathwayFormFields?.IndustryType ?? [];
        updatedData.IndustryType = [...indData, ...newType];
      }
      if (name === 'InstructionalProgram') {
        const insData = addPathwayFormFields?.InstructionalProgramType ?? [];
        updatedData.InstructionalProgramType = [...insData, ...newType];
      }
      if (name === 'Support') {
        const insData = addPathwayFormFields?.HasSupportService ?? [];
        updatedData.HasSupportService = [...insData, ...newType];
      }
      //console.log(updatedData);
      setAddPathwayFormFields(updatedData);
    }
    // appendSourceItem({
    //   Name: e.value,
    //   CodedNotation: e.value,
    //  Id: (crypto as any).randomUUID(),
    // });}
    else {
      if (name === 'Occupation') {
        const filteredOccupations = allOccupationTypeData?.filter(
          (data: any) => data.Name === e.value
        );
        const occData = addPathwayFormFields?.OccupationType ?? [];
        updatedData.OccupationType = [...occData, ...filteredOccupations];
      }
      if (name === 'Industry') {
        const filteredIndustry = allIndustryTypeData?.filter(
          (data: any) => data.Name === e.value
        );
        const indData = addPathwayFormFields?.IndustryType ?? [];
        updatedData.IndustryType = [...indData, ...filteredIndustry];
      }
      if (name === 'InstructionalProgram') {
        //console.log(allInstructionalProgramTypeData);
        const filteredInstructionalProgram =
          allInstructionalProgramTypeData?.filter(
            (data: any) => data.Name === e.value
          );
        const insData = addPathwayFormFields?.InstructionalProgramType ?? [];
        updatedData.InstructionalProgramType = [
          ...insData,
          ...filteredInstructionalProgram,
        ];
      }
      if (name === 'Support') {
        const filteredIndustry = allSupportServicesData?.filter(
          (data: any) => data.Name === e.value
        );
        const indData = addPathwayFormFields?.HasSupportService ?? [];
        updatedData.HasSupportService = [...indData, ...filteredIndustry];
      }
      //console.log(updatedData);
      setAddPathwayFormFields(updatedData);
    }
  };

  const onDebounceDeSelectHnadler = (e: any, name: string) => {
    const updatedData = { ...addPathwayFormFields };
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
    if (name === 'InstructionalProgram') {
      updatedData.InstructionalProgramType =
        updatedData?.InstructionalProgramType?.filter(
          (item: any) => item.Name !== e.key
        );
    }
    if (name === 'Support') {
      updatedData.IndustryType = updatedData.IndustryType?.filter(
        (item: any) => item.Name !== e.key
      );
    }
    setAddPathwayFormFields(updatedData);
  };
  const onAddPathwayOkHandler = () => {
    if (isEditPathwayFormVisible) {
      if (
        _.toString(_.get(addPathwayFormFields?.HasProgressionModel, '0')) ===
          _.toString(_.get(PathwayWrapper?.ProgressionModels, '0')?.CTID) &&
        pathwayWrapper.mappedData?.ProgressionLevels?.length > 0 &&
        pathwayWrapper.mappedData?.ProgressionModels?.length > 0
      ) {
        dispatch(
          saveDataForPathwayRequest({
            ...PathwayWrapper,
            Pathway: addPathwayFormFields,
            PathwayComponents: PathwayWrapper.PathwayComponents,
            PendingComponents: PathwayWrapper.PendingComponents,
            ProgressionLevels: PathwayWrapper.ProgressionLevels,
            ProgressionModels: PathwayWrapper.ProgressionModels,
          })
        );
        dispatch(
          updateMappedDataRequest({
            ...PathwayWrapper,
            Pathway: addPathwayFormFields,
            PathwayComponents: PathwayWrapper.PathwayComponents,
            PendingComponents: PathwayWrapper.PendingComponents,
            ProgressionLevels: PathwayWrapper.ProgressionLevels,
            ProgressionModels: PathwayWrapper.ProgressionModels,
          })
        );
        setIsEditPathwayFormVisible(false);
        setIsDropCardAfterEditingForm(true);
      } else if (
        _.toString(_.get(addPathwayFormFields?.HasProgressionModel, '0')) ==
          '' &&
        (pathwayWrapper.mappedData?.ProgressionModels == undefined ||
          pathwayWrapper.mappedData?.ProgressionModels.length == 0)
      ) {
        dispatch(
          saveDataForPathwayRequest({
            ...PathwayWrapper,
            Pathway: addPathwayFormFields,
            PathwayComponents: PathwayWrapper.PathwayComponents,
            PendingComponents: PathwayWrapper.PendingComponents,
            ProgressionLevels: PathwayWrapper.ProgressionLevels,
            ProgressionModels: PathwayWrapper.ProgressionModels,
          })
        );
        dispatch(
          updateMappedDataRequest({
            ...PathwayWrapper,
            Pathway: addPathwayFormFields,
            PathwayComponents: PathwayWrapper.PathwayComponents,
            PendingComponents: PathwayWrapper.PendingComponents,
            ProgressionLevels: PathwayWrapper.ProgressionLevels,
            ProgressionModels: PathwayWrapper.ProgressionModels,
          })
        );
        setIsEditPathwayFormVisible(false);
        setIsDropCardAfterEditingForm(true);
      } else {
        Modal.confirm({
          title: 'By clicking on Save all existing data will be lost.',
          okText: 'Save',
          cancelText: 'Cancel',
          onOk: () => {
            const updatedPathwayWrapper = { ...PathwayWrapper };

            updatedPathwayWrapper.Pathway = {
              ...addPathwayFormFields,
              HasDestinationComponent: '',
            };
            updatedPathwayWrapper.PathwayComponents = [];
            updatedPathwayWrapper.ComponentConditions = [];
            updatedPathwayWrapper.PendingComponents =
              addPathwayWrapperFields.PendingComponents;
            (updatedPathwayWrapper.ProgressionLevels =
              addPathwayWrapperFields.ProgressionLevels),
              (updatedPathwayWrapper.ProgressionModels =
                addPathwayWrapperFields.ProgressionModels),
              setAddPathwayFormFields({ ...updatedPathwayWrapper.Pathway });
            dispatch(saveDataForPathwayRequest(updatedPathwayWrapper));
            dispatch(updateMappedDataRequest(updatedPathwayWrapper));
          },
          onCancel: noop,
        });
        setIsEditPathwayFormVisible(false);
        setIsDropCardAfterEditingForm(true);
      }
    } else {
      dispatch(
        saveDataForPathwayRequest({
          ...addPathwayWrapperFields,
          Pathway: addPathwayFormFields,
          DeletedComponentConditions: [],
          DeletedComponents: [],
        })
      );

      dispatch(
        updateMappedDataRequest({
          ...addPathwayWrapperFields,
          Pathway: addPathwayFormFields,
          PathwayComponents: [],
          Constraints: [],
          DeletedComponentConditions: [],
          DeletedComponents: [],
        })
      );
    }
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

  const getToolTipText = (value: string) => {
    let text = '';
    switch (value) {
      case 'Industry':
        text =
          'Identify the specific industries that apply to this pathway. We recommend using the NAICS codes. You can add more than one Industry type';
        break;
      case 'Keywords':
        text =
          'Enter keywords or phrases that describe this pathway. Press the enter key after each word or phrase to enter it as a keyword.';
        break;
      case 'Occupations':
        text =
          'Identify the specific occupations that apply to this pathway. We recommend using the SOC codes. You can add more than on Occupation type';
        break;
      case 'Instructional':
        text =
          'Identify the specific instructional program classifications that apply to this pathway. We recommend using the CIP codes. You can add more than one Instructional program type.';
        break;
      case 'Subjects':
        text =
          'Enter subjects or topics that this pathway covers. Press the enter key after each word or phrase to enter it as a subject.';
        break;
      case 'Website':
        text =
          'Provide a URL to the web page, PDF, or other source documentation where this pathway is described.';
        break;
      case 'Model':
        text = 'Select an applicable Progression Model for this pathway.';
        break;
      case 'Progression':
        text =
          'A progression Model is a developmental progression including increasing levels of competence, achievement or temporal position (e.g., "First Quarter, Second Quarter"). To Create your own progression model, click  ';
        break;
      case 'Support':
        text = 'Reference to a relevant support service.';
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
        {type == 'Progression' ? (
          <p>
            A progression Model is a developmental progression including
            increasing levels of competence, achievement or temporal position
            (e.g., &quot; First Quarter, Second Quarter &quot;). To Create your
            own progression model,{' '}
            <a
              style={{ color: 'black', textDecoration: 'underline' }}
              href={progressionModelUrl}
              target="_blank"
              rel="noreferrer"
            >
              Click Here
            </a>
          </p>
        ) : (
          getToolTipText(type)
        )}
      </>
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
  const instructionalProgramTypes =
    addPathwayFormFields?.InstructionalProgramType?.map((obj: any) => obj.Name);
  const occupationTypes = addPathwayFormFields?.OccupationType?.map(
    (obj: any) => obj.Name
  );
  const industryTypes = addPathwayFormFields?.IndustryType?.map(
    (obj: any) => obj.Name
  );

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
                disabled={isViewMode}
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
                  ? 'Description is Required, 15 Characters minimum'
                  : null
              }
            >
              <Textarea
                disabled={isViewMode}
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
              label="Subject Webpage"
              className="swNoMargin"
              wrapperCol={{ span: 24 }}
              labelCol={{ span: 24 }}
              //required={true}
              //validateTrigger="onBlur"
              // help={
              //   // (!_.isNil(addPathwayFormFields.SubjectWebpage) ||
              //   //   addPathwayFormFields.SubjectWebpage !== '') &&
              //   !isValidUrl(addPathwayFormFields.SubjectWebpage) &&
              //   !addPathwayFormFields?.SubjectWebpage?.includes('http')
              //  // isTouched.SubjectWebpage
              //     ? 'Subject Webpage is Required in Correct Format'
              //     : null
              // }
            >
              {customToolTipIcon('Website')}
              <InputBox
                disabled={isViewMode}
                placeholder="add a URL"
                maxLength={500}
                value={addPathwayFormFields?.SubjectWebpage}
                name="SubjectWebpage"
                onChange={onInputChangeHandler}
                // onBlur={() =>
                //   isTouched.SubjectWebpage === true
                //     ? null
                //     : setisTouched({ ...isTouched, SubjectWebpage: true })
                // }
              />
              {toolTip.find((item: any) => item.type === 'Website').isVisible &&
                customToolTip('Website')}
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
              {customToolTipIcon('Industry')}
              <DebounceSelect
                disabled={isViewMode}
                showSearch
                mode="tags"
                tagRender={tagRender}
                value={isEditPathwayFormVisible ? industryTypes : undefined}
                placeholder="Start typing to select Industry Types"
                fetchOptions={fetchIndustryList}
                onSelect={(e: any) => onDebounceSelectHnadler(e, 'Industry')}
                onDeselect={(e: any) =>
                  onDebounceDeSelectHnadler(e, 'Industry')
                }
              />
              {/* <DebounceSelect
                disabled={isViewMode}
                mode="multiple"
                tagRender={tagRender}
                value={isEditPathwayFormVisible ? industryTypes : undefined}
                placeholder=" Start Typing to select the Industry type"
                fetchOptions={fetchIndustryList}
                onSelect={(e: any) => onDebounceSelectHnadler(e, 'Industry')}
                onDeselect={(e: any) =>
                  onDebounceDeSelectHnadler(e, 'Industry')
                }
              /> */}

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
                disabled={isViewMode}
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
                disabled={isViewMode}
                showSearch
                mode="tags"
                tagRender={tagRender}
                value={isEditPathwayFormVisible ? occupationTypes : undefined}
                placeholder="Start typing to select occupation types"
                fetchOptions={fetchOccupationList}
                onSelect={(e: any) => onDebounceSelectHnadler(e, 'Occupation')}
                onDeselect={(e: any) =>
                  onDebounceDeSelectHnadler(e, 'Occupation')
                }
              />
              {/* <DebounceSelect
                disabled={isViewMode}
                mode="multiple"
                tagRender={tagRender}
                value={isEditPathwayFormVisible ? occupationTypes : undefined}
                placeholder="Start typing to select the Occupation types"
                fetchOptions={fetchOccupationList}
                onSelect={(e: any) => onDebounceSelectHnadler(e, 'Occupation')}
                onDeselect={(e: any) =>
                  onDebounceDeSelectHnadler(e, 'Occupation')
                }
              /> */}
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
                  disabled={isViewMode}
                  showSearch
                  mode="tags"
                  tagRender={tagRender}
                  value={
                    isEditPathwayFormVisible
                      ? instructionalProgramTypes
                      : undefined
                  }
                  placeholder="Start typing to select Instructional Program Types"
                  fetchOptions={fetchInstructionalProgramList}
                  onSelect={(e: any) =>
                    onDebounceSelectHnadler(e, 'InstructionalProgram')
                  }
                  onDeselect={(e: any) =>
                    onDebounceDeSelectHnadler(e, 'InstructionalProgram')
                  }
                />
                {/* <DebounceSelect
                  disabled={isViewMode}
                  mode="multiple"
                  tagRender={tagRender}
                  value={
                    isEditPathwayFormVisible
                      ? instructionalProgramTypes
                      : undefined
                  }
                  placeholder="Select Instructional Program"
                  fetchOptions={fetchInstructionalProgramList}
                  onSelect={(e: any) =>
                    onDebounceSelectHnadler(e, 'InstructionalProgram')
                  }
                  onDeselect={(e: any) =>
                    onDebounceDeSelectHnadler(e, 'InstructionalProgram')
                  }
                /> */}
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
                disabled={isViewMode}
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
              label="Support Services"
              className="swNoMargin"
              wrapperCol={{ span: 24 }}
              labelCol={{ span: 24 }}
              validateTrigger="onBlur"
            >
              <>
                {customToolTipIcon('Support')}
                <DebounceSelect
                  disabled={isViewMode}
                  showSearch
                  mode="tags"
                  tagRender={tagRender}
                  //value={isEditPathwayFormVisible ? instructionalProgramTypes : undefined}
                  placeholder="Start typing to select Support Services"
                  fetchOptions={fetchSupportServices}
                  onSelect={(e: any) => onDebounceSelectHnadler(e, 'Support')}
                  onDeselect={(e: any) =>
                    onDebounceDeSelectHnadler(e, 'Support')
                  }
                />
              </>
              {toolTip.find((item: any) => item.type === 'Support').isVisible &&
                customToolTip('Support')}
            </Form.Item>
          </Col>
          <Divider className={styles.divider} />
          <br /> <br />
          <Col span={24}>
            <Form.Item
              label="Progression Model"
              className="swNoMargin"
              wrapperCol={{ span: 24 }}
              labelCol={{ span: 24 }}
              validateTrigger="onBlur"
            >
              {customToolTipIcon('Progression')}
              <CheckBox
                disabled={isEditPathwayFormVisible || isViewMode}
                onChange={onCheckBoxChangeHandler}
                checked={checkboxValues.progressionModel}
                name="progressionModel"
                label="This Pathway Contains a Progression Model"
              />
              {toolTip.find((item: any) => item.type === 'Progression')
                .isVisible && customToolTip('Progression')}
            </Form.Item>
          </Col>
          {!!checkboxValues.progressionModel && (
            <Col span={24}>
              <Form.Item
                // label="Progression Model"
                className="swNoMargin"
                wrapperCol={{ span: 24 }}
                labelCol={{ span: 24 }}
                validateTrigger="onBlur"
              >
                {/* {customToolTipIcon('Model')} */}
                <AutoCompleteBox
                  {...SelectAutoCompleteProps(
                    allProgressionModel,
                    selectedProgressionModelValue,
                    'Name',
                    'Name'
                  )}
                  allowClear={true}
                  disabled={isEditPathwayFormVisible || isViewMode}
                  value={selectedProgressionModelValue}
                  placeholder="Start typing to choose a Progression Model"
                  onSearch={onProgressionModelSearchHandler}
                  onSelect={(e: any) => onProgressionModelSelectHandler(e)}
                  onChange={(e: any) => onProgressionModelHandler(e)}
                />
                {/* {toolTip.find((item: any) => item.type === 'Progression').isVisible &&
                  customToolTip('Progression')} */}
              </Form.Item>
            </Col>
          )}
          {!isViewMode && (
            <Col span={24}>
              <Button
                type={Type.PRIMARY}
                onClick={() => onAddPathwayOkHandler()}
                text={isEditPathwayFormVisible ? 'Save' : 'Next'}
                disabled={!isAddPathwayFormNextButtonDisable}
              />
            </Col>
          )}
        </Row>
      </Form>
    </>
  );
};

export default AddPathwayForm;
