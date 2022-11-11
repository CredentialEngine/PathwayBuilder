import { faCubes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Form, Row } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { v4 as uuidv4 } from 'uuid';

import Button from '../../components/button';
import Dropdown from '../../components/formFields/dropdown';
import InputBox from '../../components/formFields/inputBox';
import { updateMappedDataRequest } from '../../states/actions';

import Constraint from './constraint';

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
  } = Props;
  const [componentConditionFields, setComponentConditionFields] = useState<any>(
    new ComponentConditionEntity()
  );
  const [conditionalComponent, setConditionalComponent] = useState<any>([]);
  const [currentComponent, setCurrentComponent] = useState<any>();
  const [cardAlreadyExistOnDropWrapper, setCardAlreadyExistOnDropWrapper] =
    useState<boolean>(false);

  useEffect(() => {
    const currentPathwayComponent =
      allComponentCardsData[connectionsCTID.start];
    const currentConditionalComponent =
      allConditionalCardsData[connectionsCTID.start];
    setCurrentComponent(currentPathwayComponent || currentConditionalComponent);
  }, [allComponentCardsData, connectionsCTID, allConditionalCardsData]);

  const [constraintRow, setConstraintRow] = useState<any>([]);
  const [consRowID, setConstRowId] = useState<any>([]);
  const [hasConstraints, setHasConstraints] = useState<any>([]);
  const dispatch = useDispatch();

  const pathwayWrapper = useSelector((state: any) => state.initalReducer);
  const { mappedData: pathwayComponent } = pathwayWrapper;

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
    if (conditionalComponent.length > 0 && !cardAlreadyExistOnDropWrapper) {
      const currentPathwayComponent =
        allComponentCardsData[connectionsCTID.start];
      const currentConditionalComponent =
        allConditionalCardsData[connectionsCTID.start];

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
        } else {
          currentPathwayComponent.HasCondition = [
            conditionalComponent[0].RowId,
          ];
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
              _.toString(currentConditionalComponent?.RowId)
        );
      const uniqueConditionalArray: any =
        !_.isUndefined(currentConditionalComponent) &&
        !_.isNull(currentConditionalComponent)
          ? [
              ...new Set([
                ...restConditionalComponentInProgressionLevel1,
                currentConditionalComponent,
              ]),
            ]
          : [...new Set([...restConditionalComponentInProgressionLevel1])];

      const componentCardInProgressionLevel =
        pathwayComponent?.PathwayComponents?.filter(
          (card: any) =>
            card?.HasProgressionLevel === progressionLevelForAddComponent
        );

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
      const updatedPathwayComponentArray = uniquePathwayComponentArray.map(
        (a: any) => ({
          ...a,
          ColumnNumber: a?.destinationColumn
            ? a?.ColumnNumber
            : conditionalComponent[0].ColumnNumber <= a?.ColumnNumber
            ? a?.ColumnNumber + 1
            : a?.ColumnNumber,
        })
      );

      const updatedConditionalArray = uniqueConditionalArray
        .map((a: any) => ({
          ...a,
          ColumnNumber:
            conditionalComponent[0].ColumnNumber <= a?.ColumnNumber
              ? a.ColumnNumber + 1
              : a.ColumnNumber,
        }))
        .concat(conditionalComponent);
      const allComponentConditionalCard = [
        ...conditionalComponentOutOfProgressionLevel,
        ...updatedConditionalArray,
      ];

      const allPathwayComponentCard = [
        ...updatedPathwayWrapper.PathwayComponents,
        ...updatedPathwayComponentArray,
      ];

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
          .concat({ ...currentComponent, TargetComponent: [] });
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
          ParentIdentifier: data?.RowId,
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
    } else if (cardAlreadyExistOnDropWrapper) {
      updatedPathwayWrapper.ComponentConditions = [
        ...updatedPathwayWrapper.ComponentConditions,
        ...conditionalComponent,
      ];
      setConditionalComponent([]);
      !!visibleConstraintConditionProp && visibleConstraintConditionProp(false);

      !!setIsConditionalModalStatus && setIsConditionalModalStatus(false);

      !!setIsConditionalEditing && setIsConditionalEditing(false);

      dispatch(updateMappedDataRequest(updatedPathwayWrapper));
    }
  }, [conditionalComponent]);

  useEffect(() => {
    if (isConditionalEditing) {
      const constraintToStore = [] as any;
      // if (data && data?.HasConstraint) {
      //   data?.HasConstraint?.map((constraint: any) => {
      //     pathwayComponent?.Constraints?.map((pathwayConstraint: any) => {
      //       if (pathwayConstraint?.RowId === constraint) {
      //         constraintToStore.push(_.cloneDeep(pathwayConstraint));
      //       }
      //     });
      //   });
      // }
      setConstraintRow(constraintToStore);
      setComponentConditionFields({
        ...componentConditionFields,
        ...data,
      });
    }
  }, [isConditionalEditing]);

  const constraintRowData = {
    LeftAction: [],
    LeftSource: [],
    Comparator: [],
    RightAction: [],
    RightSource: [],
    id: 0,
    Name: componentConditionFields.Name,
    RowId: currentComponent?.RowId,
    name: componentConditionFields.Name,
    Description: componentConditionFields.Description,
  };

  useEffect(() => {
    if (!isConditionalEditing) {
      if (getAllLogicalOperator.valid)
        setComponentConditionFields({
          ...componentConditionFields,
          LogicalOperator: getAllLogicalOperator.data.map((dta: any) => ({
            ...dta,
            value: dta.Name,
            label: dta.Name,
          })),
        });
    }
  }, [getAllLogicalOperator]);

  useEffect(() => {
    dispatch(getLogicalOperatorsRequest());
    dispatch(getAllComparatorsRequest());
    dispatch(getAllArrayConceptsRequest());
  }, []);

  const saveCondition = () => {
    if (currentComponent?.Type !== 'conditional' || !isConditionalEditing) {
      const conditionalCardAlreadyExistForDestination =
        updatedPathwayComponentConditionCards?.filter(
          (condtional_card: any) =>
            _.toString(condtional_card.ParentIdentifier) ===
            _.toString(connectionsCTID?.start)
        );

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
      const ComponentConditions = {
        ParentIdentifier: connectionsCTID?.start,
        Description: componentConditionFields.Description,
        RequiredNumber: componentConditionFields.RequiredNumber,
        LogicalOperator: componentConditionFields.LogicalOperator,
        HasConstraint: Constraint,
        ColumnNumber:
          conditionalCardAlreadyExistForDestination.length > 0
            ? conditionalCardAlreadyExistForDestination[0]?.ColumnNumber
            : currentComponent?.destinationColumn
            ? currentComponent?.ColumnNumber + 1
            : currentComponent?.ColumnNumber + 1,
        RowNumber:
          conditionalCardAlreadyExistForDestination?.length > 0
            ? maximumRowNumber + 1
            : currentComponent?.RowNumber,
        RowId: uuidv4(),
        Name: componentConditionFields.Name,
        TargetComponent: [connectionsCTID?.end],
        HasCondition: [],
        HasProgressionLevel: progressionLevelForAddComponent,
      };
      setConditionalComponent([ComponentConditions]);
    }

    if (currentComponent?.Type === 'conditional' && isConditionalEditing) {
      const updatedPathwayWrapper = { ...pathwayComponent };

      if (pathwayComponent?.ComponentConditions.length > 0) {
        let currentConditionalComponent = _.get(
          pathwayComponent?.ComponentConditions?.filter(
            (condition_card: any) =>
              condition_card.RowId === _.toString(data.RowId)
          ),
          '0'
        );

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
        !!visibleConstraintConditionProp &&
          visibleConstraintConditionProp(false);

        !!setIsConditionalModalStatus && setIsConditionalModalStatus(false);

        !!setIsConditionalEditing && setIsConditionalEditing(false);
        dispatch(updateMappedDataRequest(updatedPathwayWrapper));
      }
    }
  };

  const addConstraintRow = () => {
    const mId = uuidv4();
    const rowCon = [
      ...constraintRow,
      {
        ...constraintRowData,
        RowId: mId,
        id: !_.isUndefined(constraintRow[constraintRow.length - 1]?.id)
          ? constraintRow[constraintRow.length - 1]?.id + 1
          : 0,
      },
    ];

    setConstraintRow(rowCon);
    setConstRowId(mId);
    setHasConstraints([...hasConstraints, mId]);
  };

  const getData = (val: any) => {
    const temp = constraintRow?.map((item: any) => {
      if (val?.id !== null && item?.id === val?.id) {
        return (item = val);
      } else {
        return item;
      }
    });
    setConstraintRow([...temp]);
  };
  const handleDeleteRow = (deleteRow: number) => {
    constraintRow.splice(deleteRow, 1);
    if (deleteRow !== 0) {
      setConstraintRow([...constraintRow]);
    } else {
      setConstraintRow([]);
    }
  };
  return (
    <div className={Styles.addComponentwrapper}>
      <Form>
        <h2>Add Component</h2>
        <div className={Styles.iconheader}>
          <span className={Styles.iconwrapper + ' iconwrapper'}>
            <FontAwesomeIcon
              icon={faCubes}
              style={{ height: '15px' }}
              color="black"
            />
          </span>
          <h4>Component Condition</h4>
        </div>
        <Form.Item>
          <label>Parent Component</label>
          <InputBox name="ParentIdentifier" value={currentComponent?.Name} />
        </Form.Item>
        <Form.Item>
          <label>Name</label>
          <InputBox
            onChange={onInputChangeHandler}
            placeholder="Name"
            name="Name"
            value={componentConditionFields.Name}
          />
        </Form.Item>
        <Form.Item>
          <label>Condition Description</label>
          <TextArea
            onChange={onInputChangeHandler}
            rows={3}
            name="Description"
            value={componentConditionFields.Description}
          />
        </Form.Item>
        <Row gutter={20}>
          <Col span="12">
            <Form.Item>
              <label>Required Number</label>
              <InputBox
                type="number"
                onChange={onInputChangeHandler}
                min={1}
                name="RequiredNumber"
                value={componentConditionFields.RequiredNumber}
              />
            </Form.Item>
          </Col>
          <Col span="12">
            <Form.Item>
              <label>Logical Operator</label>
              <Dropdown
                options={componentConditionFields?.LogicalOperator}
                defaultValue="And"
                showSearch={false}
              />
            </Form.Item>
          </Col>
        </Row>
        <div className={Styles.divider}>
          <label>Constraints</label>
          <hr className="min-top" />
        </div>
        {constraintRow &&
          constraintRow?.map((v: any, RowIndex: any) => (
            <Constraint
              key={RowIndex}
              RowIndex={RowIndex}
              constraintRow={v}
              getConstraintData={(val: any) => getData(val)}
              getRequiredDeleteRow={(val: any) => handleDeleteRow(val)}
            />
          ))}

        <p>
          <u onClick={() => addConstraintRow()} style={{ cursor: 'pointer' }}>
            Add another constraint
          </u>
        </p>
        <hr />
        <Button
          size="medium"
          text="Save Condition"
          type="primary"
          onClick={saveCondition}
        />
      </Form>
    </div>
  );
};

export default AddConditionalComponent;
