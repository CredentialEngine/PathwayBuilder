import {
  GET_ALL_COMPARATORS_FAILURE,
  GET_ALL_COMPARATORS_REQUEST,
  GET_ALL_COMPARATORS_SUCCESS,
  GET_ARRAY_CONCEPT_FAILURE,
  GET_ARRAY_CONCEPT_REQUEST,
  GET_ARRAY_CONCEPT_SUCCESS,
  GET_CONSTRAINT_OPERAND_FAILURE,
  GET_CONSTRAINT_OPERAND_REQUEST,
  GET_CONSTRAINT_OPERAND_SUCCESS,
  GET_LOGICAL_OPERATOR_FAILURE,
  GET_LOGICAL_OPERATOR_REQUEST,
  GET_LOGICAL_OPERATOR_SUCCESS,
} from './actionTypes';

export const getLogicalOperatorsRequest = () => ({
  type: GET_LOGICAL_OPERATOR_REQUEST,
});

export const getLogicalOperatorsSuccess = (payload: any) => ({
  type: GET_LOGICAL_OPERATOR_SUCCESS,
  payload,
});

export const getLogicalOperatorsFailure = (payload: any) => ({
  type: GET_LOGICAL_OPERATOR_FAILURE,
  payload,
});

export const getAllComparatorsRequest = () => ({
  type: GET_ALL_COMPARATORS_REQUEST,
});

export const getAllComparatorsSuccess = (payload: any) => ({
  type: GET_ALL_COMPARATORS_SUCCESS,
  payload,
});

export const getAllComparatorsFailure = (payload: any) => ({
  type: GET_ALL_COMPARATORS_FAILURE,
  payload,
});

export const getAllArrayConceptsRequest = () => ({
  type: GET_ARRAY_CONCEPT_REQUEST,
});

export const getAllArrayConceptsSuccess = (payload: any) => ({
  type: GET_ARRAY_CONCEPT_SUCCESS,
  payload,
});

export const getAllArrayConceptsFailure = (payload: any) => ({
  type: GET_ARRAY_CONCEPT_FAILURE,
  payload,
});

export const getConstraintOperandRequest = () => ({
  type: GET_CONSTRAINT_OPERAND_REQUEST,
});

export const getConstraintOperandSuccess = (payload: any) => ({
  type: GET_CONSTRAINT_OPERAND_SUCCESS,
  payload,
});

export const getConstraintOperandFailure = (payload: any) => ({
  type: GET_CONSTRAINT_OPERAND_FAILURE,
  payload,
});
