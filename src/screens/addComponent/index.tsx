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
  isConditionalEditing?: boolean;
  setIsConditionalEditing?: (a: boolean) => void;
}

const AddConditionalComponent: React.FC<Props> = (Props) => {
  const {
    visibleConstraintConditionProp,
    data,
    isDestinationCard,
    filteredPathwayComponent,
    setIsConditionalModalStatus,
    isConditionalEditing,
    setIsConditionalEditing,
  } = Props;
  const [componentConditionFields, setComponentConditionFields] = useState<any>(
    new ComponentConditionEntity()
  );
  const [conditionalComponent, setConditionalComponent] = useState<any>([]);

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
    if (conditionalComponent.length > 0) {
      const currentPathwayComponent = _.get(
        pathwayComponent?.PathwayComponents?.filter(
          (pathway_card: any) => pathway_card.CTID === _.toString(data.CTID)
        ),
        '0'
      );

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
      const otherconditionalComponentOutOfProgressionLevel =
        pathwayComponent?.ComponentConditions?.filter(
          (pathway_card: any) =>
            pathway_card.HasProgressionLevel !==
            _.toString(data.HasProgressionLevel)
        );
      const currentConditionalComponentInProgressionLevel1 = _.get(
        pathwayComponent?.ComponentConditions?.filter(
          (pathway_card: any) =>
            pathway_card.CTID === _.toString(data.CTID) ||
            pathway_card.RowId === _.toString(data.RowId)
        ),
        '0'
      );

      const restConditionalComponentInProgressionLevel1 =
        pathwayComponent?.ComponentConditions?.filter(
          (pathway_card: any) =>
            pathway_card.CTID !== _.toString(data.CTID) ||
            pathway_card.RowId !== _.toString(data.RowId)
        );

      if (
        !_.isUndefined(currentConditionalComponentInProgressionLevel1) &&
        !_.isNull(currentConditionalComponentInProgressionLevel1)
      ) {
        if (
          !_.isEmpty(
            currentConditionalComponentInProgressionLevel1.HasCondition
          )
        ) {
          currentConditionalComponentInProgressionLevel1.HasCondition = [
            ...currentConditionalComponentInProgressionLevel1.HasCondition,
            conditionalComponent[0].RowId,
          ];
        } else {
          currentConditionalComponentInProgressionLevel1.HasCondition = [
            conditionalComponent[0].RowId,
          ];
        }
      }

      const allConditionalComponent: any =
        !_.isUndefined(currentConditionalComponentInProgressionLevel1) &&
        !_.isNull(currentConditionalComponentInProgressionLevel1)
          ? [
              ...restConditionalComponentInProgressionLevel1,
              currentConditionalComponentInProgressionLevel1,
            ]
          : [];

      const uniqueConditionalArray = [
        ...new Set([
          ...otherconditionalComponentOutOfProgressionLevel,
          ...allConditionalComponent,
        ]),
      ];

      const uniquePathwayComponentArray = [
        ...new Set(filteredPathwayComponent),
      ];

      const updatedPathwayComponentArray = uniquePathwayComponentArray.map(
        (a: any) => ({
          ...a,
          ColumnNumber:
            data.ColumnNumber > a.ColumnNumber
              ? a.ColumnNumber
              : a.ColumnNumber + 1,
        })
      );

      const updatedConditionalArray = uniqueConditionalArray
        .map((a: any) => ({ ...a, ColumnNumber: a.ColumnNumber + 1 }))
        .concat(conditionalComponent);

      const allComponentConditionalCard = [
        ...updatedPathwayWrapper.ComponentConditions,
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

      updatedPathwayWrapper.ComponentConditions = uniqueAllConditionalArray;
      updatedPathwayWrapper.PathwayComponents = uniqueAllPathwayComponentArray;

      updatedPathwayWrapper.Constraints = [
        ...updatedPathwayWrapper.Constraints,
        ...constraintRow.map((v: any) => ({
          ...v,
          ParentIdentifier: data.RowId,
          RowId: consRowID,
          Name: componentConditionFields.Name,
          Description: componentConditionFields.Description,
        })),
      ];
      dispatch(updateMappedDataRequest(updatedPathwayWrapper));
      setConditionalComponent([]);
    }
  }, [conditionalComponent]);

  useEffect(() => {
    if (isConditionalEditing) {
      const constraintToStore = [] as any;
      if (data && data?.HasConstraint) {
        data?.HasConstraint?.map((constraint: any) => {
          pathwayComponent?.Constraints?.map((pathwayConstraint: any) => {
            if (pathwayConstraint?.RowId === constraint) {
              constraintToStore.push(_.cloneDeep(pathwayConstraint));
            }
          });
        });
      }
      setConstraintRow(constraintToStore);
      setComponentConditionFields({ ...componentConditionFields, ...data });
    }
  }, [isConditionalEditing]);

  const constraintRowData = {
    LeftAction: [],
    LeftSource: [],
    Comparator: [],
    RightAction: [],
    RightSource: [],
    id: 0,
    //RowId: data?.RowId,
    Name: componentConditionFields.Name,
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
    const mId = uuidv4();

    if (data?.Type !== 'conditional' || !isConditionalEditing) {
      const updatedTargetChild =
        !!data?.TargetComponent &&
        data?.TargetComponent.length > 0 &&
        data?.TargetComponent.filter(
          (target_card: any) => target_card !== data.RowId
        );

      const ComponentConditions = {
        ParentIdentifier: data?.RowId,
        RowId: mId,
        Name: componentConditionFields.Name,
        Description: componentConditionFields.Description,
        RequiredNumber: componentConditionFields.RequiredNumber,
        LogicalOperator: componentConditionFields.LogicalOperator,
        HasCondition: [],
        HasConstraint: hasConstraints,
        ColumnNumber: isDestinationCard
          ? data?.ColumnNumber + 1
          : data?.ColumnNumber,
        RowNumber: data?.RowNumber,
        TargetComponent:
          data?.PrecededBy || data.HasChild || updatedTargetChild,
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
        dispatch(updateMappedDataRequest(updatedPathwayWrapper));
      }
    }

    !!visibleConstraintConditionProp && visibleConstraintConditionProp(false);

    !!setIsConditionalModalStatus && setIsConditionalModalStatus(false);

    !!setIsConditionalEditing && setIsConditionalEditing(false);
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
          <InputBox name="ParentIdentifier" value={data?.Name} />
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
