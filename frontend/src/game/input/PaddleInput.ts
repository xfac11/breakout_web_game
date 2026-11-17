import { PaddleDirection } from '../PaddleDirection';

export interface PaddleInput
{
    getDirection (): PaddleDirection;
    destroy (): void;
}
