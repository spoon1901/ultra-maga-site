
// ✅ Flappy Trump Game — Debug Version with Pixel Font Fix and Hitboxes On

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
const db = firebase.database();

let isMuted = false;

const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 },
            debug: true // ✅ Hitbox Debug ON
        }
    },
    scene: [PreloadScene, MenuScene, GameScene, GameOverScene, LeaderboardScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

const game = new Phaser.Game(config);

function pixelText(scene, x, y, text, size = 16) {
    return scene.add.text(x, y, text, {
        fontFamily: '"Press Start 2P"',
        fontSize: `${size}px`,
        color: '#FFFFFF',
        stroke: '#000000',
        strokeThickness: 4,
        align: 'center',
        resolution: 10
    }).setOrigin(0.5);
}

function PreloadScene() { Phaser.Scene.call(this, { key: 'PreloadScene' }); }
PreloadScene.prototype = Object.create(Phaser.Scene.prototype);
PreloadScene.prototype.constructor = PreloadScene;
PreloadScene.prototype.preload = function () {
    const self = this;
    this.readyCount = 0;

    WebFont.load({
        google: { families: ['Press Start 2P'] },
        active: function () { self.ready(); }
    });

    this.load.image('background', 'https://files.catbox.moe/chw14r.png');
    this.load.image('pipe', 'https://files.catbox.moe/qswcqq.png');
    this.load.image('burger', 'https://files.catbox.moe/hwbf07.png');
    this.load.spritesheet('bird', 'https://files.catbox.moe/7wbrf6.png', { frameWidth: 34, frameHeight: 24 });
    this.load.audio('flap', 'https://files.catbox.moe/2oly9t.mp3');
    this.load.audio('hit', 'https://files.catbox.moe/2v2pm7.mp3');
    this.load.audio('burgerSound', 'https://files.catbox.moe/5c5st7.mp3');
    this.load.audio('bgm', 'https://files.catbox.moe/4eq3qy.mp3');

    this.load.on('complete', () => {
        self.ready();
    });
};
PreloadScene.prototype.ready = function () {
    this.readyCount++;
    if (this.readyCount === 2) {
        this.scene.start('MenuScene');
    }
};

function MenuScene() { Phaser.Scene.call(this, { key: 'MenuScene' }); }
MenuScene.prototype = Object.create(Phaser.Scene.prototype);
MenuScene.prototype.constructor = MenuScene;
MenuScene.prototype.create = function () {
    this.add.image(200, 300, 'background').setScale(1.1);
    pixelText(this, 200, 120, 'Flappy Trump', 20);
    pixelText(this, 200, 160, 'Brought to you', 12);
    pixelText(this, 200, 180, 'by Ultra $MAGA', 12);

    const startBtn = pixelText(this, 200, 260, 'Start Game', 14).setInteractive();
    startBtn.on('pointerdown', () => this.scene.start('GameScene'));

    const leaderboardBtn = pixelText(this, 200, 320, 'Leaderboard', 14).setInteractive();
    leaderboardBtn.on('pointerdown', () => this.scene.start('LeaderboardScene'));

    const muteBtn = pixelText(this, 370, 30, isMuted ? '🔇' : '🔊', 12).setInteractive();
    muteBtn.on('pointerdown', () => {
        isMuted = !isMuted;
        muteBtn.setText(isMuted ? '🔇' : '🔊');
    });
};

function GameScene() { Phaser.Scene.call(this, { key: 'GameScene' }); }
GameScene.prototype = Object.create(Phaser.Scene.prototype);
GameScene.prototype.constructor = GameScene;
GameScene.prototype.create = function () {
    this.add.image(200, 300, 'background').setScale(1.1);

    this.bgm = this.sound.add('bgm', { loop: true, volume: 0.5 });
    if (!isMuted) this.bgm.play();

    this.flapSound = this.sound.add('flap');
    this.hitSound = this.sound.add('hit');
    this.burgerSound = this.sound.add('burgerSound');

    this.bird = this.physics.add.sprite(100, 300, 'bird').setScale(3).setOrigin(0.5);
    this.bird.setCollideWorldBounds(true);
    this.bird.body.gravity.y = 1000;

    this.input.on('pointerdown', () => {
        this.bird.setVelocityY(-350);
        if (!isMuted) this.flapSound.play();
    });

    this.pipes = this.physics.add.group({ allowGravity: false });
    this.burgers = this.physics.add.group({ allowGravity: false });

    this.score = 0;
    this.scoreText = pixelText(this, 200, 30, 'Score: 0', 14);

    this.timer = this.time.addEvent({
        delay: 1500,
        callback: this.spawnPipes,
        callbackScope: this,
        loop: true
    });

    this.physics.add.overlap(this.bird, this.pipes, this.gameOver, null, this);
    this.physics.add.overlap(this.bird, this.burgers, this.collectBurger, null, this);

    const muteBtn = pixelText(this, 370, 30, isMuted ? '🔇' : '🔊', 12).setInteractive();
    muteBtn.on('pointerdown', () => {
        isMuted = !isMuted;
        muteBtn.setText(isMuted ? '🔇' : '🔊');
        if (isMuted) this.bgm.pause();
        else this.bgm.resume();
    });
};

GameScene.prototype.spawnPipes = function () {
    const gap = 150;
    const y = Phaser.Math.Between(120, 400);

    const topPipe = this.pipes.create(400, y - gap / 2 - 320, 'pipe')
        .setOrigin(0, 0)
        .setFlipY(true)
        .setScale(0.5)
        .refreshBody();

    const bottomPipe = this.pipes.create(400, y + gap / 2, 'pipe')
        .setOrigin(0, 0)
        .setScale(0.5)
        .refreshBody();

    topPipe.body.velocity.x = -200;
    bottomPipe.body.velocity.x = -200;

    topPipe.scored = false;

    if (Phaser.Math.Between(0, 9) === 0) {
        const burger = this.burgers.create(400, y, 'burger').setScale(0.3);
        burger.body.velocity.x = -200;
    }
};

GameScene.prototype.update = function () {
    this.pipes.children.iterate(pipe => {
        if (!pipe.scored && pipe.x + pipe.width < this.bird.x) {
            pipe.scored = true;
            this.score++;
            this.scoreText.setText('Score: ' + this.score);
        }
    });

    if (this.bird.y > 600 || this.bird.y < 0) {
        this.gameOver();
    }
};

GameScene.prototype.collectBurger = function (bird, burger) {
    if (!isMuted) this.burgerSound.play();
    burger.destroy();
    this.score += 10;
    this.scoreText.setText('Score: ' + this.score);
};

GameScene.prototype.gameOver = function () {
    if (!isMuted) this.hitSound.play();
    this.bgm.stop();
    this.scene.start('GameOverScene', { score: this.score });
};

function GameOverScene() { Phaser.Scene.call(this, { key: 'GameOverScene' }); }
GameOverScene.prototype = Object.create(Phaser.Scene.prototype);
GameOverScene.prototype.constructor = GameOverScene;
GameOverScene.prototype.init = function (data) { this.score = data.score; };
GameOverScene.prototype.create = function () {
    this.add.image(200, 300, 'background').setScale(1.1);
    pixelText(this, 200, 100, 'Game Over', 20);
    pixelText(this, 200, 160, 'Score: ' + this.score, 14);

    const userRef = db.ref('leaderboard').push();
    userRef.set({ name: 'Guest', score: this.score });

    const retryBtn = pixelText(this, 200, 260, 'Retry', 14).setInteractive();
    retryBtn.on('pointerdown', () => this.scene.start('GameScene'));

    const leaderboardBtn = pixelText(this, 200, 320, 'Leaderboard', 14).setInteractive();
    leaderboardBtn.on('pointerdown', () => this.scene.start('LeaderboardScene'));

    const muteBtn = pixelText(this, 370, 30, isMuted ? '🔇' : '🔊', 12).setInteractive();
    muteBtn.on('pointerdown', () => {
        isMuted = !isMuted;
        muteBtn.setText(isMuted ? '🔇' : '🔊');
    });
};

function LeaderboardScene() { Phaser.Scene.call(this, { key: 'LeaderboardScene' }); }
LeaderboardScene.prototype = Object.create(Phaser.Scene.prototype);
LeaderboardScene.prototype.constructor = LeaderboardScene;
LeaderboardScene.prototype.create = function () {
    this.add.image(200, 300, 'background').setScale(1.1);
    pixelText(this, 200, 80, 'Leaderboard', 20);

    const startBtn = pixelText(this, 200, 500, 'Start Game', 14).setInteractive();
    startBtn.on('pointerdown', () => this.scene.start('GameScene'));

    const leaderboardRef = db.ref('leaderboard');
    leaderboardRef.orderByChild('score').limitToLast(10).once('value', snapshot => {
        const data = [];
        snapshot.forEach(child => {
            data.push(child.val());
        });
        data.reverse();
        data.forEach((entry, index) => {
            pixelText(this, 200, 130 + index * 30, (index + 1) + '. ' + entry.name + ' - ' + entry.score, 12);
        });
    });

    const muteBtn = pixelText(this, 370, 30, isMuted ? '🔇' : '🔊', 12).setInteractive();
    muteBtn.on('pointerdown', () => {
        isMuted = !isMuted;
        muteBtn.setText(isMuted ? '🔇' : '🔊');
    });
};
