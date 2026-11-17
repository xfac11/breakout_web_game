import { GameObjects, Math as PhaserMath, Scene } from 'phaser';
import { PaddleDirection } from '../PaddleDirection';

export class Paddle extends GameObjects.Rectangle
{
    private readonly gameWidth: number;
    private readonly speed: number;

    constructor (scene: Scene, x: number, y: number, width: number, height: number, speed = 500)
    {
        super(scene, x, y, width, height, 0xffffff);

        this.gameWidth = scene.scale.width;
        this.speed = speed;
        this.setOrigin(0.5);
        scene.add.existing(this);
    }

    move (direction: PaddleDirection, delta: number): void
    {
        if (direction === 'left')
        {
            this.x -= this.speed * delta / 1000;
        }
        else if (direction === 'right')
        {
            this.x += this.speed * delta / 1000;
        }

        this.x = PhaserMath.Clamp(this.x, this.width / 2, this.gameWidth - this.width / 2);
    }
}
