import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import LoginPage2 from '../pages/LoginPage';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

// Mock axios
jest.mock('axios');

describe('LoginPage2', () => {
  const navigate = useNavigate();

  test('renders LoginPage2 component', () => {
    render(<LoginPage2 />);
    expect(screen.getByText('Login')).toBeInTheDocument(); // Adjust based on your LoginPage2 content
  });

  test('handles login form submission', async () => {
    axios.post.mockResolvedValue({ status: 200 }); // Mock successful login response

    render(<LoginPage2 />);
    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password' } });
    fireEvent.click(screen.getByText('Login')); // Adjust button text

    expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/api/users/login', {
      username: 'testuser',
      password: 'password',
    });
    expect(navigate).toHaveBeenCalledWith('/home'); // Adjust based on your redirection logic
  });

  // Add more tests for LoginPage2 functionality
});
