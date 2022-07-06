import { Select, Tag } from 'antd';
import { DefaultOptionType } from 'antd/lib/select';
import type { CustomTagProps } from 'rc-select/lib/BaseSelect';
import React from 'react';

export interface MultiSelectProps {
  options?: DefaultOptionType[];
  onChange?: (event: React.MouseEvent<HTMLElement>) => void;
  defaultValue?: React.MouseEvent<HTMLElement, MouseEvent>;
  placeholder: string;
}
const MultiSelect: React.FC<MultiSelectProps> = (props: MultiSelectProps) => {
  const { options, onChange, defaultValue, placeholder } = props;

  const tagRender = (props: CustomTagProps) => {
    const { label, closable, onClose } = props;
    const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <Tag
        color="#4ee5e1"
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3 }}
      >
        {label}
      </Tag>
    );
  };

  return (
    <Select
      style={{ width: '100%' }}
      mode="multiple"
      placeholder={placeholder}
      tagRender={tagRender}
      defaultValue={defaultValue}
      onChange={onChange}
      options={options}
    />
  );
};

export default MultiSelect;
