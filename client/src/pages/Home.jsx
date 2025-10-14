import React from 'react';
import Sidebar from '../components/Sidebar';
import Feed from '../components/Feed';

const Home = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-1/4 fixed h-full top-0 left-0 overflow-y-auto">
        <Sidebar />
      </div>
      <main className="flex-1 w-3/4 p-4 ml-1/4">
        <Feed /> 
      </main>
    </div>
  );
};

export default Home;