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
  const [isTouched, setisTouched] = useState({
    requiredNumber: false,
    Name: false,
  });
  const pathwayWrapper = useSelector((state: any) => state.initalReducer);
  const { mappedData: pathwayComponent } = pathwayWrapper;
  useEffect(() => {
    const pathwayComponentCards = [...pathwayComponent.PathwayComponents];
    if (isConditionalEditing) {
      const parentCard = pathwayComponentCards?.filter(
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
      allComponentCardsData[connectionsCTID.start];
    const currentConditionalComponent =
      allConditionalCardsData[connectionsCTID.start];

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

      let updatedPathwayComponentArray: any = [];
      let updatedConditionalArray: any = [];
      if (!cardAlreadyExistOnDropWrapper) {
        updatedPathwayComponentArray = uniquePathwayComponentArray.map(
          (a: any) => ({
            ...a,
            ColumnNumber: a?.destinationColumn
              ? a?.ColumnNumber
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

  useEffect(() => {
    if (isConditionalEditing) {
      const constraintToStore = [] as any;
      const updatedPathwayWrapper = { ...pathwayComponent };
      // console.log('datadata useEffectt---2 ', { data, updatedPathwayWrapper });

      if (data && data?.HasConstraint) {
        data?.HasConstraint?.map((constraint: any) => {
          pathwayComponent?.Constraints?.map((pathwayConstraint: any) => {
            if (pathwayConstraint?.RowId === constraint) {
              constraintToStore.push(_.cloneDeep(pathwayConstraint));
            }
          });
        });
      } /* else if (!data?.HasConstraint) {
        console.log('!data?.HasConstraint');

        updatedPathwayWrapper.ComponentConditions[0].HasConstraint =
          updatedPathwayWrapper.Constraints[0].RowId;
        constraintToStore.push(
          _.cloneDeep(updatedPathwayWrapper.Constraints[0])
        );
      } */
      updatedPathwayWrapper.Constraints = [
        ...updatedPathwayWrapper?.Constraints,
        ...constraintRow.map((v: any) => ({
          ...v,
          RowId: consRowID,
          Name: componentConditionFields.Name,
          Description: componentConditionFields.Description,
        })),
      ];
      // console.log('useeffect---2', {
      //   constraintRow,
      //   pathwayComponent,
      //   updatedPathwayWrapper,
      //   conditionalComponent,
      //   componentConditionFields,
      //   data,
      //   constraintToStore,
      // });
      const currentConditionalComponent = _.get(
        pathwayComponent?.ComponentConditions?.filter(
          (condition_card: any) =>
            condition_card.RowId === _.toString(data.RowId)
        ),
        '0'
      );
      // const updatedPathwayComponent =
      // updatedPathwayWrapper?.ComponentConditions?.filter(
      //   (component_card: any) =>
      //     component_card?.RowId !== currentConditionalComponent?.RowId
      // ).concat({
      //   ...data,
      //   LogicalOperator: getLogicalOperatorURI[0]?.URI,
      //   HasConstraint: [constraintRow[0]?.RowId]
      //     ? [constraintRow[0]?.RowId]
      //     : hasConstraints,
      // });

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
    Name: componentConditionFields.Name,
    RowId: currentComponent?.RowId,
    Description: componentConditionFields.Description,
    ParentIdentifier: connectionsCTID?.start,
  };

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

  const saveCondition = () => {
    if (currentComponent?.Type !== 'conditional' && !isConditionalEditing) {
      // console.log(
      //   "currentComponent?.Type !== 'conditional' && !isConditionalEditing"
      // );

      const conditionalCardAlreadyExistForDestination =
        updatedPathwayComponentConditionCards?.filter(
          (condtional_card: any) =>
            _.toString(condtional_card?.ParentIdentifier) ===
            _.toString(currentComponent?.RowId)
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
        LogicalOperator: getLogicalOperatorURI[0]?.URI,
        HasConstraint: hasConstraints,
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
      // console.log(
      //   { hasConstraints, constraintRow },
      //   "data?.Type === 'conditional' && isConditionalEditing"
      // );

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

        const getLogicalOperatorURI =
          allogicalOperator?.LogicalOperator?.filter(
            (getURI: any) => logicalOperator === getURI?.Name
          );
        const hasConstraintsIds: string[] = [];

        constraintRow.map((constraintRow: any) =>
          hasConstraintsIds.push(constraintRow.RowId)
        );

        const updatedPathwayComponent =
          updatedPathwayWrapper?.ComponentConditions?.filter(
            (component_card: any) =>
              component_card?.RowId !== currentConditionalComponent?.RowId
          ).concat({
            ...data,
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
        // console.log(
        //   {
        //     currentConditionalComponent,
        //     logicalOperator,
        //     updatedPathwayWrapper,
        //     constraintRow,
        //     hasConstraintsIds,
        //     data,
        //     pathwayComponent,
        //     conditionalComponent,
        //     componentConditionFields,
        //   },
        //   'updatedPathwayWrapper'
        // );

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
  const funcSelectedComparators = (value: any) => {
    setLogicalOperator(value);
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
    const deletedRow = constraintRow.splice(deleteRow, 1);
    const updatedPathwayWrapper = { ...pathwayComponent };
    _.remove(
      updatedPathwayWrapper?.Constraints,
      (constraints: any) => constraints.RowId == deletedRow[0]?.RowId
    );
    dispatch(updateMappedDataRequest(updatedPathwayWrapper));

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
          <InputBox
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
        </Form.Item>
        <Form.Item>
          <label>Condition Description</label>
          <TextArea
            onChange={onInputChangeHandler}
            rows={3}
            name="Description"
            value={componentConditionFields.Description}
            placeholder="Description"
          />
        </Form.Item>
        <Row gutter={20}>
          <Col span="12">
            <Form.Item
              required={true}
              wrapperCol={{ span: 24 }}
              labelCol={{ span: 24 }}
              label="Required Number"
              validateTrigger="onBlur"
              help={
                (_.isEmpty(componentConditionFields.RequiredNumber) ||
                  _.isNull(componentConditionFields.RequiredNumber)) &&
                isTouched.requiredNumber
                  ? 'Number is Required'
                  : null
              }
            >
              <InputBox
                type="number"
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
            </Form.Item>
          </Col>
          <Col span="12">
            <Form.Item
              label="Logical Operator"
              wrapperCol={{ span: 24 }}
              labelCol={{ span: 24 }}
            >
              {/* {console.log({logicalOperator,componentConditionFields}, 'logicalOperator')} */}
              <Dropdown
                options={allogicalOperator?.LogicalOperator}
                showSearch={false}
                placeholder="Select Logical Operator"
                value={logicalOperator}
                onChange={(e) => funcSelectedComparators(e)}
              />
            </Form.Item>
          </Col>
        </Row>
        <div className={Styles.divider}>
          <label>Constraints</label>
          <hr className="min-top" />
        </div>
        {constraintRow &&
          constraintRow?.map((constraintRowData: any, RowIndex: any) => (
            <Constraint
              key={RowIndex}
              RowIndex={RowIndex}
              constraintRow={constraintRowData}
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
          disabled={_.isEmpty(
            componentConditionFields.RequiredNumber &&
              componentConditionFields.Name
          )}
          onClick={saveCondition}
        />
      </Form>
    </div>
  );
};

export default AddConditionalComponent;
