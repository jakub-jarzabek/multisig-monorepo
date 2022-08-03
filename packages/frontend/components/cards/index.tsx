import React from 'react';
import { Button } from '..';

interface CardProps {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children }) => {
  return (
    <div className="flex flex-row p-2 h-10 bg-slate-300 bg-opacity-50 rounded border border-slate-300 justify-around">
      {children}
    </div>
  );
};

interface TransactionCardProps {
  hash: string;
  completed?: boolean;
}
export const TransactionCard: React.FC<TransactionCardProps> = ({
  hash,
  completed,
}) => {
  const handleCancel = () => null;
  const handleApprove = () => null;
  return (
    <Card>
      <>
        <span>{hash}</span>
        {!completed && (
          <div className="flex flex-row gap-2 items-center">
            <Button primary label="Approve" onClick={handleApprove} />
            <Button label="Cancel" onClick={handleCancel} />
          </div>
        )}
      </>
    </Card>
  );
};
