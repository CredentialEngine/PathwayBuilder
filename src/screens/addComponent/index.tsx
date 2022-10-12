import { faCubes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Form, Row } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '../../components/button';
import Dropdown from '../../components/formFields/dropdown';
import InputBox from '../../components/formFields/inputBox';

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
}

const AddConditionalComponent: React.FC<Props> = (Props) => {
  const { visibleConstraintConditionProp } = Props;
  const [componentConditionFields, setComponentConditionFields] = useState<any>(
    new ComponentConditionEntity()
  );
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
    !!visibleConstraintConditionProp && visibleConstraintConditionProp(false);
    const Constraint = {
      ParentIdentifier: componentConditionFields.ParentIdentifier,
      // Id
      // RowId
      // Name
      Description: componentConditionFields.Description,
      // LeftAction :
      // LeftSource: constraintData.LeftSource,
      // Comparator: componentConditionFields.Comparator,

      // RightSource: constraintData.RightSource,

      // rowid: 'asdasdasdasd',
      // leftSource: [
      //   {
      //     URI: 'ceterms:AdvancedStandingAction',
      //     Name: leftSourcedata,
      //   },
      // ],
      // comparator: `compare:${constraintData.Comparator}`,
      // RightAction:
      // rightSource: [
      //   {
      //     URI: 'ceterms:AdvancedStandingAction',
      //     Name: rightSourcedata,
      //   },
      // ],
    };
    const ComponentCondition = {
      ParentIdentifier: componentConditionFields.ParentIdentifier,
      // Id;
      // RowId;
      // Name;
      Description: componentConditionFields.Description,
      RequiredNumber: componentConditionFields.RequiredNumber,
      LogicalOperator: componentConditionFields.LogicalOperator,
      // HasCondition;
      HasConstraint: Constraint,
      // LastUpdated;
      // TargetComponent;
    };

    ComponentCondition;
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
            onChange={onInputChangeHandler}
            placeholder=""
            maxLength={0}
            value={componentConditionFields.ParentIdentifier}
          />
        </Form.Item>
        <Form.Item>
          <label>Name</label>
          <InputBox
            onChange={onInputChangeHandler}
            placeholder=""
            maxLength={0}
            value={componentConditionFields.Name}
          />
        </Form.Item>
        <Form.Item>
          <label>Condition Description</label>
          <TextArea
            onChange={onInputChangeHandler}
            placeholder=""
            maxLength={0}
            rows={3}
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
                placeholder=""
                min={1}
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
