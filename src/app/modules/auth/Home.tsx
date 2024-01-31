// Home.tsx

import React, { useContext } from 'react';
import { AuthContext } from './core/Auth'; // Update this path

const Home = () => {
  const { currentUser } = useContext(AuthContext); // Assuming you have a context providing user information

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      {currentUser ? (
        <p>Hello, {currentUser.email}!</p>
      ) : (
        <p>User information not available</p>
      )}
    </div>
  );
};

export default Home;
