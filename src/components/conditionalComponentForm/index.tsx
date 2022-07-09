import { faCubes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Divider, Form, Row } from 'antd';
import React from 'react';

import AutoCompleteBox from '../autoComplete';
import SearchBox from '../formFields/searchBox';
import Textarea from '../formFields/textarea';
import Textbox from '../formFields/textbox';

import styles from './index.module.scss';

const ConditionalComponent = () => (
  <div>
    <Row style={{ padding: '2px' }}>
      <Col span={3}>
        <FontAwesomeIcon
          icon={faCubes}
          style={{ height: '15px', color: 'blue' }}
        />
      </Col>
      <Col span={18} style={{ fontSize: 14, fontWeight: 700 }}>
        Component Condition
      </Col>
      <Col span={24} style={{ marginTop: '10px' }}>
        <Form.Item
          label="Parent Component"
          className="swNoMargin"
          wrapperCol={{ span: 24 }}
          labelCol={{ span: 24 }}
          validateTrigger="onBlur"
        >
          <AutoCompleteBox placeholder="Start typing to choose a Progression Model" />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item
          label="Pathway Description"
          className="swNoMargin"
          wrapperCol={{ span: 24 }}
          labelCol={{ span: 24 }}
          validateTrigger="onBlur"
        >
          <Textarea
            placeholder="Add a Pathway Description"
            maxLength={200}
            value="480 Credits Total"
          />
        </Form.Item>
      </Col>
      <Row style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Col span={8}>
          <Textbox placeholder="Required Number" />
        </Col>
        <Col span={7}>
          <Textbox placeholder="Is Equal To" />
        </Col>
        <Col span={8}>
          <Textbox placeholder="0" />
        </Col>
      </Row>
      <Divider className={styles.divider} />
      <Row style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Col span={11}>
          <SearchBox />
        </Col>
        <Col span={9}>
          <AutoCompleteBox
            placeholder="Start typing to"
            className={styles.autoComplete}
          />
        </Col>
        <Col span={3}>
          <Textbox placeholder="0" />
        </Col>
      </Row>
      <Col span={24}>
        <span className={styles.addConstraints}>Add another Constraints</span>
      </Col>
    </Row>
  </div>
);
export default ConditionalComponent;
