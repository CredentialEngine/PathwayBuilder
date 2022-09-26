import { Form } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import AutoCompleteBox from '../../components/autoComplete';

import Button from '../../components/button';
import Dropdown from '../../components/formFields/dropdown';
import Options from '../../components/formFields/dropdown/lib/options';
import InputBox from '../../components/formFields/inputBox';
import RadioButton from '../../components/formFields/radio';
import { getLeftPanelPathwayComponentRequest } from '../../components/leftPanel/state/actions';
import Tab, { TabPane } from '../../components/tab';
import { SelectAutoCompleteProps } from '../../utils/selectProps';
import { getAllProxyForResourcesRequest } from '../preSelectResourceCreatePath/state/actions';

import Styles from './index.module.scss';

export enum ComponentToPathway {
  DefineComponent = 'Define Component',
  AddPlaceholder = 'Add a Placeholder',
}

const AddComponentToPathway = () => {
  const propsChildrenData = [];
  const tab = [
    {
      key: ComponentToPathway.DefineComponent,
      name: ComponentToPathway.DefineComponent,
    },
    {
      key: ComponentToPathway.AddPlaceholder,
      name: ComponentToPathway.AddPlaceholder,
    },
  ];
  const allProxyForResourcesComponent = useSelector(
    (state: any) => state.preSelectProxyResources.allProxyForResourcesComponent
  );
  const dispatch = useDispatch();
  const [allComponentTypes, setAllComponentTypes] = useState<Array<any>>(
    new Array<any>([])
  );

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

  const [allProxyResourcesCard, setAllProxyResourcesCard] = useState<any>([]);
  const [selectedResource, setSelectedResource] = useState<any>([]);

  const allComponentTabCards = useSelector(
    (state: any) => state.leftPanelReducer.allLeftPathwayComponent
  );

  useEffect(() => {
    dispatch(getAllProxyForResourcesRequest(searchFilterValue));
  }, [searchFilterValue]);

  useEffect(() => {
    dispatch(getLeftPanelPathwayComponentRequest());
  }, []);

  useEffect(() => {
    if (allComponentTabCards?.data?.length > 0) {
      const allTypesOfComponentCards = allComponentTabCards.data.map(
        (card: any, index: any) => ({ key: index, label: card.URI })
      );
      setAllComponentTypes(allTypesOfComponentCards);
    }
  }, [allComponentTabCards]);

  useEffect(() => {
    if (allProxyForResourcesComponent.valid)
      setAllProxyResourcesCard(allProxyForResourcesComponent.data.Results);
  }, [allProxyForResourcesComponent.data]);

  const onProgressionModelSearchHandler = (e: any) => {
    setSearchFilterValue({ ...searchFilterValue, keywords: e });
  };

  const selectResource = (e: any) => {
    const tempSelectedResource = allProxyResourcesCard.filter(
      (model: any) => model.Name === e
    );
    setSelectedResource(tempSelectedResource);
  };

  const propsChildren = [
    {
      key: ComponentToPathway.DefineComponent,
      name: ComponentToPathway.DefineComponent,
      children: (
        <div className={Styles.addComponentToPathway}>
          <Form.Item label="Component Type" name="Component Type">
            <Dropdown defaultValue="Course Component">
              {allComponentTypes?.map((item: any, idx: number) => (
                <Options key={idx} value={item?.label}>
                  {item?.label}
                </Options>
              ))}
            </Dropdown>
          </Form.Item>
          <Form.Item label="Choose Resource" name="Choose Resource">
            <p>
              <RadioButton label="Only selected resource" />
              <RadioButton label="All my resource" />
              <RadioButton label="All resource" />
            </p>
            {/* <Dropdown placeholder="Start typing to find a component">
              <Options value="item1">item1</Options>
              <Options value="item2">item2</Options>
              <Options value="item3">item3</Options>
            </Dropdown> */}
            <AutoCompleteBox
              {...SelectAutoCompleteProps(
                allProxyResourcesCard,
                selectedResource,
                'Name',
                'Name'
              )}
              placeholder="Start typing to choose a Progression Model"
              onSearch={onProgressionModelSearchHandler}
              onSelect={(e: any) => selectResource(e)}
            />
          </Form.Item>
          <br />
          <br />
          <br />
          <br />
          <br />
          <hr />
          <Button text="Add New Component" type="primary" />
        </div>
      ),
    },
    {
      key: ComponentToPathway.AddPlaceholder,
      name: ComponentToPathway.AddPlaceholder,
      children: (
        <div className={Styles.addComponentToPathway}>
          <Form.Item label="Component Type" name="Component Type">
            <Dropdown defaultValue="Course Component">
              <Options value="item1">item1</Options>
              <Options value="item2">item2</Options>
              <Options value="item3">item3</Options>
            </Dropdown>
          </Form.Item>
          <Form.Item label="Name Placeholder" name="Name Placeholder">
            <InputBox placeholder="Name Placeholder" />
          </Form.Item>
          <Form.Item label="External Reference" name="External Reference">
            <small>
              {' '}
              Add a external url reference a reference not found in the register
            </small>
            <InputBox placeholder="Add a URL" />
          </Form.Item>
          <br />
          <hr />
          <Button text="Add Placeholder" type="primary" disabled />
        </div>
      ),
    },
  ];
  for (let i = 0; i < propsChildren.length; i++) {
    propsChildrenData.push(
      <TabPane name={propsChildren[i].name} key={propsChildren[i].key}>
        {propsChildren[i].children}
      </TabPane>
    );
  }

  const tabVal = {
    showTabBar: true,
    activeKey: ComponentToPathway.DefineComponent,
    tabs: tab,
    children: propsChildrenData,
    className: Styles.addComToPathwaytab,
  };
  return (
    <>
      <h2>Add a Component To Pathway</h2>
      <Tab {...tabVal} />
    </>
  );
};

export default AddComponentToPathway;
