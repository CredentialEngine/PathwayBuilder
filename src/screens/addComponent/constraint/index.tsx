import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Form, Row, Col } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Dropdown from '../../../components/formFields/dropdown';
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
}

const Constraint: React.FC<Props> = (Props) => {
  //Initialization
  const {
    RowIndex,
    getConstraintData,
    deleteRowByIndex,
    constraintRow,
    isViewMode,
  } = Props;
  const [constraintEntityFields, setConstraintEntityFields] = useState<any>(
    new ConstraintEntity()
  );
  const [leftSourceData, setleftSourceData] = useState<any>([]);
  const [rightSourceData, setRightSourceData] = useState<any>([]);
  const [Comparator, setComparator] = useState<any>([]);
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
    //console.log("Handled", constraintData);
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

  const handleDeleteRow = (RowIndex: any) => {
    deleteRowByIndex(RowIndex);
  };

  return (
    <>
      <Row gutter={10}>
        <Col span="3">
          <Form.Item
            label="Left Action"
            wrapperCol={{ span: 24 }}
            labelCol={{ span: 24 }}
            tooltip="Action performed on the left source; select from an existing enumeration of such types."
          >
            <Dropdown
              disabled={!(constraintData?.LeftSource?.length > 1) || isViewMode}
              options={constraintEntityFields.LeftAction}
              placeholder="..."
              showSearch={false}
              onChange={(e) => handleConstraintAction(e, 'LeftAction')}
              defaultValue={constraintData?.LeftAction}
              value={constraintData?.LeftAction}
            />
          </Form.Item>
        </Col>
        <Col span="6">
          <>
            <Form.Item
              label="Left Source"
              required={true}
              wrapperCol={{ span: 24 }}
              labelCol={{ span: 24 }}
              className="swNoMargin"
              validateTrigger="onBlur"
              tooltip="Left hand parameter of a constraint."
            >
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
            </Form.Item>
          </>
        </Col>
        <Col span="1" style={{ margin: '10px 0', textAlign: 'center' }}>
          must be
        </Col>
        <Col span="4">
          <Form.Item
            label="Comparator"
            wrapperCol={{ span: 24 }}
            labelCol={{ span: 24 }}
            tooltip="Type of symbol that denotes an operator in a constraint expression such as greater than or equal to, equal to, less than; select from an existing enumeration of such types."
          >
            <Dropdown
              disabled={isViewMode}
              options={Comparator}
              defaultValue={constraintData?.Comparator}
              value={constraintData?.Comparator}
              showSearch={false}
              onChange={(e) => selectedComparators(e)}
              placeholder="..."
            />
          </Form.Item>
        </Col>
        <Col span="3">
          <Form.Item
            label="Right Action"
            wrapperCol={{ span: 24 }}
            labelCol={{ span: 24 }}
            tooltip="Action performed on the right source; select from an existing enumeration of such types."
          >
            <Dropdown
              disabled={
                !(constraintData?.RightSource?.length > 1) || isViewMode
              }
              options={constraintEntityFields.RightAction}
              placeholder="..."
              showSearch={false}
              onChange={(e) => handleConstraintAction(e, 'RightAction')}
              defaultValue={constraintData?.RightAction}
              value={constraintData?.RightAction}
            />
          </Form.Item>
        </Col>
        <Col span="6">
          <Form.Item>
            <>
              <Form.Item
                required={true}
                label="Right Source"
                wrapperCol={{ span: 24 }}
                labelCol={{ span: 24 }}
                className="swNoMargin"
                validateTrigger="onBlur"
                tooltip="Right hand parameter of a constraint."
              >
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
              </Form.Item>
            </>
          </Form.Item>
        </Col>
        <Col span="1">
          <button
            className={Styles.clearRowIcon}
            disabled={isViewMode}
            onClick={() =>
              Modal.confirm({
                title: 'Are you sure you want to delete this Constraint?',
                okText: 'Yes',
                cancelText: 'Cancel',
                onOk: () => handleDeleteRow(RowIndex),
              })
            }
          >
            <FontAwesomeIcon icon={faClose} />
          </button>
        </Col>
      </Row>
    </>
  );
};

export default Constraint;
