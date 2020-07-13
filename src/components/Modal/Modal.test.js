import React from 'react';
import { render, screen } from '@testing-library/react';
 
import Modal from './index';
 
describe('Modal', () => {
  test('renders Modal component', () => {
    render(<Modal />);
  });
  test('renders Modal component', () => {
    expect(screen.getByTestId('Modal')).toBeInTheDocument();
  });
});
