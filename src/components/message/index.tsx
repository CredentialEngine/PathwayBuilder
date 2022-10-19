import { message as antMessage } from 'antd';
import classNames from 'classnames';
import React from 'react';

import SVG from 'react-inlinesvg';

import Close from '../../assets/images/icons/close.svg';
import Reminder from '../../assets/images/icons/reminder.svg';
import Right from '../../assets/images/icons/right.svg';
import CloseLine from '../../assets/images/remix/close-line.svg';
import Button from '../button';

import styles from './index.module.scss';

interface Props {
  type: 'success' | 'error' | 'warning' | 'notice';
  size?: string;
  title?: string;
  description: any;
  onLinkClick?: (event?: React.MouseEvent<HTMLElement>) => void;
  linkText?: string;
}
export const Type = {
  LINK: 'link',
};

export interface MessageProps extends Props {
  className: string;
  onClose: () => void;
}

export const Message = ({
  type,
  title,
  description,
  onLinkClick,
  linkText,
}: Props) => {
  const onLinkTextClick = () => {
    antMessage.destroy();
    onLinkClick!();
  };

  const onClose = () => {
    showMessage();
  };

  const showMessage = antMessage.success({
    content: (
      <MessageContent
        className={type}
        type={type}
        title={title}
        description={description}
        onLinkClick={onLinkTextClick}
        linkText={linkText}
        onClose={onClose}
      />
    ),
    duration: type === 'success' ? 4 : 0,
    icon: <span />,
  });
};

export const MessageContent = ({
  type,
  className,
  title,
  description,
  onLinkClick,
  linkText,
  onClose,
}: MessageProps) => {
  const icons = {
    success: (
      <SVG
        src={Right}
        style={{ width: 24, height: 24, fill: 'currentColor' }}
      />
    ),
    error: (
      <SVG
        src={Close}
        style={{ width: 24, height: 24, fill: 'currentColor' }}
      />
    ),
    warning: (
      <SVG
        src={Reminder}
        style={{ width: 24, height: 24, fill: 'currentColor' }}
      />
    ),
    notice: (
      <SVG
        src={Reminder}
        style={{ width: 24, height: 24, fill: 'currentColor' }}
      />
    ),
  };
  const height = (): string => {
    if (linkText) return 'linkHeight';
    else if (title) return 'noLinkHeight';
    else return 'noTitleHeight';
  };

  return (
    <div
      className={classNames(
        styles[className],
        styles.message,
        styles[height()]
      )}
    >
      <div className={styles.content}>
        {icons[type]}
        <div className={styles.text}>
          {title && <p className={styles.title}>{title}</p>}
          <div className={styles.description}>{description}</div>
          {type === 'success' && linkText && (
            <Button
              className={styles.buttonLink}
              type="link"
              text={linkText}
              onClick={onLinkClick}
              disabled={false}
            />
          )}
        </div>
        <SVG
          src={CloseLine}
          style={{
            width: 24,
            height: 24,
            fill: 'currentColor',
            cursor: 'pointer',
          }}
          onClick={onClose}
        />
      </div>
    </div>
  );
};

export default Message;
