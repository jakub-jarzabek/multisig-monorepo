import React, { useState } from 'react';

interface TabsProps {
  onChange: (x: number) => void;
  activeTab:number
}
export const Tabs: React.FC<TabsProps> = ({ onChange,activeTab }) => {
  return (
    <div className="shadow h-10 w-80 bg-slate-100 rounded relative ">
      <div
        className={`rounded bg-purple-300 w-1/2 h-10 absolute ${
          activeTab == 0 ? 'left-0' : 'left-1/2'
        } transition-all`}
      />
      <div
        className="cursor-pointer w-1/2 h-10 left-0 absolute z-20 text-center leading-10"
        onClick={() => onChange(0)}
      >
        Dashboard
      </div>

      <div
        className="cursor-pointer w-1/2 h-10 left-1/2 absolute z-20 text-center leading-10"
        onClick={() => onChange(1)}
      >
        Transactions
      </div>
    </div>
  );
};
