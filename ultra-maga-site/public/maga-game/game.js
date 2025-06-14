const config = {
  type: Phaser.AUTO,
  width: 400,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 600 }, debug: false }
  },
  scene: {
    preload,
    create,
    update
  }
};

let trump;
let cursors;
let pipes;
let score = 0;
let scoreText;
let gameOver = false;

const game = new Phaser.Game(config);

function preload() {
  this.load.image('trump', 'https://files.catbox.moe/kbcy6t.png'); // Temp sprite
  this.load.image('pipe', 'https://files.catbox.moe/qswcqq.png');  // Temp pipe
}

function create() {
  trump = this.physics.add.sprite(100, 300, 'trump').setScale(0.2);
  trump.setCollideWorldBounds(true);

  pipes = this.physics.add.group();

  this.time.addEvent({
    delay: 1500,
    callback: addPipe,
    callbackScope: this,
    loop: true
  });

  scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '24px', fill: '#fff' });

  this.input.on('pointerdown', flap, this);
  cursors = this.input.keyboard.createCursorKeys();

  this.physics.add.collider(trump, pipes, hitPipe, null, this);
}

function update() {
  if (gameOver) return;

  if (cursors.space && Phaser.Input.Keyboard.JustDown(cursors.space)) {
    flap.call(this);
  }

  pipes.getChildren().forEach(pipe => {
    if (pipe.x < trump.x && !pipe.passed) {
      score += 1;
      pipe.passed = true;
      scoreText.setText('Score: ' + score);
    }
  });
}

function flap() {
  trump.setVelocityY(-300);
}

function addPipe() {
  const y = Phaser.Math.Between(150, 450);
  const gap = 150;

  const topPipe = pipes.create(400, y - gap, 'pipe');
  const bottomPipe = pipes.create(400, y + gap, 'pipe');

 [topPipe, bottomPipe].forEach(pipe => {
  pipe.setScale(0.25);
  pipe.setVelocityX(-200);
  pipe.passed = false;
  pipe.body.allowGravity = false;
  pipe.setImmovable(true);
});

}

function hitPipe() {
  gameOver = true;
  this.add.text(100, 250, 'GAME OVER', { fontSize: '32px', fill: '#ff0000' });
  this.physics.pause();
}
