import classNames from 'classnames';
import React from 'react';
import SVG from 'react-inlinesvg';

import styles from './index.module.scss';
import { IconNameType as IconNames } from './types';

export type Color = 'blue' | 'grey' | 'red' | 'white';

export const COLOR_MAP: Record<Color, string> = {
  blue: 'blue1',
  grey: 'grey6',
  red: 'red4',
  white: 'white',
};

interface Props {
  name: IconNameType;
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  tooltipMessage?: string;
  color?: Color;
}

export const Icon: React.FC<Props> = ({
  name,
  className,
  size,
  onClick,
  color,
  tooltipMessage,
  ...restProps
}: Props) => {
  const combinedClassNames = classNames(
    styles.icon,
    className,
    color ? styles[COLOR_MAP[color]] : ''
  );
  const svgSize = size || '1em';
  const svgStyle = { width: svgSize, height: svgSize, verticalAlign: 'middle' };
  const isRemix = (iconName: string) =>
    ['fill', 'line'].some((status) => iconName.indexOf(status) !== -1);
  const iconSrc = isRemix(name)
    ? require(`../../assets/images/remix/${name}.svg`).default
    : require(`../../assets/images/remix/${name}.svg`).default;
  return (
    <i
      className={combinedClassNames}
      {...restProps}
      style={svgStyle}
      title={tooltipMessage}
      onClick={onClick}
    >
      <SVG
        src={iconSrc}
        style={{ width: svgSize, height: svgSize, fill: 'currentColor' }}
      />
    </i>
  );
};

export type IconNameType = IconNames;
export default Icon;
