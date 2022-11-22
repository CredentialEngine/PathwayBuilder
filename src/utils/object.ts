import _, { isEqual, isNil, isNull, isUndefined, omitBy, trim } from 'lodash';

export const isEmptyValue = (v: any): v is null | undefined =>
  isNil(v) || trim(v) === '' || isEqual(v, {});
// NOTE: no type narrow?
export const isNotEmptyValue = (v: any) => !isEmptyValue(v);
export const omitByEmptyDeeply = (obj: any) => {
  const object1 = obj || {};
  Object.keys(object1).forEach((key) => {
    if (typeof object1[key] === 'object') {
      object1[key] = omitByEmptyDeeply(object1[key]);
    }
  });
  return omitBy(object1, isEmptyValue);
};

export const isEqualIgnoreEmpty = (obj1: any, obj2: any) => {
  if (isEqual(obj1, obj2)) {
    return true;
  }
  return isEqual(omitByEmptyDeeply(obj1), omitByEmptyDeeply(obj2));
};

/**
 * a string contains only spaces is regarded as blank
 */
const isBlank = (s: string) => s.trim() === '';

export function isBlankOrEmpty(s: string | undefined | null) {
  if (isUndefined(s)) return true;
  if (isNull(s)) return true;
  return isBlank(s);
}

export const isPromise = (value: any): value is Promise<any> =>
  value && Object.prototype.toString.call(value) === '[object Promise]';

export const descriptionOrCode = (d: {
  description?: string | null;
  code: string;
}): string => {
  if (isBlankOrEmpty(d.description)) return d.code;
  return d.description as string;
};

export const isValidUrl = (urlString: string) => {
  const urlPattern = new RegExp(
    '^(https?:\\/\\/)?' + // validate protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  ); // validate fragment locator
  return !!urlPattern.test(urlString);
};

export const getErrorMessage = (error: any): string => {
  if (_.isArray(error?.errors) && !_.isEmpty(error?.errors)) {
    if (!_.isEmpty(error?.errors[0]?.extensions?.content?.error?.data))
      return _.replace(
        _.toString(
          _.values(error?.errors[0]?.extensions?.content?.error?.data)
        ),
        ',',
        '\n'
      );
    else if (!_.isEmpty(error?.errors[0]?.extensions?.content?.error?.message))
      return error?.errors[0]?.extensions?.content?.error?.message;
    else return error?.errors[0]?.message;
  } else {
    if (!_.isEmpty(error?.data))
      return _.replace(_.toString(_.values(error?.data)), ',', '\n');
    else return error?.message;
  }
};

export const getTooltipContent = (type: any) => {
  if (type?.includes('ComponentCondition')) {
    return 'Resource that describes what must be done to complete a PathwayComponent, or part thereof, as determined by the issuer of the Pathway.';
  } else if (type?.includes('AssessmentComponent')) {
    return 'Resource that identifies a direct, indirect, formative, and summative evaluation or estimation of the nature, ability, or quality of a resource, performance, or outcome of an action.';
  } else if (type?.includes('BasicComponent')) {
    return 'Resource that identifies a resource not otherwise covered by the enumerated PathwayComponent subclasses.';
  } else if (type?.includes('CocurricularComponent')) {
    return 'Resource that identifies an activity, program, or informal learning experience such as a civic or service activity that supplements and complements the curriculum.';
  } else if (type?.includes('CompetencyComponent')) {
    return 'Resource that identifies a measurable or observable knowledge, skill, or ability necessary to successful performance of a person in a given context.';
  } else if (type?.includes('CourseComponent')) {
    return 'Resource that identifies a structured sequence of one or more learning activities that aims to develop a prescribed set of knowledge, skill, or ability of learners.';
  } else if (type?.includes('CredentialComponent')) {
    return 'Resource that identifies another resource that describes qualification, achievement, personal or organizational quality, or aspect of an identity typically used to indicate suitability.';
  } else if (type?.includes('ExtracurricularComponent')) {
    return 'Resource that identifies an activity, program, or informal learning experience that may be offered or provided by a school, college, or other organization that is not connected to a curriculum.';
  } else if (type?.includes('JobComponent')) {
    return 'Resource that identifies a work position, employment, or occupation.';
  } else if (type?.includes('WorkExperienceComponent')) {
    return 'Resource describing an activity or training through which a person gains job experience.';
  } else return 'N/A';
};
