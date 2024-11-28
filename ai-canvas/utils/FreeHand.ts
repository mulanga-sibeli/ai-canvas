import { Shape } from "./Shape";
import {Point} from "../types/Point";

export class FreeHand extends Shape {
    path: Point[];

    constructor(startPoint: Point) {
        super(startPoint);
        this.path = [];
    }

    drawShape(ctx: CanvasRenderingContext2D, trace: Point[]) {
        let currentPoint = trace[trace.length - 1];
        this.path.push({ x: currentPoint.x, y: currentPoint.y } as Point)
        this.path.forEach((point, index) => {
            if (index === 0) {
                ctx.moveTo(point.x, point.y);
            } else {
                ctx.lineTo(point.x, point.y);
            }
        });
        ctx.stroke();
    }

    registerCursorOverlap(currentPoint: Point) {}

    finalizeShape(){
        this.path.push(this.endPoint)
    }
}
