import { Alert, Modal as AntModal } from 'antd';
import { ModalProps as AntModalProps, ModalFuncProps } from 'antd/lib/modal';
import classNames from 'classnames';
import { omit } from 'lodash';
import React from 'react';

import { isPromise } from '../../utils/object';

import styles from './index.module.scss';

/* global HTMLElement */

const mergeProps = (
  props: AntModalProps,
  buttonDisabled = false
): AntModalProps => ({
  centered: true,
  destroyOnClose: true,
  closable: false,
  ...props,
  okButtonProps: {
    ...props.okButtonProps,
    disabled: buttonDisabled || !!props.okButtonProps?.disabled,
  },
  cancelButtonProps: {
    ...props.cancelButtonProps,
    disabled: buttonDisabled || !!props.cancelButtonProps?.disabled,
    type: 'ghost',
  },
  className: classNames(styles.modal, props.className),
});

export interface ModalProps extends AntModalProps {
  children: React.ReactNode;
  errorMessage?: string;
  onClearErrorMessage?: () => void;
}

const Modal = (props: ModalProps) => {
  const { errorMessage, onClearErrorMessage } = props;

  const [buttonDisabled, setButtonDisabled] = React.useState(false);

  const setStateIfPromiseAction = (
    e: React.MouseEvent<HTMLElement>,
    onClickHandler?: (args: any) => any
  ) => {
    if (!onClickHandler) {
      return;
    }
    const clickReturnValue = onClickHandler(e);
    if (isPromise(clickReturnValue)) {
      const promise = clickReturnValue;
      setButtonDisabled(true);
      promise
        .then(() => {
          setButtonDisabled(false);
        })
        .catch(() => {
          setButtonDisabled(false);
        });
    }
  };

  const renderErrorMessage = () => (
    <Alert
      showIcon
      message={errorMessage}
      type="error"
      closable
      afterClose={onClearErrorMessage}
    />
  );

  return (
    <AntModal
      {...mergeProps(omit(props, 'children'), buttonDisabled)}
      onOk={(e) => setStateIfPromiseAction(e, props.onOk)}
      onCancel={(e) => setStateIfPromiseAction(e, props.onCancel)}
    >
      {errorMessage && renderErrorMessage()}
      {props.children}
    </AntModal>
  );
};

Modal.confirm = (props: ModalFuncProps) =>
  AntModal.confirm({
    ...mergeProps(props),
    icon: null,
    width: 560,
  });

Modal.info = (props: ModalFuncProps) =>
  AntModal.info({
    ...props,
    icon: null,
    width: 560,
  });

Modal.error = (props: ModalFuncProps) =>
  AntModal.error({
    ...props,
    centered: true,
    icon: null,
    width: 560,
  });

export default Modal;
