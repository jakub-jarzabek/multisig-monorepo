import React, { useRef, useEffect, useState } from "react";
import { Tabs, MainPanel, Transactions, AccountInfo } from "../../components";
import autoAnimate from "@formkit/auto-animate";
import { useDispatch, useSelector } from "react-redux";
import {
  AppDispatch,
  Connection,
  loadTransactions,
  loadWalletData,
  ReduxState,
  RootState,
} from "../../redux";
import { useRouter } from "next/router";
import { useWallet } from "@solana/wallet-adapter-react";
import { BiRefresh } from "react-icons/bi";
import { AiOutlinePoweroff } from "react-icons/ai";
import { useSubscribeSolEvents, useSubscribeEvmEvents } from "../../hooks";

const Dashboard = () => {
  const { connection, evm } = useSelector<RootState, ReduxState>(
    (state) => state
  );
  const [rotation, setRotation] = useState(0);
  const [color, setColor] = useState<"white" | "#ff1818">("white");
  const { msig, program } = connection;
  const { wallet: wallet_evm } = evm;
  const dispatch = useDispatch<AppDispatch>();
  const { publicKey } = useWallet();
  const router = useRouter();
  const parent = useRef(null);
  const [activeTab, setActiveTab] = useState(0);

  const wallet = useWallet();
  const reloadData = () => {
    dispatch(loadWalletData());
    dispatch(loadTransactions());
  };

  useSubscribeSolEvents(reloadData, wallet, connection.chain === "sol");
  useSubscribeEvmEvents(
    reloadData,
    evm.walletContract,
    connection.chain === "eth"
  );

  useEffect(() => {
    if (
      ((!publicKey || !program) && connection.chain === "sol") ||
      (!wallet_evm && connection.chain === "eth")
    ) {
      router.replace("/");
    }
  }, [publicKey]);

  useEffect(() => {
    if (msig) {
      dispatch(loadWalletData());
      dispatch(loadTransactions());
    } else {
      router.replace("/");
    }
  }, []);

  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  return (
    <div
      className={`${
        activeTab === 0 ? "mt-20" : ""
      } md:mt-0 p-4 w-full md:w-5/6 min-h-9/10  absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-3xl shadow-3xl  bg-gradient-to-r from-purple-500 to-purple-900 bg-opacity bg-opacity-50 border-4 border-slate-300 backdrop-blur-md`}
      style={{ opacity: 0.5 }}
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
        <Tabs onChange={(e) => setActiveTab(e)} activeTab={activeTab} />
        <div className="flex flex-col-reverse md:flex-row gap-2 md:gap-10 items-center">
          <div className="flex flex-row items-center gap-2 bg-slate-200 bg-opacity-20 px-2 rounded-xl shadow-lg magic">
            <AiOutlinePoweroff
              size={36}
              color={color}
              onMouseOver={() => setColor("#ff1818")}
              onMouseLeave={() => setColor("white")}
              style={{
                cursor: "pointer",
                transition: "transform 0.3s ease-in-out",
              }}
              onClick={() => {
                dispatch(Connection.clearMsig());
                router.replace("/");
              }}
            />
            <BiRefresh
              size={50}
              color="white"
              onMouseOver={() => setRotation(45)}
              onMouseLeave={() => setRotation(0)}
              style={{
                cursor: "pointer",
                transition: "all 0.3s ease-in-out",
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
