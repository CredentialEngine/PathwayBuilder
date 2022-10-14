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
  CTID: any;
  data?: any;
}

const AddConditionalComponent: React.FC<Props> = (Props) => {
  const { visibleConstraintConditionProp, CTID, data } = Props;
  const [componentConditionFields, setComponentConditionFields] = useState<any>(
    new ComponentConditionEntity()
  );

  const [allConditionalComponents, setAllConditionalComponents] = useState<any>(
    []
  );
  useEffect(() => {
    const updatedPathwayWrapper = { ...pathwayComponent };

    updatedPathwayWrapper.ComponentConditions = [
      ...updatedPathwayWrapper.ComponentConditions,
      ...allConditionalComponents,
    ];
    dispatch(updateMappedDataRequest(updatedPathwayWrapper));
  }, [allConditionalComponents]);

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

    let pathwayComponentChilds: [] = [];
    const childPathwayComponent: any = [];

    const filteredPathwayComponent = pathwayComponent?.PathwayComponents.filter(
      (card: any) => card.CTID === CTID?.toString()
    );

    let columnNumber = 0;
    if (filteredPathwayComponent.length > 0) {
      pathwayComponentChilds = _.get(filteredPathwayComponent, '0').HasChild;

      pathwayComponentChilds.forEach((child: any) => {
        pathwayComponent.PathwayComponents.forEach((component: any) => {
          if (component.CTID === child) {
            childPathwayComponent.push(component);
          }
        });
      });
      columnNumber = childPathwayComponent.reduce((acc: any, curr: any) => {
        if (acc >= curr.ColumnNumber) {
          return acc;
        } else {
          return curr.ColumnNumber;
        }
      }, 1);
    }

    const updatedColumnNumber = Math.max(
      _.toNumber(columnNumber),
      _.toNumber(data?.ColumnNumber)
    );
    const ComponentConditions = {
      ParentIdentifier: data?.RowId,
      Description: componentConditionFields.Description,
      RequiredNumber: componentConditionFields.RequiredNumber,
      LogicalOperator: componentConditionFields.LogicalOperator,
      HasConstraint: Constraint,
      ColumnNumber: updatedColumnNumber + 1,
      RowNumber: data?.RowNumber,
      RowId: uuidv4(),
      TargetComponent: data.HasChild || data.TargetComponent,
    };

    setAllConditionalComponents([
      ...allConditionalComponents,
      ComponentConditions,
    ]);

    !!visibleConstraintConditionProp && visibleConstraintConditionProp(false);
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
          <InputBox
            disabled
            // onChange={onInputChangeHandler}
            // placeholder=""
            name="ParentIdentifier"
            value={data?.RowId}
          />
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
