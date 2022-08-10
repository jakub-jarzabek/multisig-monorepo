import {
  AppDispatch,
  Evm,
  logInToWallet,
  ReduxState,
  RootState,
} from "../../redux";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Blockies from "react-blockies";
import { Button, Card } from "..";

interface IWalletPickerProps {
  onCreateNew: () => void;
}
export const WalletPicker: React.FC<IWalletPickerProps> = ({ onCreateNew }) => {
  const { connection } = useSelector<RootState, ReduxState>((state) => state);
  const { myWallets } = connection;
  const dispatch = useDispatch<AppDispatch>();
  const handleLogIn = (pk: string) => {
    dispatch(logInToWallet({ pk }));
    if (connection.chain === "eth") {
      dispatch(Evm.setWalletContract());
    }
  };
  return (
    <div className="flex items-center p-8 gap-4 flex-col w-full md:w-1/2 mx-auto mt-20 rounded-3xl shadow-3xl  bg-gradient-to-r from-purple-100 to-purple-300 bg-opacity bg-opacity-50 border-1 border-slate-200  backdrop-blur-md">
      <h1 className="text-2xl font-semibold text-purple-900">Choose Wallet</h1>
      {myWallets &&
        myWallets.map((wallet, i) => (
          <Card
            key={"wallet-" + i}
            twStyles="hover:magic cursor-pointer"
            onClick={() => handleLogIn(wallet)}
          >
            <span className="leading-10 font-semibold text-slate-700">
              {wallet}
            </span>
            <Blockies size={10} seed={wallet} bgColor="#800080" />
          </Card>
        ))}
      <Button label="Add New" onClick={onCreateNew} />
    </div>
  );
};
