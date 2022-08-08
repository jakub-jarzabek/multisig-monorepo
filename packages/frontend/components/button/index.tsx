import React from 'react';
import { IconType } from 'react-icons';

interface ButtonProps {
  primary?: boolean;
  onClick: ((e: any) => void) | ((e: any) => Promise<void>);
  label: string | IconType;
  disabled?: boolean;
}
export const Button: React.FC<ButtonProps> = ({
  primary,
  onClick,
  label,
  disabled,
}) => {
  return (
    <div
      onClick={disabled ? () => null : onClick}
      className={`px-4 cursor-pointer py-1 w-fit rounded border-2 border-purple-600 drop-shadow-2xl  ${
        primary ? 'bg-purple-600 text-white' : 'bg-white text-purple-600'
      } active:drop-shadow-none hover:${
        disabled ? '' : 'magic'
      } duration-300 transition-al ${
        disabled ? 'bg-slate-300 text-slate-500 border-slate-500' : ''
      }`}
    >
      {typeof label === 'string' ? label : <label />}
    </div>
  );
};
