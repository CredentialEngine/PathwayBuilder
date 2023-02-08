import { faCircle, faQuestion } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Row } from 'antd';
import React from 'react';
import ReactPlayer from 'react-player';

import { CreatePathwayTexts } from './constants';
import styles from './createPathway.module.scss';

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
        className={`${styles.videoPlayer}`}
        height={280}
        url="https://youtu.be/qedR5enJ7cM"
        controls
      />
    </Row>
    <Row>
      <p className={`${styles.content}`}>
        {CreatePathwayTexts.content2}
        <span className={styles.iconSpacing}>
          <span className="fa-layers fa-fw fa-lg">
            <FontAwesomeIcon icon={faCircle} className={styles.iconPrimary} />
            <FontAwesomeIcon
              icon={faQuestion}
              transform="shrink-6"
              className={styles.iconSecondary}
            />
          </span>
        </span>
        {CreatePathwayTexts.content3}
      </p>
    </Row>
    <Row>
      <p className={`${styles.content}`}>{CreatePathwayTexts.content4}</p>
    </Row>
    <br />
  </div>
);

export default CreatePathway;
