'use client'

import React from 'react'

export function Modal({ title, children, open, onClose }:{ title:string, children:React.ReactNode, open:boolean, onClose?:()=>void }){
  if(!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded p-6 max-w-xl mx-4" onClick={(e)=>e.stopPropagation()}>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <div className="text-sm">{children}</div>
        <div className="mt-4 text-right">
          <button className="px-3 py-1 bg-gray-800 text-white rounded" onClick={onClose}>Fechar (ESC)</button>
        </div>
      </div>
    </div>
  )
}
