import { PlusOutlined, DownOutlined } from '@ant-design/icons';
import {
  faCaretDown,
  faGear,
  faMinus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Col,
  Card,
  Row,
  Form,
  Dropdown,
  Typography,
  Space,
  Menu,
  Tag,
  Drawer,
} from 'antd';
import _, { noop } from 'lodash';

import type { CustomTagProps } from 'rc-select/lib/BaseSelect';
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
//import AutoCompleteBox from '../../components/autoComplete';

import { GET_ORGANIZATION } from '../../../apiConfig/endpoint';
import { TEMP_BASE_URL } from '../../../apiConfig/setting';
import Button from '../../../components/button';

import { Type } from '../../../components/button/type';

import CardWithLeftIcon from '../../../components/cardWithLeftIcon';
import CheckBox from '../../../components/formFields/checkbox';
import SearchBox from '../../../components/formFields/searchBox';
import { getLeftPanelPathwayComponentRequest } from '../../../components/leftPanel/state/actions';
import Modal from '../../../components/modal';
import { updateMappedDataRequest } from '../../../states/actions';
//import { SelectAutoCompleteProps } from '../../utils/selectProps';
import DebounceSelect from '../../addPathwayForm/debounceSelect';

import { getAllProxyForResourcesRequest } from '../../preSelectResourceCreatePath/state/actions';
import StylesRight from '../index.module.scss';

import Styles from './index.module.scss';

