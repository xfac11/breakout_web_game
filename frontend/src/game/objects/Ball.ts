import { GameObjects, Scene } from 'phaser';
import { Paddle } from './Paddle';

export class Ball extends GameObjects.Ellipse
{
    private readonly gameWidth: number;
    private readonly gameHeight: number;
    private readonly radius: number;
    private readonly speed = 420;
    private velocityX = 0;
    private velocityY = 0;
    private launched = false;

    constructor (scene: Scene, x: number, y: number, radius = 10)
    {
        super(scene, x, y, radius * 2, radius * 2, 0xffd700);

        this.gameWidth = scene.scale.width;
        this.gameHeight = scene.scale.height;
        this.radius = radius;
        scene.add.existing(this);
        this.setStrokeStyle(2, 0xffffff);
    }

    get isLaunched (): boolean
    {
        return this.launched;
    }

    launch (): void
    {
        if (this.launched)
        {
            return;
        }

        this.launched = true;
        this.velocityX = this.speed * 0.55;
        this.velocityY = -this.speed * 0.835;
    }

    update (paddle: Paddle, delta: number): void
    {
        if (!this.launched)
        {
            this.attachToPaddle(paddle);
            return;
        }

        const seconds = delta / 1000;
        this.x += this.velocityX * seconds;
        this.y += this.velocityY * seconds;

        this.bounceOffWalls();
        this.bounceOffPaddle(paddle);

        if (this.y - this.radius > this.gameHeight)
        {
            this.reset(paddle);
        }
    }

    reset (paddle: Paddle): void
    {
        this.launched = false;
        this.velocityX = 0;
        this.velocityY = 0;
        this.attachToPaddle(paddle);
    }

    private attachToPaddle (paddle: Paddle): void
    {
        this.x = paddle.x;
        this.y = paddle.y - paddle.height / 2 - this.radius - 2;
    }

    private bounceOffWalls (): void
    {
        if (this.x - this.radius <= 0)
        {
            this.x = this.radius;
            this.velocityX = Math.abs(this.velocityX);
        }
        else if (this.x + this.radius >= this.gameWidth)
        {
            this.x = this.gameWidth - this.radius;
            this.velocityX = -Math.abs(this.velocityX);
        }

        if (this.y - this.radius <= 0)
        {
            this.y = this.radius;
            this.velocityY = Math.abs(this.velocityY);
        }
    }

    private bounceOffPaddle (paddle: Paddle): void
    {
        if (this.velocityY >= 0)
        {
            const paddleLeft = paddle.x - paddle.width / 2;
            const paddleRight = paddle.x + paddle.width / 2;
            const paddleTop = paddle.y - paddle.height / 2;

            if (
                this.y + this.radius >= paddleTop
                && this.y - this.radius <= paddle.y + paddle.height / 2
                && this.x + this.radius >= paddleLeft
                && this.x - this.radius <= paddleRight
            )
            {
                const relativeHit = (this.x - paddle.x) / (paddle.width / 2);
                const clampedHit = Math.max(-1, Math.min(1, relativeHit));
                const angle = clampedHit * Math.PI / 3;
                const horizontalSpeed = this.speed * Math.sin(angle);

                this.x = Math.max(paddleLeft + this.radius, Math.min(paddleRight - this.radius, this.x));
                this.y = paddleTop - this.radius - 1;
                this.velocityX = horizontalSpeed;
                this.velocityY = -Math.abs(this.speed * Math.cos(angle));
            }
        }
    }
}
