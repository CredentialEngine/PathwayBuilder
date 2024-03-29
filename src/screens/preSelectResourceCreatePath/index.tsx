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
} from 'antd';
import _, { noop } from 'lodash';

import type { CustomTagProps } from 'rc-select/lib/BaseSelect';
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
//import AutoCompleteBox from '../../components/autoComplete';

import { GET_ORGANIZATION } from '../../apiConfig/endpoint';
import { TEMP_BASE_URL } from '../../apiConfig/setting';
import Button from '../../components/button';

import { Type } from '../../components/button/type';

import CardWithLeftIcon from '../../components/cardWithLeftIcon';
import CheckBox from '../../components/formFields/checkbox';
import SearchBox from '../../components/formFields/searchBox';
import { getLeftPanelPathwayComponentRequest } from '../../components/leftPanel/state/actions';
import Modal from '../../components/modal';
import { updateMappedDataRequest } from '../../states/actions';
//import { SelectAutoCompleteProps } from '../../utils/selectProps';
import DebounceSelect from '../addPathwayForm/debounceSelect';

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
  const { mappedData: pathwayComponent } = pathwayWrapper;
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

  useEffect(() => {
    if (pathwayComponent && pathwayComponent?.PendingComponents?.length > 0) {
      setSelectedResource(pathwayComponent?.PendingComponents);
    }
  }, [pathwayComponent]);

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
    if (allProxyForResourcesComponent.valid)
      setAllProxyResourcesCard(allProxyForResourcesComponent.data.Results);
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
      const allTypesOfComponentCards = allComponentTabCards.data.map(
        (card: any, index: any) => ({
          key: index,
          label: card.Name,
          Name: card.URI,
        })
      );
      //remove the component condition from the list
      const updatedoptions = allTypesOfComponentCards.filter(
        (opt: any) => opt.label !== 'Component Condition'
      );
      const allresources = { key: 9, label: 'All resources' };
      updatedoptions.push(allresources);
      setAllComponentTypes(updatedoptions);
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
    setIsPreSelectedCreateResourceVisible(false);
    !!getSkipValueOfPreSelectResources &&
      getSkipValueOfPreSelectResources(true);
    const updatedPathwayWrapper = { ...appState.mappedData };
    updatedPathwayWrapper.PathwayComponents = PathwayComponents;
    updatedPathwayWrapper.ComponentConditions = ComponentConditions;
    updatedPathwayWrapper.Constraints = Constraints;
    updatedPathwayWrapper.DeletedComponents =
      deletedResource.length > 0 ? deletedResource : DeletedComponents;

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
            ComponentConditions: [],
            PathwayComponents: [],
          })
        )
      : dispatch(
          updateMappedDataRequest({
            ...updatedPathwayWrapper,
          })
        );
    setIsPreSelectedCreateResourceVisible(false);
    !fromPreSelect &&
      !!setIsDestinationColumnSelected &&
      setIsDestinationColumnSelected(true);
    !!getSkipValueOfPreSelectResources &&
      getSkipValueOfPreSelectResources(true);
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
    <Form className={Styles.skinwrapper} onFinish={noop} autoComplete="off">
      Use registry search to include resources into your pathway, The Purpose of
      using the registry search is to use the data already included with the
      resource and to link directly to it.
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
  );
};
export default PreSelectResourceCreatePath;
