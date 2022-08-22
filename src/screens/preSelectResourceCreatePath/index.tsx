import { PlusOutlined } from '@ant-design/icons';
import { faCaretDown, faGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Card, Row, Form } from 'antd';
import { noop } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ComponentsCards } from '../../assets/modal/constant';

import CardWithLeftIcon from '../../components/cardWithLeftIcon';
import SearchBox from '../../components/formFields/searchBox';

import Styles from './index.module.scss';
import { getAllProxyForResourcesRequest } from './state/actions';

export interface Props {
  getAllPathwayFormFields: (a: any, b: string) => void;
}
const PreSelectResourceCreatePath: React.FC<Props> = ({
  getAllPathwayFormFields,
}) => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [displaySearchContainer, setDisplaySearchContainer] =
    React.useState(false);
  const [SelectedResource, setSelectedResource] = useState<any>([]);
  const [dataArray, setDataArray] = useState<any>([ComponentsCards]);
  const [allProxyResourcesCard, setAllProxyResourcesCard] = useState<any>([]);
  const searchComponent = (value: any) => {
    setSearchValue(value.target.value);
    setDisplaySearchContainer(true);
  };
  const dispatch = useDispatch();

  useEffect(() => {
    if (SelectedResource.length > 0)
      getAllPathwayFormFields(SelectedResource, 'pendingComponent');
  }, [SelectedResource]);
  const allProxyForResourcesComponent = useSelector(
    (state: any) => state.preSelectProxyResources.allProxyForResourcesComponent
  );
  useEffect(() => {
    if (allProxyForResourcesComponent.valid)
      setAllProxyResourcesCard(allProxyForResourcesComponent.data.Results);
  }, [allProxyForResourcesComponent.data]);

  useEffect(() => {
    setDataArray(ComponentsCards);
  }, []);

  useEffect(() => {
    dispatch(
      getAllProxyForResourcesRequest({
        Filters: 'Name',
        Keywords: searchValue,
      })
    );
  }, [searchValue]);

  const addResource = (itemId: string, itemIndex: number) => {
    const filteredItem = allProxyResourcesCard.filter(
      (item: any) => item.id === itemId
    );
    setSelectedResource([...SelectedResource, filteredItem[0]]);
    allProxyResourcesCard.splice(itemIndex, 1);
    if (allProxyResourcesCard.length === 0) {
      setDisplaySearchContainer(false);
    }
  };
  const UnSelectSelectedItem = (itemId: string, itemIndex: number) => {
    const filteredItem = SelectedResource.filter(
      (item: any) => item.id === itemId
    );
    setDataArray([...dataArray, filteredItem[0]]);
    setAllProxyResourcesCard([...allProxyResourcesCard, filteredItem[0]]);
    SelectedResource.splice(itemIndex, 1);
    if (allProxyResourcesCard.length > 0) {
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
              {allProxyResourcesCard
                .filter((resource: any) =>
                  resource.Description?.toLocaleLowerCase().includes(
                    searchValue.toLocaleLowerCase()
                  )
                )
                .map((filteredResources: any, i: number) => (
                  <div className={Styles.flexGrowCenter} key={i}>
                    <CardWithLeftIcon
                      draggable={true}
                      key={i}
                      name={filteredResources.Name}
                      type="Semester 1"
                      description={filteredResources.Description.slice(0, 30)}
                      IconName={faGear}
                      IconColor="black"
                    />
                    <PlusOutlined
                      onClick={() => addResource(filteredResources.id, i)}
                    />
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
              {SelectedResource?.map((select_resource: any, i: number) => (
                <div className={Styles.flexGrowCenter} key={i}>
                  <CardWithLeftIcon
                    draggable={true}
                    key={i}
                    name={select_resource.Name}
                    type="Semester 1"
                    description={select_resource.Description.slice(0, 30)}
                    IconName={faGear}
                    IconColor="black"
                  />
                  <PlusOutlined
                    onClick={() => UnSelectSelectedItem(select_resource.id, i)}
                  />
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
