import React, { useState } from 'react';

type Tab = { label: string; index: number };
interface TabsProps {
  onChange: (tab: Tab) => void;
}
export const Tabs: React.FC<TabsProps> = ({ onChange }) => {
  const [tab, setTab] = useState(0);
  const tabs: Tab[] = [
    { label: 'Dashboard', index: 0 },
    { label: 'Transactions', index: 1 },
  ];
  return (
    <div className="bg slate-100 rounded relative ">
      <div
        className={`rouned bg-slate-300 ${
          tab == 0 ? 'left-0' : 'left-1/2'
        } transition-all`}
      />
      <div className="w-1/2 h-full left-0 absolute z-20" onClick={()=>setTab(0)}>{tabs[0].label}</div>

      <div className="w-1/2 h-full left-1/2 absolute z-20" onClick={()=>setTab(1)}>{tabs[1].label}</div>
    </div>
  );
};
