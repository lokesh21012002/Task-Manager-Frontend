import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SignupPage from '../pages/SignupPage';
import { useNavigate } from 'react-router-dom';

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('SignupPage', () => {
  const navigate = useNavigate();

  test('renders SignupPage component', () => {
    render(<SignupPage />);
    expect(screen.getByText('Sign Up')).toBeInTheDocument(); // Adjust based on your SignupPage content
  });

  test('handles signup form submission', async () => {
    render(<SignupPage />);
    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password' } });
    fireEvent.click(screen.getByText('Sign Up')); // Adjust button text

    // You can mock the signup API response if needed
    expect(navigate).toHaveBeenCalledWith('/login'); // Adjust based on your redirection logic
  });

  // Add more tests for SignupPage functionality
});
