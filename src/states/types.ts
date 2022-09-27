import { PathwayWrapper } from '../screens/addPathwayForm/model/pathwayWrapper';

type mappedData = PathwayWrapper;

export type RootState = {
  currentUserData: {
    loading: boolean;
    data: any;
    valid: boolean;
  };
  pathwayComponentData: {
    loading: boolean;
    data: any;
    valid: boolean;
  };
  mappedData: mappedData;
  approvePathway: {
    loading: boolean;
    data: any;
    valid: boolean;
  };
  savePathway: {
    loading: boolean;
    data: any;
    valid: boolean;
  };
};
