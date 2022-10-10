import { faCubes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Form, Row, Tag } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '../../components/button';
import Dropdown from '../../components/formFields/dropdown';
import InputBox from '../../components/formFields/inputBox';
import { updateMappedDataRequest } from '../../states/actions';
import { getAllConstraintOperand } from '../../utils/fetchSearchResponse';

import DebounceSelect from '../addPathwayForm/debounceSelect';

import Styles from './index.module.scss';
import { ComponentConditionEntity, ConstraintEntity } from './model';
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
  const [constraintEntityFields, setConstraintEntityFields] = useState<any>(
    new ConstraintEntity()
  );

  // older key
  const [selectedComparators, setSelectedComparators] = useState<any>();
  const [leftSourcedata, setleftSourceData] = useState<any>([]);
  const [leftSourcesSelected, setleftSourceSelected] = useState<any>([]);
  const [rightSourcedata, setRightSourceData] = useState<any>([]);
  const [rightSourceSelected, setRightSourceSelected] = useState<any>([]);
  const [allConditionalComponents, setAllConditionalComponents] = useState<any>(
    []
  );

  useEffect(() => {
    const updatedPathwayWrapper = { ...pathwayComponent };
    updatedPathwayWrapper.ComponentCondition = allConditionalComponents;
    dispatch(updateMappedDataRequest(updatedPathwayWrapper));
  }, [allConditionalComponents]);

  const dispatch = useDispatch();

  const pathwayWrapper = useSelector((state: any) => state.initalReducer);
  const { mappedData: pathwayComponent } = pathwayWrapper;

  const onInputChangeHandler = (e: any) => {
    const updatedData = { ...componentConditionFields };
    const { name, value } = e.target;
    updatedData[name] = value;

    setComponentConditionFields(updatedData);
  };
  // older key

  const getAllLogicalOperator = useSelector(
    (state: any) => state.addConditionalComponent.logicalOperatorData
  );

  const getAllComparators = useSelector(
    (state: any) => state.addConditionalComponent.comparatorsData
  );

  const getAllArrayConcept = useSelector(
    (state: any) => state.addConditionalComponent.arrayOperationData
  );

  const funcSelectedComparators = (value: any) => {
    setSelectedComparators(value);
  };

  const allConstraintOperandfunc = async (e: string) => {
    const data = await getAllConstraintOperand({ Keywords: e });
    if (data.Data.Results) {
      const updatedBody = data.Data.Results.map((dta: any) => ({
        ...dta,
        value: dta.Name,
        label: dta.Name,
      }));
      setleftSourceData(updatedBody);
      setRightSourceData(updatedBody);
      return updatedBody;
    }
  };

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
    if (getAllComparators.valid)
      setConstraintEntityFields({
        ...constraintEntityFields,
        Comparator: getAllComparators.data.map((dta: any) => ({
          ...dta,
          value: dta.URI,
          label: dta.Name,
        })),
      });
    if (getAllArrayConcept.valid)
      setConstraintEntityFields({
        ...constraintEntityFields,
        LeftAction: getAllArrayConcept.data.map((dta: any) => ({
          ...dta,
          value: dta.Name,
          label: dta.Name,
        })),
        RightAction: getAllArrayConcept.data.map((dta: any) => ({
          ...dta,
          value: dta.Name,
          label: dta.Name,
        })),
      });
  }, [getAllLogicalOperator, getAllComparators, getAllArrayConcept]);

  useEffect(() => {
    dispatch(getLogicalOperatorsRequest());
    dispatch(getAllComparatorsRequest());
    dispatch(getAllArrayConceptsRequest());
  }, []);

  useEffect(() => {
    const updatedData = { ...constraintEntityFields };
    if (leftSourcesSelected.length > 0) {
      updatedData.LeftSources = leftSourcesSelected;
    }
    if (rightSourceSelected.length > 0) {
      updatedData.LeftSources = rightSourceSelected;
    }
  }, [leftSourcesSelected, rightSourceSelected]);

  const onDebounceSelectHnadler = (e: any, name: string) => {
    if (name === 'LeftSources') {
      const filteredLeftSource = leftSourcedata.filter(
        (data: any) => e.value == data.Name
      );
      setleftSourceSelected((prevState: any) => [
        ...prevState,
        ...filteredLeftSource,
      ]);
    }
    if (name === 'RightSource') {
      const filteredRightSources = rightSourcedata?.filter(
        (data: any) => e.value == data.Name
      );
      setRightSourceSelected((prevState: any) => [
        ...prevState,
        ...filteredRightSources,
      ]);
    }
  };

  const tagRender = (props: any) => {
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
        style={{ marginRight: 3 }}
      >
        {label}
      </Tag>
    );
  };

  const saveCondition = () => {
    const Constraint = {
      ParentIdentifier: componentConditionFields.ParentIdentifier,

      Description: componentConditionFields.Description,
      LeftSource: leftSourcesSelected,
      Comparator: componentConditionFields.Comparator,
      RightSource: rightSourceSelected,
      comparator: `compare:${selectedComparators}`,
    };
    const ComponentCondition = {
      ParentIdentifier: componentConditionFields.ParentIdentifier,
      Description: componentConditionFields.Description,
      RequiredNumber: componentConditionFields.RequiredNumber,
      LogicalOperator: componentConditionFields.LogicalOperator,
      HasConstraint: Constraint,
    };

    setAllConditionalComponents([
      ...allConditionalComponents,
      ComponentCondition,
    ]);

    !!visibleConstraintConditionProp && visibleConstraintConditionProp(false);
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
            name="ParentIdentifier"
            value={componentConditionFields.ParentIdentifier}
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
        <Form.List name="users">
          {(fields, { add }) => (
            <>
              {fields.map((v, i) => (
                <Row gutter={20} key={i}>
                  <Col span="9">
                    <>
                      {leftSourcesSelected?.length > 1 && (
                        <Dropdown
                          options={constraintEntityFields.LeftAction}
                          defaultValue="Any Of"
                          showSearch={false}
                        />
                      )}
                      <Form.Item
                        className="swNoMargin"
                        validateTrigger="onBlur"
                        tooltip="This is a required field"
                      >
                        <DebounceSelect
                          showSearch
                          tagRender={tagRender}
                          value={constraintEntityFields.LeftSource}
                          placeholder="Left Sources"
                          fetchOptions={allConstraintOperandfunc}
                          onSelect={(e: any) =>
                            onDebounceSelectHnadler(e, 'LeftSources')
                          }
                        />
                      </Form.Item>
                    </>
                  </Col>
                  <Col span="6">
                    <Form.Item>
                      <Dropdown
                        options={constraintEntityFields.Comparator}
                        defaultValue="Equals"
                        showSearch={false}
                        onChange={(e) => funcSelectedComparators(e)}
                      />
                    </Form.Item>
                  </Col>
                  <Col span="9">
                    <Form.Item>
                      <>
                        {rightSourceSelected?.length > 1 && (
                          <Dropdown
                            options={constraintEntityFields.RightAction}
                            defaultValue="Any Of"
                            showSearch={false}
                          />
                        )}
                        <Form.Item
                          className="swNoMargin"
                          validateTrigger="onBlur"
                          tooltip="This is a required field"
                        >
                          <DebounceSelect
                            showSearch
                            tagRender={tagRender}
                            value={constraintEntityFields.RightSource}
                            placeholder="Right Sources"
                            fetchOptions={allConstraintOperandfunc}
                            onSelect={(e: any) =>
                              onDebounceSelectHnadler(e, 'RightSource')
                            }
                          />
                        </Form.Item>
                      </>
                    </Form.Item>
                  </Col>
                </Row>
              ))}
              <p>
                <u onClick={() => add()} style={{ cursor: 'pointer' }}>
                  Add another constraint
                </u>
              </p>
            </>
          )}
        </Form.List>

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
