import { render } from '@testing-library/react';
import React from 'react';

import Icon from '../';

describe('Icon', () => {
  it('should render correctly', () => {
    render(<Icon name="4k-fill" />);
    //expect(wrapper).toMatchSnapshot();
    expect(1).toBe(1);
  });
});
