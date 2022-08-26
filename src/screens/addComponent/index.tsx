import { faCubes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Form, Row } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { noop } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '../../components/button';
import Dropdown from '../../components/formFields/dropdown';
import InputBox from '../../components/formFields/inputBox';
import MultiSelect from '../../components/formFields/multiSelect';

import Styles from './index.module.scss';
import {
  getAllArrayConceptsRequest,
  getAllComparatorsRequest,
  getLogicalOperatorsRequest,
} from './state/actions';

const companyList = [
  {
    key: 1,
    value: 'company',
    label: 'company',
    title: 'Company',
  },
  {
    key: 2,
    title: 'New Company',
    value: 'Newcompany',
    label: 'New company',
  },
];

const AddConditionalComponent: React.FC = () => {
  const [allLogicalOperators, setAllLogicOperators] = useState<any>([]);
  const [allComparators, setAllComparators] = useState<any>([]);
  const [allArrayConcept, setAllArrayConcept] = useState<any>([]);

  const dispatch = useDispatch();
  // const onFinish = (values: any) => {
  //   console.log('Received values of form:', values);
  // };
  const getAllLogicalOperator = useSelector(
    (state: any) => state.addConditionalComponent.logicalOperatorData
  );

  const getAllComparators = useSelector(
    (state: any) => state.addConditionalComponent.comparatorsData
  );

  const getAllArrayConcept = useSelector(
    (state: any) => state.addConditionalComponent.arrayOperationData
  );
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
        <InputBox onChange={noop} placeholder="" maxLength={0} value="" />
      </Form.Item>
      <Form.Item>
        <label>Condition Description</label>
        <TextArea onChange={noop} placeholder="" maxLength={0} rows={3} />
      </Form.Item>
      <Row gutter={20}>
        <Col span="12">
          <Form.Item>
            <label>Required Number</label>
            <InputBox
              type="number"
              onChange={noop}
              placeholder=""
              maxLength={0}
              value=""
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
      <Form
        name="dynamic_form_nest_item"
        // onFinish={onFinish}
        autoComplete="off"
      >
        <Form.List name="users">
          {(fields, { add }) => (
            <>
              {fields.map((v, i) => (
                <Row gutter={20} key={i}>
                  <Col span="9">
                    <Form.Item>
                      <MultiSelect
                        placeholder="Left Sources"
                        options={companyList}
                        optionLabelProp="label"
                        // onChange={(e) => onSelectChangeHandler(e, 'industryType')}
                      />
                    </Form.Item>
                  </Col>
                  <Col span="6">
                    <Form.Item>
                      <Dropdown
                        options={allComparators}
                        defaultValue="Equals"
                        showSearch={false}
                      />
                    </Form.Item>
                  </Col>
                  <Col span="9">
                    <Form.Item>
                      <MultiSelect
                        placeholder="Right Sources"
                        options={allArrayConcept}
                        optionLabelProp="label"
                        // onChange={(e) => onSelectChangeHandler(e, 'industryType')}
                      />
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
      <Button
        size="medium"
        text="Save Consition"
        type="primary"
        onClick={noop}
      />
    </div>
  );
};

export default AddConditionalComponent;
