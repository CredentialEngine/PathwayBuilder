import { faCircle, faExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import React from 'react';

import { isPromise } from '../../utils/object';
import { Color, COLOR_MAP } from '../icon';

import styles from './index.module.scss';

export type Type =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'selection'
  | 'link'
  | 'linkIcon'
  | 'approve'
  | 'blue'
  | 'gold'
  | 'blueOutline'
  | 'green'
  | 'link'
  | 'buttonIcon'
  | 'disabled'
  | 'cancel';

export interface ButtonProps {
  text: string;
  type: Type;
  htmlType?: 'button' | 'submit' | 'reset';
  onClick: (event: React.MouseEvent<HTMLElement>) => Promise<any> | void;
  disabled?: boolean;
  className?: string;
  title?: string;
  color?: Color;
  iconOnTop?: boolean;
  iconColor?: string;
  style?: { [key: string]: string };
  size?: 'small' | 'medium' | 'large';
}

const Button: React.FC<ButtonProps> & {
  defaultProps: Partial<ButtonProps>;
} = ({
  style,
  type,
  text,
  onClick,
  htmlType,
  disabled: disabledInProps,
  className,
  title,
  color,
  iconOnTop,
  size,
}) => {
  const [disabled, setDisabled] = React.useState(disabledInProps);
  React.useEffect(() => {
    setDisabled(disabledInProps);
  }, [disabledInProps]);

  const typeClassname = type;

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    const clickReturnValue = onClick(e);
    if (isPromise(clickReturnValue)) {
      const promise = clickReturnValue as any as Promise<any>;
      setDisabled(true);
      promise
        .then(() => {
          setDisabled(false);
        })
        .catch(() => {
          setDisabled(false);
        });
    }
  };

  return (
    <div className={styles.container}>
      <button
        className={classNames(
          styles[typeClassname],
          styles.button,
          className,
          color ? styles[COLOR_MAP[color]] : '',
          size
        )}
        onClick={handleClick}
        disabled={disabled}
        type={htmlType}
        title={title}
        style={style}
      >
        <span>{text}</span>
      </button>
      {iconOnTop && (
        <span className={styles.infoIconContainer}>
          <span className="fa-layers fa-fw fa-lg">
            <FontAwesomeIcon icon={faCircle} className={styles.infoCircle} />
            <FontAwesomeIcon
              icon={faExclamation}
              transform="shrink-6"
              className={styles.infoIcon}
            />
          </span>
        </span>
      )}
    </div>
  );
};

Button.defaultProps = {
  disabled: false,
  htmlType: 'button',
};

export default Button;