export interface Props {
  setIsPreSelectedCreateResourceVisible: (a: boolean) => void;
  panelData?: any;
}
const GroupComponents: React.FC<Props> = ({
  setIsPreSelectedCreateResourceVisible,
  panelData,
}) => {
  const [allComponentTypes, setAllComponentTypes] = useState<Array<any>>(
    new Array<any>([])
  );
  const [previousDisabled, setPreviousDisabled] = useState(false);
  const [nextDisabled, setNextDisabled] = useState(false);
  const [displaySearchContainer, setDisplaySearchContainer] =
    React.useState(true);
  const [allOrganizations, setAllOrganizations] = useState<[]>([]);
  const [selectedOrganization, setSelectedOrganization] = useState<any>([]);
  const [selectedResource, setSelectedResource] = useState<any>([]);
  const [deletedResource, setDeletedResource] = useState<any>([]);
  const [selectedAlphaResource, setSelectedAlphaResource] = useState<any>([]);
  const [allProxyResourcesCard, setAllProxyResourcesCard] = useState<any>([]);
  const [dropDownRef, setDropDownRef] = useState<string>('');
  const [alphabetical, setAlphabetical] = useState<string>('');
  const [checkboxForOrganisation, setCheckboxForOrganisation] =
    useState<boolean>(false);
  const pathwayWrapper = useSelector((state: any) => state.initalReducer);
  //const { mappedData: pathwayComponent } = pathwayWrapper;
  const resultSection = useRef(document.createElement('div'));
  const appState = useSelector((state: any) => state?.initalReducer);
  const [isVisible, setIsVisible] = useState(true);
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
  // const [searchOrgFilterValue, setOrgSearchFilterValue] = useState<any>({
  //   Keywords: '',
  // });

  const {
    mappedData: {
      PathwayComponents,
      ComponentConditions,
      Constraints,
      DeletedComponents,
    },
  } = appState || {};

  const scrollToTop = () => {
    resultSection.current.scrollTo(0, 0);
  };
  useEffect(() => {
    if (searchFilterValue.Skip == 0) {
      setPreviousDisabled(true);
    } else {
      setPreviousDisabled(false);
    }
  });
  const tagRender = (props: CustomTagProps) => {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <Tag
        color={value}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        // className={styles.content}
      >
        {label && label.toString().substring(0, 72)}
      </Tag>
    );
  };
  async function fetchIndustryList(e: string): Promise<any[]> {
    const data = new FormData();
    data.append('json', JSON.stringify({ Keywords: e }));

    return fetch(`${TEMP_BASE_URL}${GET_ORGANIZATION}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ Keywords: e }),
    })
      .then((response: any) => response.clone().json())
      .then((body: any) => {
        const updatedBody = body.Data.Results.map((dta: any) => ({
          Name: dta.Name,
          Description: dta.Description,
          CTID: dta.CTID,
          label: dta.Name,
          value: dta.CTID,
        }));
        setAllOrganizations(updatedBody);
        return updatedBody;
      });
  }

  const onDebounceSelectHnadler = (e: any) => {
    const filteredOccupations = allOrganizations?.filter(
      (data: any) => data.value === e.value
    );
    const selected = filteredOccupations.map((obj: any) => obj.Name);
    setSelectedOrganization(selected);
  };

  const onDebounceDeSelectHnadler = (e: any) => {
    const selected = selectedOrganization
      ?.filter((item: any) => item !== e.value)
      .map((obj: any) => obj.Name);
    setSelectedOrganization(selected);
  };
  const searchComponent = (e: any) => {
    setSearchFilterValue({
      ...searchFilterValue,
      Keywords: e.target.value,
      Skip: 0,
    });
    setDisplaySearchContainer(true);
  };
  useEffect(() => {
    const updatedSearchValue = { ...searchFilterValue };
    updatedSearchValue.Skip = 0;
    if (selectedOrganization != null && selectedOrganization != '') {
      _.remove(
        updatedSearchValue.Filters,
        (item: any) => item.URI == 'search:recordOwnedBy'
      );
      const filteredOccupations = allOrganizations
        ?.filter((data: any) => data.Name === selectedOrganization[0])
        .map((obj: any) => obj.value);
      updatedSearchValue.Filters = [
        ...updatedSearchValue.Filters,
        {
          URI: 'search:recordOwnedBy',
          ItemTexts: filteredOccupations,
        },
      ];
    } else {
      _.remove(
        updatedSearchValue.Filters,
        (item: any) => item.URI == 'search:recordOwnedBy'
      );
    }

    setSearchFilterValue(updatedSearchValue);
    // setDisplaySearchContainer(true);
  }, [selectedOrganization]);

  const getNextSearchComponent = () => {
    const currentsearch = searchFilterValue;
    setSearchFilterValue({
      ...searchFilterValue,
      Keywords: currentsearch.Keywords,
      Skip: currentsearch.Skip + 20,
    });
    setDisplaySearchContainer(true);
  };

  const getPreviousSearchComponent = () => {
    const currentsearch = searchFilterValue;
    setSearchFilterValue({
      ...searchFilterValue,
      Keywords: currentsearch.Keywords,
      Skip:
        currentsearch.Skip > 0 ? currentsearch.Skip - 20 : currentsearch.Skip,
    });
    setDisplaySearchContainer(true);
  };

  const allProxyForResourcesComponent = useSelector(
    (state: any) => state.preSelectProxyResources.allProxyForResourcesComponent
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (allProxyForResourcesComponent.valid) {
      const updatedBody = allProxyForResourcesComponent?.data?.Results?.map(
        (dta: any) => ({
          Name: dta.Name,
          Description: dta.Description,
          CTID: dta?.FinderResource?.CTID,
          Type: dta.Type,
          CredentialType: dta.CredentialType,
          CredentialId: dta.CredentialType,
        })
      );
      if (updatedBody !== undefined) {
        setAllProxyResourcesCard(updatedBody);
      }
    }
    if (allProxyForResourcesComponent.data !== null) {
      if (allProxyForResourcesComponent.data.Results.length == 0) {
        setNextDisabled(true);
        setDisplaySearchContainer(true);
      } else {
        setNextDisabled(false);
        if (displaySearchContainer) {
          scrollToTop();
        }
      }
    }
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

  useEffect(() => {
    if (panelData && panelData?.ProxyForList) {
      debugger;
      const updatedBody = panelData?.ProxyForList?.map((dta: any) => ({
        Name: dta.Name,
        Description: dta.Description,
        CTID: dta.CTID,
        Type: dta.Type,
        CredentialType: dta.CredentialType || dta.CredentialId,
        CredentialId: dta.CredentialType || dta.CredentialType,
        ProxyFor: dta.FinderResources?.CTID,
      }));
      setSelectedResource(updatedBody);
    }
  }, [panelData]);
  useEffect(() => {
    const updatedSearchValue = { ...searchFilterValue };
    if (!_.isNull(pathwayWrapper.mappedData.Pathway.Organization.CTID)) {
      _.remove(
        updatedSearchValue.Filters,
        (item: any) => item.URI == 'search:recordOwnedBy'
      );
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

  const onMenuClickHandler = (e: any) => {
    const selectedCardType = allComponentTypes.filter(
      (comp_type: any) => comp_type.key === _.toNumber(e.key)
    );
    const updatedSearchValue = { ...searchFilterValue };
    updatedSearchValue.Skip = 0;
    if (e?.key) {
      if (
        !_.isNull(pathwayWrapper.mappedData.Pathway.Organization.CTID) &&
        checkboxForOrganisation
      ) {
        updatedSearchValue.Filters = [
          {
            URI: 'meta:pathwayComponentType',
            ItemTexts: [_.get(selectedCardType, '0').Name],
          },
          {
            URI: 'search:recordOwnedBy',
            ItemTexts: [pathwayWrapper.mappedData.Pathway.Organization.CTID],
          },
        ];
        setSearchFilterValue(updatedSearchValue);
      } else {
        _.remove(
          updatedSearchValue.Filters,
          (item: any) => item.URI == 'meta:pathwayComponentType'
        );
        updatedSearchValue.Filters = [
          ...updatedSearchValue.Filters,
          {
            URI: 'meta:pathwayComponentType',
            ItemTexts: [_.get(selectedCardType, '0').Name],
          },
        ];
        setSearchFilterValue(updatedSearchValue);
        setDisplaySearchContainer(true);
      }
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
      const updated = allComponentTabCards.data.filter(
        (opt: any) =>
          opt.Name !== 'Component Condition' && opt.Name !== 'Multi Component'
      );
      const updatedoptions = updated.map((card: any, index: any) => ({
        key: index,
        label: card.Name,
        Name: card.URI,
      }));
      // const allTypesOfComponentCards = allComponentTabCards.data.map(
      //   (card: any, index: any) => ({
      //     key: index,
      //     label: card.Name,
      //     Name: card.URI,
      //   })
      // );
      // //remove the component condition from the list
      // const updatedoptions = allTypesOfComponentCards.filter(
      //   (opt: any) => opt.label !== 'Component Condition' && opt.label !== 'Multi Component'
      // );
      const allresources = {
        key: 10,
        label: 'All resources',
        Name: 'All resources',
      };
      updatedoptions.push(allresources);
      setAllComponentTypes(updatedoptions);
    }
  }, [selectedResource, allComponentTabCards]);

  const addResource = (selectedItem: any, itemIndex: number) => {
    const filteredItem = allProxyResourcesCard.filter(
      (item: any) => item.CTID === selectedItem?.CTID
    );
    debugger;

    const selectedItemExist = selectedResource.some(
      (item: any) =>
        item.Description === selectedItem?.Description &&
        item.Name === selectedItem?.Name
    );

    if (selectedItemExist) {
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
      setDisplaySearchContainer(true);
    }
  };

  const UnSelectSelectedItem = (itemId: string, itemIndex: number) => {
    const filteredItem = selectedResource.filter(
      (item: any) => item.CTID === itemId
    );
    setAllProxyResourcesCard([...allProxyResourcesCard, filteredItem[0]]);
    selectedResource.splice(itemIndex, 1);
    setDeletedResource(DeletedComponents);
    if (!deletedResource?.some((item: any) => item.CTID === itemId)) {
      setDeletedResource([...deletedResource, ...filteredItem]);
    }
    if (allProxyResourcesCard.length > 0) {
      setDisplaySearchContainer(true);
    }
  };

  const onPathwaySaveHandler = () => {
    panelData.ProxyForList = selectedResource;
    debugger;
    const test = pathwayWrapper?.mappedData?.PathwayComponents?.filter(
      (item: any) => item?.RowId !== panelData?.RowId
    );
    test.push({
      ...panelData,
    });
    pathwayWrapper.mappedData.PathwayComponents = test;
    dispatch(updateMappedDataRequest(pathwayWrapper.mappedData));
    setIsPreSelectedCreateResourceVisible(false);
  };

  const onPreSelectResourceCancelHandler = () => {
    const updatedPathwayWrapper = { ...appState.mappedData };
    updatedPathwayWrapper.PathwayComponents = PathwayComponents;
    updatedPathwayWrapper.ComponentConditions = ComponentConditions;
    updatedPathwayWrapper.Constraints = Constraints;
    updatedPathwayWrapper.DeletedComponents = DeletedComponents;
    setIsPreSelectedCreateResourceVisible(false);
  };

  const handleCheckBox = () => {
    setCheckboxForOrganisation(!checkboxForOrganisation);
    checkboxForOrganisation === false
      ? setIsVisible(false)
      : setIsVisible(true);
  };

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
    <Drawer
      visible={true}
      className={StylesRight.right_drawer}
      width={1000}
      placement="left"
    >
      <Form className={Styles.skinwrapper} onFinish={noop} autoComplete="off">
        <div style={{ display: 'flex' }}>
          <h2>Group Components</h2>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Button
            style={{ float: 'right', background: 'White', border: 'none' }}
            text="X"
            onClick={() => setIsPreSelectedCreateResourceVisible(false)}
          />
        </div>
        <Row gutter={20}>
          <Col span="12">
            <div className={Styles.dropDownRefDiv}>
              <div className="child">
                <h5>Filter Registry Resources</h5>
              </div>
              <div
                className="child"
                style={{ backgroundColor: '#4ee5e1', borderRadius: '5px' }}
              >
                <Dropdown overlay={menu} trigger={['click']}>
                  <Typography.Link>
                    <Space>
                      {dropDownRef ? (
                        <span className={Styles.dropDownRef}>
                          {allComponentTypes[Number(dropDownRef)]?.label}
                        </span>
                      ) : (
                        'All resources'
                      )}

                      <DownOutlined />
                    </Space>
                  </Typography.Link>
                </Dropdown>
              </div>
            </div>
            <SearchBox
              placeholder="Search your components"
              onKeyUp={searchComponent}
            />
            {isVisible && (
              <Form.Item
                wrapperCol={{ span: 24 }}
                labelCol={{ span: 24 }}
                validateTrigger="onBlur"
              >
                <DebounceSelect
                  // disabled={isViewMode}
                  mode="multiple"
                  tagRender={tagRender}
                  value={selectedOrganization}
                  placeholder=" Start Typing to select the organization"
                  fetchOptions={fetchIndustryList}
                  onSelect={(e: any) => onDebounceSelectHnadler(e)}
                  onDeselect={(e: any) => onDebounceDeSelectHnadler(e)}
                />
              </Form.Item>
            )}

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
              <div className={Styles.searchItemWrapper} ref={resultSection}>
                {allProxyResourcesCard.map(
                  (filteredResources: any, i: number) => (
                    <div className={Styles.flexGrowCenter} key={i}>
                      <CardWithLeftIcon
                        data={filteredResources}
                        draggable={true}
                        key={i}
                        name={filteredResources?.Name}
                        type={filteredResources?.Type}
                        description={filteredResources?.Description?.slice(
                          0,
                          30
                        )}
                        IconName={faGear}
                        IconColor="black"
                      />
                      <PlusOutlined
                        onClick={() => addResource(filteredResources, i)}
                      />
                    </div>
                  )
                )}
                <div style={{ display: 'flex', margin: '40px 0px 10px 10px' }}>
                  <Button
                    type={Type.PRIMARY}
                    onClick={getPreviousSearchComponent}
                    text="Previous"
                    style={{ marginRight: '20px' }}
                    disabled={previousDisabled}
                  />

                  <Button
                    type={Type.PRIMARY}
                    onClick={getNextSearchComponent}
                    text="Next"
                    disabled={nextDisabled}
                  />
                </div>
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
                      onClick={() =>
                        UnSelectSelectedItem(select_resource.CTID, i)
                      }
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
                  group them to make a Multi COmponent.
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
                // disabled={selectedResource?.length === 0}
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
    </Drawer>
  );
};
export default GroupComponents;
