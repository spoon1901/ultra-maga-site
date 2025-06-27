const firebaseConfig = {
    apiKey: "AIzaSyBlvFjps9OwJIhQjajvmneGwB18mYYDCUI",
    authDomain: "flappytrump.firebaseapp.com",
    databaseURL: "https://flappytrump-default-rtdb.firebaseio.com",
    projectId: "flappytrump",
    storageBucket: "flappytrump.appspot.com",
    messagingSenderId: "513580021078",
    appId: "1:513580021078:web:caacd9c4a55acee33712f7"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

let userId = null;
let userHandle = null;

const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 900 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game = new Phaser.Game(config);

let bird, pipes, cursors, score = 0, scoreText, highScore = 0, highScoreText;
let gameOver = false;
let music, flapSound, hitSound, burgerSound;
let cheeseburger;
let pipeGap = 130;

function preload() {
    this.load.image('background', 'https://files.catbox.moe/q83up9.png');
    this.load.image('pipe', 'https://files.catbox.moe/qswcqq.png');
    this.load.image('burger', 'https://files.catbox.moe/6bc6uj.png');
    this.load.spritesheet('bird', 'https://files.catbox.moe/p9sktx.png', { frameWidth: 34, frameHeight: 24 });

    this.load.audio('music', 'https://files.catbox.moe/4eq3qy.mp3');
    this.load.audio('flap', 'https://files.catbox.moe/2oly9t.mp3');
    this.load.audio('hit', 'https://files.catbox.moe/2v2pm7.mp3');
    this.load.audio('burgerSound', 'https://files.catbox.moe/5c5st7.mp3');
}

function create() {
    this.add.image(200, 300, 'background');

    pipes = this.physics.add.group();
    cheeseburger = this.physics.add.sprite(-50, -50, 'burger');

    bird = this.physics.add.sprite(100, 300, 'bird').setScale(2);
    bird.setCollideWorldBounds(true);

    this.anims.create({
        key: 'fly',
        frames: this.anims.generateFrameNumbers('bird', { start: 0, end: 2 }),
        frameRate: 10,
        repeat: -1
    });

    bird.play('fly');

    cursors = this.input.keyboard.createCursorKeys();
    this.input.on('pointerdown', flap);

    score = 0;
    scoreText = this.add.text(20, 20, "Score: 0", { fontSize: '24px', fill: '#fff' });
    highScoreText = this.add.text(200, 20, "High: 0", { fontSize: '18px', fill: '#fff' }).setOrigin(0.5, 0);

    music = this.sound.add('music', { loop: true, volume: 0.5 });
    flapSound = this.sound.add('flap');
    hitSound = this.sound.add('hit');
    burgerSound = this.sound.add('burgerSound');

    music.play();

    this.time.addEvent({ delay: 1500, callback: spawnPipes, callbackScope: this, loop: true });
    this.time.addEvent({ delay: 10000, callback: spawnBurger, callbackScope: this, loop: true });

    this.physics.add.collider(bird, pipes, hitPipe, null, this);
    this.physics.add.overlap(bird, cheeseburger, collectBurger, null, this);

    if (userId) {
        db.ref(`users/${userId}/highscore`).once('value').then(snapshot => {
            highScore = snapshot.val() || 0;
            highScoreText.setText("High: " + highScore);
        });
    }
}

function update() {
    if (gameOver) return;

    if (cursors.space.isDown) {
        flap();
    }

    pipes.getChildren().forEach(function(pipe) {
        if (pipe.x < -50) {
            pipe.destroy();
        }
    });

    cheeseburger.x -= 2;
    if (cheeseburger.x < -50) {
        cheeseburger.setPosition(-50, -50);
    }
}

function flap() {
    if (!gameOver) {
        bird.setVelocityY(-300);
        flapSound.play();
    }
}

function spawnPipes() {
    const centerY = Phaser.Math.Between(150, 450);
    const pipeTop = pipes.create(400, centerY - pipeGap / 2 - 320, 'pipe').setOrigin(0, 1).setScale(0.6).refreshBody();
    const pipeBottom = pipes.create(400, centerY + pipeGap / 2, 'pipe').setOrigin(0, 0).setScale(0.6).refreshBody();

    pipeTop.body.velocity.x = -200;
    pipeBottom.body.velocity.x = -200;

    pipeTop.scored = false;

    pipeTop.update = () => {
        if (!pipeTop.scored && pipeTop.x + pipeTop.width < bird.x) {
            pipeTop.scored = true;
            score++;
            scoreText.setText('Score: ' + score);
        }
    };
}

function spawnBurger() {
    if (Phaser.Math.Between(0, 100) < 10) {
        cheeseburger.setPosition(450, Phaser.Math.Between(100, 500));
        cheeseburger.body.velocity.x = -200;
    }
}

function collectBurger(player, burger) {
    burgerSound.play();
    score += 10;
    scoreText.setText('Score: ' + score);
    burger.setPosition(-50, -50);
}

function hitPipe() {
    if (gameOver) return;

    hitSound.play();
    music.stop();
    this.scene.pause();
    gameOver = true;

    if (score > highScore) {
        highScore = score;
        highScoreText.setText("High: " + highScore);
        if (userId) {
            db.ref(`users/${userId}/highscore`).set(highScore);
        }
    }

    const gameOverText = this.add.text(200, 300, 'GAME OVER', { fontSize: '36px', fill: '#f00' }).setOrigin(0.5);
    const retryText = this.add.text(200, 350, 'Retry', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5).setInteractive();
    const leaderboardText = this.add.text(200, 400, 'Leaderboard', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5).setInteractive();

    retryText.on('pointerdown', () => {
        this.scene.restart();
        gameOver = false;
    });

    leaderboardText.on('pointerdown', () => {
        location.reload();  // Simulates going back to the login/leaderboard screen
    });
}
