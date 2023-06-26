import CloseOutlined from '@ant-design/icons/CloseOutlined';
import {
  faCubes,
  faCircle,
  faQuestion,
  faChevronCircleDown,
  faChevronCircleUp,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Form, Modal, Row, Tag } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { v4 as uuidv4 } from 'uuid';

import Button from '../../components/button';
//import Dropdown from '../../components/formFields/dropdown';
import InputBox from '../../components/formFields/inputBox';
import { updateMappedDataRequest } from '../../states/actions';

import Constraint from './constraint';
import ConstraintV2 from './constraintV2';

import Styles from './index.module.scss';
import { ComponentConditionEntity } from './model';
import {
  getAllArrayConceptsRequest,
  getAllComparatorsRequest,
  getLogicalOperatorsRequest,
} from './state/actions';

interface Props {
  visibleConstraintConditionProp?: (bool: boolean) => void;
  lastIndexHasProgressionModelID?: string;
  data?: any;
  filteredConditionalComponent?: any;
  isDestinationCard?: any;
  filteredPathwayComponent?: any;
  setIsConditionalModalStatus?: (a: boolean) => void;
  HasProgressionLevel?: string;
  allComponentCardsData?: any;
  connectionsCTID?: any;
  allConditionalCardsData?: any;
  updatedPathwayComponentConditionCards?: any;
  isConditionalEditing?: boolean;
  setIsConditionalEditing?: (a: boolean) => void;
  progressionLevelForAddComponent?: string;
  isViewMode?: boolean;
}

