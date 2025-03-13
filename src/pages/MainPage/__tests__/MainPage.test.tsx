import React from 'react';
import { render } from '@testing-library/react';
import { MainPage } from '../MainPage';

describe('MainPage Component', () => {
  it('matches the snapshot', () => {
    const { container } = render(<MainPage />);
    expect(container).toMatchSnapshot();
  });
});