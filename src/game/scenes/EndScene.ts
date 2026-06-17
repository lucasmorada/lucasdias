import Phaser from 'phaser';

export default class EndScene extends Phaser.Scene{
  constructor(){
    super('EndScene');
  }
  create(){
    const { width, height } = this.scale;
    this.add.text(width/2, height/2-40, 'Jornada concluída!', { fontSize: '32px', color: '#ffffff' }).setOrigin(0.5);
    this.add.text(width/2, height/2+8, 'Obrigado por visitar meu portfólio.', { fontSize: '16px', color: '#ffffff' }).setOrigin(0.5);

    const restart = this.add.text(width/2, height/2+60, 'Jogar novamente', { fontSize: '18px', color: '#ffcc00' }).setOrigin(0.5).setInteractive();
    restart.on('pointerdown', ()=>{
      this.scene.start('GameScene');
    });
  }
}
