import { faCubes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Form, Row } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { v4 as uuidv4 } from 'uuid';

import Button from '../../components/button';
import Dropdown from '../../components/formFields/dropdown';
import InputBox from '../../components/formFields/inputBox';
import { updateMappedDataRequest } from '../../states/actions';

import Constraint from './constraint';

import Styles from './index.module.scss';
import { ComponentConditionEntity } from './model';
import {
	getAllArrayConceptsRequest,
	getAllComparatorsRequest,
	getLogicalOperatorsRequest,
} from './state/actions';

interface Props {
	visibleConstraintConditionProp?: (bool: boolean) => void;
	lastIndexHasProgressionModelID?: string;
	data?: any;
	filteredConditionalComponent?: any;
	isDestinationCard?: any;
	filteredPathwayComponent?: any;
	setIsConditionalModalStatus?: (a: boolean) => void;
	HasProgressionLevel?: string;
	allComponentCardsData?: any;
	connectionsCTID?: any;
	allConditionalCardsData?: any;
	updatedPathwayComponentConditionCards?: any;
	isConditionalEditing?: boolean;
	setIsConditionalEditing?: (a: boolean) => void;
	progressionLevelForAddComponent?: string;
}

const AddConditionalComponent: React.FC<Props> = (Props) => {
	const {
		visibleConstraintConditionProp,
		setIsConditionalModalStatus,
		allComponentCardsData,
		connectionsCTID,
		allConditionalCardsData,
		updatedPathwayComponentConditionCards,
		isConditionalEditing,
		setIsConditionalEditing,
		data,
		progressionLevelForAddComponent,
	} = Props;
	const [componentConditionFields, setComponentConditionFields] = useState<any>(
		new ComponentConditionEntity()
	);
	const [conditionalComponent, setConditionalComponent] = useState<any>([]);
	const [currentComponent, setCurrentComponent] = useState<any>();
	const [cardAlreadyExistOnDropWrapper, setCardAlreadyExistOnDropWrapper] =
		useState<boolean>(false);
	const [isTouched, setisTouched] = useState({
		requiredNumber: false,
		Name: false,
	});
	const pathwayWrapper = useSelector((state: any) => state.initalReducer);
	const { mappedData: pathwayComponent } = pathwayWrapper;
	useEffect(() => {
		const allGameboardCards = [
			...pathwayComponent.PathwayComponents,

			...pathwayComponent.ComponentConditions,
		];

		if (isConditionalEditing) {
			const parentCard = allGameboardCards?.filter(
				(card: any) => card.RowId == data?.ParentIdentifier
			);

			setCurrentComponent(parentCard[0]);
		} else {
			const currentPathwayComponent =
				allComponentCardsData[connectionsCTID.start];

			const currentConditionalComponent =
				allConditionalCardsData[connectionsCTID.start];

			setCurrentComponent(
				currentPathwayComponent || currentConditionalComponent
			);
		}
	}, [allComponentCardsData, connectionsCTID, allConditionalCardsData]);

	const [constraintRow, setConstraintRow] = useState<any>([]);
	const [consRowID, setConstRowId] = useState<any>([]);
	const [logicalOperator, setLogicalOperator] = useState<string>('');
	const [allogicalOperator, setAllLogicalOperator] = useState<any>({});
	const [hasConstraints, setHasConstraints] = useState<any>([]);
	const dispatch = useDispatch();

	const onInputChangeHandler = (e: any) => {
		const updatedData = { ...componentConditionFields };
		const { name, value } = e.target;
		updatedData[name] = value;

		setComponentConditionFields(updatedData);
	};

	const getAllLogicalOperator = useSelector(
		(state: any) => state.addConditionalComponent.logicalOperatorData
	);

	useEffect(() => {
		const updatedPathwayWrapper = { ...pathwayComponent };

		const currentPathwayComponent =
			allComponentCardsData[connectionsCTID?.start];
		const currentConditionalComponent =
			allConditionalCardsData[connectionsCTID?.start];

		if (conditionalComponent.length > 0) {
			/* in the below code we are adding RowId of the newly created conitional component inside the parent component*/
			if (
				!_.isUndefined(currentPathwayComponent) &&
				!_.isNull(currentPathwayComponent)
			) {
				if (!_.isEmpty(currentPathwayComponent.HasCondition)) {
					currentPathwayComponent.HasCondition = [
						...currentPathwayComponent.HasCondition,
						conditionalComponent[0].RowId,
					];
					currentPathwayComponent.PrecededBy = [];
				} else {
					currentPathwayComponent.HasCondition = [
						conditionalComponent[0].RowId,
					];
					currentPathwayComponent.PrecededBy = [];
				}
			}
			/* in the below code we are adding RowId of the newly created conitional component inside the parent conditional component*/
			if (
				!_.isUndefined(currentConditionalComponent) &&
				!_.isNull(currentConditionalComponent)
			) {
				if (!_.isEmpty(currentConditionalComponent.HasCondition)) {
					currentConditionalComponent.HasCondition = [
						...currentConditionalComponent.HasCondition,
						conditionalComponent[0].RowId,
					];
				} else {
					currentConditionalComponent.HasCondition = [
						conditionalComponent[0].RowId,
					];
				}
			}

			/* getting here all the conditional component those are outside the to the current progression level*/
			const conditionalComponentOutOfProgressionLevel =
				updatedPathwayComponentConditionCards?.filter(
					(conditional_Card: any) =>
						_.toString(conditional_Card?.HasProgressionLevel) !==
						_.toString(progressionLevelForAddComponent)
				);

			/* getting here rest conditional component except current conitional component which are inside the to the current progression level*/

			const restConditionalComponentInProgressionLevel1 =
				updatedPathwayComponentConditionCards?.filter(
					(conditional_Card: any) =>
						_.toString(conditional_Card?.HasProgressionLevel) ===
						_.toString(progressionLevelForAddComponent) &&
						_.toString(conditional_Card?.RowId) !==
						_.toString(currentConditionalComponent?.RowId)
				);
			const uniqueConditionalArray: any =
				!_.isUndefined(currentConditionalComponent) &&
					!_.isNull(currentConditionalComponent)
					? [
						...new Set([
							...restConditionalComponentInProgressionLevel1,
							currentConditionalComponent,
						]),
					]
					: [...new Set([...restConditionalComponentInProgressionLevel1])];

			const componentCardInProgressionLevel =
				pathwayComponent?.PathwayComponents?.filter(
					(card: any) =>
						card?.HasProgressionLevel === progressionLevelForAddComponent
				);

			const uniquePathwayComponentArray =
				!_.isUndefined(currentPathwayComponent) &&
					!_.isNull(currentPathwayComponent)
					? [
						...new Set([
							...componentCardInProgressionLevel,
							currentPathwayComponent,
						]),
					]
					: [...new Set([...componentCardInProgressionLevel])];

			let updatedPathwayComponentArray: any = [];
			let updatedConditionalArray: any = [];
			if (!cardAlreadyExistOnDropWrapper) {
				updatedPathwayComponentArray = uniquePathwayComponentArray.map(
					(a: any) => ({
						...a,
						ColumnNumber: a?.destinationColumn
							? a?.ColumnNumber
							: conditionalComponent[0].ColumnNumber <= a?.ColumnNumber
								? a?.ColumnNumber + 1
								: a?.ColumnNumber,
					})
				);

				updatedConditionalArray = uniqueConditionalArray
					.map((a: any) => ({
						...a,
						ColumnNumber:
							conditionalComponent[0].ColumnNumber <= a?.ColumnNumber
								? a.ColumnNumber + 1
								: a.ColumnNumber,
					}))
					.concat(conditionalComponent);
			} else {
				updatedConditionalArray = [
					...uniqueConditionalArray,
					...conditionalComponent,
				];

				updatedPathwayComponentArray = uniquePathwayComponentArray;
			}

			const allComponentConditionalCard = [
				...conditionalComponentOutOfProgressionLevel,
				...updatedConditionalArray,
			];

			const allPathwayComponentCard = [
				...updatedPathwayWrapper.PathwayComponents,
				...updatedPathwayComponentArray,
			];

			const uniqueAllPathwayComponentArray = [
				...new Map(
					allPathwayComponentCard.map((item: any) => [item['CTID'], item])
				).values(),
			];
			const uniqueAllConditionalArray = [
				...new Map(
					allComponentConditionalCard.map(
						(item: any) => [item['RowId'], item] && [item['HasCondition'], item]
					)
				).values(),
			];

			let finalConditionalComponentsList: any = [];
			if (currentComponent?.Type === 'conditional') {
				finalConditionalComponentsList = uniqueAllConditionalArray
					?.filter(
						(conditional_card: any) =>
							conditional_card.RowId !== currentComponent?.RowId
					)
					.concat({
						...currentComponent,
						TargetComponent: [],
						ColumnNumber: currentComponent?.ColumnNumber + 1,
					});
			} else {
				finalConditionalComponentsList = uniqueAllConditionalArray;
			}

			updatedPathwayWrapper.ComponentConditions =
				finalConditionalComponentsList;
			updatedPathwayWrapper.PathwayComponents = uniqueAllPathwayComponentArray;

			updatedPathwayWrapper.Constraints = [
				...updatedPathwayWrapper?.Constraints,
				...constraintRow.map((v: any) => ({
					...v,
					RowId: consRowID,
					Name: componentConditionFields.Name,
					Description: componentConditionFields.Description,
				})),
			];
			dispatch(updateMappedDataRequest(updatedPathwayWrapper));
			setConditionalComponent([]);
			!!visibleConstraintConditionProp && visibleConstraintConditionProp(false);
			!!setIsConditionalModalStatus && setIsConditionalModalStatus(false);
			!!setIsConditionalEditing && setIsConditionalEditing(false);
		}
	}, [conditionalComponent]);

	const saveCondition = () => {
		if (
      /* currentComponent?.Type !== 'conditional' && */ !isConditionalEditing
		) {
			const conditionalCardAlreadyExistForDestination =
				updatedPathwayComponentConditionCards?.filter(
					(condtional_card: any) =>
						_.toString(condtional_card?.ParentIdentifier) ===
						_.toString(currentComponent?.RowId)
				);

			const maximumRowNumber = conditionalCardAlreadyExistForDestination.reduce(
				(acc: any, curr: any) => {
					if (acc >= curr) {
						return acc.RowNumber;
					} else {
						return curr.RowNumber;
					}
				},
				currentComponent?.RowNumber
			);

			setCardAlreadyExistOnDropWrapper(
				conditionalCardAlreadyExistForDestination.length > 0 ? true : false
			);
			const getLogicalOperatorURI = allogicalOperator?.LogicalOperator?.filter(
				(getURI: any) => logicalOperator === getURI?.Name
			);
			const ComponentConditions = {
				ParentIdentifier:
					conditionalCardAlreadyExistForDestination?.length > 0
						? conditionalCardAlreadyExistForDestination[0]?.ParentIdentifier
						: currentComponent?.RowId,
				Description: componentConditionFields.Description,
				RequiredNumber: componentConditionFields.RequiredNumber,
				LogicalOperator: getLogicalOperatorURI[0]?.URI,
				HasConstraint: hasConstraints,
				ColumnNumber:
					conditionalCardAlreadyExistForDestination.length > 0
						? conditionalCardAlreadyExistForDestination[0]?.ColumnNumber
						: currentComponent?.destinationColumn
							? currentComponent?.ColumnNumber
							: currentComponent?.ColumnNumber,
				RowNumber:
					conditionalCardAlreadyExistForDestination?.length > 0
						? maximumRowNumber + 1
						: currentComponent?.RowNumber,
				RowId: uuidv4(),
				Name: componentConditionFields.Name,
				TargetComponent:
					conditionalCardAlreadyExistForDestination.length > 0
						? []
						: currentComponent?.PrecededBy ||
						currentComponent?.TargetComponent ||
						[],
				HasCondition: [],
				HasProgressionLevel: progressionLevelForAddComponent,
			};
			setConditionalComponent([ComponentConditions]);
		}

		if (data?.Type === 'conditional' && isConditionalEditing) {
			const updatedPathwayWrapper = { ...pathwayComponent };

			if (pathwayComponent?.ComponentConditions.length > 0) {
				let currentConditionalComponent = _.get(
					pathwayComponent?.ComponentConditions?.filter(
						(condition_card: any) =>
							condition_card.RowId === _.toString(data.RowId)
					),
					'0'
				);

				if (
					!_.isUndefined(currentConditionalComponent) &&
					!_.isNull(currentConditionalComponent)
				) {
					currentConditionalComponent = { ...componentConditionFields };
				}

				const remainingCompCond = pathwayComponent?.ComponentConditions?.filter(
					(item: any) => item?.RowId !== data?.RowId
				);
				const cardsToSend = remainingCompCond?.concat(
					currentConditionalComponent
				);
				updatedPathwayWrapper.ComponentConditions = cardsToSend;
				let getLogicalOperatorURI = [];
				if (logicalOperator) {
					getLogicalOperatorURI = allogicalOperator?.LogicalOperator?.filter(
						(getURI: any) =>
							logicalOperator == getURI?.Name || logicalOperator == getURI?.URI
					);
				}

				const hasConstraintsIds: string[] = [];

				constraintRow.map((constraintRow: any) =>
					hasConstraintsIds.push(constraintRow.RowId)
				);

				const updatedPathwayComponent =
					updatedPathwayWrapper?.ComponentConditions?.filter(
						(component_card: any) =>
							component_card?.RowId !== currentConditionalComponent?.RowId
					).concat({
						...componentConditionFields,
						LogicalOperator: getLogicalOperatorURI[0]?.URI,
						HasConstraint: hasConstraintsIds
							? _.uniq(hasConstraintsIds)
							: hasConstraints,
					});
				const updatedPathwayConstraint =
					updatedPathwayWrapper?.Constraints?.filter(
						(Constraints_card: any) =>
							!hasConstraintsIds.includes(Constraints_card?.RowId) /* .map(
              (ids: string) => Constraints_card?.RowId !== ids
            ) */
					).concat([...constraintRow]);

				updatedPathwayWrapper.ComponentConditions = [
					...updatedPathwayComponent,
				];
				updatedPathwayWrapper.Constraints = [...updatedPathwayConstraint];
				!!visibleConstraintConditionProp &&
					visibleConstraintConditionProp(false);
				!!setIsConditionalModalStatus && setIsConditionalModalStatus(false);
				!!setIsConditionalEditing && setIsConditionalEditing(false);

				dispatch(updateMappedDataRequest(updatedPathwayWrapper));
			}
		}
	};

	useEffect(() => {
		if (isConditionalEditing) {
			const constraintToStore = [] as any;
			const updatedPathwayWrapper = { ...pathwayComponent };
			if (data && data?.HasConstraint) {
				data?.HasConstraint?.map((constraint: any) => {
					pathwayComponent?.Constraints?.map((pathwayConstraint: any) => {
						if (pathwayConstraint?.RowId === constraint) {
							constraintToStore.push(_.cloneDeep(pathwayConstraint));
						}
					});
				});
			}
			updatedPathwayWrapper.Constraints = [
				...updatedPathwayWrapper?.Constraints,
				...constraintRow.map((v: any) => ({
					...v,
					RowId: consRowID,
					Name: componentConditionFields.Name,
					Description: componentConditionFields.Description,
				})),
			];
			const currentConditionalComponent = _.get(
				pathwayComponent?.ComponentConditions?.filter(
					(condition_card: any) =>
						condition_card.RowId === _.toString(data.RowId)
				),
				'0'
			);

			setConstraintRow(constraintToStore);
			setLogicalOperator(currentConditionalComponent?.LogicalOperator);
			setComponentConditionFields({
				...componentConditionFields,
				...data,
			});
			dispatch(updateMappedDataRequest(updatedPathwayWrapper));
		}
	}, [isConditionalEditing]);

	const constraintRowData = {
		LeftAction: [],
		LeftSource: [],
		Comparator: [],
		RightAction: [],
		RightSource: [],
		id: 0,
		Name: componentConditionFields.Name,
		RowId: currentComponent?.RowId,
		Description: componentConditionFields.Description,
		ParentIdentifier: connectionsCTID?.start,
	};

	useEffect(() => {
		if (getAllLogicalOperator.valid)
			setAllLogicalOperator({
				LogicalOperator: getAllLogicalOperator.data?.map((dta: any) => ({
					...dta,
					value: dta.Name,
					label: dta.Name,
				})),
			});
	}, [getAllLogicalOperator]);

	useEffect(() => {
		dispatch(getLogicalOperatorsRequest());
		dispatch(getAllComparatorsRequest());
		dispatch(getAllArrayConceptsRequest());
	}, []);

	const addConstraintRow = () => {
		const mId = uuidv4();
		const rowCon = [
			...constraintRow,
			{
				...constraintRowData,
				RowId: mId,
				id: 0,
			},
		];

		setConstraintRow(rowCon);
		setConstRowId(mId);
		setHasConstraints([...hasConstraints, mId]);
		console.log("rowCon", rowCon);
		console.log("Has constraints", hasConstraints);

	};
	const selectedComparators = (value: any) => {
		setLogicalOperator(value);
	};
	const getConstraintData = (val: any) => {
		var matchIndex = -1;
		constraintRow.find((item: any, index: number) => { item.RowId == val.RowId && (matchIndex = index); });
		matchIndex > -1 && (constraintRow[matchIndex] = val);
		setConstraintRow([...constraintRow]);
		/*
		const filteredConstraintRow = constraintRow?.map((item: any) => {
			if (val?.id !== null && item?.id === val?.id) {
				return (item = val);
			} else {
				return item;
			}
		});
		setConstraintRow([...filteredConstraintRow]);
		*/
	};
	const handleDeleteRow = (rowIndex: number) => {
		const deletedRow = constraintRow.splice(rowIndex, 1);
		const updatedPathwayWrapper = { ...pathwayComponent };
		_.remove(
			updatedPathwayWrapper?.Constraints,
			(constraints: any) => constraints.RowId == deletedRow[0]?.RowId
		);
		dispatch(updateMappedDataRequest(updatedPathwayWrapper));

		if (rowIndex !== 0) {
			setConstraintRow([...constraintRow]);
		} else {
			setConstraintRow([]);
		}
	};

	return (
		<div className={Styles.addComponentwrapper}>
			<Form>
				<div className={Styles.iconheader}>
					<span className={Styles.iconwrapper + ' iconwrapper'}>
						<FontAwesomeIcon icon={faCubes} style={{ height: '15px' }} color="black" />
					</span>
					<h2 style={{margin: 0}}>Component Condition for <i>{currentComponent?.Name || "Parent Component"}</i></h2>
				</div>
				<Form.Item required={true} wrapperCol={{ span: 24 }} labelCol={{ span: 24 }} label="Name" validateTrigger="onBlur" help={isTouched.Name && !componentConditionFields.Name ? 'Name is Required' : null } >
					<InputBox onChange={onInputChangeHandler} placeholder="Name" name="Name" value={componentConditionFields.Name} required={true} onBlur={() => isTouched.Name ? null : setisTouched({ ...isTouched, Name: true }) } />
				</Form.Item>
				<Form.Item>
					<label>Condition Description</label>
					<TextArea style={{maxHeight: "200px"}} onChange={onInputChangeHandler} rows={3} name="Description" value={componentConditionFields.Description} placeholder="Description" />
				</Form.Item>
				<Row gutter={20}>
					<Col span="12">
						<Form.Item required={true} wrapperCol={{ span: 24 }} labelCol={{ span: 24 }} label="Required Number" validateTrigger="onBlur" help={isTouched.requiredNumber && !componentConditionFields.RequiredNumber ? 'Number is Required' : null} >
							<div className={Styles.helpText}>The Required Number field indicates how many of the Components and Conditions that branch out to the left of these Condtions are required to be satisfied in order for these Conditions to be true (in addition to any other constraints indicated below). Use 0 if the items that branch out to the left are entirely optional.</div>
							<InputBox type="number" placeholder="Required Number" onChange={onInputChangeHandler} min={0} name="RequiredNumber" value={componentConditionFields.RequiredNumber} required={true} onBlur={() => isTouched.requiredNumber ? null : setisTouched({ ...isTouched, requiredNumber: true }) } />
						</Form.Item>
					</Col>
					<Col span="12">
						<Form.Item label="Logical Operator" wrapperCol={{ span: 24 }} labelCol={{ span: 24 }} >
							<div className={Styles.helpText}>The logical operator indicates how the constraints below, as well as any other Conditions that branch out to the left of these Conditions, should be evaluated. For example, select "And" to indicate that all of the constraints must be true in order for these conditions to be met; select "Or" to indicate that only one needs to be true.</div>
							<Dropdown options={allogicalOperator?.LogicalOperator} showSearch={false} placeholder="Select Logical Operator" value={logicalOperator} onChange={(e) => selectedComparators(e)} />
						</Form.Item>
					</Col>
				</Row>
				<div className={Styles.divider}>
					<label>Constraints</label>
					<div className={Styles.helpText}>Constraints enable you to precisely define the requirements that must be satisfied by the components and conditions on the left of these conditions in order to progress to the component on the right of these conditions. For a detailed explanation of how constraints work, consult the <a href="https://credreg.net/ctdl/handbook#pathwaylevel3" target="_blank">CTDL Handbook</a>.</div>
					<hr className="min-top" />
				</div>
				{constraintRow && constraintRow?.map((constraintRowData: any, RowIndex: any) => (
					<Constraint key={RowIndex} RowIndex={RowIndex} constraintRow={constraintRowData} getConstraintData={(val: any) => getConstraintData(val)} deleteRowByIndex={(rowIndex: any) => handleDeleteRow(rowIndex)} />
				))}
				<button onClick={() => addConstraintRow()} style={{ cursor: 'pointer', backgroundColor: "transparent", border: "none", textDecoration: "underline" }}>Add another constraint</button>
				<hr />
				<Button size="medium" text="Save Condition" type="primary"
					disabled={_.isEmpty(
						componentConditionFields.RequiredNumber &&
						componentConditionFields.Name
					)}
					onClick={saveCondition}
				/>
			</Form>
		</div>
	);
};

export default AddConditionalComponent;
