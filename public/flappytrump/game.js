
// ✅ Full game.js — Flappy Trump with MAGA Mode, Leaderboard, Share to X, and +10 popup

let isMuted = false;

const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 },
            debug: false
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

// ---------------- Preload Scene ----------------
function PreloadScene() { Phaser.Scene.call(this, { key: 'PreloadScene' }); }
PreloadScene.prototype = Object.create(Phaser.Scene.prototype);
PreloadScene.prototype.constructor = PreloadScene;
PreloadScene.prototype.preload = function () {
    this.load.image('background', 'https://files.catbox.moe/chw14r.png');
    this.load.image('pipe', 'https://files.catbox.moe/7mgltx.png');
    this.load.image('burger', 'https://files.catbox.moe/uif031.png');
    this.load.image('magaHat', 'https://files.catbox.moe/3zv4y9.png');
    this.load.image('trump', 'https://files.catbox.moe/wlm5xw.png');
    this.load.audio('flap', 'https://files.catbox.moe/2oly9t.mp3');
    this.load.audio('hit', 'https://files.catbox.moe/2v2pm7.mp3');
    this.load.audio('burgerSound', 'https://files.catbox.moe/5c5st7.mp3');
    this.load.audio('eagle', 'https://files.catbox.moe/6vkm2r.mp3');
    this.load.audio('bgm', 'https://files.catbox.moe/4eq3qy.mp3');
};
PreloadScene.prototype.create = function () {
    this.scene.start('MenuScene');
};

// ---------------- Menu Scene ----------------
function MenuScene() { Phaser.Scene.call(this, { key: 'MenuScene' }); }
MenuScene.prototype = Object.create(Phaser.Scene.prototype);
MenuScene.prototype.constructor = MenuScene;
MenuScene.prototype.create = function () {
    this.bg = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'background').setOrigin(0);
    pixelText(this, 200, 80, 'Flappy Trump', 32);
    pixelText(this, 200, 130, 'Brought to you', 16);
    pixelText(this, 200, 150, 'by Ultra $MAGA', 16);

    const startButton = pixelText(this, 200, 220, 'Start Game', 24).setInteractive();
    startButton.on('pointerdown', () => this.scene.start('GameScene'));

    const leaderboardButton = pixelText(this, 200, 270, 'Leaderboard', 24).setInteractive();
    leaderboardButton.on('pointerdown', () => this.scene.start('LeaderboardScene'));

    const logoutButton = pixelText(this, 200, 320, 'Logout', 14).setInteractive();
    logoutButton.on('pointerdown', () => logout());
};
MenuScene.prototype.update = function () {
    this.bg.tilePositionX += 0.5;
};

// ---------------- GameOver Scene ----------------
function GameOverScene() { Phaser.Scene.call(this, { key: 'GameOverScene' }); }
GameOverScene.prototype = Object.create(Phaser.Scene.prototype);
GameOverScene.prototype.constructor = GameOverScene;
GameOverScene.prototype.init = function (data) {
    this.finalScore = data.score;
};
GameOverScene.prototype.create = function () {
    this.bg = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'background').setOrigin(0);

    pixelText(this, 200, 80, 'Game Over', 32);
    pixelText(this, 200, 140, 'Score: ' + this.finalScore, 16);

    const retryBtn = pixelText(this, 200, 250, 'Retry', 14).setInteractive();
    retryBtn.on('pointerdown', () => this.scene.start('GameScene'));

    const leaderboardBtn = pixelText(this, 200, 300, 'Leaderboard', 14).setInteractive();
    leaderboardBtn.on('pointerdown', () => this.scene.start('LeaderboardScene'));

    const logoutBtn = pixelText(this, 200, 350, 'Logout', 14).setInteractive();
    logoutBtn.on('pointerdown', () => logout());

    const shareBtn = pixelText(this, 200, 400, 'Share to X', 14).setInteractive();
    shareBtn.on('pointerdown', () => {
        const shareText = `I scored ${this.finalScore} in #FlappyTrump! 🇺🇸🦅#UltraMAGA\nCan you beat me?\nPlay 👉 https://flappytrump.ultramagaxrpl.com`;
        const twitterURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
        window.open(twitterURL, '_blank');
    });
};
GameOverScene.prototype.update = function () {
    this.bg.tilePositionX += 0.5;
};

