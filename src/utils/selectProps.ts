import _ from 'lodash';

export const Selecteprops = (
  values: any,
  control: string,
  value: any = null,
  valueField: any = null
) => {
  const options = [];
  let selectProps = {};
  if (!_.isNil(values)) {
    for (let i = 0; i < values.length; i++) {
      const value = values[i];
      if (_.isNull(valueField)) {
        options.push({
          key: values[i].key != undefined ? values[i].key : i,
          label: values[i].title != undefined ? values[i].title : value,
          value: values[i].key != undefined ? values[i].key : value,
          disabled: values[i].disabled ? values[i].disabled : false,
        });
      } else {
        options.push({
          key: values[i].key != undefined ? values[i].key : i,
          label: values[i].title != undefined ? values[i].title : value,
          value: _.toNumber(values[i][valueField]),
          disabled: values[i].disabled ? values[i].disabled : false,
        });
      }
    }
  }
  if (!_.isNull(value)) {
    selectProps = {
      key: control,
      value,
      options,
    };
  } else {
    selectProps = {
      key: control,
      options,
    };
  }

  return selectProps;
};

export const SelectAutoCompleteProps = (
  values: any,
  value: any = null,
  valueField: any = null,
  label: any = null
) => {
  const options = [];
  const labelInUse = !_.isNull(label) ? label : 'title';
  const keyInUse = !_.isNull(valueField) ? valueField : 'key';
  let selectProps = {};
  if (!_.isNil(values)) {
    for (let i = 0; i < values.length; i++) {
      options.push({
        key: values[i][keyInUse] != undefined ? values[i][keyInUse] : i,
        label: values[i][labelInUse],
        value: values[i][valueField],
      });
    }
  }
  if (!_.isNull(value)) {
    selectProps = {
      options,
    };
  }
  return selectProps;
};
