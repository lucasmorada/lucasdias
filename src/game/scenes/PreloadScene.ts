import Phaser from 'phaser';

export default class PreloadScene extends Phaser.Scene{
  constructor(){
    super('PreloadScene');
  }
  preload(){
    // Generate simple pixel textures procedurally
    const g = this.add.graphics();
    // player frames (16x24)
    const w = 16, h = 24;
    // idle
    g.fillStyle(0x2b2b2b,1);
    g.fillRect(0,0,w,h);
    g.generateTexture('player_idle',w,h);
    g.clear();
    // walk1
    g.fillStyle(0x2b2b2b,1);
    g.fillRect(0,0,w,h);
    g.fillStyle(0x9cc66b,1);
    g.fillRect(2,4,4,6); // simple detail
    g.generateTexture('player_walk1',w,h);
    g.clear();
    // walk2
    g.fillStyle(0x2b2b2b,1);
    g.fillRect(0,0,w,h);
    g.fillStyle(0x8fb86a,1);
    g.fillRect(10,4,4,6);
    g.generateTexture('player_walk2',w,h);
    g.clear();
    // run1
    g.fillStyle(0x2b2b2b,1);
    g.fillRect(0,0,w,h);
    g.fillStyle(0x6aa44a,1);
    g.fillRect(2,14,12,4);
    g.generateTexture('player_run1',w,h);
    g.clear();
    // run2
    g.fillStyle(0x2b2b2b,1);
    g.fillRect(0,0,w,h);
    g.fillStyle(0x5b8b3b,1);
    g.fillRect(2,10,12,6);
    g.generateTexture('player_run2',w,h);
    g.clear();
    // jump
    g.fillStyle(0x2b2b2b,1);
    g.fillRect(0,0,w,h);
    g.fillStyle(0xd1a66b,1);
    g.fillRect(4,2,8,6);
    g.generateTexture('player_jump',w,h);
    g.clear();
    // hurt
    g.fillStyle(0x4b2b2b,1);
    g.fillRect(0,0,w,h);
    g.generateTexture('player_hurt',w,h);
    g.clear();

    // ground and tiles
    g.fillStyle(0x7b5a3c,1); // dirt
    g.fillRect(0,0,64,32);
    g.generateTexture('dirt',64,32);
    g.clear();

    g.fillStyle(0x6e6e6e,1); // stone
    g.fillRect(0,0,64,32);
    g.generateTexture('stone',64,32);
    g.clear();

    g.fillStyle(0x8b5a3c,1); // wood
    g.fillRect(0,0,48,24);
    g.generateTexture('wood',48,24);
    g.clear();

    g.fillStyle(0xb35a3c,1); // brick
    g.fillRect(0,0,32,16);
    g.generateTexture('brick',32,16);
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

    // small collectible
    g.fillStyle(0xffd166,1);
    g.fillRect(0,0,8,8);
    g.generateTexture('collect',8,8);
    g.clear();
  }
  create(){
    // register animations globally
    const anims = this.anims;

    // idle
    anims.create({
      key: 'idle',
      frames: [{ key: 'player_idle' }],
      frameRate: 1,
      repeat: -1
    });

    anims.create({
      key: 'walk',
      frames: [ { key: 'player_walk1' }, { key: 'player_walk2' } ],
      frameRate: 8,
      repeat: -1
    });

    anims.create({
      key: 'run',
      frames: [ { key: 'player_run1' }, { key: 'player_run2' } ],
      frameRate: 12,
      repeat: -1
    });

    anims.create({
      key: 'jump',
      frames: [ { key: 'player_jump' } ],
      frameRate: 1,
      repeat: -1
    });

    anims.create({
      key: 'hurt',
      frames: [ { key: 'player_hurt' } ],
      frameRate: 1,
      repeat: 0
    });

    // Launch GameScene but keep it waiting for start
    this.scene.launch('GameScene', { started: false });
    this.scene.moveAbove('GameScene', 'PreloadScene');
  }
}
