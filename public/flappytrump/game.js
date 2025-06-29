// ✅ Full game.js — Flappy Trump with Twitter Login, Leaderboard, Profile Pictures, Score Fix, and All Bug Fixes

// Firebase is initialized in index.html 
let isMuted = false;

// Phaser Game Config
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

// Helper function for pixel text
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

// Preload Scene
function PreloadScene() { Phaser.Scene.call(this, { key: 'PreloadScene' }); }
PreloadScene.prototype = Object.create(Phaser.Scene.prototype);
PreloadScene.prototype.constructor = PreloadScene;
PreloadScene.prototype.preload = function () {
    this.load.image('background', 'https://files.catbox.moe/chw14r.png');
    this.load.image('pipe', 'https://files.catbox.moe/7mgltx.png');
    this.load.image('burger', 'https://files.catbox.moe/uif031.png');
    this.load.image('trump', 'https://files.catbox.moe/wlm5xw.png');
    this.load.audio('flap', 'https://files.catbox.moe/2oly9t.mp3');
    this.load.audio('hit', 'https://files.catbox.moe/2v2pm7.mp3');
    this.load.audio('burgerSound', 'https://files.catbox.moe/5c5st7.mp3');
    this.load.audio('bgm', 'https://files.catbox.moe/4eq3qy.mp3');
    this.load.image('maga', 'https://files.catbox.moe/pzmcm5.png');
    this.load.image('sparkle', 'https://files.catbox.moe/2hm9xw.png');
    this.load.audio('eagle', 'https://files.catbox.moe/ksi4ze.mp3');

};
PreloadScene.prototype.create = function () {
    this.scene.start('MenuScene');
};

// Menu Scene
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

// Game Scene
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

    this.magaText = pixelText(this, 200, 100, '', 24).setVisible(false);

    this.pipes = this.physics.add.group({ allowGravity: false, immovable: true });
    this.burgers = this.physics.add.group({ allowGravity: false });
    this.magaHats = this.physics.add.group({ allowGravity: false });
    this.sparkles = this.add.particles('sparkle');
    this.sparkleEmitter = null;
    this.isInvincible = false;


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
    // ✅ Fetch and display the global high score
    db.ref('scores').once('value').then(snapshot => {
        const leaderboard = [];
        snapshot.forEach(child => {
            const data = child.val();
            leaderboard.push({
                username: data.username,
                score: data.score
            });
        });

        leaderboard.sort((a, b) => b.score - a.score);
        const topEntry = leaderboard[0];
        this.highScore = topEntry ? topEntry.score : 0;
        this.highPlayer = topEntry ? topEntry.username : 'None';

        // Show the high score under the current score
        this.highScoreText = pixelText(this, 200, 60, `High: ${this.highScore} (${this.highPlayer})`, 14);
    });


    this.pipeCollider = this.physics.add.collider(this.trump, this.pipes, (trump, pipe) => {
        if (!this.isInvincible) {
            this.gameOver();
        }
    }, null, this);

    this.physics.add.overlap(this.trump, this.burgers, this.collectBurger, null, this);
    this.physics.add.overlap(this.trump, this.magaHats, this.collectMaga, null, this);

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

    if (Phaser.Math.Between(0, 1) === 0) {
        const maga = this.magaHats.create(400, topPipeY + gap / 2, 'maga');
        maga.body.velocity.x = -200;
    }

    bottomPipe.body.velocity.x = -200;

    if (Phaser.Math.Between(0, 9) === 0) {
    const pipeX = 400;
    const pipeSpacing = Phaser.Math.Between(200, 300);
    const nextPipeX = pipeX + pipeSpacing;
    const burgerX = Phaser.Math.Between(pipeX + 80, nextPipeX - 80);
    const burgerY = Phaser.Math.Between(80, 520);
    const burger = this.burgers.create(burgerX, burgerY, 'burger');
    burger.body.velocity.x = -200;
}
    bottomPipe.setSize(64, 450).setOffset(0, 0);

    if (Phaser.Math.Between(0, 9) === 0) {
        const burger = this.burgers.create(400, topPipeY + gap / 2, 'burger');
        burger.body.velocity.x = -200;
    }
};
GameScene.prototype.update = function () {
    this.bg.tilePositionX += 0.7;

    this.pipes.children.iterate(pipe => {
        if (!pipe.scored && pipe.x + pipe.width < this.trump.x) {
            pipe.scored = true;
            this.score++;
            this.scoreText.setText('Score: ' + this.score);
        }
    });

    
    this.pipes.children.iterate(pipe => {
        if (pipe && pipe.x + pipe.width < 0) {
            this.pipes.remove(pipe, true, true);
        }
    });
    
    this.magaHats.children.iterate(hat => {
        if (hat && hat.x + hat.width < 0) {
            this.magaHats.remove(hat, true, true);
        }
    });

    this.burgers.children.iterate(burger => {
        if (burger && burger.x + burger.width < 0) {
            this.burgers.remove(burger, true, true);
        }
    });


    if (this.trump.y > 600 || this.trump.y < 0) {
        this.gameOver();
    }
};
GameScene.prototype.collectBurger = function (trump, burger) {
    const popup = pixelText(this, trump.x, trump.y - 30, '+10', 12);
    this.tweens.add({
        targets: popup,
        y: popup.y - 30,
        alpha: 0,
        duration: 800,
        ease: 'Power1',
        onComplete: () => popup.destroy()
    });

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

// Game Over Scene
function GameOverScene() { Phaser.Scene.call(this, { key: 'GameOverScene' }); }
GameOverScene.prototype = Object.create(Phaser.Scene.prototype);
GameOverScene.prototype.constructor = GameOverScene;
GameOverScene.prototype.init = function (data) {
    this.finalScore = data.score;
};
GameOverScene.prototype.create = function () {
    this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'background').setOrigin(0);

    pixelText(this, 200, 200, 'Game Over', 18);
    pixelText(this, 200, 250, 'Score: ' + this.finalScore, 14);

    const userRef = db.ref('scores/' + currentUser.uid);
    userRef.once('value')
        .then(snapshot => {
            const existing = snapshot.val();
            if (!existing || this.finalScore > existing.score) {
                return userRef.set({
                    username: currentUser.displayName,
                    photoURL: currentUser.photoURL,
                    score: this.finalScore
                });
            }
        });

    const retryBtn = pixelText(this, 200, 320, 'Retry', 14).setInteractive();
    retryBtn.on('pointerdown', () => this.scene.start('GameScene'));

    const leaderboardBtn = pixelText(this, 200, 380, 'Leaderboard', 14).setInteractive();
    leaderboardBtn.on('pointerdown', () => this.scene.start('LeaderboardScene'));

    const logoutBtn = pixelText(this, 200, 440, 'Logout', 14).setInteractive();
    logoutBtn.on('pointerdown', () => logout());
    const shareBtn = pixelText(this, 200, 500, 'Share to X', 14).setInteractive();
    shareBtn.on('pointerdown', () => {
        const shareText = `I scored ${this.finalScore} in #FlappyTrump #UltraMAGA! 🇺🇸🦅\nCan you beat me?\nPlay 👉 https://flappytrump.ultramagaxrpl.com`;
        const twitterURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
        window.open(twitterURL, '_blank');
    });

};

