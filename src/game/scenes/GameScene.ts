import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene{
  cursors:any;
  player:any;
  speed:number = 200;
  runSpeed:number = 340;
  started:boolean = false;
  lives:number = 3;
  checkpointX:number = 100;
  stackBlocks:any;

  constructor(){
    super('GameScene');
  }
  init(data:any){
    this.started = data?.started ?? false;
  }
  create(){
    const { width, height } = this.scale;
    // simple background
    this.cameras.main.setBackgroundColor('#7e9a7e');

    // ground group
    const ground = this.physics.add.staticGroup();
    for(let i=0;i<60;i++){
      ground.create(64*i, height-32, 'dirt').setOrigin(0,0).refreshBody();
    }

    // some stone platforms
    for(let i=0;i<6;i++){
      const px = 600 + i*220;
      const platform = ground.create(px, height-150 - (i%2)*40, 'stone').setOrigin(0,0).refreshBody();
    }

    // floating stack blocks (interact)
    this.stackBlocks = this.physics.add.staticGroup();
    const skills = ['React','Next.js','TypeScript','Tailwind CSS','n8n'];
    let sx = 350;
    skills.forEach((s, idx)=>{
      const b = this.stackBlocks.create(sx + idx*120, height-260 - (idx%2)*20, 'brick').setOrigin(0.5,0.5).refreshBody();
      // attach skill name on data
      (b as any).setData('skill', s);
    });

    // player
    this.player = this.physics.add.sprite(100, height-150, 'player_idle');
    this.player.setCollideWorldBounds(true);
    this.player.setBounce(0.05);
    this.physics.add.collider(this.player, ground);
    this.physics.add.collider(this.player, this.stackBlocks);

    // camera
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setBounds(0,0,64*60, height);

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

    // enemies - simple patrolling bug
    const enemy = this.physics.add.sprite(900, height-100, 'bug');
    enemy.setVelocityX(60);
    enemy.setBounce(1,0);
    enemy.setCollideWorldBounds(true);
    this.physics.add.collider(enemy, ground);
    this.physics.add.overlap(this.player, enemy, ()=>{ this.handleHit(); }, undefined, this);

    // collectibles
    const collect = this.physics.add.staticGroup();
    collect.create(800, height-200, 'collect');
    collect.create(1200, height-220, 'collect');
    this.physics.add.overlap(this.player, collect, (p:any, c:any)=>{
      c.destroy();
      window.dispatchEvent(new CustomEvent('collected', { detail: { x: c.x, y: c.y } }));
    }, undefined, this);

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

    // interaction detection area
    this.physics.add.overlap(this.player, this.stackBlocks, (p:any, block:any)=>{
      // if player presses E this will be handled in update (we just keep reference)
      (block as any).setData('near', true);
    }, undefined, this);

    // create an invisible sensor to clear 'near' flags when away
    this.time.addEvent({
      delay: 200,
      loop: true,
      callback: ()=>{
        this.stackBlocks.getChildren().forEach((b:any)=>{
          const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, b.x, b.y);
          if(dist > 64) b.setData('near', false);
        });
      }
    });

    this.player.anims.play('idle');
  }
  handleHit(){
    this.lives -= 1;
    this.player.anims.play('hurt');
    // simple knockback
    this.player.setVelocityY(-200);
    if(this.lives <= 0){
      // game over - restart scene
      window.dispatchEvent(new CustomEvent('gameOver'));
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
      window.dispatchEvent(new CustomEvent('gameOver'));
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
      if(running) this.player.anims.play('run', true);
      else this.player.anims.play('walk', true);
    } else if(right){
      this.player.setVelocityX(speed);
      this.player.flipX = false;
      if(running) this.player.anims.play('run', true);
      else this.player.anims.play('walk', true);
    } else {
      this.player.setVelocityX(0);
      if(this.player.body.onFloor()) this.player.anims.play('idle', true);
    }

    if(jump && this.player.body.onFloor()){
      this.player.setVelocityY(-520);
      this.player.anims.play('jump');
    }

    // falling detection
    if(this.player.y > this.scale.height + 300){
      this.loseLifeAndRespawn();
    }

    // interaction: check nearby blocks for 'near' and E pressed
    this.stackBlocks.getChildren().forEach((b:any)=>{
      if(b.getData('near') && Phaser.Input.Keyboard.JustDown(this.cursors.interact)){
        const skill = b.getData('skill');
        window.dispatchEvent(new CustomEvent('openStack', { detail: { skill } }));
      }
    });
  }
}
