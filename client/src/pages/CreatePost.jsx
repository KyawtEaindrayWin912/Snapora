import React from 'react';
import Sidebar from '../components/Sidebar';
import CreatePost from '../components/CreatePost';

const Home = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-1/4">
        <Sidebar />
      </div>
      <main className="flex-1 w-3/4 p-4">
        <CreatePost /> 
      </main>
    </div>
  );
};

export default Home;
