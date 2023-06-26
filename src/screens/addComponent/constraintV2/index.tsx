import CloseOutlined from '@ant-design/icons/CloseOutlined';
import { faCircle, faQuestion } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Form, Row, Col, Tag } from 'antd';

import _ from 'lodash';
import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';

import Button from '../../../components/button';

import Dropdown from '../../../components/formFields/dropdown';
import InputBox from '../../../components/formFields/inputBox';
import Textarea from '../../../components/formFields/textarea';
import Modal from '../../../components/modal';
import { getAllConstraintOperand } from '../../../utils/fetchSearchResponse';
import DebounceSelect from '../../addPathwayForm/debounceSelect';
import Styles from '../index.module.scss';
import { ConstraintEntity } from '../model';

interface Props {
  RowIndex?: number;
  constraintRow?: any;
  getConstraintData: (val: any) => void;
  deleteRowByIndex: (val: any) => void;
  isViewMode?: boolean;
  setIsEditConstraintModalStatus?: (a: boolean) => void;
}

const Constraintv2: React.FC<Props> = (Props) => {
  //Initialization
  const {
    RowIndex,
    getConstraintData,
    deleteRowByIndex,
    constraintRow,
    isViewMode,
    setIsEditConstraintModalStatus,
  } = Props;
  const [constraintEntityFields, setConstraintEntityFields] = useState<any>(
    new ConstraintEntity()
  );
  const [leftSourceData, setleftSourceData] = useState<any>([]);
  const [rightSourceData, setRightSourceData] = useState<any>([]);
  const [Comparator, setComparator] = useState<any>([]);
  // const [constraintRow, setConstraintRow] = useState<any>([]);
  const [constraintData, setConstraintData] = useState<any>({
    LeftAction: [],
    LeftSource: [],
    Comparator: [],
    RightAction: [],
    RightSource: [],
    id: null,
  });

  useEffect(() => {
    constraintRow &&
      constraintRow?.LeftSource &&
      constraintRow?.RightSource &&
      setConstraintData(constraintRow);
  }, [constraintRow]);

  // Helper Functions
  const getAllComparators = useSelector(
    (state: any) => state.addConditionalComponent.comparatorsData
  );

  const getAllArrayConcept = useSelector(
    (state: any) => state.addConditionalComponent.arrayOperationData
  );
  const LeftSourceList = constraintData?.LeftSource.map((obj: any) => obj.Name);
  const RightSourceList = constraintData?.RightSource.map(
    (obj: any) => obj.Name
  );

  const handleConstraintAction = (value: string, property: string) => {
    constraintData[property] = value;
    setConstraintData({ ...constraintData });
  };

  const selectedComparators = (value: any) => {
    setConstraintData({ ...constraintData, Comparator: value });
  };

  //Do a search and update the result lists that both sides read from (for some reason)
  const allConstraintOperandFunc = async (e: string) => {
    const data = await getAllConstraintOperand({ Keywords: e });
    if (data.Data.Results) {
      //Attach properties that the Select component will be looking for (label and value) based on the result data
      const updatedBody = data.Data.Results.map((result: any) => ({
        ...result,
        value: result.URI,
        label: result.Name,
      }));
      setleftSourceData(updatedBody);
      setRightSourceData(updatedBody);
      //console.log("updated body", updatedBody);
      return updatedBody;
    }
  };
  const onInputChangeHandler = (e: any) => {
    const updatedData = { ...constraintData };
    const { name, value } = e.target;
    updatedData[name] = value;
    setConstraintData(updatedData);
  };

  //Find the matching search result from a selected item and append it to the indicated property of the constraint data, or append a new object made from the raw text if the user just entered raw text instead
  const onDebounceSelectHandler = (
    value: any,
    property: string,
    searchResults: any
  ) => {
    if (!value.label) {
      appendSourceItem({
        Name: value.value,
        label: value.value,
        value: (crypto as any).randomUUID(),
      });
    } else {
      const fullValueFromResults = searchResults.find(
        (item: any) => item.value == value.value
      );
      fullValueFromResults && appendSourceItem(fullValueFromResults);
    }

    //Helper
    function appendSourceItem(value: any) {
      constraintData[property] = [...constraintData[property], value];
      setConstraintData({ ...constraintData });
      //console.log("updated", constraintData);
    }
  };

  const onDeselectHandler = (
    value: any,
    sourceProperty: string,
    arrayProperty: any
  ) => {
    constraintData[sourceProperty] = constraintData[sourceProperty].filter(
      (item: any) => item.Name != value.value
    );
    if (constraintData[sourceProperty].length < 2) {
      constraintData[arrayProperty] = null;
    }
    setConstraintData({ ...constraintData });
  };

  useEffect(() => {
    if (getAllComparators.valid) {
      setComparator(
        getAllComparators.data.map((item: any) => ({
          ...item,
          value: item.URI,
          label: item.Name,
        }))
      );
    }

    if (getAllArrayConcept.valid) {
      setConstraintEntityFields({
        ...constraintEntityFields,
        LeftAction: getAllArrayConcept.data.map((item: any) => ({
          ...item,
          value: item.Name,
          label: item.Name,
        })),
        RightAction: getAllArrayConcept.data.map((item: any) => ({
          ...item,
          value: item.Name,
          label: item.Name,
        })),
      });
    }
  }, [getAllComparators, getAllArrayConcept]);

  useEffect(() => {
    constraintData &&
      constraintData?.LeftSource?.length > 0 &&
      constraintData?.RightSource?.length > 0 &&
      constraintData?.Comparator?.length > 0 &&
      getConstraintData(constraintData);
  }, [constraintData]);

  const SaveConstraint = () => {
    let matchIndex = -1;
    if (constraintRow.length > 0) {
      if (constraintData.id == null) {
        constraintRow.find((item: any, index: number) => {
          item.id == 0 && (matchIndex = index);
        });
      } else {
        constraintRow.find((item: any, index: number) => {
          item.RowId == constraintData.RowId && (matchIndex = index);
        });
        matchIndex > -1 && (constraintRow[matchIndex] = constraintData);
      }
    }
    !!setIsEditConstraintModalStatus && setIsEditConstraintModalStatus(false);
  };
  const DeleteConstraint = () => {
    Modal.confirm({
      title: 'Are you sure you want to delete this Constraint?',
      okText: 'Yes',
      cancelText: 'Cancel',
      onOk: () => handleDeleteRow(RowIndex),
    });
    !!setIsEditConstraintModalStatus && setIsEditConstraintModalStatus(false);
  };

  /*
	const onDebounceSelectHandler = (e: any, name: string) => {
		console.log("wtf", { e: e, name: name, leftSourceData: leftSourceData });
		if (name === 'LeftSource') {
			leftSourceData.map((val: any) => {
				if (e.value == val.Name) {
					setConstraintData({
						...constraintData,
						LeftSource: [...constraintData?.LeftSource, val],
						id: RowIndex,
					});
				}
			});
			if (e.label === undefined) {
				setConstraintData({
					...constraintData,
					LeftSource: [...constraintData?.LeftSource, e.value],
					id: RowIndex,
				});
			}
		}
		if (name === 'RightSource') {
			rightSourceData.map((val: any) => {
				if (e.value == val.Name) {
					setConstraintData({
						...constraintData,
						RightSource: [...constraintData?.RightSource, val],
						id: RowIndex,
					});
				}
			});
			if (e.label === undefined) {
				setConstraintData({
					...constraintData,
					RightSource: [...constraintData?.RightSource, e.value],
					id: RowIndex,
				});
			}
		}
	};
	*/

  /*
	const handleDeselectHandler = (event: any, name: string) => {
		if (name === 'LeftSource') {
			const index = constraintData?.LeftSource?.findIndex(
				(item: any) => item?.Name == event?.value
			);
			constraintData?.LeftSource?.splice(index, 1);
			setConstraintData({
				...constraintData,
				LeftSource: [...constraintData?.LeftSource],
			});
		}
		if (name === 'RightSource') {
			const index = constraintData?.RightSource?.findIndex(
				(item: any) => item?.Name == event?.value
			);
			constraintData?.RightSource?.splice(index, 1);
			setConstraintData({
				...constraintData,
				RightSource: [...constraintData?.RightSource],
			});
		}
	};
	*/
  const customToolTipIcon = (type: any) => (
    <span
      className={Styles.iconSpacing}
      style={{ position: 'absolute', right: 0, top: -23, zIndex: 200 }}
      onClick={() => onShowCloseToolTip(type, true)}
    >
      <span className="fa-layers fa-fw fa-lg">
        <FontAwesomeIcon icon={faCircle} className={Styles.iconPrimary} />
        <FontAwesomeIcon
          icon={faQuestion}
          transform="shrink-6"
          className={Styles.iconSecondary}
        />
      </span>
    </span>
  );
  const [toolTip, setToolTip] = useState<any>([
    {
      type: 'LeftSource',
      isVisible: false,
    },
    {
      type: 'LeftAction',
      isVisible: false,
    },
    {
      type: 'Comparator',
      isVisible: false,
    },
    {
      type: 'RightSource',
      isVisible: false,
    },
    {
      type: 'RightAction',
      isVisible: false,
    },
  ]);
  // const getConstraintData = (val: any) => {
  //   let matchIndex = -1;
  //   constraintRow.find((item: any, index: number) => {
  //     item.RowId == val.RowId && (matchIndex = index);
  //   });
  //   matchIndex > -1 && (constraintRow[matchIndex] = val);
  //   setConstraintRow([...constraintRow]);
  //   /*
  //   const filteredConstraintRow = constraintRow?.map((item: any) => {
  //     if (val?.id !== null && item?.id === val?.id) {
  //       return (item = val);
  //     } else {
  //       return item;
  //     }
  //   });
  //   setConstraintRow([...filteredConstraintRow]);
  // 	*/
  // };

  const getToolTipText = (value: string) => {
    let text = '';
    switch (value) {
      case 'LeftSource':
        text = 'Left hand parameter of a constraint.';
        break;
      case 'LeftAction':
        text =
          'Action performed on the left source; select from an existing values of the dropdown, when the left source has more than one value';
        break;
      case 'Comparator':
        text =
          'Type of symbol that denotes an operator in a constraint expression such as greater than or equal to, equal to, less than; select from the existing dropdown values.';
        break;
      case 'RightSource':
        text = 'Right hand parameter of a constraint.';
        break;
      case 'RightAction':
        text =
          'Action performed on the right source; select from an existing values of the dropdown when the right source has more than one value';
        break;
    }
    return text;
  };

  const customToolTip = (type: any) => (
    <Tag
      color="rgb(220,250,249)"
      style={{
        width: '100%',
        padding: 10,
        paddingRight: 20,
        marginTop: 10,
        blockOverflow: 'ellipsis',
        whiteSpace: 'pre-wrap',
        position: 'relative',
      }}
    >
      <>
        <CloseOutlined
          style={{
            marginLeft: 3,
            fontSize: '10',
            position: 'absolute',
            right: 5,
            top: 5,
            cursor: 'pointer',
          }}
          onClick={() => onShowCloseToolTip(type, false)}
        />
        {getToolTipText(type)}
      </>
    </Tag>
  );

  const onShowCloseToolTip = (type: any, visibility: boolean) => {
    const toolTipArray =
      toolTip &&
      toolTip.map((item: any) =>
        item.type === type ? { ...item, isVisible: visibility } : item
      );
    setToolTip(toolTipArray);
  };
  const handleDeleteRow = (RowIndex: any) => {
    deleteRowByIndex(RowIndex);
  };

  return (
    <>
      <>
        <Form.Item
          label="Left Action"
          wrapperCol={{ span: 24 }}
          labelCol={{ span: 24 }}
        >
          {customToolTipIcon('LeftAction')}
          <Dropdown
            disabled={!(constraintData?.LeftSource?.length > 1) || isViewMode}
            options={constraintEntityFields.LeftAction}
            placeholder="..."
            showSearch={false}
            onChange={(e) => handleConstraintAction(e, 'LeftAction')}
            defaultValue={constraintData?.LeftAction}
            value={constraintData?.LeftAction}
          />
          {toolTip.find((item: any) => item.type === 'LeftAction').isVisible &&
            customToolTip('LeftAction')}
        </Form.Item>
        <Form.Item
          label="Left Source"
          required={true}
          wrapperCol={{ span: 24 }}
          labelCol={{ span: 24 }}
          className="swNoMargin"
          validateTrigger="onBlur"
        >
          {customToolTipIcon('LeftSource')}
          <DebounceSelect
            disabled={isViewMode}
            showSearch
            mode="tags"
            value={LeftSourceList}
            placeholder="Start typing to select or provide Left Value(s)"
            fetchOptions={allConstraintOperandFunc}
            onSelect={(e: any) =>
              onDebounceSelectHandler(e, 'LeftSource', leftSourceData)
            }
            onDeselect={(e: any) =>
              onDeselectHandler(e, 'LeftSource', 'LeftAction')
            }
          />
          {toolTip.find((item: any) => item.type === 'LeftSource').isVisible &&
            customToolTip('LeftSource')}
        </Form.Item>
      </>
      <Form.Item
        label="Comparator"
        wrapperCol={{ span: 24 }}
        labelCol={{ span: 24 }}
        required={true}
      >
        {customToolTipIcon('Comparator')}
        <Dropdown
          disabled={isViewMode}
          options={Comparator}
          defaultValue={constraintData?.Comparator}
          value={constraintData?.Comparator}
          showSearch={false}
          onChange={(e) => selectedComparators(e)}
          placeholder="..."
        />
        {toolTip.find((item: any) => item.type === 'Comparator').isVisible &&
          customToolTip('Comparator')}
      </Form.Item>
      <Form.Item
        label="Right Action"
        wrapperCol={{ span: 24 }}
        labelCol={{ span: 24 }}
      >
        {customToolTipIcon('RightAction')}
        <Dropdown
          disabled={!(constraintData?.RightSource?.length > 1) || isViewMode}
          options={constraintEntityFields.RightAction}
          placeholder="..."
          showSearch={false}
          onChange={(e) => handleConstraintAction(e, 'RightAction')}
          defaultValue={constraintData?.RightAction}
          value={constraintData?.RightAction}
        />
        {toolTip.find((item: any) => item.type === 'RightAction').isVisible &&
          customToolTip('RightAction')}
      </Form.Item>
      <Form.Item>
        <>
          <Form.Item
            required={true}
            label="Right Source"
            wrapperCol={{ span: 24 }}
            labelCol={{ span: 24 }}
            className="swNoMargin"
            validateTrigger="onBlur"
          >
            {customToolTipIcon('RightSource')}
            <DebounceSelect
              disabled={isViewMode}
              showSearch
              mode="tags"
              value={RightSourceList}
              placeholder="Start typing to select or provide Right Value(s)"
              fetchOptions={allConstraintOperandFunc}
              onSelect={(e: any) =>
                onDebounceSelectHandler(e, 'RightSource', rightSourceData)
              }
              onDeselect={(e: any) =>
                onDeselectHandler(e, 'RightSource', 'RightAction')
              }
            />
            {toolTip.find((item: any) => item.type === 'RightSource')
              .isVisible && customToolTip('RightSource')}
          </Form.Item>
        </>
      </Form.Item>
      <Form.Item
        label="Name"
        wrapperCol={{ span: 24 }}
        labelCol={{ span: 24 }}
        // required={true}
        validateTrigger="onBlur"
      >
        <InputBox
          disabled={isViewMode}
          placeholder="Add a Constraint Name"
          name="Name"
          // required={true}
          onChange={onInputChangeHandler}
          value={constraintData?.Name}
        />
      </Form.Item>
      <Form.Item
        label="Description"
        className="swNoMargin"
        wrapperCol={{ span: 24 }}
        labelCol={{ span: 24 }}
        // required={true}
        validateTrigger="onBlur"
      >
        <Textarea
          disabled={isViewMode}
          placeholder="Add a Constraint Description"
          name="Description"
          onChange={onInputChangeHandler}
          value={constraintData.Description}
        />
      </Form.Item>
      <Row gutter={24}>
        <Col span={12}>
          <Button
            size="medium"
            text="Save Constraint"
            type="primary"
            disabled={
              _.isEmpty(constraintData.Comparator) ||
              _.isEmpty(constraintData.LeftSource) ||
              _.isEmpty(constraintData.RightSource)
            }
            onClick={SaveConstraint}
          />
        </Col>
        <Col span={12}>
          <Button
            disabled={isViewMode}
            size="medium"
            text="Delete Constraint"
            type="primary"
            onClick={DeleteConstraint}
          />
        </Col>
      </Row>
    </>
  );
};

export default Constraintv2;