const AddConditionalComponent: React.FC<Props> = (Props) => {
  const {
    visibleConstraintConditionProp,
    setIsConditionalModalStatus,
    allComponentCardsData,
    connectionsCTID,
    allConditionalCardsData,
    updatedPathwayComponentConditionCards,
    isConditionalEditing,
    setIsConditionalEditing,
    data,
    progressionLevelForAddComponent,
    isViewMode,
  } = Props;
  const [componentConditionFields, setComponentConditionFields] = useState<any>(
    new ComponentConditionEntity()
  );
  const [conditionalComponent, setConditionalComponent] = useState<any>([]);
  const [currentComponent, setCurrentComponent] = useState<any>();
  const [cardAlreadyExistOnDropWrapper, setCardAlreadyExistOnDropWrapper] =
    useState<boolean>(false);
  const [isTouched, setisTouched] = useState({
    requiredNumber: false,
    Name: false,
  });
  const [isTextShown, setIsTextShown] = useState(false);
  const [isActionTextShown, setActionIsTextShown] = useState(false);
  // const [isComparatorTextShown, setComparatorIsTextShown] = useState(false);
  const pathwayWrapper = useSelector((state: any) => state.initalReducer);
  const [isEditConstraintModalStatus, setIsEditConstraintModalStatus] =
    useState<boolean>(false);
  const [constraint, setConstraint] = useState<any>([]);
  const [rowIndex, setRowIndex] = useState<number>(1);

  const { mappedData: pathwayComponent } = pathwayWrapper;
  useEffect(() => {
    const allGameboardCards = [
      ...pathwayComponent.PathwayComponents,
      ...pathwayComponent.ComponentConditions,
    ];

    if (isConditionalEditing) {
      const parentCard = allGameboardCards?.filter(
        (card: any) => card.RowId == data?.ParentIdentifier
      );

      setCurrentComponent(parentCard[0]);
    } else {
      const currentPathwayComponent =
        allComponentCardsData[connectionsCTID.start];

      const currentConditionalComponent =
        allConditionalCardsData[connectionsCTID.start];

      setCurrentComponent(
        currentPathwayComponent || currentConditionalComponent
      );
    }
  }, [allComponentCardsData, connectionsCTID, allConditionalCardsData]);

  const [constraintRow, setConstraintRow] = useState<any>([]);
  const [consRowID, setConstRowId] = useState<any>([]);
  const [logicalOperator, setLogicalOperator] = useState<string>('');
  const [allogicalOperator, setAllLogicalOperator] = useState<any>({});
  const [hasConstraints, setHasConstraints] = useState<any>([]);
  const dispatch = useDispatch();

  const onInputChangeHandler = (e: any) => {
    const updatedData = { ...componentConditionFields };
    const { name, value } = e.target;
    updatedData[name] = value;

    setComponentConditionFields(updatedData);
  };

  const getAllLogicalOperator = useSelector(
    (state: any) => state.addConditionalComponent.logicalOperatorData
  );

  useEffect(() => {
    const updatedPathwayWrapper = { ...pathwayComponent };

    const currentPathwayComponent =
      allComponentCardsData[connectionsCTID?.start];
    const currentConditionalComponent =
      allConditionalCardsData[connectionsCTID?.start];
    const endPathwayComponent = allComponentCardsData[connectionsCTID?.end];

    if (conditionalComponent.length > 0) {
      /* in the below code we are adding RowId of the newly created conitional component inside the parent component*/
      if (
        !_.isUndefined(currentPathwayComponent) &&
        !_.isNull(currentPathwayComponent)
      ) {
        if (!_.isEmpty(currentPathwayComponent.HasCondition)) {
          currentPathwayComponent.HasCondition = [
            ...currentPathwayComponent.HasCondition,
            conditionalComponent[0].RowId,
          ];
          currentPathwayComponent.PrecededBy = [];
        } else {
          currentPathwayComponent.HasCondition = [
            conditionalComponent[0].RowId,
          ];
          currentPathwayComponent.PrecededBy = [];
        }
      }
      /* in the below code we are adding RowId of the newly created conitional component inside the parent conditional component*/
      if (
        !_.isUndefined(currentConditionalComponent) &&
        !_.isNull(currentConditionalComponent)
      ) {
        if (!_.isEmpty(currentConditionalComponent.HasCondition)) {
          currentConditionalComponent.HasCondition = [
            ...currentConditionalComponent.HasCondition,
            conditionalComponent[0].RowId,
          ];
        } else {
          currentConditionalComponent.HasCondition = [
            conditionalComponent[0].RowId,
          ];
        }
      }

      /* getting here all the conditional component those are outside the to the current progression level*/
      const conditionalComponentOutOfProgressionLevel =
        updatedPathwayComponentConditionCards?.filter(
          (conditional_Card: any) =>
            _.toString(conditional_Card?.HasProgressionLevel) !==
            _.toString(progressionLevelForAddComponent)
        );

      /* getting here rest conditional component except current conitional component which are inside the to the current progression level*/

      const restConditionalComponentInProgressionLevel1 =
        updatedPathwayComponentConditionCards?.filter(
          (conditional_Card: any) =>
            _.toString(conditional_Card?.HasProgressionLevel) ===
              _.toString(progressionLevelForAddComponent) &&
            _.toString(conditional_Card?.RowId) !==
              _.toString(currentConditionalComponent?.RowId) &&
            conditional_Card?.RowNumber == conditionalComponent[0].RowNumber
        );
      const conditionalComponentOutOfProgressionLevelRow =
        updatedPathwayComponentConditionCards?.filter(
          (conditional_Card: any) =>
            _.toString(conditional_Card?.HasProgressionLevel) ===
              _.toString(progressionLevelForAddComponent) &&
            conditional_Card?.RowNumber !== conditionalComponent[0].RowNumber
        );
      const uniqueConditionalArray: any =
        !_.isUndefined(currentConditionalComponent) &&
        !_.isNull(currentConditionalComponent) &&
        currentConditionalComponent?.RowNumber >
          conditionalComponent[0].RowNumber
          ? [
              ...new Set([
                ...restConditionalComponentInProgressionLevel1,
                currentConditionalComponent,
                currentComponent,
              ]),
            ]
          : [...new Set([...restConditionalComponentInProgressionLevel1])];
      let componentCardInProgressionLevel: any = [];
      if (
        pathwayComponent?.Pathway?.HasProgressionModel &&
        pathwayComponent?.Pathway?.HasProgressionModel.length > 0
      ) {
        if (progressionLevelForAddComponent !== '') {
          componentCardInProgressionLevel =
            pathwayComponent?.PathwayComponents?.filter(
              (card: any) =>
                card?.HasProgressionLevel === progressionLevelForAddComponent &&
                card?.RowNumber == conditionalComponent[0].RowNumber
            );
        } else {
          componentCardInProgressionLevel =
            pathwayComponent?.PathwayComponents?.filter(
              (card: any) =>
                card?.CTID !==
                  pathwayComponent?.Pathway?.HasDestinationComponent &&
                card?.RowNumber == conditionalComponent[0].RowNumber
            );
        }
      } else {
        if (
          progressionLevelForAddComponent !== '' &&
          progressionLevelForAddComponent !== undefined
        ) {
          componentCardInProgressionLevel =
            pathwayComponent?.PathwayComponents?.filter(
              (card: any) =>
                card?.CTID !==
                  pathwayComponent?.Pathway?.HasDestinationComponent &&
                card?.RowNumber == conditionalComponent[0].RowNumber
            );
        } else {
          componentCardInProgressionLevel =
            pathwayComponent?.PathwayComponents?.filter(
              (card: any) =>
                card?.CTID ===
                pathwayComponent?.Pathway?.HasDestinationComponent
            );
        }
      }
      const uniquePathwayComponentArray =
        !_.isUndefined(currentPathwayComponent) &&
        !_.isNull(currentPathwayComponent)
          ? [
              ...new Set([
                ...componentCardInProgressionLevel,
                currentPathwayComponent,
              ]),
            ]
          : [...new Set([...componentCardInProgressionLevel])];

      let updatedPathwayComponentArray: any = [];
      let updatedConditionalArray: any = [];
      if (!cardAlreadyExistOnDropWrapper) {
        updatedPathwayComponentArray = uniquePathwayComponentArray.map(
          (a: any) => ({
            ...a,
            ColumnNumber: a?.destinationColumn
              ? a?.ColumnNumber + 1
              : conditionalComponent[0].ColumnNumber <= a?.ColumnNumber
              ? a?.ColumnNumber + 1
              : a?.ColumnNumber,
          })
        );

        updatedConditionalArray = uniqueConditionalArray
          .map((a: any) => ({
            ...a,
            ColumnNumber:
              conditionalComponent[0].ColumnNumber <= a?.ColumnNumber
                ? a.ColumnNumber + 1
                : a.ColumnNumber,
          }))
          .concat(conditionalComponent);
      } else {
        updatedConditionalArray = [
          ...uniqueConditionalArray,
          ...conditionalComponent,
        ];

        updatedPathwayComponentArray = uniquePathwayComponentArray;
      }

      const allComponentConditionalCard = [
        ...conditionalComponentOutOfProgressionLevelRow,
        ...conditionalComponentOutOfProgressionLevel,
        ...updatedConditionalArray,
      ];

      const allPathwayComponentCard = [
        ...updatedPathwayWrapper.PathwayComponents,
        ...updatedPathwayComponentArray,
      ];
      if (endPathwayComponent !== undefined) {
        allPathwayComponentCard.map((item) => {
          if (item.CTID === endPathwayComponent.CTID) {
            return {
              ...item,
              Precedes: [],
            };
          }
        });
      }

      const uniqueAllPathwayComponentArray = [
        ...new Map(
          allPathwayComponentCard.map((item: any) => [item['CTID'], item])
        ).values(),
      ];
      const uniqueAllConditionalArray = [
        ...new Map(
          allComponentConditionalCard.map(
            (item: any) => [item['RowId'], item] && [item['HasCondition'], item]
          )
        ).values(),
      ];

      let finalConditionalComponentsList: any = [];
      if (currentComponent?.Type === 'conditional') {
        finalConditionalComponentsList = uniqueAllConditionalArray
          ?.filter(
            (conditional_card: any) =>
              conditional_card.RowId !== currentComponent?.RowId
          )
          .concat({
            ...currentComponent,
            TargetComponent: [],
            ColumnNumber:
              currentComponent?.ColumnNumber ===
              conditionalComponent[0].ColumnNumber
                ? currentComponent?.ColumnNumber + 1
                : currentComponent?.ColumnNumber,
          });
      } else {
        finalConditionalComponentsList = uniqueAllConditionalArray;
      }

      updatedPathwayWrapper.ComponentConditions =
        finalConditionalComponentsList;
      updatedPathwayWrapper.PathwayComponents = uniqueAllPathwayComponentArray;

      updatedPathwayWrapper.Constraints = [
        ...updatedPathwayWrapper?.Constraints,
        ...constraintRow.map((v: any) => ({
          ...v,
          RowId: consRowID,
          Name: componentConditionFields.Name,
          Description: componentConditionFields.Description,
        })),
      ];
      dispatch(updateMappedDataRequest(updatedPathwayWrapper));
      setConditionalComponent([]);
      !!visibleConstraintConditionProp && visibleConstraintConditionProp(false);
      !!setIsConditionalModalStatus && setIsConditionalModalStatus(false);
      !!setIsConditionalEditing && setIsConditionalEditing(false);
    }
  }, [conditionalComponent]);

  const saveCondition = () => {
    if (
      /* currentComponent?.Type !== 'conditional' && */ !isConditionalEditing
    ) {
      const conditionalCardAlreadyExistForDestination =
        updatedPathwayComponentConditionCards?.filter(
          (condtional_card: any) =>
            _.toString(condtional_card?.ParentIdentifier) ===
            _.toString(currentComponent?.RowId)
        );
      //debugger;
      const maximumRowNumber = conditionalCardAlreadyExistForDestination.reduce(
        (acc: any, curr: any) => {
          if (acc >= curr) {
            return acc.RowNumber;
          } else {
            return curr.RowNumber;
          }
        },
        currentComponent?.RowNumber
      );

      setCardAlreadyExistOnDropWrapper(
        conditionalCardAlreadyExistForDestination.length > 0 ? true : false
      );
      const getLogicalOperatorURI = allogicalOperator?.LogicalOperator?.filter(
        (getURI: any) => logicalOperator === getURI?.Name
      );
      const ComponentConditions = {
        ParentIdentifier:
          conditionalCardAlreadyExistForDestination?.length > 0
            ? conditionalCardAlreadyExistForDestination[0]?.ParentIdentifier
            : currentComponent?.RowId,
        Description: componentConditionFields.Description,
        RequiredNumber: componentConditionFields.RequiredNumber,
        RequiredConstraints: componentConditionFields.RequiredConstraints,
        LogicalOperator: getLogicalOperatorURI[0]?.URI,
        HasConstraint: hasConstraints,
        ColumnNumber:
          conditionalCardAlreadyExistForDestination.length > 0
            ? conditionalCardAlreadyExistForDestination[0]?.ColumnNumber
            : currentComponent?.destinationColumn
            ? currentComponent?.ColumnNumber
            : currentComponent?.ColumnNumber,
        RowNumber:
          conditionalCardAlreadyExistForDestination?.length > 0
            ? maximumRowNumber + 1
            : currentComponent?.RowNumber,
        RowId: uuidv4(),
        Name: componentConditionFields.Name,
        TargetComponent:
          conditionalCardAlreadyExistForDestination.length > 0
            ? []
            : currentComponent?.PrecededBy ||
              currentComponent?.TargetComponent ||
              [],
        HasCondition: [],
        HasProgressionLevel: progressionLevelForAddComponent,
      };
      setConditionalComponent([ComponentConditions]);
    }

    if (data?.Type === 'conditional' && isConditionalEditing) {
      const updatedPathwayWrapper = { ...pathwayComponent };

      if (pathwayComponent?.ComponentConditions.length > 0) {
        let currentConditionalComponent = _.get(
          pathwayComponent?.ComponentConditions?.filter(
            (condition_card: any) =>
              condition_card.RowId === _.toString(data.RowId)
          ),
          '0'
        );

        if (data.HasProgressionLevel == '') {
          componentConditionFields.HasProgressionLevel =
            currentConditionalComponent?.HasProgressionLevel;
          // console.log(componentConditionFields);
        }
        if (
          !_.isUndefined(currentConditionalComponent) &&
          !_.isNull(currentConditionalComponent)
        ) {
          currentConditionalComponent = { ...componentConditionFields };
        }

        const remainingCompCond = pathwayComponent?.ComponentConditions?.filter(
          (item: any) => item?.RowId !== data?.RowId
        );
        const cardsToSend = remainingCompCond?.concat(
          currentConditionalComponent
        );
        updatedPathwayWrapper.ComponentConditions = cardsToSend;
        let getLogicalOperatorURI = [];
        if (logicalOperator) {
          getLogicalOperatorURI = allogicalOperator?.LogicalOperator?.filter(
            (getURI: any) =>
              logicalOperator == getURI?.Name || logicalOperator == getURI?.URI
          );
        }

        const hasConstraintsIds: string[] = [];

        constraintRow.map((constraintRow: any) =>
          hasConstraintsIds.push(constraintRow.RowId)
        );

        const updatedPathwayComponent =
          updatedPathwayWrapper?.ComponentConditions?.filter(
            (component_card: any) =>
              component_card?.RowId !== currentConditionalComponent?.RowId
          ).concat({
            ...componentConditionFields,
            LogicalOperator: getLogicalOperatorURI[0]?.URI,
            HasConstraint: hasConstraintsIds
              ? _.uniq(hasConstraintsIds)
              : hasConstraints,
          });
        const updatedPathwayConstraint =
          updatedPathwayWrapper?.Constraints?.filter(
            (Constraints_card: any) =>
              !hasConstraintsIds.includes(Constraints_card?.RowId) /* .map(
              (ids: string) => Constraints_card?.RowId !== ids
            ) */
          ).concat([...constraintRow]);

        updatedPathwayWrapper.ComponentConditions = [
          ...updatedPathwayComponent,
        ];
        updatedPathwayWrapper.Constraints = [...updatedPathwayConstraint];
        !!visibleConstraintConditionProp &&
          visibleConstraintConditionProp(false);
        !!setIsConditionalModalStatus && setIsConditionalModalStatus(false);
        !!setIsConditionalEditing && setIsConditionalEditing(false);

        dispatch(updateMappedDataRequest(updatedPathwayWrapper));
      }
    }
  };

  useEffect(() => {
    if (isConditionalEditing) {
      const constraintToStore = [] as any;
      const updatedPathwayWrapper = { ...pathwayComponent };
      if (data && data?.HasConstraint) {
        data?.HasConstraint?.map((constraint: any) => {
          pathwayComponent?.Constraints?.map((pathwayConstraint: any) => {
            if (pathwayConstraint?.RowId === constraint) {
              constraintToStore.push(_.cloneDeep(pathwayConstraint));
            }
          });
        });
      }
      updatedPathwayWrapper.Constraints = [
        ...updatedPathwayWrapper?.Constraints,
        ...constraintRow.map((v: any) => ({
          ...v,
          RowId: consRowID,
          // Name: "",
          // Description: "",
          ParentIdentifier: componentConditionFields.RowId,
        })),
      ];
      const currentConditionalComponent = _.get(
        pathwayComponent?.ComponentConditions?.filter(
          (condition_card: any) =>
            condition_card.RowId === _.toString(data.RowId)
        ),
        '0'
      );

      setConstraintRow(constraintToStore);
      setLogicalOperator(currentConditionalComponent?.LogicalOperator);
      setComponentConditionFields({
        ...componentConditionFields,
        ...data,
      });
      dispatch(updateMappedDataRequest(updatedPathwayWrapper));
    }
  }, [isConditionalEditing]);

  const constraintRowData = {
    LeftAction: [],
    LeftSource: [],
    Comparator: [],
    RightAction: [],
    RightSource: [],
    id: 0,
    Name: '',
    RowId: currentComponent?.RowId,
    Description: '',
  };
  const toggleText = () => {
    setIsTextShown(!isTextShown);
  };
  const toggleActionText = () => {
    setActionIsTextShown(!isActionTextShown);
  };
  // const toggleComparatorText = () => {
  //   setComparatorIsTextShown(!isComparatorTextShown);
  // };
  useEffect(() => {
    if (getAllLogicalOperator.valid)
      setAllLogicalOperator({
        LogicalOperator: getAllLogicalOperator.data?.map((dta: any) => ({
          ...dta,
          value: dta.Name,
          label: dta.Name,
        })),
      });
  }, [getAllLogicalOperator]);

  useEffect(() => {
    dispatch(getLogicalOperatorsRequest());
    dispatch(getAllComparatorsRequest());
    dispatch(getAllArrayConceptsRequest());
  }, []);

  const addConstraintRow = () => {
    const mId = uuidv4();
    const rowCon = [
      ...constraintRow,
      {
        ...constraintRowData,
        RowId: mId,
        id: 0,
        ParentIdentifier: componentConditionFields.RowId,
      },
    ];

    setConstraintRow(rowCon);
    setConstRowId(mId);
    setHasConstraints([...hasConstraints, mId]);
    setIsEditConstraintModalStatus(true);
    //debugger;
    // console.log(rowCon[rowCon.length - 1])
    setConstraint(rowCon[rowCon.length - 1]);
    //	console.log("rowCon", rowCon);
    //console.log("Has constraints", hasConstraints);
  };

  const EditConstraintRow = (RowIndex: any, ConstraintData: any) => {
    setIsEditConstraintModalStatus(true);
    setConstraint(ConstraintData);
    setRowIndex(RowIndex);
    //	console.log("rowCon", rowCon);
    //console.log("Has constraints", hasConstraints);
  };
  // const selectedComparators = (value: any) => {
  //   setLogicalOperator(value);
  // };
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
      type: 'RequiredNumber',
      isVisible: false,
    },
    {
      type: 'Logic',
      isVisible: false,
    },
    {
      type: 'RequiredConstraints',
      isVisible: false,
    },
    {
      type: 'ParentComponent',
      isVisible: false,
    },
    {
      type: 'test',
      isVisible: false,
    },
  ]);

  const getToolTipText = (value: string) => {
    let text = '';
    switch (value) {
      case 'Name':
        text = 'Name of the Condition.';
        break;
      case 'Description':
        text = 'Statement, characterization or account of the entity.';
        break;
      case 'RequiredNumber':
        text =
          'The Required Number field indicates how many of the Components and Conditions that branch out to the left of these Condtions are required to be satisfied in order for these Conditions to be true (in addition to any other constraints indicated below). Use 0 if the items that branch out to the left are entirely optional';
        break;
      case 'Logic':
        text =
          'The logical operator indicates how the constraints below, as well as any other Conditions that branch out to the left of these Conditions, should be evaluated. For example, select "And" to indicate that all of the constraints must be true in order for these conditions to be met; select "Or" to indicate that only one needs to be true.';
        break;
      case 'RequiredConstraints':
        text =
          'The Required Constraints field indicates the number of constraints that are required to satisfy this condition';
        break;
      case 'ParentComponent':
        text = 'Parent Component of this condition.';
        break;
      case 'test':
        text = 'Parent Component of this condition.';
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

  const onShowCloseToolTip = (type: any, visibility: boolean) => {
    const toolTipArray =
      toolTip &&
      toolTip.map((item: any) =>
        item.type === type ? { ...item, isVisible: visibility } : item
      );
    setToolTip(toolTipArray);
  };
  const getConstraintData = (val: any) => {
    let matchIndex = -1;
    constraintRow.find((item: any, index: number) => {
      item.RowId == val.RowId && (matchIndex = index);
    });
    matchIndex > -1 && (constraintRow[matchIndex] = val);
    setConstraintRow([...constraintRow]);
    /*
    const filteredConstraintRow = constraintRow?.map((item: any) => {
      if (val?.id !== null && item?.id === val?.id) {
        return (item = val);
      } else {
        return item;
      }
    });
    setConstraintRow([...filteredConstraintRow]);
		*/
  };
  const handleDeleteRow = (rowIndex: number) => {
    // debugger;
    const deletedRow = constraintRow.splice(rowIndex, 1);
    const updatedPathwayWrapper = { ...pathwayComponent };
    _.remove(
      updatedPathwayWrapper?.Constraints,
      (constraints: any) => constraints.RowId == deletedRow[0]?.RowId
    );
    dispatch(updateMappedDataRequest(updatedPathwayWrapper));

    // if (rowIndex !== 0) {
    setConstraintRow([...constraintRow]);
    // } else {
    //   setConstraintRow([]);
    // }
  };
  return (
    <div className={Styles.addComponentwrapper}>
      <Form>
        {/* <h2>Add Condition</h2> */}
        <div className={Styles.iconheader}>
          <span className={Styles.iconwrapper + ' iconwrapper'}>
            <FontAwesomeIcon
              icon={faCubes}
              style={{ height: '15px' }}
              color="black"
            />
          </span>
          <h2 style={{ margin: 0 }}>
            Component Condition for{' '}
            <i>{currentComponent?.Name || 'Parent Component'}</i>
          </h2>
        </div>
        {/* <Form.Item
        wrapperCol={{ span: 24 }}
        labelCol={{ span: 24 }}
        label="Parent Component">
          {customToolTipIcon('ParentComponent')}
          <InputBox
            disabled={isViewMode}
            name="ParentIdentifier"
            value={currentComponent?.Name}
          />
            {toolTip.find((item: any) => item.type === 'ParentComponent')
                .isVisible && customToolTip('ParentComponent')}
        </Form.Item> */}
        <Form.Item
          required={true}
          wrapperCol={{ span: 24 }}
          labelCol={{ span: 24 }}
          label="Name"
          validateTrigger="onBlur"
          help={
            (_.isEmpty(componentConditionFields.Name) ||
              _.isNull(componentConditionFields.Name)) &&
            isTouched.Name
              ? 'Name is Required'
              : null
          }
        >
          {customToolTipIcon('Name')}
          <InputBox
            disabled={isViewMode}
            onChange={onInputChangeHandler}
            placeholder="Name"
            name="Name"
            value={componentConditionFields.Name}
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
        <Form.Item
          label="Condition Description"
          wrapperCol={{ span: 24 }}
          labelCol={{ span: 24 }}
        >
          {customToolTipIcon('Description')}
          <TextArea
            disabled={isViewMode}
            onChange={onInputChangeHandler}
            rows={3}
            name="Description"
            value={componentConditionFields.Description}
            placeholder="Description"
          />
          {toolTip.find((item: any) => item.type === 'Description').isVisible &&
            customToolTip('Description')}
        </Form.Item>
        <Row gutter={20}>
          <Col span="12">
            <Form.Item
              required={true}
              wrapperCol={{ span: 24 }}
              labelCol={{ span: 24 }}
              label="Required Target Components and Conditions"
              validateTrigger="onBlur"
              help={
                (_.isEmpty(componentConditionFields.RequiredNumber) ||
                  _.isNull(componentConditionFields.RequiredNumber)) &&
                isTouched.requiredNumber
                  ? 'Number is Required'
                  : null
              }
            >
              {customToolTipIcon('RequiredNumber')}
              <InputBox
                disabled={isViewMode}
                type="number"
                placeholder="Required Target Components and Conditions"
                onChange={onInputChangeHandler}
                min={1}
                name="RequiredNumber"
                value={componentConditionFields.RequiredNumber}
                required={true}
                onBlur={() =>
                  isTouched.requiredNumber === true
                    ? null
                    : setisTouched({ ...isTouched, requiredNumber: true })
                }
              />
              {toolTip.find((item: any) => item.type === 'RequiredNumber')
                .isVisible && customToolTip('RequiredNumber')}
            </Form.Item>
          </Col>

          {/* <Col span="12">
            <Form.Item
              label="Logical Operator"
              wrapperCol={{ span: 24 }}
              labelCol={{ span: 24 }}
            >
              {customToolTipIcon('Logic')}
              <Dropdown
                disabled={isViewMode}
                options={allogicalOperator?.LogicalOperator}
                showSearch={false}
                placeholder="Select Logical Operator"
                value={logicalOperator}
                onChange={(e) => selectedComparators(e)}
              />
                 {toolTip.find((item: any) => item.type === 'Logic')
                .isVisible && customToolTip('Logic')}
            </Form.Item>
          </Col> */}
        </Row>
        <div className={Styles.divider}>
          <label>Constraints</label>
          <div>
            Constraints enable you to precisely define the requirements that
            must be satisfied by the components and conditions on the left of
            these conditions in order to progress to the component on the right
            of these conditions. For a detailed explanation of how constraints
            work, consult the{' '}
            <a
              href="https://credreg.net/ctdl/handbook#pathwaylevel3"
              target="_blank"
              rel="noreferrer"
            >
              CTDL Handbook
            </a>
            .
          </div>
          <Row>
            <Col span="14">
              <a onClick={toggleText}>
                {isTextShown
                  ? 'Hide Constraints Description'
                  : 'Show Constraints Description'}
                {isTextShown ? (
                  <FontAwesomeIcon
                    icon={faChevronCircleUp}
                    className={Styles.iconPrimary}
                  ></FontAwesomeIcon>
                ) : (
                  <FontAwesomeIcon
                    icon={faChevronCircleDown}
                    className={Styles.iconPrimary}
                  ></FontAwesomeIcon>
                )}
              </a>
              {isTextShown && (
                <>
                  <ul>
                    Each Constraint consists of several fields:
                    <li>
                      The <b>Left Source</b> and <b>Right Source</b> fields each
                      reference one or more data points related to the Pathway
                      Components and/or Component Conditions referenced by this
                      Component Condition.
                    </li>
                    <li>
                      <b>Left Source</b> and <b>Right Source</b> may reference
                      CTDL classes, properties, concepts, or your own custom
                      concepts, or simple text or numeric values.
                    </li>
                    <li>
                      If either the <b>Left Source</b> or <b>Right Source</b>{' '}
                      references more than one data point, provide the
                      corresponding <b>Left Action</b> or <b>Right Action</b> to
                      indicate how that Source should be treated (see below).{' '}
                    </li>
                    <li>
                      The <b>Comparator </b> field indicates how those two sets
                      of data points should be compared, e.g.{' '}
                      <b>
                        <i>
                          &quot; Credit Value must be greater than 3 &quot; or
                          &quot;Student Grade must be one of A, B, or C&quot;,
                          or &quot;Sum of years of experience and apprenticeship
                          experience must be greater than or equal to one of six
                          months or the estimated duration&quot;
                        </i>
                      </b>{' '}
                      of the items referenced by this Component Condition
                    </li>
                  </ul>
                  <p></p>
                </>
              )}
            </Col>
            <Col span="10">
              <a onClick={toggleActionText}>
                {isActionTextShown
                  ? 'Hide Actions Vocabulary'
                  : 'Show Actions Vocabulary'}
                {isActionTextShown ? (
                  <FontAwesomeIcon
                    icon={faChevronCircleUp}
                    className={Styles.iconPrimary}
                  ></FontAwesomeIcon>
                ) : (
                  <FontAwesomeIcon
                    icon={faChevronCircleDown}
                    className={Styles.iconPrimary}
                  ></FontAwesomeIcon>
                )}
              </a>
              {isActionTextShown && (
                <>
                  <table>
                    <thead>
                      <tr>
                        <th>Action</th>
                        <th>Action Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>All Of</td>
                        <td>All of the values.</td>
                      </tr>
                      <tr>
                        <td>Any Of</td>
                        <td>Any (one or more) of the values.</td>
                      </tr>
                      <tr>
                        <td>Count Distinct</td>
                        <td>The number of unique values; yields a number.</td>
                      </tr>
                      <tr>
                        <td>Maximum</td>
                        <td>Maximum Value</td>
                      </tr>
                      <tr>
                        <td>Mean</td>
                        <td>The arithmetic mean of all the values.</td>
                      </tr>
                      <tr>
                        <td>Minimum</td>
                        <td>Minimum Value</td>
                      </tr>
                      <tr>
                        <td>One Of</td>
                        <td>One of the values.</td>
                      </tr>
                      <tr>
                        <td>Sum</td>
                        <td>Sum of the Values</td>
                      </tr>
                    </tbody>
                  </table>
                </>
              )}
            </Col>
            {/* <Col span="5">
          <a onClick={toggleComparatorText}>
          {isComparatorTextShown?"Hide Comparator Vocabulary":"Show Comparator Vocabulary"}
          {isComparatorTextShown ?<FontAwesomeIcon icon={faChevronCircleUp} className={Styles.iconPrimary}></FontAwesomeIcon>:  <FontAwesomeIcon icon={faChevronCircleDown} className={Styles.iconPrimary}></FontAwesomeIcon>}
          </a>
      {isComparatorTextShown && (
          <><table>
          <thead>
            <tr>
              <th>Comparator</th>
              <th>Comparator Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Equal To</td>
              <td>Left source equals to right source, eg Credits Equal to 120</td>
            </tr>
            <tr>
              <td>Greater Than</td>
              <td>Any (one or more) of the values.</td>
            </tr>
            <tr>
              <td>Greater Than or Equal To</td>
              <td>The number of unique values; yields a number.</td>
            </tr>
            <tr>
              <td>Less Than</td>
              <td>Maximum Value</td>
            </tr>
            <tr>
              <td>Less Than or Equal To</td>
              <td>The arithmetic mean of all the values.</td>
            </tr>
            <tr>
              <td>Not Equal To</td>
              <td>Minimum Value</td>
            </tr>
          </tbody>
        </table></>
      )}
          </Col> */}
          </Row>

          <hr className="min-top" />
        </div>
        <Col span="12">
          <Form.Item
            //required={true}
            wrapperCol={{ span: 24 }}
            labelCol={{ span: 24 }}
            label="Required Constraints"
            validateTrigger="onBlur"
          >
            {customToolTipIcon('RequiredConstraints')}
            <InputBox
              disabled={isViewMode}
              type="number"
              placeholder="Required Constraints"
              onChange={onInputChangeHandler}
              min={1}
              name="RequiredConstraints"
              value={componentConditionFields.RequiredConstraints}
            />
            {toolTip.find((item: any) => item.type === 'RequiredConstraints')
              .isVisible && customToolTip('RequiredConstraints')}
          </Form.Item>
        </Col>

        {constraintRow &&
          constraintRow?.map((constraintRowData: any, RowIndex: any) => (
            <>
              {!isViewMode && (
                <u
                  onClick={() => EditConstraintRow(RowIndex, constraintRowData)}
                  style={{ cursor: 'pointer' }}
                >
                  Edit Constraint
                </u>
              )}

              <Constraint
                key={RowIndex}
                RowIndex={RowIndex}
                constraintRow={constraintRowData}
                getConstraintData={(val: any) => getConstraintData(val)}
                deleteRowByIndex={(rowIndex: any) => handleDeleteRow(rowIndex)}
                isViewMode={isViewMode}
              />
            </>
          ))}
        <p>
          {!isViewMode && (
            <u onClick={() => addConstraintRow()} style={{ cursor: 'pointer' }}>
              Add another constraint
            </u>
          )}
        </p>

        <hr />
        <Button
          size="medium"
          text="Save Condition"
          type="primary"
          disabled={
            _.isEmpty(
              componentConditionFields.RequiredNumber &&
                componentConditionFields.Name
            ) || isViewMode
          }
          onClick={saveCondition}
        />
      </Form>
      {isEditConstraintModalStatus && (
        <Modal
          width="20vw"
          visible={isEditConstraintModalStatus}
          title=""
          footer={[]}
          onCancel={() => {
            setIsEditConstraintModalStatus(false);
          }}
        >
          {constraintRow && (
            <ConstraintV2
              key={rowIndex}
              RowIndex={rowIndex}
              constraintRow={constraint}
              getConstraintData={(val: any) => getConstraintData(val)}
              deleteRowByIndex={(rowIndex: any) => handleDeleteRow(rowIndex)}
              isViewMode={isViewMode}
              setIsEditConstraintModalStatus={setIsEditConstraintModalStatus}
            />
          )}
        </Modal>
      )}
    </div>
  );
};

export default AddConditionalComponent;
