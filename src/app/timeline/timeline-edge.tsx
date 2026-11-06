import { BaseEdge, getBezierPath, type EdgeProps } from "@xyflow/react";

export function TimelineEdge({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data }: EdgeProps) {
  const [path] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition, curvature: 0.22 });
  const isOriginal = data?.path === "original";

  return <BaseEdge path={path} className={`timeline-edge ${isOriginal ? "is-original" : ""}`} />;
}