// ---------------- Game Scene ----------------
function GameScene() { Phaser.Scene.call(this, { key: 'GameScene' }); }
GameScene.prototype = Object.create(Phaser.Scene.prototype);
GameScene.prototype.constructor = GameScene;
GameScene.prototype.create = function () {
    this.bg = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'background').setOrigin(0);

    this.bgm = this.sound.add('bgm', { loop: true, volume: 0.5 });
    if (!isMuted) this.bgm.play();

    this.flapSound = this.sound.add('flap');
    this.hitSound = this.sound.add('hit');
    this.burgerSound = this.sound.add('burgerSound');
    this.eagleSound = this.sound.add('eagle');

    this.isInvincible = false;

    this.pipes = this.physics.add.group({ allowGravity: false, immovable: true });
    this.burgers = this.physics.add.group({ allowGravity: false });

    this.trump = this.physics.add.sprite(100, 245, 'trump').setOrigin(0.5);
    this.trump.setSize(50, 50).setOffset(7, 7);
    this.trump.setCollideWorldBounds(true);

    this.input.on('pointerdown', () => {
        this.trump.setVelocityY(-350);
        if (!isMuted) this.flapSound.play();
    });

    this.timer = this.time.addEvent({
        delay: 1500,
        callback: this.spawnPipes,
        callbackScope: this,
        loop: true
    });

    this.score = 0;
    this.scoreText = pixelText(this, 200, 30, 'Score: 0', 14);

    this.physics.add.collider(this.trump, this.pipes, () => {
        if (!this.isInvincible) this.gameOver();
    }, null, this);

    this.physics.add.overlap(this.trump, this.burgers, this.collectBurger, null, this);
};
GameScene.prototype.spawnPipes = function () {
    const gap = 160;
    const minPipeY = 100;
    const maxPipeY = 350;

    const topPipeY = Phaser.Math.Between(minPipeY, maxPipeY);
    const bottomPipeY = topPipeY + gap;

    const topPipe = this.pipes.create(400, topPipeY, 'pipe').setOrigin(0, 1).setFlipY(true);
    topPipe.body.velocity.x = -200;
    topPipe.setSize(64, 450).setOffset(0, 0);
    topPipe.scored = false;

    const bottomPipe = this.pipes.create(400, bottomPipeY, 'pipe').setOrigin(0, 0);
    bottomPipe.body.velocity.x = -200;
    bottomPipe.setSize(64, 450).setOffset(0, 0);

    if (Phaser.Math.Between(0, 9) === 0) {
        const pipeX = 400;
        const pipeSpacing = Phaser.Math.Between(200, 300);
        const nextPipeX = pipeX + pipeSpacing;
        const burgerX = Phaser.Math.Between(pipeX + 80, nextPipeX - 80);
        const burgerY = Phaser.Math.Between(80, 520);
        const burger = this.burgers.create(burgerX, burgerY, 'burger');
        burger.body.velocity.x = -200;
    }

    if (Phaser.Math.Between(0, 1) === 0) {
        const pipeX = 400;
        const pipeSpacing = Phaser.Math.Between(200, 300);
        const nextPipeX = pipeX + pipeSpacing;
        const magaX = Phaser.Math.Between(pipeX + 80, nextPipeX - 80);
        const magaY = Phaser.Math.Between(80, 520);
        const maga = this.burgers.create(magaX, magaY, 'magaHat');
        maga.body.velocity.x = -200;
        maga.isMaga = true;
    }
};
GameScene.prototype.collectBurger = function (trump, burger) {
    if (burger.isMaga) {
        if (!this.isInvincible) {
            this.isInvincible = true;
            this.trump.setTint(0xFFA500);
            if (this.eagleSound) this.eagleSound.play();
            this.time.delayedCall(5000, () => {
                this.isInvincible = false;
                this.trump.clearTint();
            });
        }
    } else {
        const popup = pixelText(this, trump.x, trump.y - 30, '+10', 12);
        this.tweens.add({
            targets: popup,
            y: popup.y - 30,
            alpha: 0,
            duration: 800,
            ease: 'Power1',
            onComplete: () => popup.destroy()
        });
        burger.destroy();
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);
    }
};
GameScene.prototype.update = function () {
    this.bg.tilePositionX += 0.7;

    this.pipes.children.iterate(pipe => {
        if (pipe && !pipe.scored && pipe.x + pipe.width < this.trump.x) {
            pipe.scored = true;
            this.score++;
            this.scoreText.setText('Score: ' + this.score);
        }
        if (pipe && pipe.x + pipe.width < 0) {
            this.pipes.remove(pipe, true, true);
        }
    });

    this.burgers.children.iterate(burger => {
        if (burger && burger.x + burger.width < 0) {
            this.burgers.remove(burger, true, true);
        }
    });

    if (this.trump.y > 600 || this.trump.y < 0) {
        if (!this.isInvincible) this.gameOver();
    }
};
GameScene.prototype.gameOver = function () {
    if (!isMuted) this.hitSound.play();
    this.bgm.stop();
    this.scene.start('GameOverScene', { score: this.score });
};

// ---------------- Leaderboard Scene ----------------
function LeaderboardScene() { Phaser.Scene.call(this, { key: 'LeaderboardScene' }); }
LeaderboardScene.prototype = Object.create(Phaser.Scene.prototype);
LeaderboardScene.prototype.constructor = LeaderboardScene;
LeaderboardScene.prototype.create = function () {
    this.bg = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'background').setOrigin(0);

    pixelText(this, 200, 50, 'Top Patriots', 20);

    const backButton = pixelText(this, 200, 550, 'Back', 14).setInteractive();
    backButton.on('pointerdown', () => this.scene.start('MenuScene'));

    const scoresRef = firebase.database().ref('scores').orderByChild('score').limitToLast(10);

    scoresRef.once('value').then(snapshot => {
        const data = [];
        snapshot.forEach(child => {
            data.unshift(child.val());
        });

        data.forEach((entry, index) => {
            const y = 100 + index * 40;
            this.add.image(50, y, 'pipe').setScale(0.15).setOrigin(0.5);
            this.add.image(100, y, 'pipe').setScale(0.15).setOrigin(0.5);
            this.add.image(150, y, 'pipe').setScale(0.15).setOrigin(0.5);
            this.add.image(200, y, 'pipe').setScale(0.15).setOrigin(0.5);

            this.add.image(250, y, 'pipe').setScale(0.15).setOrigin(0.5);
            pixelText(this, 200, y, `${entry.username}: ${entry.score}`, 12);
        });
    });
};
LeaderboardScene.prototype.update = function () {
    this.bg.tilePositionX += 0.5;
};
