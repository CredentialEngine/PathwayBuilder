import { Row } from 'antd';
import _ from 'lodash';
import React from 'react';

//import StartLeft from '../../assets/images/Start-Left.svg';
import StartRight from '../../assets/images/Start-Right.svg';
import Button from '../../components/button';

export interface Props {
  setIsAddPathwayDestinationVisible: (a: boolean) => void;
  setIsDestinationColumnSelected: (a: boolean) => void;
  setIsStartFromInitialColumnSelected: (a: boolean) => void;
  destinationColumnSelected: (a: boolean) => void;
}

const SelectDestination: React.FC<Props> = ({
  setIsAddPathwayDestinationVisible,
  setIsDestinationColumnSelected,
  // setIsStartFromInitialColumnSelected,
  destinationColumnSelected,
}) => {
  const selectDestinationColumn = () => {
    destinationColumnSelected(true);
    setIsAddPathwayDestinationVisible(false);
    setIsDestinationColumnSelected(true);
    const destinationElemenet = document.getElementById('destinationColumn');
    if (!_.isNull(destinationElemenet)) {
      destinationElemenet.scrollIntoView(true);
    }
  };

  // const selectInitialColumn = () => {
  //   destinationColumnSelected(false);
  //   setIsAddPathwayDestinationVisible(false);
  //   setIsStartFromInitialColumnSelected(true);
  //   const firstColumn = document.getElementById('firstColumn');
  //   if (!_.isNull(firstColumn)) {
  //     !_.isNull(firstColumn) && firstColumn.scrollIntoView(true);
  //   }
  // };

  return (
    <>
      <h5>Choose how you would like to build your pathway.</h5>
      <br />
      <p>
        Start with the destination to build your Pathway based on the
        requirements for completing it. To begin drop the last component, the
        final destination to the far right of the pathway board.
        {/* <br />
        <br />
        Start with the initial components to work your way towards the
        destination. To begin drop the first component, on the left side of the
        board. Add a Pathway. */}
      </p>
      <Row>
        <img src={StartRight} alt="Start with Destination" />

        <div style={{ textAlign: 'center', margin: '15px 0' }}>
          <Button
            text="Start with Destination"
            type="primary"
            style={{ width: '100%', padding: '8px' }}
            onClick={() => selectDestinationColumn()}
          />
        </div>

        {/* <Col span="12">
          <img src={StartLeft} alt="Start with Destination" />
          <div style={{ textAlign: 'center', margin: '15px 0' }}>
            <Button
              text="Start with Initial components"
              type="primary"
              style={{ width: '100%', padding: '8px' }}
              onClick={() => selectInitialColumn()}
            />
          </div>
        </Col> */}
      </Row>
    </>
  );
};

export default SelectDestination;
