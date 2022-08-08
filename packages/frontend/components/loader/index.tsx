import { ReduxState, RootState } from 'packages/frontend/redux';
import React from 'react';
import { useSelector } from 'react-redux';

export const Loader = () => {
  const { connection, wallet } = useSelector<RootState, ReduxState>(
    (state) => state
  );
  const loading = connection.loading || wallet.loading;
  if (loading) {
    return (
      <div className="absolute top-5 right-5">
        <div className="lds-roller">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }
  return <></>;
};
