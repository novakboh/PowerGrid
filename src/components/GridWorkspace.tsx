import { useEffect, useRef, useState } from "react";
import type { PointerEvent, WheelEvent } from "react";
import type { MapObjectData, MapAreaData, PowerLineData, ToolType, MapObjectType, VoltageType, NetworkStats, } from "../types";
import MapObject from "./MapObject";
import "./GridWorkspace.css";

type Props = {
  selectedTool: ToolType;
  selectedVoltage: VoltageType;
  onStatsChange: (stats: NetworkStats) => void;
};

function GridWorkspace({ selectedTool, selectedVoltage, onStatsChange }: Props) {
  const [view, setView] = useState({
    scale: 1,
    x: 0,
    y: 0,
  });

  const [objects, setObjects] = useState<MapObjectData[]>([]);
  const [selectedObject, setSelectedObject] = useState<string | null>(null);

  const [areas, setAreas] = useState<MapAreaData[]>([]);
  const [drawingPoints, setDrawingPoints] = useState<
    { x: number; y: number }[]
  >([]);

  const [lines, setLines] = useState<PowerLineData[]>([]);
  const [lineStart, setLineStart] = useState<string | null>(null);

  useEffect(() => {
    const totalLength = lines.reduce((total, line) => {
      const start = objects.find((obj) => obj.id === line.startId);
      const end = objects.find((obj) => obj.id === line.endId);

      if (!start || !end) return total;

      return total + Math.hypot(
        end.x - start.x,
        end.y - start.y
      );
    }, 0);

    onStatsChange({
      poles: objects.filter((obj) => obj.type === "pole").length,
      lines: lines.length,
      length: totalLength,
      transformers: objects.filter(
        (obj) => obj.type === "transformer"
      ).length,
    });
  }, [objects, lines, onStatsChange]);

  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const dragObject = useRef<string | null>(null);
  const panStart = useRef<{ x: number; y: number } | null>(null);

  const objectNames: Record<MapObjectType, string> = {
    pole: "Електрична опора",
    transformer: "Трансформатор",
    house: "Житловий будинок",
    tree: "Дерево",
  };

  const getCoordinates = (
    e: PointerEvent<SVGSVGElement>
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const x = ((e.clientX - rect.left) / rect.width) * 1250;
    const y = ((e.clientY - rect.top) / rect.height) * 860;

    return {
      x: (x - view.x) / view.scale,
      y: (y - view.y) / view.scale,
    };
  };

  const hasOverlap = (
    points: { x: number; y: number }[],
    type: "road" | "water"
  ) => {
    const padding = type === "road" ? 10 : 0;

    const minX = Math.min(...points.map((p) => p.x)) - padding;
    const maxX = Math.max(...points.map((p) => p.x)) + padding;
    const minY = Math.min(...points.map((p) => p.y)) - padding;
    const maxY = Math.max(...points.map((p) => p.y)) + padding;

    const overlaps = (
      x1: number,
      y1: number,
      x2: number,
      y2: number
    ) => minX < x2 && maxX > x1 && minY < y2 && maxY > y1;

    for (const obj of objects) {
      if (
        overlaps(
          obj.x - 30,
          obj.y - 30,
          obj.x + 30,
          obj.y + 30
        )
      ) {
        return true;
      }
    }

    for (const area of areas) {
      const xs = area.points.map((p) => p.x);
      const ys = area.points.map((p) => p.y);

      if (
        overlaps(
          Math.min(...xs) - 10,
          Math.min(...ys) - 10,
          Math.max(...xs) + 10,
          Math.max(...ys) + 10
        )
      ) {
        return true;
      }
    }

    return false;
  };

  const handleWheel = (e: WheelEvent<SVGSVGElement>) => {
    e.preventDefault();

    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * 1250;
    const mouseY = ((e.clientY - rect.top) / rect.height) * 860;

    setView((prev) => {
      const newScale = Math.min(
        3,
        Math.max(0.5, prev.scale * (e.deltaY < 0 ? 1.1 : 0.9))
      );

      const ratio = newScale / prev.scale;

      return {
        scale: newScale,
        x: mouseX - (mouseX - prev.x) * ratio,
        y: mouseY - (mouseY - prev.y) * ratio,
      };
    });
  };

  const handlePointerDown = (e: PointerEvent<SVGSVGElement>) => {
    if (e.button === 1) {
      e.preventDefault();

      panStart.current = {
        x: e.clientX,
        y: e.clientY,
      };

      e.currentTarget.setPointerCapture(e.pointerId);
      return;
    }

    if (e.button !== 0) return;

    const target = e.target as Element;
    const objectElement = target.closest("[data-object-id]");
    const objectId = objectElement?.getAttribute("data-object-id");

    if (objectId) {
      if (selectedTool === "delete") {
        setObjects((prev) => prev.filter((obj) => obj.id !== objectId));
        setAreas((prev) => prev.filter((area) => area.id !== objectId));
        setLines((prev) =>
          prev.filter(
            (line) =>
              line.id !== objectId &&
              line.startId !== objectId &&
              line.endId !== objectId
          )
        );
        setSelectedObject(null);
        setLineStart(null);
        return;
      }

      if (selectedTool === "line") {
        const endpoint = objects.find(
          (obj) =>
            obj.id === objectId &&
            (obj.type === "pole" || obj.type === "transformer")
        );

        if (!endpoint) return;

        if (!lineStart) {
          setLineStart(objectId);
          return;
        }

        if (lineStart === objectId) return;

        const duplicate = lines.some(
          (line) =>
            (line.startId === lineStart && line.endId === objectId) ||
            (line.startId === objectId && line.endId === lineStart)
        );

        if (!duplicate) {
          setLines((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              startId: lineStart,
              endId: objectId,
              voltage: selectedVoltage,
            },
          ]);
        }

        setLineStart(null);
        return;
      }

      if (selectedTool === "select") {
        setSelectedObject(objectId);
        dragObject.current = objectId;
        dragStart.current = {
          x: e.clientX,
          y: e.clientY,
        };
        e.currentTarget.setPointerCapture(e.pointerId);
      }

      return;
    }

    if (selectedTool === "line") {
      return;
    }

    if (selectedTool === "select") {
      setSelectedObject(null);
      setLineStart(null);
      return;
    }

    if (selectedTool === "delete") return;

    if (selectedTool === "road" || selectedTool === "water") {
      const coords = getCoordinates(e);

      setDrawingPoints([coords]);
      e.currentTarget.setPointerCapture(e.pointerId);
      return;
    }

    if (
      selectedTool === "pole" ||
      selectedTool === "transformer" ||
      selectedTool === "house" ||
      selectedTool === "tree"
    ) {
      const type = selectedTool as MapObjectType;
      const coords = getCoordinates(e);

      const newObject: MapObjectData = {
        id: crypto.randomUUID(),
        type,
        name: objectNames[type],
        x: coords.x,
        y: coords.y,
      };

      setObjects((prev) => [...prev, newObject]);
      setSelectedObject(newObject.id);
    }
  };

  const handlePointerMove = (e: PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();

    if (drawingPoints.length > 0) {
      const coords = getCoordinates(e);

      setDrawingPoints((prev) => {
        const last = prev[prev.length - 1];

        const distance = Math.hypot(
          coords.x - last.x,
          coords.y - last.y
        );

        if (distance < 5) return prev;

        return [...prev, coords];
      });

      return;
    }

    if (panStart.current) {
      const dx = ((e.clientX - panStart.current.x) / rect.width) * 1250;
      const dy = ((e.clientY - panStart.current.y) / rect.height) * 860;

      panStart.current = {
        x: e.clientX,
        y: e.clientY,
      };

      setView((prev) => ({
        ...prev,
        x: prev.x + dx,
        y: prev.y + dy,
      }));

      return;
    }

    if (dragObject.current && dragStart.current) {
      const dx =
        ((e.clientX - dragStart.current.x) / rect.width) *
        1250 /
        view.scale;

      const dy =
        ((e.clientY - dragStart.current.y) / rect.height) *
        860 /
        view.scale;

      dragStart.current = {
        x: e.clientX,
        y: e.clientY,
      };

      const id = dragObject.current;

      setObjects((prev) =>
        prev.map((obj) =>
          obj.id === id
            ? { ...obj, x: obj.x + dx, y: obj.y + dy }
            : obj
        )
      );

      setAreas((prev) =>
        prev.map((area) =>
          area.id === id
            ? {
                ...area,
                points: area.points.map((p) => ({
                  x: p.x + dx,
                  y: p.y + dy,
                })),
              }
            : area
        )
      );
    }
  };

  const handlePointerUp = () => {
    if (drawingPoints.length > 0) {
      const minPoints = selectedTool === "water" ? 3 : 2;

      if (
        drawingPoints.length >= minPoints &&
        !hasOverlap(drawingPoints, selectedTool as "road" | "water")
      ) {
        const newArea: MapAreaData = {
          id: crypto.randomUUID(),
          type: selectedTool as "road" | "water",
          points: drawingPoints,
        };

        setAreas((prev) => [...prev, newArea]);
      }

      setDrawingPoints([]);
    }

    panStart.current = null;
    dragStart.current = null;
    dragObject.current = null;
  };

  return (
    <svg
      className="grid-workspace"
      viewBox="0 0 1250 860"
      preserveAspectRatio="none"
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <defs>
        <pattern
          id="grid"
          width="25"
          height="25"
          patternUnits="userSpaceOnUse"
          patternTransform={`translate(${view.x} ${view.y}) scale(${view.scale})`}
        >
          <path
            d="M 25 0 L 0 0 0 25"
            fill="none"
            stroke="#789C50"
            strokeWidth="0.7"
          />
        </pattern>
      </defs>

      <rect width="1250" height="860" fill="#93B868" />
      <rect width="1250" height="860" fill="url(#grid)" />

      <g transform={`translate(${view.x} ${view.y}) scale(${view.scale})`}>
        {areas.map((area) => {
          const points = area.points
            .map((p) => `${p.x},${p.y}`)
            .join(" ");

          return (
            <g key={area.id} data-object-id={area.id}>
              {area.type === "road" ? (
                <polyline
                  points={points}
                  fill="none"
                  stroke="#777777"
                  strokeWidth="20"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : (
                <polygon
                  points={points}
                  fill="#388BCB"
                  stroke="#246B9E"
                  strokeWidth="2"
                />
              )}
            </g>
          );
        })}

        {drawingPoints.length > 0 && (
          <polyline
            points={drawingPoints
              .map((p) => `${p.x},${p.y}`)
              .join(" ")}
            fill={selectedTool === "water" ? "#388BCB" : "none"}
            fillOpacity="0.6"
            stroke={selectedTool === "road" ? "#777777" : "#246B9E"}
            strokeWidth="20"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {objects.map((object) => (
          <MapObject
            key={object.id}
            object={object}
            selected={selectedObject === object.id}
          />
        ))}

        {lines.map((line) => {
          const start = objects.find((obj) => obj.id === line.startId);
          const end = objects.find((obj) => obj.id === line.endId);

          if (!start || !end) return null;

          const lineStyles = {
            low: { color: "#303030", width: 4 },
            medium: { color: "#E5A323", width: 4 },
            high: { color: "#2878D0", width: 4 },
          };

          const style = lineStyles[line.voltage];

          return (
            <g key={line.id} data-object-id={line.id}>
              <line
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke={style.color}
                strokeWidth={style.width}
                strokeLinecap="round"
              />
              <line
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke="transparent"
                strokeWidth="14"
              />
            </g>
          );
        })}

        {lineStart && (() => {
          const start = objects.find((obj) => obj.id === lineStart);

          if (!start) return null;

          return (
            <circle
              cx={start.x}
              cy={start.y}
              r="12"
              fill="none"
              stroke="#55B9F3"
              strokeWidth="3"
            />
          );
        })()}
      </g>
    </svg>
  );
}

export default GridWorkspace;