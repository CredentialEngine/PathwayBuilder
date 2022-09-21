import { faCubes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Form, Row } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { ContraintComponent } from './constants';

import Button from '../../components/button';
import Dropdown from '../../components/formFields/dropdown';
import InputBox from '../../components/formFields/inputBox';
import MultiSelect from '../../components/formFields/multiSelect';
import { getAllConstraintOperand } from '../../utils/fetchSearchResponse';

import Styles from './index.module.scss';
import {
  getAllArrayConceptsRequest,
  getAllComparatorsRequest,
  getLogicalOperatorsRequest,
} from './state/actions';

const PLEASE_SELECT_LEFT_SOURCE_VALUE = 'Please select left source value';
const PLEASE_SELECT_RIGHT_SOURCE_VALUE = 'Please select right source value';
const PLEASE_SELECT_COMPARATOR = 'Please select comparator value';

interface Props {
  visibleConstraintConditionProp: boolean;
}

const AddConditionalComponent: React.FC<Props> = (Props) => {
  const { visibleConstraintConditionProp } = Props;
  // const [allConstraintComponent, setAllConstraintComponent] = useState<any>(
  //   new ContraintComponent()
  // );

  const [allLogicalOperators, setAllLogicOperators] = useState<any>([]);
  const [allComparators, setAllComparators] = useState<any>([]);
  const [selectedComparators, setSelectedComparators] = useState<any>();
  const [allArrayConcept, setAllArrayConcept] = useState<any>([]);
  const [allConstraintOperand, setAllConstraintOperand] = useState<any>([]);
  const [leftSourcedata, setleftSourceData] = useState<any>();
  const [rightSourcedata, setRightSourceData] = useState<any>();
  const [errorField, setErrorField] = useState<any>([]);
  const [parentComponent, setParentComponent] = useState<string>('');
  const [conditionDescription, setConditionDescription] = useState<string>('');
  const [requiredNumber, setRequiredNumber] = useState<string>('');

  const dispatch = useDispatch();
  // const onFinish = (values: any) => {
  //   console.log('Received values of form:', values);
  // };
  const searchLeftConstraintOperand = (value: any) => {
    setleftSourceData(value);
  };
  const searchRightConstraintOperand = (value: any) => {
    setRightSourceData(value);
  };
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

  const allConstraintOperandfunc = async () => {
    const data = await getAllConstraintOperand(leftSourcedata);
    if (data.Data.Results) {
      setAllConstraintOperand(
        data.Data.Results.map((value: any) => ({
          ...value,
          value: value.Name,
          label: value.Name,
        }))
      );
    }
  };

  useEffect(() => {
    if (leftSourcedata !== '') {
      allConstraintOperandfunc();
    }
  }, [leftSourcedata]);

  useEffect(() => {
    if (getAllLogicalOperator.valid)
      setAllLogicOperators(
        getAllLogicalOperator.data.map((dta: any) => ({
          ...dta,
          value: dta.Name,
          label: dta.Name,
        }))
      );
    if (getAllComparators.valid)
      setAllComparators(
        getAllComparators.data.map((dta: any) => ({
          ...dta,
          value: dta.Name,
          label: dta.Name,
        }))
      );
    if (getAllArrayConcept.valid)
      setAllArrayConcept(
        getAllArrayConcept.data.map((dta: any) => ({
          ...dta,
          value: dta.Name,
          label: dta.Name,
        }))
      );
  }, [getAllLogicalOperator, getAllComparators, getAllArrayConcept]);

  useEffect(() => {
    dispatch(getLogicalOperatorsRequest());
    dispatch(getAllComparatorsRequest());
    dispatch(getAllArrayConceptsRequest());
  }, []);

  const saveCondition = () => {
    visibleConstraintConditionProp(false);
    if (!leftSourcedata?.length)
      setErrorField([PLEASE_SELECT_LEFT_SOURCE_VALUE]);
    else if (!selectedComparators) setErrorField([PLEASE_SELECT_COMPARATOR]);
    else if (!rightSourcedata?.length)
      setErrorField([PLEASE_SELECT_RIGHT_SOURCE_VALUE]);
    else {
      setErrorField(['']);
      const saveCondition = {
        rowid: 'asdasdasdasd',
        leftSource: [
          {
            URI: 'ceterms:AdvancedStandingAction',
            Name: leftSourcedata,
          },
        ],
        comparator: `compare:${selectedComparators}`,
        rightSource: [
          {
            URI: 'ceterms:AdvancedStandingAction',
            Name: rightSourcedata,
          },
        ],
      };
      saveCondition;
    }
  };

  return (
    <div className={Styles.addComponentwrapper}>
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
          onChange={(e) => setParentComponent(e.target.value)}
          placeholder=""
          maxLength={0}
          value={parentComponent}
        />
      </Form.Item>
      <Form.Item>
        <label>Condition Description</label>
        <TextArea
          onChange={(e) => setConditionDescription(e.target.value)}
          placeholder=""
          maxLength={0}
          rows={3}
          value={conditionDescription}
        />
      </Form.Item>
      <Row gutter={20}>
        <Col span="12">
          <Form.Item>
            <label>Required Number</label>
            <InputBox
              type="number"
              onChange={(e) => setRequiredNumber(e.target.value)}
              placeholder=""
              maxLength={0}
              value={requiredNumber}
            />
          </Form.Item>
        </Col>
        <Col span="12">
          <Form.Item>
            <label>Logical Operator</label>
            <Dropdown
              options={allLogicalOperators}
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
      <Form name="dynamic_form_nest_item" autoComplete="off">
        <Form.List name="users">
          {(fields, { add }) => (
            <>
              {fields.map((v, i) => (
                <Row gutter={20} key={i}>
                  <Col span="9">
                    <>
                      <Form.Item>
                        <MultiSelect
                          placeholder="Left Sources"
                          options={allConstraintOperand}
                          optionLabelProp="label"
                          onChange={(e) => searchLeftConstraintOperand(e)}
                        />
                      </Form.Item>
                    </>
                  </Col>
                  <Col span="6">
                    <Form.Item>
                      <Dropdown
                        options={allComparators}
                        defaultValue="Equals"
                        showSearch={false}
                        onChange={(e) => funcSelectedComparators(e)}
                      />
                    </Form.Item>
                  </Col>
                  <Col span="9">
                    <Form.Item>
                      <>
                        {rightSourcedata?.length > 1 && (
                          <Dropdown
                            options={allArrayConcept}
                            defaultValue="Any Of"
                            showSearch={false}
                          />
                        )}

                        <MultiSelect
                          mode="tags"
                          options={allConstraintOperand}
                          optionLabelProp="label"
                          placeholder="Right Sources"
                          onChange={(e) => searchRightConstraintOperand(e)}
                        />
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
      </Form>

      <hr />
      {errorField?.map((error: string) => (
        <p key={error} className="error">
          {error}
        </p>
      ))}
      <br />
      <Button
        size="medium"
        text="Save Condition"
        type="primary"
        onClick={saveCondition}
      />
    </div>
  );
};

export default AddConditionalComponent;
