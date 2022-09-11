import { Row, Col } from 'antd';
import _ from 'lodash';
import React from 'react';

import StartLeft from '../../assets/images/Start-Left.svg';
import StartRight from '../../assets/images/Start-Right.svg';
import Button from '../../components/button';

export interface Props {
  setIsAddPathwayDestinationVisible: (a: boolean) => void;
}

const SelectDestination: React.FC<Props> = ({
  setIsAddPathwayDestinationVisible,
}) => {
  const selectDestinationColumn = () => {
    setIsAddPathwayDestinationVisible(false);
    const destinationElemenet = document.getElementById('destinationColumn');
    if (!_.isNull(destinationElemenet)) {
      !_.isNull(destinationElemenet) &&
        destinationElemenet.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'start',
        });
    }
  };

  const selectInitialColumn = () => {
    setIsAddPathwayDestinationVisible(false);
    const firstColumn = document.getElementById('firstColumn');
    if (!_.isNull(firstColumn)) {
      !_.isNull(firstColumn) &&
        firstColumn.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'start',
        });
    }
  };

  return (
    <>
      <h5>Choose how you would like to build your pathway.</h5>
      <br />
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum commodi
        adipisci omnis accusamus velit ad nulla, quisquam, culpa esse nisi unde
        nemo doloremque aut architecto ratione iure nihil impedit ullam!
      </p>
      <Row gutter={20}>
        <Col span="12">
          <img src={StartRight} alt="Start with Destination" />

          <div style={{ textAlign: 'center', margin: '15px 0' }}>
            <Button
              text="Start with Destination"
              type="primary"
              style={{ width: '100%', padding: '8px' }}
              onClick={() => selectDestinationColumn()}
            />
          </div>
        </Col>
        <Col span="12">
          <img src={StartLeft} alt="Start with Destination" />
          <div style={{ textAlign: 'center', margin: '15px 0' }}>
            <Button
              text="Start with Initial components"
              type="primary"
              style={{ width: '100%', padding: '8px' }}
              onClick={() => selectInitialColumn()}
            />
          </div>
        </Col>
      </Row>
    </>
  );
};

export default SelectDestination;
