import { Select } from 'antd';
import React from 'react';

import Styles from './index.module.scss';

export type DropdownProps = {
	onClick?: (event: any) => void;
	children?: React.ReactNode;
	defaultValue?: string;
	value?: string;
	style?: any;
	placeholder?: string;
	showSearch?: boolean;
	options?: any;
	onChange?: (event: any) => void;
	onSearch?: (event: any) => void;
	disabled?: boolean;
};

export const Dropdown = (props: DropdownProps) => {
	const {
		children,
		placeholder,
		defaultValue,
		style,
		showSearch,
		options,
		onChange,
		onSearch,
		value,
		disabled
	} = props;

	return (
		<>
			{showSearch ? (
				<Select
					disabled={disabled}
					showSearch
					options={options}
					defaultValue={defaultValue}
					placeholder={placeholder}
					style={style}
					className={Styles.dropdownwrapper}
					filterOption={(input, option) =>
						(option!.children as unknown as string)
							.toLowerCase()
							.includes(input.toLowerCase())
					}
				>
					{children}
				</Select>
			) : (
				<Select
					disabled={disabled}
					onChange={onChange}
					value={value}
					onSearch={onSearch}
					options={options}
					defaultValue={defaultValue}
					placeholder={placeholder}
					style={style}
					className={Styles.dropdownwrapper}
					filterOption={(input, option) =>
						(option!.children as unknown as string)
							.toLowerCase()
							.includes(input.toLowerCase())
					}
				>
					{children}
				</Select>
			)}
		</>
	);
};

export default Dropdown;
