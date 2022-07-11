import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { faAirFreshener } from '@fortawesome/free-solid-svg-icons';
import { Col, Card, Row, Form, Space } from 'antd';
import React from 'react';

import Button from '../../components/button';
import CardWithLeftIcon from '../../components/cardWithLeftIcon';
import SearchBox from '../../components/formFields/searchBox';
import Modal from '../../components/modal';

import Styles from './index.module.scss';

const PreSelectResourceCreatePath: React.FC = () => {
  const [state, setState] = React.useState(false);
  const stateOpen = () => {
    setState(!state);
  };
  const stateClose = () => {
    setState(false);
  };

  const onFinish = (values: any) => {
    console.log('Received values of form:', values);
  };
  return (
    <div>
      <Button
        type="selection"
        text="state Open"
        onClick={stateOpen}
        disabled={false}
      />
      <Modal
        title="Pre-Select Resources to Create Your Pathway"
        visible={state}
        okText="Done Adding"
        cancelText="Skip"
        onOk={stateClose}
        onCancel={stateClose}
        closeIcon
        className={Styles.antModal}
      >
        <Row gutter={20}>
          <Col span="12">
            <div>
              <h3>Select Resources</h3>
              <p>All types</p>
            </div>
            <SearchBox placeholder="Search your components" />
            <div>
              <Form
                name="dynamic_form_nest_item"
                onFinish={onFinish}
                autoComplete="off"
              >
                <Form.List name="users">
                  {(fields, { add }) => (
                    <>
                      <Space
                        style={{
                          display: 'flex',
                          marginBottom: 8,
                        }}
                        align="baseline"
                      >
                        <CardWithLeftIcon
                          title="Course"
                          Subtitle="Course"
                          IconName={faAirFreshener}
                        />
                        <PlusOutlined onClick={() => add()} />
                      </Space>
                      {fields.map(({ key }) => (
                        <Space
                          key={key}
                          style={{
                            display: 'flex',
                            marginBottom: 8,
                          }}
                          align="baseline"
                        >
                          <CardWithLeftIcon
                            title="Course"
                            Subtitle="Course"
                            IconName={faAirFreshener}
                          />
                          <PlusOutlined onClick={() => add()} />
                        </Space>
                      ))}
                    </>
                  )}
                </Form.List>
              </Form>
            </div>
          </Col>
          <Col span="12">
            <div>
              <h3>1 Resource Selected</h3>
              <p>Alphabetical</p>
              <Card>
                <>
                  <Form
                    name="dynamic_form_nest_item"
                    onFinish={onFinish}
                    autoComplete="off"
                  >
                    <Form.List name="users">
                      {(fields, { remove }) => (
                        <>
                          {fields.map(({ key, name }) => (
                            <Space
                              key={key}
                              style={{
                                display: 'flex',
                                marginBottom: 8,
                              }}
                              align="baseline"
                            >
                              <CardWithLeftIcon
                                title="Course"
                                Subtitle="Course"
                                IconName={faAirFreshener}
                              />
                              <MinusCircleOutlined
                                onClick={() => remove(name)}
                              />
                            </Space>
                          ))}
                        </>
                      )}
                    </Form.List>
                    <Form.Item></Form.Item>
                  </Form>
                  <p className={Styles.infoCard}>
                    Search for resources that you have uploaded to the Registry
                    to add them now as pre-selected options. This provides a
                    smaller set of resources to create the components you’ll ned
                    work with while you are building your Pathway. Any resource
                    that you have uploaded to the Registry will be availble to
                    you when creating your pathway so you can skip this step.
                  </p>
                </>
              </Card>
            </div>
          </Col>
        </Row>
      </Modal>
    </div>
  );
};

export default PreSelectResourceCreatePath;
