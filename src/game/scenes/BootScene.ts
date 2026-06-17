import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene{
  constructor(){
    super('BootScene');
  }
  preload(){
    // Here we could load small external assets if needed
  }
  create(){
    this.scene.start('PreloadScene');
  }
}
