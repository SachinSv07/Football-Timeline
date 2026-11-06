import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import type { TimelineEvent } from "./timeline-data";

type TimelineNodeData = Node<TimelineEvent, "timelineEvent">;

export function TimelineNode({ data, selected }: NodeProps<TimelineNodeData>) {
  const isOriginal = data.path === "original";

  return (
    <div className={`timeline-node ${isOriginal ? "is-original" : ""} ${selected ? "is-selected" : ""}`}>
      <Handle type="target" position={Position.Left} className="timeline-handle" />
      <div className="node-scanline" />
      <div className="node-topline"><span>{data.year}</span><span>{isOriginal ? "ORIGINAL" : "VARIANCE"}</span></div>
      <div className="node-title">{data.title}</div>
      <div className="node-signal"><i /> SIGNAL {selected ? "LOCKED" : "STABLE"}</div>
      <Handle type="source" position={Position.Right} className="timeline-handle" />
    </div>
  );
}
