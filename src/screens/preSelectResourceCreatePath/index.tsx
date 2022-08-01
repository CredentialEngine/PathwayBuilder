import { PlusOutlined } from '@ant-design/icons';
import { faCaretDown, faGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Card, Row, Form } from 'antd';
import { noop } from 'lodash';
import React, { useEffect } from 'react';

import { ComponentsCards } from '../../assets/modal/constant';

import CardWithLeftIcon from '../../components/cardWithLeftIcon';
import SearchBox from '../../components/formFields/searchBox';

import Styles from './index.module.scss';

const PreSelectResourceCreatePath: React.FC = () => {
  const [searchValue, setSearchValue] = React.useState('');
  const [displaySearchContainer, setDisplaySearchContainer] =
    React.useState(false);
  const [SelectedResource, setSelectedResource] = React.useState<any>([]);
  const [dataArray, setDataArray] = React.useState<any>([ComponentsCards]);
  const searchComponent = (value: any) => {
    setSearchValue(value.target.value);
    setDisplaySearchContainer(true);
  };

  useEffect(() => {
    setDataArray(ComponentsCards);
  }, []);

  const addResource = (itemId: string, itemIndex: number) => {
    const filteredItem = dataArray.filter((item: any) => item.id === itemId);
    setSelectedResource([...SelectedResource, filteredItem[0]]);
    dataArray.splice(itemIndex, 1);
    if (dataArray.length === 0) {
      setDisplaySearchContainer(false);
    }
  };
  const UnSelectSelectedItem = (itemId: string, itemIndex: number) => {
    const filteredItem = SelectedResource.filter(
      (item: any) => item.id === itemId
    );
    setDataArray([...dataArray, filteredItem[0]]);
    SelectedResource.splice(itemIndex, 1);
    if (dataArray.length > 0) {
      setDisplaySearchContainer(true);
    }
  };
  return (
    <Form className={Styles.skinwrapper} onFinish={noop} autoComplete="off">
      <Row gutter={20}>
        <Col span="12">
          <div className={Styles.flexCenter}>
            <h5>Select Resources</h5>
            <p className="dropdown-title">
              All resources types{' '}
              <FontAwesomeIcon icon={faCaretDown} color="black" />
            </p>
          </div>
          <SearchBox
            placeholder="Search your components"
            onKeyUp={searchComponent}
          />
          {displaySearchContainer && (
            <div className={Styles.searchItemWrapper}>
              {dataArray
                .filter((v: any) =>
                  v.description
                    ?.toLocaleLowerCase()
                    .includes(searchValue.toLocaleLowerCase())
                )
                .map((v: any, i: number) => (
                  <div className={Styles.flexGrowCenter} key={i}>
                    <CardWithLeftIcon
                      draggable={true}
                      key={i}
                      title={v.name}
                      type="Semester 1"
                      SubTitle={v.description}
                      IconName={faGear}
                      IconColor="black"
                    />
                    <PlusOutlined onClick={() => addResource(v.id, i)} />
                  </div>
                ))}
            </div>
          )}
        </Col>
        <Col span="12">
          <div className={Styles.flexCenter}>
            <h5>1 Resource Selected</h5>
            <p className="dropdown-title">
              Alphabetical <FontAwesomeIcon icon={faCaretDown} color="black" />
            </p>
          </div>
          <Card className="customacardstyle">
            <div className={Styles.cardwrapper}>
              {SelectedResource?.map((v: any, i: number) => (
                <div className={Styles.flexGrowCenter} key={i}>
                  <CardWithLeftIcon
                    draggable={true}
                    key={i}
                    title={v.name}
                    type="Semester 1"
                    SubTitle={v.description}
                    IconName={faGear}
                    IconColor="black"
                  />
                  <PlusOutlined onClick={() => UnSelectSelectedItem(v.id, i)} />
                </div>
              ))}
            </div>
            <p className={Styles.infoCard}>
              Search for resources that you have uploaded to the Registry to add
              them now as pre-selected options. This provides a smaller set of
              resources to create the components you’ll ned work with while you
              are building your Pathway.
              <br />
              <i>
                Any resource that you have uploaded to the Registry will be
                availble to you when creating your pathway so you can skip this
                step.
              </i>
            </p>
          </Card>
        </Col>
      </Row>
    </Form>
  );
};
export default PreSelectResourceCreatePath;
