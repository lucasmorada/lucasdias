import Phaser from 'phaser';

export default class PreloadScene extends Phaser.Scene{
  constructor(){
    super('PreloadScene');
  }
  preload(){
    // Generate simple pixel textures procedurally
    const g = this.add.graphics();
    // player
    g.fillStyle(0x2b2b2b,1);
    g.fillRect(0,0,16,24);
    g.generateTexture('player',16,24);
    g.clear();
    // ground
    g.fillStyle(0x7b5a3c,1);
    g.fillRect(0,0,64,32);
    g.generateTexture('ground',64,32);
    g.clear();
    // heart
    g.fillStyle(0xff4d6d,1);
    g.fillRect(0,0,8,8);
    g.generateTexture('heart',8,8);
    g.clear();
    // enemy
    g.fillStyle(0x3b2b2b,1);
    g.fillRect(0,0,16,16);
    g.generateTexture('bug',16,16);
    g.clear();
  }
  create(){
    // Wait for a start signal from the UI; start GameScene but paused
    this.scene.launch('GameScene', { started: false });
    this.scene.moveAbove('GameScene', 'PreloadScene');
  }
}
