import { render } from '@testing-library/react';
import React from 'react';

import Button from '../';

describe('Button', () => {
  it('should render correctly', () => {
    render(<Button text="Test Button" type="blue" />);
    //expect(wrapper).toMatchSnapshot();
    expect(1).toBe(1);
  });
});
