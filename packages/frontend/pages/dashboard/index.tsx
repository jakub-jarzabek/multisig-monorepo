import React, { useRef, useEffect, useState } from 'react';
import {
  Tabs,
  SendTransaction,
  Transactions,
  AccountInfo,
  AccountCreation,
} from '../../components';
import autoAnimate from '@formkit/auto-animate';

const Dashboard = () => {
  const parent = useRef(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);
  return (
    <div
      className=" p-4 w-5/6 min-h-9/10 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-3xl shadow-3xl  bg-gradient-to-r from-purple-600 to-pink-200 bg-opacity bg-opacity-50 border-4 border-slate-300 backdrop-blur-md"
      style={{ opacity: 0.5 }}
    >
      {false ? (
        <AccountCreation />
      ) : (
        <>
          <div className="flex flex-row items-center justify-between">
            <Tabs onChange={(e) => setActiveTab(e)} activeTab={activeTab} />
            <AccountInfo />
          </div>
          <div ref={parent} className="mt-4">
            {activeTab === 0 ? <SendTransaction /> : <Transactions />}
          </div>
        </>
      )}
    </div>
  );
};
export default Dashboard;
