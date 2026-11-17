import { Scene } from 'phaser';
import { PaddleDirection } from '../PaddleDirection';
import { PaddleInput } from './PaddleInput';

export class TouchPaddleInput implements PaddleInput
{
    private readonly scene: Scene;
    private readonly pointers = new Map<number, number>();
    private readonly onPointerDown = (pointer: Phaser.Input.Pointer) =>
    {
        this.pointers.set(pointer.id, pointer.x);
    };
    private readonly onPointerMove = (pointer: Phaser.Input.Pointer) =>
    {
        if (this.pointers.has(pointer.id))
        {
            this.pointers.set(pointer.id, pointer.x);
        }
    };
    private readonly onPointerUp = (pointer: Phaser.Input.Pointer) =>
    {
        this.pointers.delete(pointer.id);
    };

    constructor (scene: Scene)
    {
        this.scene = scene;
        scene.input.on('pointerdown', this.onPointerDown);
        scene.input.on('pointermove', this.onPointerMove);
        scene.input.on('pointerup', this.onPointerUp);
        scene.input.on('pointerupoutside', this.onPointerUp);
    }

    getDirection (): PaddleDirection
    {
        const midpoint = this.scene.scale.width / 2;
        let leftPressed = false;
        let rightPressed = false;

        for (const x of this.pointers.values())
        {
            if (x < midpoint)
            {
                leftPressed = true;
            }
            else
            {
                rightPressed = true;
            }
        }

        if (leftPressed === rightPressed)
        {
            return 'none';
        }

        return leftPressed ? 'left' : 'right';
    }

    destroy (): void
    {
        this.scene.input.off('pointerdown', this.onPointerDown);
        this.scene.input.off('pointermove', this.onPointerMove);
        this.scene.input.off('pointerup', this.onPointerUp);
        this.scene.input.off('pointerupoutside', this.onPointerUp);
        this.pointers.clear();
    }
}
