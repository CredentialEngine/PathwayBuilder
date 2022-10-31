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

import Button from '../../components/button';

import { Type } from '../../components/button/type';

import CardWithLeftIcon from '../../components/cardWithLeftIcon';
import CheckBox from '../../components/formFields/checkbox';
import SearchBox from '../../components/formFields/searchBox';
import { getLeftPanelPathwayComponentRequest } from '../../components/leftPanel/state/actions';
import Modal from '../../components/modal';
import { updateMappedDataRequest } from '../../states/actions';

import Styles from './index.module.scss';
import { getAllProxyForResourcesRequest } from './state/actions';

export interface Props {
  setIsPreSelectedCreateResourceVisible: (a: boolean) => void;
  addPathwayWrapperFields: any;
  setIsAddPathwayDestinationVisible: (a: boolean) => void;
  fromPreSelect: boolean;
  setIsDestinationColumnSelected?: (a: boolean) => void;
  getSkipValueOfPreSelectResources?: (a: boolean) => void;
}
const PreSelectResourceCreatePath: React.FC<Props> = ({
  setIsPreSelectedCreateResourceVisible,
  addPathwayWrapperFields,
  setIsAddPathwayDestinationVisible,
  fromPreSelect,
  setIsDestinationColumnSelected,
  getSkipValueOfPreSelectResources,
}) => {
  const [allComponentTypes, setAllComponentTypes] = useState<Array<any>>(
    new Array<any>([])
  );
  const [displaySearchContainer, setDisplaySearchContainer] =
    React.useState(false);
  const [selectedResource, setSelectedResource] = useState<any>([]);
  const [selectedAlphaResource, setSelectedAlphaResource] = useState<any>([]);
  const [allProxyResourcesCard, setAllProxyResourcesCard] = useState<any>([]);
  const [dropDownRef, setDropDownRef] = useState<string>('');
  const [alphabetical, setAlphabetical] = useState<string>('');
  const [checkboxForOrganisation, setCheckboxForOrganisation] =
    useState<boolean>(false);
  const pathwayWrapper = useSelector((state: any) => state.initalReducer);
  const { mappedData: pathwayComponent } = pathwayWrapper;

  const appState = useSelector((state: any) => state?.initalReducer);
  const [searchFilterValue, setSearchFilterValue] = useState<any>({
    Keywords: '',
    Skip: 0,
    Take: 20,
    Sort: '',
    Filters: [
      {
        URI: 'meta:pathwayComponentType',
        ItemTexts: [],
      },
    ],
  });

  const {
    mappedData: {
      PathwayComponents,
      ComponentConditions,
      Constraints,
      DeletedComponents,
    },
  } = appState || {};

  useEffect(() => {
    if (pathwayComponent && pathwayComponent?.PendingComponents?.length > 0) {
      setSelectedResource(pathwayComponent?.PendingComponents);
    }
  }, [pathwayComponent]);

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
  const alphabeticalMenu = [
    {
      label: 'Alphabetical',
      key: '0',
    },
    {
      label: 'Recently Added',
      key: '1',
    },
  ];

  const onMenuClickHandler = (e: any) => {
    const selectedCardType = allComponentTypes.filter(
      (comp_type: any) => comp_type.key === _.toNumber(e.key)
    );
    const updatedSearchValue = { ...searchFilterValue };

    if (e?.key) {
      updatedSearchValue.Filters = [
        ...updatedSearchValue.Filters,
        {
          URI: 'meta:pathwayComponentType',
          ItemTexts: [_.get(selectedCardType, '0').label],
        },
      ];
      setSearchFilterValue(updatedSearchValue);
    } else {
      _.remove(
        updatedSearchValue.Filters,
        (item: any) => item.URI == 'meta:pathwayComponentType'
      );
      setSearchFilterValue(updatedSearchValue);
    }
  };
  useEffect(() => {
    if (allComponentTabCards?.data?.length > 0) {
      const allTypesOfComponentCards = allComponentTabCards.data.map(
        (card: any, index: any) => ({ key: index, label: card.URI })
      );
      setAllComponentTypes(allTypesOfComponentCards);
    }
  }, [selectedResource, allComponentTabCards]);

  const addResource = (selectedItem: any, itemIndex: number) => {
    const filteredItem = allProxyResourcesCard.filter(
      (item: any) => item.CTID === selectedItem?.CTID
    );

    const selectedItemExist = selectedResource.some(
      (item: any) =>
        item.CTID === selectedItem?.CTID ||
        item.ProxyFor === selectedItem?.ProxyFor
    );

    const pathwayComponentsExists = pathwayComponent?.PathwayComponents?.some(
      (item: any) =>
        item.CTID === selectedItem?.CTID ||
        item.ProxyFor === selectedItem?.ProxyFor
    );

    const PendingComponentsExists =
      pathwayWrapper?.pathwayComponentData?.data?.PendingComponents?.some(
        (item: any) =>
          item.CTID === selectedItem?.CTID ||
          item.ProxyFor === selectedItem?.ProxyFor
      );

    if (
      selectedItemExist ||
      pathwayComponentsExists ||
      PendingComponentsExists
    ) {
      Modal.confirm({
        cancelText: 'No',
        okText: 'Yes',
        title:
          'This resource has already been selected, or already exists in your Pathway. Do you want to add it again?',
        onOk: () => {
          setSelectedResource([...selectedResource, ...filteredItem]);
          allProxyResourcesCard.splice(itemIndex, 1);
        },
      });
    } else {
      setSelectedResource([...selectedResource, ...filteredItem]);
      allProxyResourcesCard.splice(itemIndex, 1);
    }
    setAllProxyResourcesCard(allProxyResourcesCard);
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

  const onPathwaySaveHandler = () => {
    setIsPreSelectedCreateResourceVisible(false);
    !!getSkipValueOfPreSelectResources &&
      getSkipValueOfPreSelectResources(true);
    const updatedPathwayWrapper = { ...appState.mappedData };
    updatedPathwayWrapper.PathwayComponents = PathwayComponents;
    updatedPathwayWrapper.ComponentConditions = ComponentConditions;
    updatedPathwayWrapper.Constraints = Constraints;
    updatedPathwayWrapper.DeletedComponents = DeletedComponents;

    !fromPreSelect && setIsAddPathwayDestinationVisible(true);
    !fromPreSelect
      ? dispatch(
          updateMappedDataRequest({
            ...addPathwayWrapperFields,
            PendingComponents: selectedResource,
            ComponentConditions: [],
            PathwayComponents: [],
          })
        )
      : dispatch(
          updateMappedDataRequest({
            ...updatedPathwayWrapper,
            PendingComponents: selectedResource,
          })
        );
  };

  const onPreSelectResourceCancelHandler = () => {
    setIsPreSelectedCreateResourceVisible(false);
    !fromPreSelect &&
      !!setIsDestinationColumnSelected &&
      setIsDestinationColumnSelected(true);
    !!getSkipValueOfPreSelectResources &&
      getSkipValueOfPreSelectResources(false);
  };

  const handleCheckBox = () => {
    setCheckboxForOrganisation(!checkboxForOrganisation);
  };

  useEffect(() => {
    const updatedSearchValue = { ...searchFilterValue };
    if (!_.isNull(pathwayWrapper.mappedData.Pathway.Organization.CTID)) {
      if (checkboxForOrganisation) {
        updatedSearchValue.Filters = [
          ...updatedSearchValue.Filters,
          {
            URI: 'search:recordOwnedBy',
            ItemTexts: [pathwayWrapper.mappedData.Pathway.Organization.CTID],
          },
        ];
        setSearchFilterValue(updatedSearchValue);
      } else {
        _.remove(
          updatedSearchValue.Filters,
          (item: any) => item.URI == 'search:recordOwnedBy'
        );
        setSearchFilterValue(updatedSearchValue);
      }
    }
  }, [checkboxForOrganisation]);

  const arrangeAlphabetically = (value: string) => {
    const clonedSelectedResource = _.cloneDeep(selectedResource);
    if (value == 'alphabetical') {
      clonedSelectedResource?.sort((a: any, b: any) =>
        a.Name.localeCompare(b.Name)
      );
      setSelectedAlphaResource(clonedSelectedResource);
    } else {
      setSelectedResource(selectedResource);
      setSelectedAlphaResource([]);
    }
  };

  useEffect(() => {
    Number(alphabetical) === 0
      ? arrangeAlphabetically('alphabetical')
      : arrangeAlphabetically('recentAdded');
  }, [alphabetical]);

  return (
    <Form className={Styles.skinwrapper} onFinish={noop} autoComplete="off">
      <Row gutter={20}>
        <Col span="12">
          <div className={Styles.dropDownRefDiv}>
            <h5>Select Resources</h5>

            <Dropdown overlay={menu} trigger={['click']}>
              <Typography.Link>
                <Space>
                  {dropDownRef ? (
                    <span className={Styles.dropDownRef}>
                      {allComponentTypes[Number(dropDownRef)]?.label}
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
            label="Only components published by my organization"
            className=" fontweightlight checkboxlabel"
            value={checkboxForOrganisation}
            onChange={handleCheckBox}
            checked={checkboxForOrganisation ? true : false}
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
                      name={filteredResources?.Name}
                      type={filteredResources?.Type}
                      description={filteredResources?.Description?.slice(0, 30)}
                      IconName={faGear}
                      IconColor="black"
                    />
                    <PlusOutlined
                      onClick={() => addResource(filteredResources, i)}
                    />
                  </div>
                )
              )}
            </div>
          )}
        </Col>
        <Col span="12">
          <div className={Styles.flexCenter}>
            <>
              <h5>{selectedResource.length} Resource Selected</h5>
              <Dropdown
                overlay={
                  <Menu
                    items={alphabeticalMenu}
                    selectable
                    onClick={(e) => {
                      setAlphabetical(e.key);
                    }}
                  />
                }
                trigger={['click']}
              >
                <p className="dropdown-title d-flex">
                  {alphabeticalMenu[Number(alphabetical)]?.label}&nbsp;
                  <FontAwesomeIcon icon={faCaretDown} color="black" />
                </p>
              </Dropdown>
            </>
          </div>
          <Card className="customacardstyle">
            <div className={Styles.cardwrapper}>
              {(_.isEmpty(selectedAlphaResource)
                ? selectedResource
                : selectedAlphaResource
              )?.map((select_resource: any, i: number) => (
                <div className={Styles.flexGrowCenter} key={i}>
                  <CardWithLeftIcon
                    draggable={true}
                    data={select_resource}
                    key={i}
                    name={select_resource.Name}
                    type={select_resource.Type}
                    description={select_resource.Description?.slice(0, 30)}
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
            {selectedResource.length ? (
              ''
            ) : (
              <p className={Styles.infoCard}>
                Search for resources that you have uploaded to the Registry to
                add them now as pre-selected options. This provides a smaller
                set of resources to create the components you’ll ned work with
                while you are building your Pathway.
                <br />
                <i>
                  Any resource that you have uploaded to the Registry will be
                  availble to you when creating your pathway so you can skip
                  this step.
                </i>
              </p>
            )}
          </Card>
        </Col>
        <Row>
          <div style={{ display: 'flex', margin: '40px 0px 10px 10px' }}>
            <Button
              type={Type.PRIMARY}
              onClick={() => onPathwaySaveHandler()}
              text="Done Adding"
              disabled={selectedResource?.length === 0}
            />
            <Button
              type={Type.CANCEL}
              onClick={onPreSelectResourceCancelHandler}
              text="Skip"
            />
          </div>
        </Row>
      </Row>
    </Form>
  );
};
export default PreSelectResourceCreatePath;
