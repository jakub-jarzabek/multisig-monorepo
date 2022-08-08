import { ReduxState, RootState } from '../../redux';
import React from 'react';
import { useSelector } from 'react-redux';
import { TransactionCard, Modal } from '..';

export const Transactions = () => {
  const { wallet } = useSelector<RootState, ReduxState>((state) => state);
  const [modalData, setModalData] = React.useState({
    open: false,
    data: [],
    value: '',
    type: '',
    ts: '',
  });
  const handleClose = () => {
    setModalData({ open: false, data: [], value: '', type: '', ts: '' });
  };

  const { transactions } = wallet;
  return (
    <div className="flex flex-col items-center gap-10">
      <div className=" w-full flex flex-col items-center gap-2">
        <h1 className="text-2xl font-semibold text-white  tracking-widest glow-blue mb-2 ">
          Pending
        </h1>

        {transactions.peding.map((tx, i) => (
          <TransactionCard
            key={'pending' + i}
            hash={tx.publicKey.toString()}
            transaction={tx}
            twStyles="hover:magic-big cursor-pointer"
            setModalData={setModalData}
          />
        ))}
      </div>
      <div className="flex flex-col items-center w-full gap-2">
        <h1 className="text-2xl font-semibold text-white  tracking-widest glow-green mb-2">
          Completed
        </h1>
        {transactions.completed.map((tx, i) => (
          <TransactionCard
            key={'completed' + i}
            hash={tx.publicKey.toString()}
            completed
            transaction={tx}
            twStyles={'hover:magic cursor-pointer'}
            setModalData={setModalData}
          />
        ))}
      </div>
      <div className="flex flex-col items-center w-full gap-2">
        <h1 className="text-2xl font-semibold text-white  tracking-widest glow-green mb-2">
          Deleted
        </h1>
        {transactions.deleted.map((tx, i) => (
          <TransactionCard
            key={'completed' + i}
            hash={tx.publicKey.toString()}
            completed
            transaction={tx}
            twStyles={'hover:magic cursor-pointer'}
            setModalData={setModalData}
          />
        ))}
      </div>
      <Modal
        type={modalData.type as '1' | '2' | '0'}
        value={modalData.value}
        open={modalData.open}
        data={modalData.data}
        setOpen={handleClose}
        ts={modalData.ts}
      />
    </div>
  );
};
