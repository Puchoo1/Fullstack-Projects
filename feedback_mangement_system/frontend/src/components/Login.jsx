import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState(''); // State to handle email input
  const [password, setPassword] = useState(''); // State to handle password input
  const [errorMessage, setErrorMessage] = useState(''); // State to handle error messages
  const navigate = useNavigate(); // Initialize the navigate function

  // Handle Login Submission
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:4000/login', {
        email,
        password,
      });

      // Save the token to localStorage for future authenticated requests
      localStorage.setItem('token', response.data.token);
      alert(response.data.message);

      // Redirect to the dashboard on successful login
      navigate('/dashboard');
    } catch (error) {
      // Set an error message in case of failure
      setErrorMessage(error.response?.data?.message || 'Something went wrong. Please try again!');
    }
  };

  // Redirect to Signup
  const handleSignupRedirect = (e) => {
    e.preventDefault(); // Prevent default form behavior
    navigate('/signup'); // Redirect to the signup page
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
        {errorMessage && (
          <p className="text-red-500 text-center mb-4">{errorMessage}</p> // Display error message
        )}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Update email state
              className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Update password state
              className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            Login
          </button>
          <button
            onClick={handleSignupRedirect}
            className="mt-4 w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
          >
            Go to Signup
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
