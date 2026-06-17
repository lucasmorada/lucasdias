import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene{
  cursors:any;
  player:any;
  speed:number = 200;
  runSpeed:number = 320;
  started:boolean = false;
  lives:number = 3;
  checkpointX:number = 100;

  constructor(){
    super('GameScene');
  }
  init(data:any){
    this.started = data?.started ?? false;
  }
  create(){
    const { width, height } = this.scale;
    // simple background
    this.cameras.main.setBackgroundColor('#89a089');

    // ground group
    const ground = this.physics.add.staticGroup();
    for(let i=0;i<50;i++){
      ground.create(64*i, height-32, 'ground').setOrigin(0,0).refreshBody();
    }

    // player
    this.player = this.physics.add.sprite(100, height-150, 'player');
    this.player.setCollideWorldBounds(true);
    this.player.setBounce(0.05);
    this.physics.add.collider(this.player, ground);

    // camera
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0,0,64*50, height);

    // controls
    this.cursors = this.input.keyboard.addKeys({
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      w: Phaser.Input.Keyboard.KeyCodes.W,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      d: Phaser.Input.Keyboard.KeyCodes.D,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
      shift: Phaser.Input.Keyboard.KeyCodes.SHIFT,
      interact: Phaser.Input.Keyboard.KeyCodes.E,
      esc: Phaser.Input.Keyboard.KeyCodes.ESC
    });

    // enemies
    const enemy = this.physics.add.sprite(600, height-100, 'bug');
    enemy.setImmovable(true);
    this.physics.add.collider(enemy, ground);
    this.physics.add.overlap(this.player, enemy, ()=>{ this.handleHit(); }, undefined, this);

    // listen for start event
    window.addEventListener('startGame',()=>{
      this.started = true;
    });

    // respawn on fall
    this.physics.world.on('worldbounds', (body:any)=>{
      if(body.gameObject === this.player){
        this.loseLifeAndRespawn();
      }
    });

    this.player.body.onWorldBounds = true;
  }
  handleHit(){
    this.lives -= 1;
    // simple knockback
    this.player.setVelocityY(-200);
    if(this.lives <= 0){
      // game over - restart scene
      this.scene.restart();
      this.lives = 3;
    } else {
      this.player.x = this.checkpointX;
      this.player.y = 200;
    }
  }
  loseLifeAndRespawn(){
    this.lives -= 1;
    if(this.lives <= 0){
      this.scene.restart();
      this.lives = 3;
    } else {
      this.player.setPosition(this.checkpointX, 200);
      this.player.setVelocity(0,0);
    }
  }
  update(){
    if(!this.started) return; // freeze until start

    const left = this.cursors.left.isDown || this.cursors.a.isDown;
    const right = this.cursors.right.isDown || this.cursors.d.isDown;
    const jump = Phaser.Input.Keyboard.JustDown(this.cursors.space) || Phaser.Input.Keyboard.JustDown(this.cursors.w) || Phaser.Input.Keyboard.JustDown(this.cursors.up);
    const running = this.cursors.shift.isDown;

    const speed = running ? this.runSpeed : this.speed;

    if(left){
      this.player.setVelocityX(-speed);
      this.player.flipX = true;
    } else if(right){
      this.player.setVelocityX(speed);
      this.player.flipX = false;
    } else {
      this.player.setVelocityX(0);
    }

    if(jump && this.player.body.onFloor()){
      this.player.setVelocityY(-520);
    }

    // falling detection
    if(this.player.y > this.scale.height + 300){
      this.loseLifeAndRespawn();
    }
  }
}
