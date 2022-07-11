import { Row } from 'antd';
import React from 'react';
import ReactPlayer from 'react-player';

import { CreatePathwayTexts } from './constants';
import styles from './createPayhway.module.scss';

const CreatePathway: React.FC<any> = () => (
  <div className={styles.main}>
    <Row>
      <p className={styles.subHeading}>{CreatePathwayTexts.subHeading}</p>
    </Row>
    <Row>
      <p className={styles.content}>{CreatePathwayTexts.content1}</p>
    </Row>
    <Row>
      <ReactPlayer
        height={280}
        url="https://www.youtube.com/watch?v=u2RgGv8WPN0&list=PL37ZVnwpeshGHrl2h_1hm9a03b-GXH0td"
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

export default CreatePathway;
