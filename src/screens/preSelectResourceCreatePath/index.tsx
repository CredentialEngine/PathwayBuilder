import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { faAirFreshener } from '@fortawesome/free-solid-svg-icons';
import { Col, Card, Row, Form } from 'antd';
import { noop } from 'lodash';
import React from 'react';

import CardWithLeftIcon from '../../components/cardWithLeftIcon';
import SearchBox from '../../components/formFields/searchBox';

import Styles from './index.module.scss';

const PreSelectResourceCreatePath: React.FC = () => (
  // const onFinish = (values: any) => {};
  <div>
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
            onFinish={noop}
            autoComplete="off"
          >
            <Form.List name="users">
              {(fields, { add }) => (
                <>
                  <div
                    style={{
                      display: 'flex',
                      marginBottom: 8,
                      alignItems: 'center',
                    }}
                  >
                    <CardWithLeftIcon
                      title="Course"
                      Subtitle="Course"
                      IconName={faAirFreshener}
                      inlineStyles={{ flex: 1 }}
                    />
                    <PlusOutlined onClick={() => add()} />
                  </div>
                  {fields.map(({ key }) => (
                    <div
                      style={{
                        display: 'flex',
                        marginBottom: 8,
                        alignItems: 'center',
                      }}
                      key={key}
                    >
                      <CardWithLeftIcon
                        title="Course"
                        Subtitle="Course"
                        IconName={faAirFreshener}
                        inlineStyles={{ flex: 1 }}
                      />
                      <PlusOutlined onClick={() => add()} />
                    </div>
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
                  {(fields, { add, remove }) => (
                    <>
                      <div
                        style={{
                          display: 'flex',
                          marginBottom: 8,
                          alignItems: 'center',
                        }}
                      >
                        <CardWithLeftIcon
                          title="Course"
                          Subtitle="Course"
                          IconName={faAirFreshener}
                          inlineStyles={{ flex: 1 }}
                        />
                        <PlusOutlined onClick={() => add()} />
                      </div>
                      {fields.map(({ key, name }) => (
                        <div
                          style={{
                            display: 'flex',
                            marginBottom: 8,
                            alignItems: 'center',
                          }}
                          key={key}
                        >
                          <CardWithLeftIcon
                            title="Course"
                            Subtitle="Course"
                            IconName={faAirFreshener}
                            inlineStyles={{ flex: 1 }}
                          />
                          <MinusCircleOutlined onClick={() => remove(name)} />
                        </div>
                      ))}
                    </>
                  )}
                </Form.List>
                <Form.Item></Form.Item>
              </Form>
              <p className={Styles.infoCard}>
                Search for resources that you have uploaded to the Registry to
                add them now as pre-selected options. This provides a smaller
                set of resources to create the components you’ll ned work with
                while you are building your Pathway. Any resource that you have
                uploaded to the Registry will be availble to you when creating
                your pathway so you can skip this step.
              </p>
            </>
          </Card>
        </div>
      </Col>
    </Row>
  </div>
);
export default PreSelectResourceCreatePath;
