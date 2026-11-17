import type { MapObjectData } from "../types";
import tower from "../assets/tower.png";
import transformer from "../assets/transformator.png";
import house from "../assets/house.png";
import tree from "../assets/tree.png";

type Props = {
  object: MapObjectData;
  selected: boolean;
};

const images = {
  pole: tower,
  transformer,
  house,
  tree,
};

function MapObject({ object, selected }: Props) {
  return (
    <g
      data-object-id={object.id}
      transform={`translate(${object.x} ${object.y})`}
      style={{ cursor: "pointer" }}
    >
      {selected && (
        <rect
            x="-35"
            y="-35"
            width="70"
            height="70"
            rx="8"
            fill="none"
            stroke="#55B9F3"
            strokeWidth="2"
        />
      )}
      <image
        href={images[object.type]}
        x={object.type === "tree" ? -17 : -30}
        y={object.type === "tree" ? -17 : -30}
        width={object.type === "tree" ? 34 : 60}
        height={object.type === "tree" ? 34 : 60}
        preserveAspectRatio="xMidYMid meet"
      />
    </g>
  );
}

export default MapObject;