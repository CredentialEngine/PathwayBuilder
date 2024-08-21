import { PlusOutlined } from '@ant-design/icons';
import {
  faCaretDown,
  faGear,
  faMinus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Card, Row, Form, Dropdown, Menu, Tag } from 'antd';
import _, { noop } from 'lodash';

import type { CustomTagProps } from 'rc-select/lib/BaseSelect';
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
//import AutoCompleteBox from '../../components/autoComplete';

import {
  GET_PUBLISHED_PATHWAYS,
  PATHWAY_COMPONENTS_FROM,
} from '../../apiConfig/endpoint';
import { TEMP_BASE_URL } from '../../apiConfig/setting';
import Button from '../../components/button';

import { Type } from '../../components/button/type';

import CardWithLeftIcon from '../../components/cardWithLeftIcon';
import SearchBox from '../../components/formFields/searchBox';
import { getLeftPanelPathwayComponentRequest } from '../../components/leftPanel/state/actions';
import Modal from '../../components/modal';
import { updateMappedDataRequest } from '../../states/actions';
//import { SelectAutoCompleteProps } from '../../utils/selectProps';
import DebounceSelect from '../addPathwayForm/debounceSelect';

import Styles from './index.module.scss';

export interface Props {
  setIsSelectedExistingVisible: (a: boolean) => void;
  addPathwayWrapperFields: any;
  setIsAddPathwayDestinationVisible: (a: boolean) => void;
  fromPreSelect: boolean;
  setIsDestinationColumnSelected?: (a: boolean) => void;
  getSkipValueOfPreSelectResources?: (a: boolean) => void;
}
const PreSelectResourceCreatePath: React.FC<Props> = ({
  setIsSelectedExistingVisible,
  addPathwayWrapperFields,
  setIsAddPathwayDestinationVisible,
  fromPreSelect,
  setIsDestinationColumnSelected,
  getSkipValueOfPreSelectResources,
}) => {
  const [previousDisabled, setPreviousDisabled] = useState(false);
  const [nextDisabled, setNextDisabled] = useState(false);
  const [displaySearchContainer, setDisplaySearchContainer] =
    React.useState(false);
  const [allOrganizations, setAllOrganizations] = useState<[]>([]);
  const [selectedOrganization, setSelectedOrganization] = useState<any>([]);
  const [selectedResource, setSelectedResource] = useState<any>([]);
  const [deletedResource, setDeletedResource] = useState<any>([]);
  const [selectedAlphaResource, setSelectedAlphaResource] = useState<any>([]);
  const [allProxyResourcesCard, setAllProxyResourcesCard] = useState<any>([]);
  const [alphabetical, setAlphabetical] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [isJoin, setIsJoin] = useState(false);
  const [isCopy, setIsCopy] = useState(false);
  //   const [checkboxForOrganisation, setCheckboxForOrganisation] =
  //     useState<boolean>(false);
  const pathwayWrapper = useSelector((state: any) => state.initalReducer);
  const { mappedData: pathwayComponent } = pathwayWrapper;
  const resultSection = useRef(document.createElement('div'));
  const appState = useSelector((state: any) => state?.initalReducer);
  const [isVisible, setIsVisible] = useState(false);
  const [searchFilterValue, setSearchFilterValue] = useState<any>({
    Keywords: '',
    Skip: 0,
    Take: 20,
    Sort: '',
    Filters: [],
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

    return fetch(`${TEMP_BASE_URL}${GET_PUBLISHED_PATHWAYS}`, {
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
  async function fetchPathwayResults(): Promise<any[]> {
    const data = JSON.stringify({ searchFilterValue });
    const parsedJSON = JSON.parse(data);
    const searchFilterContent = parsedJSON.searchFilterValue;
    const stringifiedResult = JSON.stringify(searchFilterContent, null, 2);

    debugger;
    return fetch(`${TEMP_BASE_URL}${PATHWAY_COMPONENTS_FROM}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: stringifiedResult,
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
        if (isCopy) {
          const updatedResults = body.Data.Results.map((dta: any) => ({
            ...dta,
            IsExternalComponent: false,
            FromExternalPathway: [],
            CredentialType: dta?.CredentialType?.split(':')[1].replace(
              '//purl.org/ctdl/terms/',
              'ceterms:'
            ),
          }));
          setAllProxyResourcesCard(updatedResults);
        } else {
          setAllProxyResourcesCard(body.Data.Results);
        }

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
        (item: any) => item.URI == 'ceterms:isPartOf_ceterms:ctid'
      );
      const filteredOccupations = allOrganizations
        ?.filter((data: any) => data.Name === selectedOrganization[0])
        .map((obj: any) => obj.value);
      updatedSearchValue.Filters = [
        ...updatedSearchValue.Filters,
        {
          URI: 'ceterms:isPartOf_ceterms:ctid',
          ItemTexts: filteredOccupations,
        },
      ];
    } else {
      _.remove(
        updatedSearchValue.Filters,
        (item: any) => item.URI == 'ceterms:isPartOf_ceterms:ctid'
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
    fetchPathwayResults();
  }, [searchFilterValue]);

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
  const searchTypeMenu = [
    {
      label: 'Select the action Type',
      key: '0',
    },
    {
      label: 'Join Components',
      key: '1',
    },
    {
      label: 'Copy Components',
      key: '2',
    },
  ];

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
    setIsSelectedExistingVisible(false);
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
    setIsSelectedExistingVisible(false);
    !fromPreSelect &&
      !!setIsDestinationColumnSelected &&
      setIsDestinationColumnSelected(true);
    !!getSkipValueOfPreSelectResources &&
      getSkipValueOfPreSelectResources(true);
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

  useEffect(() => {
    if (search == '1') {
      setIsJoin(true);
      setIsCopy(false);
      setIsVisible(true);
      setDisplaySearchContainer(true);
    }
    if (search == '2') {
      setIsJoin(false);
      setIsCopy(true);
      setIsVisible(true);
      setDisplaySearchContainer(true);
    }
    if (search == '0') {
      setIsJoin(false);
      setIsCopy(false);
      setIsVisible(false);
      setDisplaySearchContainer(false);
    }
  }, [search]);

  return (
    <Form className={Styles.skinwrapper} onFinish={noop} autoComplete="off">
      <span style={{ color: 'rgb(255, 77, 79)' }}>
        This search is only for previously published components that were
        created with another pathways
      </span>
      <br />
      <br />
      <Row gutter={20}>
        <Col span="12">
          <div className={Styles.dropDownRefDiv}>
            <div className="child">
              <Form.Item
                required={true}
                wrapperCol={{ span: 24 }}
                labelCol={{ span: 24 }}
                label="Component Action"
                validateTrigger="onBlur"
                tooltip=""
              ></Form.Item>
            </div>
            <div
              className="child"
              style={{ backgroundColor: '#4ee5e1', borderRadius: '5px' }}
            >
              <Dropdown
                overlay={
                  <Menu
                    items={searchTypeMenu}
                    selectable
                    onClick={(e) => {
                      setSearch(e.key);
                    }}
                  />
                }
                trigger={['click']}
              >
                <p className="dropdown-title d-flex">
                  {searchTypeMenu[Number(search)]?.label}&nbsp;
                  <FontAwesomeIcon icon={faCaretDown} color="black" />
                </p>
              </Dropdown>
            </div>
          </div>
          <br />
          <br />
          <br />
          {isJoin && (
            <span style={{ color: 'rgb(255, 77, 79)' }}>
              The purpose of re-using a component is to be able to link directly
              to the pathway from where the component is used.
            </span>
          )}
          {isCopy && (
            <span style={{ color: 'rgb(255, 77, 79)' }}>
              The purpose of copying a components is to avoid manually entering
              the date again.
            </span>
          )}
          <br />
          <br />
          {isVisible && (
            <>
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
                  placeholder=" Start typing the name of the pathway"
                  fetchOptions={fetchIndustryList}
                  onSelect={(e: any) => onDebounceSelectHnadler(e)}
                  onDeselect={(e: any) => onDebounceDeSelectHnadler(e)}
                />
              </Form.Item>
              <SearchBox
                placeholder="Search your components"
                onKeyUp={searchComponent}
              />
            </>
          )}

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
