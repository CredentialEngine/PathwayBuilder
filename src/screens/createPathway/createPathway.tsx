import { Row } from 'antd';
import { noop } from 'lodash';
import React from 'react';
import ReactPlayer from 'react-player';

import Modal from '../../components/modal';

import { CreatePathwayButtons, CreatePathwayTexts } from './constants';
import styles from './createPayhway.module.scss';

interface Props {
  visible: boolean;
}
const CreatePathway: React.FC<Props> = ({ visible }) => {
  const modalContent = () => (
    <div className={styles.main}>
      <Row>
        <p className={styles.heading}>{CreatePathwayTexts.heading}</p>
      </Row>
      <Row>
        <p className={styles.subHeading}>{CreatePathwayTexts.subHeading}</p>
      </Row>
      <Row>
        <p className={styles.content}>{CreatePathwayTexts.content1}</p>
      </Row>
      <Row>
        <ReactPlayer
          height={280}
          url="https://www.youtube.com/watch?v=n_FCrCQ6-bA"
          controls
        />
      </Row>
      <Row className={`${styles.content} ${styles.marginTop}`}>
        {CreatePathwayTexts.content2}
      </Row>
      <Row>
        <p className={`${styles.content} ${styles.marginTop}`}>
          {CreatePathwayTexts.content3}
        </p>
      </Row>
    </div>
  );
  return (
    <div className={styles.container}>
      <Modal
        width={520}
        visible={visible}
        okText={CreatePathwayButtons.ok}
        cancelText={CreatePathwayButtons.cancel}
        onOk={noop}
        okType="primary"
        onCancel={noop}
      >
        {modalContent()}
      </Modal>
    </div>
  );
};

export default CreatePathway;
