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
  getRequiredDeleteRow: (val: any) => void;
}

const Constraint: React.FC<Props> = (Props) => {
  const { RowIndex, getConstraintData, getRequiredDeleteRow, constraintRow } =
    Props;
  const getAllComparators = useSelector(
    (state: any) => state.addConditionalComponent.comparatorsData
  );

  const getAllArrayConcept = useSelector(
    (state: any) => state.addConditionalComponent.arrayOperationData
  );
  const [constraintEntityFields, setConstraintEntityFields] = useState<any>(
    new ConstraintEntity()
  );
  const [constraintData, setConstraintData] = useState<any>({
    LeftAction: [],
    LeftSource: [],
    Comparator: [],
    RightAction: [],
    RightSource: [],
    id: null,
  });
  const [leftSourcedata, setleftSourceData] = useState<any>([]);
  const [rightSourcedata, setRightSourceData] = useState<any>([]);
  const [Comparator, setComparator] = useState<any>([]);

  useEffect(() => {
    if (
      constraintRow &&
      constraintRow?.LeftSource &&
      constraintRow?.RightSource
    ) {
      setConstraintData(constraintRow);
    }
  }, [constraintRow]);

  //   functions
  const handleConstraintAction = (value: string, label: string) => {
    if (label === 'RightAction') {
      setConstraintData({
        ...constraintData,
        RightAction: value,
      });
    }
    if (label === 'LeftAction') {
      setConstraintData({
        ...constraintData,
        LeftAction: value,
      });
    }
  };
  const funcSelectedComparators = (value: any) => {
    setConstraintData({
      ...constraintData,
      Comparator: value,
    });
  };
  const allConstraintOperandfunc = async (e: string) => {
    const data = await getAllConstraintOperand({ Keywords: e });
    if (data.Data.Results) {
      const updatedBody = data.Data.Results.map((dta: any) => ({
        ...dta,
        value: dta.Name,
        label: dta.Name,
      }));
      setleftSourceData(updatedBody);
      setRightSourceData(updatedBody);
      return updatedBody;
    }
  };
  const onDebounceSelectHnadler = (e: any, name: string) => {
    if (name === 'LeftSource') {
      leftSourcedata.map((val: any) => {
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
      rightSourcedata.map((val: any) => {
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

  useEffect(() => {
    if (getAllComparators.valid)
      setComparator(
        getAllComparators.data.map((dta: any) => ({
          ...dta,
          value: dta.URI,
          label: dta.Name,
        }))
      );

    if (getAllArrayConcept.valid)
      setConstraintEntityFields({
        ...constraintEntityFields,
        LeftAction: getAllArrayConcept.data.map((dta: any) => ({
          ...dta,
          value: dta.Name,
          label: dta.Name,
        })),
        RightAction: getAllArrayConcept.data.map((dta: any) => ({
          ...dta,
          value: dta.Name,
          label: dta.Name,
        })),
      });
  }, [getAllComparators, getAllArrayConcept]);

  useEffect(() => {
    if (
      constraintData &&
      constraintData?.LeftSource?.length > 0 &&
      constraintData?.RightSource?.length > 0 &&
      constraintData?.Comparator?.length > 0
    ) {
      getConstraintData(constraintData);
    }
  }, [constraintData]);

  const handleDeselectHnadler = (event: any, name: string) => {
    if (name === 'LeftSource') {
      const index = constraintData?.LeftSource?.findIndex(
        (item: any) => item?.Name == event?.value
      );
      constraintData?.LeftSource?.splice(index, 1);
      setConstraintData({
        ...constraintData,
        LeftSource: [...constraintData?.LeftSource],
        // id: RowIndex,
      });
      if (
        constraintData?.LeftSource.length === 0 &&
        constraintData?.RightSource.length === 0
      ) {
        Modal.confirm({
          cancelText: 'Cancel',
          okText: 'Ok',
          title: 'Are you sure you want to Delete this constraint?',
          onOk: () => handleDeleteRow(constraintData?.id),
        });
      }
    }
    if (name === 'RightSource') {
      const index = constraintData?.RightSource?.findIndex(
        (item: any) => item?.Name == event?.value
      );
      constraintData?.RightSource?.splice(index, 1);
      setConstraintData({
        ...constraintData,
        RightSource: [...constraintData?.RightSource],
        // id: RowIndex,
      });

      if (
        constraintData?.RightSource.length === 0 &&
        constraintData?.LeftSource.length === 0
      ) {
        Modal.confirm({
          cancelText: 'Cancel',
          okText: 'Ok',
          title: 'Are you sure you want to Delete this constraint?',
          onOk: () => handleDeleteRow(constraintData?.id),
        });
      }
    }
  };
  const handleDeleteRow = (RowIndex: any) => {
    getRequiredDeleteRow(RowIndex);
  };

  return (
    <>
      <Row gutter={20}>
        <Col span="8">
          <>
            {constraintData?.LeftSource?.length > 0 && (
              <Dropdown
                options={constraintEntityFields.LeftAction}
                placeholder="Left Action"
                showSearch={false}
                onChange={(e) => handleConstraintAction(e, 'LeftAction')}
                defaultValue={constraintData?.RightSource}
              />
            )}
            <Form.Item
              className="swNoMargin"
              validateTrigger="onBlur"
              tooltip="This is a required field"
            >
              <DebounceSelect
                showSearch
                mode="tags"
                value={constraintData?.LeftSource}
                placeholder="Left Sources"
                fetchOptions={allConstraintOperandfunc}
                onSelect={(e: any) => onDebounceSelectHnadler(e, 'LeftSource')}
                onDeselect={(e: any) => handleDeselectHnadler(e, 'LeftSource')}
              />
            </Form.Item>
          </>
        </Col>
        <Col span="6">
          <Form.Item>
            <Dropdown
              options={Comparator}
              defaultValue={constraintData?.Comparator}
              showSearch={false}
              onChange={(e) => funcSelectedComparators(e)}
              placeholder="Select Comparator"
            />
          </Form.Item>
        </Col>
        <Col span="8">
          <Form.Item>
            <>
              {constraintData?.RightSource?.length > 1 && (
                <Dropdown
                  options={constraintEntityFields.RightAction}
                  placeholder="Right Action"
                  showSearch={false}
                  onChange={(e) => handleConstraintAction(e, 'RightAction')}
                />
              )}
              <Form.Item
                className="swNoMargin"
                validateTrigger="onBlur"
                tooltip="This is a required field"
              >
                <DebounceSelect
                  showSearch
                  mode="tags"
                  value={constraintData?.RightSource}
                  placeholder="Right Sources"
                  fetchOptions={allConstraintOperandfunc}
                  onSelect={(e: any) =>
                    onDebounceSelectHnadler(e, 'RightSource')
                  }
                  onDeselect={(e: any) =>
                    handleDeselectHnadler(e, 'RightSource')
                  }
                />
              </Form.Item>
            </>
          </Form.Item>
        </Col>
        <Col span="1">
          <span
            className={Styles.clearRowIcon}
            onClick={() =>
              Modal.confirm({
                cancelText: 'Cancel',
                okText: 'Ok',
                title: 'Are you sure you want to Delete this constraint?',
                onOk: () => handleDeleteRow(RowIndex),
              })
            }
          >
            <FontAwesomeIcon icon={faClose} />
          </span>
        </Col>
      </Row>
    </>
  );
};

export default Constraint;
