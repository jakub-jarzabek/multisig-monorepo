import React from 'react';
import Rodal from 'rodal';
import { Card } from '..';
import { PublicKey } from '@solana/web3.js';
import 'rodal/lib/rodal.css';
import { format } from 'date-fns';
interface IModalProps {
  type: '0' | '1' | '2';
  value: string;
  ts: string;
  data: PublicKey[];
  open: boolean;
  setOpen: () => void;
}
const parseType = (type: '0' | '1' | '2') => {
  switch (type) {
    case '0':
      return 'Set Accounts';
    case '1':
      return 'Change Threshold';
    case '2':
      return 'Transfer';
    default:
      return '';
  }
};
export const Modal: React.FC<IModalProps> = ({
  type,
  ts,
  value,
  data,
  open,
  setOpen,
}) => {
  console.log(value);
  return (
    <Rodal visible={open} onClose={setOpen}>
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-semibold text-purple-900 ">
          Type: <span className="text-slate-700">{parseType(type)}</span>
        </h1>
        <h1 className="text-xl font-semibold text-purple-900 mb-2">
          Creation time:{' '}
          <span className="text-slate-700">
            {format(Number(ts + '000'), 'dd/MM/yyyy HH:mm')}
          </span>
        </h1>
        {type === '0' && (
          <>
            <h1 className="text-xl font-semibold text-purple-900 mb-2 leading-10">
              New Accounts:
            </h1>
            {data &&
              data.map((acc, i) => (
                <Card key={'card-' + i}>
                  <span className="text-slate-700 text-xl font-semibold leading-10">
                    {acc.toString()}
                  </span>
                </Card>
              ))}
          </>
        )}
        {type === '1' && (
          <>
            <Card>
              <h1 className="text-xl font-semibold text-purple-900  leading-10">
                New Value: <span className="text-slate-700">{value}</span>
              </h1>
            </Card>
          </>
        )}
        {type === '2' && (
          <>
            <h1 className="text-xl font-semibold text-purple-900 mb">
              Transfer <span className="text-slate-700">{value}</span> To:
            </h1>
            <Card>
              <span className="text-slate-700 text-xl font-semibold leading-10">
                {data[0].toString()}
              </span>
            </Card>
          </>
        )}
      </div>
    </Rodal>
  );
};
