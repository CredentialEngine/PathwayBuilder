import { PlusOutlined, DownOutlined } from '@ant-design/icons';
import {
  faCaretDown,
  faGear,
  faMinus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Card, Row, Form, Dropdown, Typography, Space, Menu } from 'antd';
import _, { noop } from 'lodash';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CardWithLeftIcon from '../../components/cardWithLeftIcon';
import CheckBox from '../../components/formFields/checkbox';
import SearchBox from '../../components/formFields/searchBox';
import { getLeftPanelPathwayComponentRequest } from '../../components/leftPanel/state/actions';

import Styles from './index.module.scss';
import { getAllProxyForResourcesRequest } from './state/actions';

export interface Props {
  getAllPathwayFormFields: (a: any, b: string) => void;
}
const PreSelectResourceCreatePath: React.FC<Props> = ({
  getAllPathwayFormFields,
}) => {
  const [allComponentTypes, setAllComponentTypes] = useState<Array<any>>(
    new Array<any>([])
  );
  const [displaySearchContainer, setDisplaySearchContainer] =
    React.useState(false);
  const [selectedResource, setSelectedResource] = useState<any>([]);
  const [allProxyResourcesCard, setAllProxyResourcesCard] = useState<any>([]);
  const [dropDownRef, setDropDownRef] = useState<string>('');

  const [searchFilterValue, setSearchFilterValue] = useState<any>({
    Keywords: '',
    Skip: 0,
    Take: 20,
    Sort: '',
    Filters: [
      {
        URI: 'meta:pathwayComponentType',
        ItemsText: [],
      },
    ],
  });
  const searchComponent = (e: any) => {
    setSearchFilterValue({ ...searchFilterValue, Keywords: e.target.value });
    setDisplaySearchContainer(true);
  };

  const allProxyForResourcesComponent = useSelector(
    (state: any) => state.preSelectProxyResources.allProxyForResourcesComponent
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (allProxyForResourcesComponent.valid)
      setAllProxyResourcesCard(allProxyForResourcesComponent.data.Results);
  }, [allProxyForResourcesComponent.data]);

  useEffect(() => {
    dispatch(getLeftPanelPathwayComponentRequest());
  }, []);

  useEffect(() => {
    dispatch(getAllProxyForResourcesRequest(searchFilterValue));
  }, [searchFilterValue]);

  const allComponentTabCards = useSelector(
    (state: any) => state.leftPanelReducer.allLeftPathwayComponent
  );
  const menu = (
    <Menu
      onClick={(e) => {
        setDropDownRef(e?.key);
        onMenuClickHandler(e);
      }}
      selectable
      items={allComponentTypes}
    />
  );

  const onMenuClickHandler = (e: any) => {
    const selectedCardType = allComponentTypes.filter(
      (comp_type: any) => comp_type.key === _.toNumber(e.key)
    );
    const updatedSearchValue = { ...searchFilterValue };
    updatedSearchValue.Filters = [
      {
        URI: 'meta:pathwayComponentType',
        ItemsText: [_.get(selectedCardType, '0').label],
      },
    ];
    setSearchFilterValue(updatedSearchValue);
  };

  useEffect(() => {
    if (selectedResource.length > 0)
      getAllPathwayFormFields(selectedResource, 'PendingComponent');

    if (allComponentTabCards?.data?.length > 0) {
      const allTypesOfComponentCards = allComponentTabCards.data.map(
        (card: any, index: any) => ({ key: index, label: card.URI })
      );
      setAllComponentTypes(allTypesOfComponentCards);
    }
  }, [selectedResource, allComponentTabCards]);
  const addResource = (itemId: string, itemIndex: number) => {
    const filteredItem = allProxyResourcesCard.filter(
      (item: any) => item.id === itemId
    );
    setSelectedResource([...selectedResource, filteredItem[0]]);
    allProxyResourcesCard.splice(itemIndex, 1);
    if (allProxyResourcesCard.length === 0) {
      setDisplaySearchContainer(false);
    }
  };
  const UnSelectSelectedItem = (itemId: string, itemIndex: number) => {
    const filteredItem = selectedResource.filter(
      (item: any) => item.id === itemId
    );
    setAllProxyResourcesCard([...allProxyResourcesCard, filteredItem[0]]);
    selectedResource.splice(itemIndex, 1);
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

            <Dropdown overlay={menu}>
              <Typography.Link>
                <Space>
                  {dropDownRef ? (
                    <span className={Styles.dropDownRef}>
                      All resources types
                    </span>
                  ) : (
                    'All resources types'
                  )}

                  <DownOutlined />
                </Space>
              </Typography.Link>
            </Dropdown>
          </div>
          <SearchBox
            placeholder="Search your components"
            onKeyUp={searchComponent}
          />
          <CheckBox
            name="progressionModel"
            label="Only components uploaded by my organisation"
            className=" fontweightlight checkboxlabel"
          />
          <br />
          <br />
          {displaySearchContainer && (
            <div className={Styles.searchItemWrapper}>
              {allProxyResourcesCard.map(
                (filteredResources: any, i: number) => (
                  <div className={Styles.flexGrowCenter} key={i}>
                    <CardWithLeftIcon
                      data={filteredResources}
                      draggable={true}
                      key={i}
                      name={filteredResources.Name}
                      type={filteredResources.Type}
                      description={filteredResources.Description?.slice(0, 30)}
                      IconName={faGear}
                      IconColor="black"
                    />
                    <PlusOutlined
                      onClick={() => addResource(filteredResources.id, i)}
                    />
                  </div>
                )
              )}
            </div>
          )}
        </Col>
        <Col span="12">
          <div className={Styles.flexCenter}>
            <h5>{selectedResource.length} Resource Selected</h5>
            <p className="dropdown-title">
              Alphabetical <FontAwesomeIcon icon={faCaretDown} color="black" />
            </p>
          </div>
          <Card className="customacardstyle">
            <div className={Styles.cardwrapper}>
              {selectedResource?.map((select_resource: any, i: number) => (
                <div className={Styles.flexGrowCenter} key={i}>
                  <CardWithLeftIcon
                    draggable={true}
                    data={select_resource}
                    key={i}
                    name={select_resource.Name}
                    type={select_resource.Type}
                    description={select_resource.Description.slice(0, 30)}
                    IconName={faGear}
                    IconColor="black"
                  />
                  <span
                    className={Styles.iconCircle}
                    onClick={() => UnSelectSelectedItem(select_resource.id, i)}
                  >
                    <FontAwesomeIcon icon={faMinus} />
                  </span>
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
