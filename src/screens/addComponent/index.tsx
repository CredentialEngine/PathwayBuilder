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
}

const AddConditionalComponent: React.FC<Props> = (Props) => {
  const {
    visibleConstraintConditionProp,
    data,
    filteredConditionalComponent,
    isDestinationCard,
    filteredPathwayComponent,
    setIsConditionalModalStatus,
  } = Props;
  const [componentConditionFields, setComponentConditionFields] = useState<any>(
    new ComponentConditionEntity()
  );
  const [conditionalComponent, setConditionalComponent] = useState<any>([]);

  // console.log('data --->', data);
  useEffect(() => {
    const updatedPathwayWrapper = { ...pathwayComponent };

    const restPathwayComponents = pathwayComponent?.PathwayComponents?.filter(
      (pathway_card: any) =>
        pathway_card.CTID !== _.toString(data.CTID) ||
        pathway_card.RowId !== _.toString(data.RowId)
    );

    const currentPathwayComponent = _.get(
      pathwayComponent?.ComponentConditions?.filter(
        (pathway_card: any) =>
          pathway_card.CTID !== _.toString(data.CTID) ||
          pathway_card.RowId !== _.toString(data.RowId)
      ),
      '0'
    );
    const restConditionalComponents =
      pathwayComponent?.PathwayComponents?.filter(
        (pathway_card: any) =>
          pathway_card.CTID !== _.toString(data.CTID) ||
          pathway_card.RowId !== _.toString(data.RowId)
      );

    const currentConditionalComponents = _.get(
      pathwayComponent?.ComponentConditions?.filter(
        (pathway_card: any) =>
          pathway_card.CTID === _.toString(data.CTID) ||
          pathway_card.RowId === _.toString(data.RowId)
      ),
      '0'
    );
    // console.log('filteredPathwayComponents --->', filteredPathwayComponents);
    if (
      !!currentPathwayComponent &&
      currentPathwayComponent.length > 0 &&
      currentPathwayComponent?.HasCondition.length > 0
    ) {
      currentPathwayComponent.HasCondition = [
        ...currentPathwayComponent.HasCondition,
        conditionalComponent.RowId,
      ];
    } else {
      if (!!currentPathwayComponent && currentPathwayComponent.length > 0)
        currentPathwayComponent.HasCondition = [conditionalComponent.RowId];
    }

    const allPathwayComponent = restPathwayComponents.push(
      currentPathwayComponent
    );

    if (
      !!currentConditionalComponents &&
      currentConditionalComponents.length > 0 &&
      currentConditionalComponents?.HasCondition.length > 0
    ) {
      currentConditionalComponents.HasCondition = [
        ...currentConditionalComponents.HasCondition,
        conditionalComponent.RowId,
      ];
    } else {
      if (
        !!currentConditionalComponents &&
        currentConditionalComponents.length > 0
      )
        currentConditionalComponents.HasCondition = [
          conditionalComponent.RowId,
        ];
    }

    const allConditionalComponent = restConditionalComponents.push(
      currentConditionalComponents
    );
    if (conditionalComponent.length > 0) {
      const uniqueConditionalArray = [...new Set(filteredConditionalComponent)];
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

      const allComponentConditionalCard =
        !!allConditionalComponent && allConditionalComponent.length > 0
          ? [
              ...updatedPathwayWrapper.ComponentConditions,
              ...updatedConditionalArray,
              ...allConditionalComponent,
            ]
          : [
              ...updatedPathwayWrapper.ComponentConditions,
              ...updatedConditionalArray,
            ];

      // console.log(
      //   'allComponentConditionalCard --->',
      //   allComponentConditionalCard
      // );
      const allPathwayComponentCard =
        !!allPathwayComponent && allPathwayComponent.length > 0
          ? [
              ...updatedPathwayWrapper.PathwayComponents,
              ...updatedPathwayComponentArray,
              ...allPathwayComponent,
            ]
          : [
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
          allComponentConditionalCard.map((item: any) => [item['RowId'], item])
        ).values(),
      ];
      updatedPathwayWrapper.ComponentConditions = uniqueAllConditionalArray;
      updatedPathwayWrapper.PathwayComponents = uniqueAllPathwayComponentArray;
      dispatch(updateMappedDataRequest(updatedPathwayWrapper));
      setConditionalComponent([]);
    }
  }, [conditionalComponent]);

  const constraintRowData = {
    LeftAction: [],
    LeftSource: [],
    Comparator: [],
    RightAction: [],
    RightSource: [],
    id: 0,
  };

  const [constraintRow, setConstraintRow] = useState<any>([
    // {
    //   LeftAction: [],
    //   LeftSource: [],
    //   Comparator: [],
    //   RightAction: [],
    //   RightSource: [],
    //   id: 0,
    // },
  ]);
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
    if (getAllLogicalOperator.valid)
      setComponentConditionFields({
        ...componentConditionFields,
        LogicalOperator: getAllLogicalOperator.data.map((dta: any) => ({
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
    const Constraint = {
      ParentIdentifier: componentConditionFields.ParentIdentifier,
      Description: componentConditionFields.Description,
      constraintRow,
    };

    const updatedTargetChild =
      !!data?.TargetComponent &&
      data?.TargetComponent.length > 0 &&
      data?.TargetComponent.filter(
        (target_card: any) => target_card !== data.RowId
      );

    const ComponentConditions = {
      ParentIdentifier: data?.RowId,
      Description: componentConditionFields.Description,
      RequiredNumber: componentConditionFields.RequiredNumber,
      LogicalOperator: componentConditionFields.LogicalOperator,
      HasConstraint: Constraint,
      ColumnNumber: isDestinationCard
        ? data?.ColumnNumber + 1
        : data?.ColumnNumber,
      RowNumber: data?.RowNumber,
      RowId: uuidv4(),
      TargetComponent: data.HasChild || updatedTargetChild,
      HasCondition: [],
    };

    setConditionalComponent([ComponentConditions]);

    !!visibleConstraintConditionProp && visibleConstraintConditionProp(false);

    !!setIsConditionalModalStatus && setIsConditionalModalStatus(false);
  };

  const addConstraintRow = () => {
    setConstraintRow((prevState: any) => [
      ...constraintRow,
      {
        ...constraintRowData,
        id: !_.isUndefined(prevState[prevState.length - 1]?.id)
          ? prevState[prevState.length - 1]?.id + 1
          : 0,
      },
    ]);
  };

  const getData = (val: any) => {
    const temp = constraintRow?.map((item: any) => {
      if (item?.id === val?.id) {
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
          <InputBox name="ParentIdentifier" value={data?.RowId} />
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
        {constraintRow.map((v: any, RowIndex: any) => (
          <Constraint
            key={RowIndex}
            RowIndex={RowIndex}
            constraintRow={constraintRow}
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
