'use client'

import React from 'react'

export default function HUD({ lives=3, areaName='Fase 1: Jornada do Lucas' }:{ lives?:number, areaName?:string }){
  return (
    <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
      <div className="flex items-center gap-2 pointer-events-auto">
        {Array.from({length:lives}).map((_,i)=>(
          <div key={i} className="w-6 h-6 bg-red-500 rounded-sm" style={{imageRendering:'pixelated'}} />
        ))}
      </div>
      <div className="text-white font-bold pointer-events-auto">{areaName}</div>
      <div className="flex gap-2 pointer-events-auto">
        <a href="https://www.linkedin.com/in/lucasdiassiqueira/" target="_blank" rel="noreferrer" className="bg-white/20 px-2 py-1 rounded">LinkedIn</a>
        <a href="https://github.com/lucasmorada" target="_blank" rel="noreferrer" className="bg-white/20 px-2 py-1 rounded">GitHub</a>
        <span className="bg-white/20 px-2 py-1 rounded">Instagram</span>
        <span className="bg-white/20 px-2 py-1 rounded">WhatsApp</span>
      </div>
    </div>
  )
}
