import { faCircle, faQuestion } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Row } from 'antd';
import React, { useEffect } from 'react';
import ReactPlayer from 'react-player';
import { useDispatch } from 'react-redux';

import { getDataForPathwayAndComponentsRequest } from '../../states/actions';

import { CreatePathwayTexts } from './constants';
import styles from './createPathway.module.scss';

const CreatePathway: React.FC<any> = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getDataForPathwayAndComponentsRequest(35));
  }, []);

  return (
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
          url="https://www.youtube.com/watch?v=u2RgGv8WPN0&list=PL37ZVnwpeshGHrl2h_1hm9a03b-GXH0td"
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
};

export default CreatePathway;
