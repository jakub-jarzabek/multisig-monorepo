import { ReduxState, RootState } from '../../redux';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { shrortenAddress } from '../../utils';

const Tooltip = ({
  visible,
  copied,
}: {
  visible: boolean;
  copied: boolean;
}) => (
  <div
    className={`bg-purple-900 shadow-2xl shadow-slate-600 absolute z-10 px-2 leading-0 rounded ${
      !visible ? 'opacity-0' : 'opacity-80'
    } transition-opacity ${
      copied ? 'translate-x-10' : 'translate-x-6'
    } duration-500 pointer-events-none`}
  >
    {copied ? 'Copied!' : 'Copy Address'}
  </div>
);

export const AccountInfo = () => {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const { connection, wallet } = useSelector<RootState, ReduxState>(
    (state) => state
  );
  const { msig } = connection;
  const { balance } = wallet;
  return (
    <div className="w-80 h-10 flex flex-row rounded bg-slate-100 shadow border border-slate-300">
      <div
        onClick={() => {
          navigator.clipboard.writeText(msig);
          setCopied(true);
        }}
        onMouseOver={() => setVisible(true)}
        onMouseLeave={() => {
          setVisible(false);
          setTimeout(() => {
            setCopied(false);
          }, 500);
        }}
        className="w-1/2 bg-purple-600 text-white rounded text-center leading-10 hover:bg-purple-500 cursor-pointer overflow-visible"
      >
        <span>{shrortenAddress(msig)}</span>
        <Tooltip visible={visible} copied={copied} />
      </div>
      <div className="w-1/2 bg-slate-100 text-purple-600 rounded text-center leading-10">
        {balance}
      </div>
    </div>
  );
};
