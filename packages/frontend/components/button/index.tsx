import React from 'react';
import { IconType } from 'react-icons';

interface ButtonProps {
  primary?: boolean;
  onClick: () => void;
  label: string | IconType;
}
export const Button: React.FC<ButtonProps> = ({ primary, onClick, label }) => {
  return (
    <div
      onClick={onClick}
      className={`px-4 cursor-pointer py-1 w-fit rounded border-2 border-purple-600 drop-shadow-2xl  ${
        primary ? 'bg-purple-600 text-white' : 'bg-white text-purple-600'
      } active:drop-shadow-none hover:magic duration-300 transition-al`}
    >
      {typeof label === 'string' ? label : <label />}
    </div>
  );
};
