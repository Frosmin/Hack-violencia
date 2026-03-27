import React, { useState } from 'react';

export default function Auth() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // States for giving feedback to the user
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // Decide which endpoint to hit based on the mode
    const endpoint = isLoginMode ? '/api/auth/login' : '/api/auth/register';
    const url = `http://localhost:3000${endpoint}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Throws the error message from your controller (e.g., 'Email y contraseña son requeridos')
        throw new Error(data.error || 'Something went wrong');
      }

      if (isLoginMode) {
        // Save the token so we can use it later for the evidence upload!
        localStorage.setItem('token', data.token);
        setMessage('Login successful!');
      } else {
        setMessage('Registration successful! You can now log in.');
        setIsLoginMode(true); // Automatically switch to Login view
        setPassword(''); // Clear the password for security
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {isLoginMode ? 'Login' : 'Register'}
      </h2>

      {/* Success and Error Messages */}
      {message && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{message}</div>}
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          {isLoginMode ? 'Sign In' : 'Sign Up'}
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          onClick={() => {
            setIsLoginMode(!isLoginMode);
            setMessage('');
            setError('');
          }}
          className="text-blue-500 hover:underline text-sm"
        >
          {isLoginMode
            ? "Don't have an account? Register here."
            : "Already have an account? Login here."}
        </button>
      </div>
    </div>
  );
}