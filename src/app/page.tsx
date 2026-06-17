'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import PhaserCanvas from '../components/PhaserCanvas'
import HUD from '../components/HUD'
import { Modal } from '../components/Modals'

const App: React.FC = ()=>{
  const [started, setStarted] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  useEffect(()=>{
    function handleKey(e:KeyboardEvent){
      if(e.key === 'Escape') setAboutOpen(false);
    }
    window.addEventListener('keydown', handleKey);
    return ()=>window.removeEventListener('keydown', handleKey);
  },[])

  function startJourney(){
    setStarted(true);
    window.dispatchEvent(new CustomEvent('startGame'));
  }

  return (
    <main className="w-full h-full flex items-center justify-center relative">
      <div style={{position:'absolute',zIndex:30, width:'100%'}}>
        <HUD lives={3} />
      </div>

      <PhaserCanvas />

      {!started && (
        <div className="overlay-center text-center z-40">
          <div className="text-4xl font-bold mb-4 text-white" style={{fontFamily:'monospace', textShadow:'2px 2px 0 rgba(0,0,0,0.6)'}}>Portfólio Lucas Dias</div>
          <button className="px-8 py-3 bg-yellow-400 rounded font-bold" onClick={startJourney}>Iniciar Jornada</button>
          <div className="mt-3 text-white text-sm">Use ← → ou A/D para andar, Espaço/W para pular, Shift para correr, E para interagir</div>
          <div className="mt-4">
            <button className="px-3 py-1 bg-white/20 rounded mr-2" onClick={()=>setAboutOpen(true)}>Quem sou eu?</button>
          </div>
        </div>
      )}

      <Modal title="Quem sou eu?" open={aboutOpen} onClose={()=>setAboutOpen(false)}>
        <p>Sou Lucas Dias, estudante de Engenharia de Software, Suporte de TI e desenvolvedor apaixonado por criar experiências digitais criativas, úteis e bem construídas. Tenho interesse em desenvolvimento web, automações, design de interfaces e cibersegurança.</p>
      </Modal>

    </main>
  )
}

export default App
