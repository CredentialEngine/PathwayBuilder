import { sanboxSetting } from './setting';

export const BASE_URL = 'https://localhost:44330/';
export const BASE_URL_SANDBOX =
  'https://sandbox.credentialengine.org/publisher/';
export const BASE_URL_STAGING =
  'https://sandbox.credentialengine.org/publisher/';
export const BASE_URL_PRODUCTION =
  'https://sandbox.credentialengine.org/publisher/';
export const BASE_URL_REGISTRY_RESOURCES =
  'https://sandbox.credentialengineregistry.org/resources/';
export const GET_ALL_RESOURCES = 'resources/';
export const GET_ALL_PATHWAY_COMPONENT = sanboxSetting.api.url.includes(
  'finderApi'
)
  ? 'PathwayDisplay/Schema/PathwayComponent'
  : 'PathwayBuilderApi/Schema/PathwayComponent';
export const GET_ALL_LOGICAL_OPERATOR = sanboxSetting.api.url.includes(
  'finderApi'
)
  ? 'PathwayDisplay/Schema/LogicalOperator'
  : 'PathwayBuilderApi/Schema/LogicalOperator';
export const GET_ALL_COMPARATORS = 'PathwayBuilderApi/Schema/Comparator';
export const GET_ALL_ARRAY_OPERATION =
  'PathwayBuilderApi/Schema/ArrayOperation';
export const GET_DATA_FOR_CURRENT_USER = 'PathwayBuilderApi/Load/User';
export const GET_DATA_FOR_PATHWAY = sanboxSetting.api.url.includes('finderApi')
  ? 'PathwayDisplay/'
  : 'PathwayBuilderApi/Load/Pathway/';
export const SAVE_DATA_FOR_PATHWAY = 'PathwayBuilderApi/Save/Pathway';
export const SAVE_DATA_FOR_RESOURCE = 'PathwayBuilderApi/Save/Resource';
export const APPROVE_PATHWAY = 'PathwayBuilderApi/Approve/Pathway';
export const SEARCH_FOR_PROGRESSION_MODAL =
  'PathwayBuilderApi/Search/Resource/Pathway_HasProgressionModel';
export const SEARCH_FOR_INDUSTRY_TYPE =
  'PathwayBuilderApi/Search/Codes/IndustryType';
export const SEARCH_FOR_LANGUAGE = 'PathwayBuilderApi/Search/Codes/Language';
export const SEARCH_FOR_OCCUPATION_TYPE =
  'PathwayBuilderApi/Search/Codes/OccupationType';
export const SEARCH_FOR_INDUSTRICAL_PROGRAM_TYPE =
  'PathwayBuilderApi/Search/Codes/InstructionalProgramType';
export const SEARCH_FOR_HAS_SUPPORT_SERVICE =
  'PathwayBuilderApi/Search/Resource/Pathway_HasSupportService';
export const SEARCH_FOR_LEFT_AND_RIGHT_OPERAND =
  'PathwayBuilderApi/Search/Resource/Constraint_Operand';
export const PATHWAY_COMPONENT_PROXY_FOR =
  'PathwayBuilderApi/Search/Resource/PathwayComponent_ProxyFor';
export const PATHWAYBUILDERAPI_APPROVE_PATHWAY =
  'PathwayBuilderApi/Approve/Pathway/';
export const GET_ALL_CREDENTIALTYPES = sanboxSetting.api.url.includes(
  'finderApi'
)
  ? 'PathwayDisplay/Schema/credentialType'
  : 'PathwayBuilderApi/Schema/credentialType';
export const GET_ALL_CREDIT_UNIT_TYPES = sanboxSetting.api.url.includes(
  'finderApi'
)
  ? 'PathwayDisplay/Schema/CreditUnitType'
  : 'PathwayBuilderApi/Schema/CreditUnitType';
export const GET_ALL_CREDIT_LEVEL_TYPES = sanboxSetting.api.url.includes(
  'finderApi'
)
  ? 'PathwayDisplay/Schema/CreditLevelType'
  : 'PathwayBuilderApi/Schema/CreditLevelType';
export const GET_ORGANIZATION =
  'PathwayBuilderApi/Search/Resource/Organization';
export const GET_ICON_URL =
  'https://sandbox.credentialengine.org/publisher/Images/PathwayBuilder/';
export const FINDER_URL = sanboxSetting.api.url.includes('local')
  ? 'https://sandbox.credentialengine.org/finder/resources/'
  : 'https://apps.credentialengine.org/finder/resources/';
