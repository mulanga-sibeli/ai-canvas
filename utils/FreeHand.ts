import { Shape } from "./Shape";
import { Point } from "../types/Point";

export class FreeHand extends Shape {
    path: Point[];

    constructor(startPoint: Point, strokeWidth?: number, strokeColor?: string) {
        super(startPoint, strokeWidth, strokeColor);
        this.path = [];
    }

    drawShape(ctx: CanvasRenderingContext2D, trace: Point[]) {
        let currentPoint = trace[trace.length - 1];
        this.path.push({ x: currentPoint.x, y: currentPoint.y } as Point);

        if (this.path.length > 2) {
            ctx.beginPath();
            ctx.moveTo(this.path[0].x, this.path[0].y);

            for (let i = 1; i < this.path.length - 2; i++) {
                const cp = {
                    x: (this.path[i].x + this.path[i + 1].x) / 2,
                    y: (this.path[i].y + this.path[i + 1].y) / 2
                };
                ctx.quadraticCurveTo(this.path[i].x, this.path[i].y, cp.x, cp.y);
            }

            const lastPoint = this.path[this.path.length - 1];
            const secondLastPoint = this.path[this.path.length - 2];
            ctx.quadraticCurveTo(secondLastPoint.x, secondLastPoint.y, lastPoint.x, lastPoint.y);
            ctx.lineWidth = this.strokeWidth;
            ctx.strokeStyle = this.strokeColor;
            ctx.stroke();
        }
    }

    registerCursorOverlap(currentPoint: Point) {}

    finalizeShape(){
        this.path.push(this.endPoint)
    }
}
