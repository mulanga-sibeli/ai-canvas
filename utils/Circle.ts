import { Shape } from "./Shape";
import { TransformMatrix } from "./TransformationMatrix";
import { Point } from "@/types/Point";
import { TransformationType } from "@/types/TransformationType";
import { CanvasConstants } from "@/constants/CanvasConfigValues";
import { Colors } from "@/constants/Colors";

export class Circle extends Shape {
    radius: number;

    constructor(startPoint: Point, radius?: number, strokeWidth?: number, strokeColor?: string) {
        super(startPoint, strokeWidth, strokeColor);
        this.radius = radius || 0;
    }

    drawShape(ctx: CanvasRenderingContext2D, trace: Point[]) {
        ctx.beginPath();
        if (this.isSelected) {
            if(this.boundingCorners.length == 0){
                for (let i = -1; i < 2; i += 2) {
                    const dy = (this.radius + CanvasConstants.TRANSFORM_BOUNDING_BOX_PADDING) * i;
                    this.boundingCorners.push(
                        new Circle({x: this.startPoint.x + dy, y: this.startPoint.y + dy}, this.radius),
                        new Circle({x: this.startPoint.x + (dy * -1), y: this.startPoint.y + dy}, this.radius),
                    )
                }
            }

            let dx = trace[trace.length - 1].x - this.startPoint.x;
            let dy = trace[trace.length - 1].y - this.startPoint.y;

            switch(this.latestTransform){
                case TransformationType.Translation:
                    const translationMatrix = TransformMatrix.identity().translate(dx, dy);
                    this.transformMatrix = this.transformMatrix.translate(dx, dy);
                    this.boundingCorners.forEach(cornerPoint => {
                        cornerPoint.startPoint = translationMatrix.transformPoint(cornerPoint.startPoint);
                    })
                    this.startPoint = translationMatrix.transformPoint(this.startPoint);
                    this.endPoint = translationMatrix.transformPoint(this.endPoint);
                    this.transformHandle.startPoint = translationMatrix.transformPoint(this.transformHandle.startPoint);
                    break;

                case TransformationType.Rotation:
                    const angleOfRotation1 = Math.atan2(dy, dx);

                    const dx2 = this.transformHandle.startPoint.x - this.startPoint.x;
                    const dy2 = this.transformHandle.startPoint.y - this.startPoint.y;
                    const angleOfRotation2 = Math.atan2(dy2, dx2);

                    this.transformMatrix = this.transformMatrix.rotate(angleOfRotation1 - angleOfRotation2);
                    const rotationMatrix = TransformMatrix.identity().rotate(angleOfRotation1 - angleOfRotation2);
                    this.boundingCorners.forEach(cornerPoint => {
                        const rotatedPoint = rotationMatrix.transformPoint({ x: cornerPoint.startPoint.x - this.startPoint.x, y: cornerPoint.startPoint.y - this.startPoint.y });
                        cornerPoint.startPoint = { x: rotatedPoint.x + this.startPoint.x, y: rotatedPoint.y + this.startPoint.y };
                    })
                    this.transformHandle.startPoint = trace[trace.length - 1];
                    break;
                case TransformationType.Scaling:
                    if (trace.length < 2) return;
                    let grabbedCornerPoint = this.boundingCorners.find(corner => corner.isSelected);
                    if (!grabbedCornerPoint) return;

                    let deltaX = trace[trace.length - 1].x - grabbedCornerPoint.startPoint.x;
                    let deltaY = trace[trace.length - 1].y - grabbedCornerPoint.startPoint.y;

                    if (this.boundingCorners.indexOf(grabbedCornerPoint) === 0) {
                        deltaY *= -1;
                        deltaX *= -1;
                    }
                    if (this.boundingCorners.indexOf(grabbedCornerPoint) === 3) deltaX *= -1;

                    let scaleFactor = grabbedCornerPoint.startPoint.x !== 0 ? deltaX / grabbedCornerPoint.startPoint.x :
                                      grabbedCornerPoint.startPoint.y !== 0 ? deltaY / grabbedCornerPoint.startPoint.y : 1;
                    scaleFactor += 1;
                    const scalingMatrix = TransformMatrix.identity().scale(scaleFactor, scaleFactor, this.startPoint);

                    this.boundingCorners.forEach(corner => {
                        corner.startPoint = scalingMatrix.transformPoint(corner.startPoint);
                    });

                    this.startPoint = scalingMatrix.transformPoint(this.startPoint);
                    this.endPoint = scalingMatrix.transformPoint(this.endPoint);
                    this.transformHandle.startPoint = scalingMatrix.transformPoint(this.transformHandle.startPoint);

                    this.radius = Math.sqrt(
                        Math.pow(this.endPoint.x - this.startPoint.x, 2) +
                        Math.pow(this.endPoint.y - this.startPoint.y, 2)
                    );
                    this.height = this.radius * 2;
                    this.width = this.radius * 2;

                    this.transformMatrix = this.transformMatrix.scale(scaleFactor, scaleFactor, this.transformHandle.startPoint);
                    break;
            }

            ctx.save();
            ctx.lineWidth = 0.5;
            ctx.strokeStyle = Colors.canvas.boundingBox;
            ctx.setLineDash(CanvasConstants.BOUNDING_BOX_DASH);
            ctx.moveTo(this.boundingCorners[0].startPoint.x, this.boundingCorners[0].startPoint.y);
            this.boundingCorners.forEach((cornerPoint, index) => {
                if (index > 0) {
                    ctx.lineTo(cornerPoint.startPoint.x, cornerPoint.startPoint.y);
                }
            });

            ctx.closePath();
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(this.startPoint.x, this.startPoint.y);
            ctx.lineTo(this.transformHandle.startPoint.x, this.transformHandle.startPoint.y);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(this.transformHandle.startPoint.x, this.transformHandle.startPoint.y, this.transformHandle.radius, 0, 2 * Math.PI);
            ctx.fillStyle = Colors.canvas.boundingBox;
            ctx.fill();

            ctx.fillStyle = Colors.canvas.scalingCorners;
            ctx.setLineDash([]);
            this.boundingCorners.forEach(cornerPoint => {
                ctx.beginPath();
                ctx.arc(cornerPoint.startPoint.x, cornerPoint.startPoint.y, this.transformHandle.radius, 0, 2 * Math.PI);
                ctx.fill();
                ctx.stroke();
            });

            ctx.restore();
            ctx.beginPath();
        }
        else{
            this.radius = Math.sqrt(Math.pow(trace[0].x - this.startPoint.x, 2) + Math.pow(trace[0].y - this.startPoint.y, 2));
            this.height = this.radius * 2;
            this.width = this.radius * 2;
        }

        ctx.arc(this.startPoint.x, this.startPoint.y, this.radius, 0, 2 * Math.PI);
        ctx.lineWidth = this.strokeWidth;
        ctx.strokeStyle = this.strokeColor;
        ctx.stroke();
    }

    registerCursorOverlap(currentPoint: Point) {
        const centerToPoint = Math.sqrt(Math.pow(currentPoint.x - this.startPoint.x, 2) + Math.pow(currentPoint.y - this.startPoint.y, 2))
        const shapeOverlap = centerToPoint - this.radius <= CanvasConstants.AREA_OF_ACCEPTANCE;
        if (this.isSelected){
            switch(true){
                case this.isCursorOverlappingHandle(currentPoint):
                    this.isTransformHandleSelected = true;
                    return;
                case this.isCursorOverlappingScalingCorners(currentPoint):
                    this.isBorderSelected = true;
                    return;
                case !shapeOverlap:
                    this.isSelected = false;
                    return;
            }
        }
        if(shapeOverlap) this.isSelected = true;
    }

    finalizeShape() {
        this.radius = Math.sqrt(Math.pow(this.endPoint.x - this.startPoint.x, 2) + Math.pow(this.endPoint.y - this.startPoint.y, 2))
        this.height = this.radius * 2;
        this.width = this.radius * 2;
    }
}
