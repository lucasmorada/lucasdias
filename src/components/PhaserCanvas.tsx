'use client'

import { useEffect, useRef } from 'react'

export default function PhaserCanvas(){
  const containerRef = useRef<HTMLDivElement | null>(null);
  const gameRef = useRef<any>(null);

  useEffect(()=>{
    let mounted = true;
    async function init(){
      if(!mounted) return;
      const Phaser = (await import('phaser')).default;
      const BootScene = (await import('../game/scenes/BootScene')).default;
      const PreloadScene = (await import('../game/scenes/PreloadScene')).default;
      const GameScene = (await import('../game/scenes/GameScene')).default;
      const EndScene = (await import('../game/scenes/EndScene')).default;
      const { GAME_CONFIG } = await import('../game/config');

      const config:any = {
        type: Phaser.AUTO,
        width: GAME_CONFIG.width,
        height: GAME_CONFIG.height,
        parent: containerRef.current || undefined,
        backgroundColor: GAME_CONFIG.backgroundColor,
        physics: GAME_CONFIG.physics,
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
        },
        scene: [BootScene, PreloadScene, GameScene, EndScene]
      }

      // prevent multiple inits
      if((window as any).__phaserGame) {
        gameRef.current = (window as any).__phaserGame;
        return;
      }

      const game = new Phaser.Game(config);
      (window as any).__phaserGame = game;
      gameRef.current = game;
    }
    init();
    return ()=>{
      mounted = false;
      if(gameRef.current){
        try{ gameRef.current.destroy(true); }catch(e){}
        (window as any).__phaserGame = null;
      }
    }
  },[])

  return (
    <div className="canvas-wrap">
      <div ref={containerRef} className="game-canvas" />
    </div>
  )
}
