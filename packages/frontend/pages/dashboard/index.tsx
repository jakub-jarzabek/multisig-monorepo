import React from 'react';
import { Tabs } from '../../components';

const Dashboard = () => {
  return (
    <div
      className="w-5/6  h-5/6 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-3xl shadow-3xl  bg-gradient-to-r from-purple-600 to-pink-200 bg-opacity bg-opacity-50 border-4 border-slate-300 backdrop-blur-md"
      style={{ opacity: 0.5 }}
    >
      <Tabs onChange={(e) => console.log(e)} />
    </div>
  );
};
export default Dashboard;
