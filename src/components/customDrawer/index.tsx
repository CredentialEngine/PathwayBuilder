import Drawer from 'antd/lib/drawer';
import _ from 'lodash';
import React, { useState } from 'react';

import Modal from '../modal';

import {
  CANCEL,
  DOUBLE_CONFIRM_CANCEL_CONTENT,
  DOUBLE_CONFIRM_CANCEL_TITLE,
  OK,
} from './constant';

export type Props = any;

const mergeProps = (props: Props): Props => ({
  destroyOnClose: true,
  ...props,
});
const CustomDrawer: React.FC<Props> = (props: Props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const handleModalOnCancel = () => {
    setModalVisible(false);
  };
  const handleModalOnOk = () => {
    setModalVisible(false);
    const prop = { ...mergeProps(props) };
    prop.onClose();
  };

  const openConfirmationPopUp = () => {
    if (props?.isdirty === false) handleModalOnOk();
    else setModalVisible(true);
  };
  return (
    <>
      <Modal
        onCancel={handleModalOnCancel}
        onOk={handleModalOnOk}
        className="confirmModal"
        title={
          _.isNil(props?.customMessage)
            ? DOUBLE_CONFIRM_CANCEL_TITLE
            : props?.customMessage
        }
        okText={OK}
        cancelText={CANCEL}
        visible={modalVisible}
      >
        {_.isNil(props?.customDescription)
          ? DOUBLE_CONFIRM_CANCEL_CONTENT
          : props?.customDescription}
      </Modal>
      <Drawer {...mergeProps(props)} onClose={openConfirmationPopUp} />
    </>
  );
};

export default CustomDrawer;