// Leaderboard Scene
function LeaderboardScene() { Phaser.Scene.call(this, { key: 'LeaderboardScene' }); }
LeaderboardScene.prototype = Object.create(Phaser.Scene.prototype);
LeaderboardScene.prototype.constructor = LeaderboardScene;
LeaderboardScene.prototype.create = function () {
    this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'background').setOrigin(0);
    pixelText(this, 200, 80, 'Leaderboard', 18);

    db.ref('scores').once('value').then(snapshot => {
        const leaderboard = [];
        snapshot.forEach(child => {
            const data = child.val();
            leaderboard.push({
                uid: child.key,
                username: data.username,
                photoURL: data.photoURL,
                score: data.score
            });
        });

        leaderboard.sort((a, b) => b.score - a.score);
        leaderboard.splice(10); // ✅ Keep top 10

        if (leaderboard.length === 0) {
            pixelText(this, 200, 300, 'No scores yet!', 14);
            return;
        }

        leaderboard.forEach(entry => {
            const imgKey = 'pfp_' + entry.uid;
            if (entry.photoURL) {
                this.load.image(imgKey, entry.photoURL);
            }
        });

        this.load.once('complete', () => {
            leaderboard.forEach((entry, index) => {
                const y = 150 + index * 60;
                const imgKey = 'pfp_' + entry.uid;

                if (this.textures.exists(imgKey)) {
                    this.add.image(80, y, imgKey).setDisplaySize(40, 40);
                } else {
                    const graphics = this.add.graphics();
                    graphics.fillStyle(0xffffff, 1);
                    graphics.fillCircle(80, y, 20);
                }

                pixelText(this, 200, y, `${entry.username}`, 14);
                pixelText(this, 350, y, `${entry.score}`, 14);
            });
        });

        this.load.start();
    });

    const startBtn = pixelText(this, 200, 500, 'Start Game', 14).setInteractive();
    startBtn.on('pointerdown', () => this.scene.start('GameScene'));

    const logoutBtn = pixelText(this, 200, 550, 'Logout', 14).setInteractive();
    logoutBtn.on('pointerdown', () => logout());
};


GameScene.prototype.collectMaga = function (trump, maga) {
    maga.destroy();
    if (!isMuted) this.eagleSound.play();

    this.isInvincible = true;
    this.trump.setTint(0xFFA500);
    this.pipeCollider.active = false;

    this.magaText.setText('MAGA MODE').setVisible(true);

    let countdown = 5;
    const countdownTimer = this.time.addEvent({
        delay: 1000,
        repeat: 5,
        callback: () => {
            countdown--;
            if (countdown > 0) {
                this.magaText.setText(countdown.toString());
            } else {
                this.magaText.setVisible(false);
            }
        }
    });

    this.sparkleEmitter = this.sparkles.createEmitter({
        x: this.trump.x,
        y: this.trump.y,
        speed: { min: -30, max: 30 },
        lifespan: 500,
        quantity: 2,
        frequency: 100,
        scale: { start: 0.5, end: 0 },
        alpha: { start: 1, end: 0 },
        on: true
    });

    this.events.on('update', () => {
        if (this.sparkleEmitter) {
            this.sparkleEmitter.setPosition(this.trump.x, this.trump.y);
        }
    });

    this.time.addEvent({
        delay: 5000,
        callback: () => {
            this.isInvincible = false;
            this.trump.clearTint();
            this.pipeCollider.active = true;
            this.magaText.setVisible(false);
            if (this.sparkleEmitter) {
                this.sparkleEmitter.stop();
                this.sparkleEmitter = null;
            }
        }
    });
};

