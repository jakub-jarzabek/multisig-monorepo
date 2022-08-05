import React, { useRef, useEffect, useState } from 'react';
import {
  Tabs,
  MainPanel,
  Transactions,
  AccountInfo,
  AccountCreation,
} from '../../components';
import autoAnimate from '@formkit/auto-animate';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppDispatch,
  Connection,
  IConnectionSlice,
  loadTransactions,
  loadWalletData,
  ReduxState,
  RootState,
} from '../../redux';
import { useRouter } from 'next/router';
import { useWallet } from '@solana/wallet-adapter-react';
import { Storage } from '../../utils';
const Dashboard = () => {
  const { connection } = useSelector<RootState, ReduxState>((state) => state);
  const { msig, program } = connection;
  const dispatch = useDispatch<AppDispatch>();
  const { publicKey } = useWallet();
  const router = useRouter();
  useEffect(() => {
    if (!publicKey || !program) {
      router.replace('/');
    } else {
      if (Storage.getItem('wallet')) {
        dispatch(Connection.setWallet(Storage.getItem('wallet')));
      }
    }
  }, [publicKey]);
  useEffect(() => {
    if (msig) {
      dispatch(loadWalletData());
      dispatch(loadTransactions());
    }
  }, [msig]);
  const parent = useRef(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);
  return (
    <div
      className=" p-4 w-5/6 min-h-9/10 max-h-full  absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-3xl shadow-3xl  bg-gradient-to-r from-purple-500 to-purple-900 bg-opacity bg-opacity-50 border-4 border-slate-300 backdrop-blur-md"
      style={{ opacity: 0.5 }}
    >
      <div className="flex flex-row items-center justify-between">
        <Tabs onChange={(e) => setActiveTab(e)} activeTab={activeTab} />
        <AccountInfo />
      </div>
      <div ref={parent} className="mt-4">
        {activeTab === 0 ? <MainPanel /> : <Transactions />}
      </div>
    </div>
  );
};
export default Dashboard;
