import React from 'react';
import Sidebar from '../components/Sidebar';
import Profile from '../components/Profile';

const Home = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-1/4 fixed h-full top-0 left-0 overflow-y-auto z-10">
        <Sidebar />
      </div>
      <main className="flex-1 ml-[25%] p-4">
        <Profile />
      </main>
    </div>
  );
};

export default Home;
