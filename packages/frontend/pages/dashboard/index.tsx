import React, { useRef, useEffect, useState } from 'react';
import { Tabs, MainPanel, Transactions, AccountInfo } from '../../components';
import autoAnimate from '@formkit/auto-animate';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppDispatch,
  Connection,
  loadTransactions,
  loadWalletData,
  ReduxState,
  RootState,
} from '../../redux';
import { useRouter } from 'next/router';
import { useWallet } from '@solana/wallet-adapter-react';
import { BiRefresh } from 'react-icons/bi';
import { AiOutlinePoweroff } from 'react-icons/ai';
import { useSubscriveEvents } from '../../hooks';

const Dashboard = () => {
  const { connection } = useSelector<RootState, ReduxState>((state) => state);
  const [rotation, setRotation] = useState(0);
  const [color, setColor] = useState<'white' | '#ff1818'>('white');
  const { msig, program } = connection;
  const dispatch = useDispatch<AppDispatch>();
  const { publicKey } = useWallet();
  const router = useRouter();
  const parent = useRef(null);
  const [activeTab, setActiveTab] = useState(0);
  const reloadData = () => {
    dispatch(loadWalletData());
    dispatch(loadTransactions());
  };

  useSubscriveEvents(reloadData, connection.program);

  useEffect(() => {
    if (!publicKey || !program) {
      router.replace('/');
    }
  }, [publicKey]);

  useEffect(() => {
    if (msig) {
      dispatch(loadWalletData());
      dispatch(loadTransactions());
    } else {
      router.replace('/');
    }
  }, []);

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
        <div className="flex flex-row gap-10 items-center">
          <div className="flex flex-row items-center gap-2 bg-slate-200 bg-opacity-20 px-2 rounded-xl shadow-lg magic">
            <AiOutlinePoweroff
              size={36}
              color={color}
              onMouseOver={() => setColor('#ff1818')}
              onMouseLeave={() => setColor('white')}
              style={{
                cursor: 'pointer',
                transition: 'transform 0.3s ease-in-out',
              }}
              onClick={() => {
                dispatch(Connection.clearMsig());
                router.replace('/');
              }}
            />
            <BiRefresh
              size={50}
              color="white"
              onMouseOver={() => setRotation(45)}
              onMouseLeave={() => setRotation(0)}
              style={{
                cursor: 'pointer',
                transition: 'all 0.3s ease-in-out',
                transform: `rotate(${rotation}deg)`,
              }}
              onClick={() => {
                dispatch(loadTransactions());
                dispatch(loadWalletData());
              }}
            />
          </div>
          <AccountInfo />
        </div>
      </div>
      <div ref={parent} className="mt-4">
        {activeTab === 0 ? <MainPanel /> : <Transactions />}
      </div>
    </div>
  );
};
export default Dashboard;
