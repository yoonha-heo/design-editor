import { Layer, Rect, Stage } from "react-konva";

const ARTBOARD_WIDTH = 600;
const ARTBOARD_HEIGHT = 600;

export function Artboard() {
  return (
    <Stage width={ARTBOARD_WIDTH} height={ARTBOARD_HEIGHT}>
      <Layer>
        <Rect
          x={0}
          y={0}
          width={ARTBOARD_WIDTH}
          height={ARTBOARD_HEIGHT}
          fill="white"
          shadowBlur={16}
          shadowOpacity={0.15}
        />
      </Layer>
    </Stage>
  );
}
