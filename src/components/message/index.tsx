import { message as antMessage } from 'antd';
import classNames from 'classnames';
import React from 'react';

import Button from '../button';
import Icon from '../icon';

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
    duration: linkText ? 7 : 5,
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
    success: <Icon name="right" size={24} />,
    error: <Icon name="close" size={24} />,
    warning: <Icon name="reminder" size={24} className={styles.warningIcon} />,
    notice: <Icon name="reminder" size={24} className={styles.noticeIcon} />,
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
        <Icon
          name="close-line"
          size={18}
          onClick={onClose}
          className={styles.close}
        />
      </div>
    </div>
  );
};

export default Message;
