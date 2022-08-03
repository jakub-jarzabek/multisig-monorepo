import React from 'react'

interface InputProps {
  onChange: (e:string) =>void
  value:string
  placeholder:string
}

export const Input:React.FC<InputProps> = ({onChange, value,placeholder}) => {
  return (
    <input onChange={e=>onChange(e.target.value)} value={value} placeholder={placeholder} className='p-2 rounded border border-purple-600 bg-slate-100 text-purple-600 outline-slate-300 h-8 leading-8'/>
  )
}
