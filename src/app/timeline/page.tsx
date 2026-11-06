"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "./timeline.css";
import { TimelineEdge } from "./timeline-edge";
import { TimelineNode } from "./timeline-node";
import { timelineEdges, timelineNodes, type TimelineEvent } from "./timeline-data";

const nodeTypes = { timelineEvent: TimelineNode };
const edgeTypes = { timelineEdge: TimelineEdge };

function TimelineToolbar() {
  const { fitView, zoomIn, zoomOut } = useReactFlow();
  return (
    <div className="timeline-toolbar" aria-label="Timeline controls">
      <button type="button" onClick={() => zoomIn({ duration: 350 })} aria-label="Zoom in">+</button>
      <button type="button" onClick={() => zoomOut({ duration: 350 })} aria-label="Zoom out">−</button>
      <button type="button" onClick={() => fitView({ padding: 0.18, duration: 500 })} aria-label="Reset timeline view">⌖</button>
    </div>
  );
}

function EventDetails({ event }: { event: TimelineEvent }) {
  return (
    <aside className="event-details frame" aria-live="polite">
      <i className="corner tl" /><i className="corner br" />
      <div className="details-kicker"><span>SELECTED EVENT</span><strong>{event.path === "original" ? "ORIGINAL PATH" : "ALTERNATE PATH"}</strong></div>
      <div className="details-year">{event.year}</div>
      <h2>{event.title}</h2>
      <p className="details-description">{event.description}</p>
      <dl>
        <div><dt>RELATED PLAYER</dt><dd>{event.player}</dd></div>
        {event.stats.map((stat) => { const [label, value] = stat.split(": "); return <div key={stat}><dt>{label}</dt><dd>{value}</dd></div>; })}
        <div><dt>PARENT / DIVERGENCE</dt><dd>{event.parent}</dd></div>
      </dl>
    </aside>
  );
}

function MonitorLegend() {
  return <div className="monitor-legend"><span><i className="legend-dot alternate" /> ALTERNATE TIMELINE</span><span><i className="legend-dot original" /> ORIGINAL TIMELINE</span><span className="monitor-state"><i /> MONITORING ACTIVE</span></div>;
}

export default function TimelinePage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(timelineNodes);
  const [edges, , onEdgesChange] = useEdgesState(timelineEdges);
  const [selectedId, setSelectedId] = useState("divergence");
  const selectedEvent = nodes.find((node) => node.id === selectedId)?.data as TimelineEvent | undefined;

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node<TimelineEvent>) => {
    setSelectedId(node.id);
    setNodes((current) => current.map((item) => ({ ...item, selected: item.id === node.id })));
  }, [setNodes]);

  return (
    <main className="timeline-screen">
      <header className="timeline-header">
        <Link href="/" className="back-link"><span>←</span> RETURN TO INTAKE</Link>
        <div className="timeline-brand"><span className="brand-mark">◇</span><div><strong>FOOTBALL: FRACTURED</strong><small>ALTERNATE TIMELINE MONITOR</small></div></div>
        <div className="header-readout"><span>FILE 7-FF / 2018–2021</span><strong><i /> LIVE SCAN</strong></div>
      </header>
      <section className="timeline-titlebar">
        <div><p>VARIANCE FILE · RONALDO / MADRID</p><h1>What if Ronaldo never left Real Madrid in 2018?</h1></div>
        <div className="integrity-readout"><span>BRANCH INTEGRITY</span><strong>87.4%</strong><i><b /></i></div>
      </section>
      <MonitorLegend />
      <section className="timeline-workspace">
        <div className="flow-shell">
          <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} edgeTypes={edgeTypes} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onNodeClick={onNodeClick} fitView fitViewOptions={{ padding: 0.18 }} minZoom={0.45} maxZoom={1.6} proOptions={{ hideAttribution: true }}>
            <Background color="#6e3917" gap={32} size={1} />
            <MiniMap className="timeline-minimap" nodeColor={(node) => node.data?.path === "original" ? "#9b602c" : "#ff8a1f"} maskColor="rgba(10, 5, 2, .82)" />
            <Controls showInteractive={false} position="bottom-left" />
            <TimelineToolbar />
          </ReactFlow>
          <div className="flow-overlay flow-top"><span>COORDINATE GRID // PITCH-04</span><span>DRAG TO PAN · SELECT EVENT TO INSPECT</span></div>
          <div className="flow-overlay flow-bottom"><span>ORIGIN: SACRED TIMELINE</span><span>VARIANCE DETECTED <i /></span></div>
        </div>
        {selectedEvent && <EventDetails event={selectedEvent} />}
      </section>
      <footer className="timeline-footer"><span>TVA ARCHIVE // BRANCH MONITORING TERMINAL 07</span><span>ALL EVENTS FICTIONAL · NO SACRED TIMELINES WERE ALTERED</span><span>UTC 14:08:22</span></footer>
    </main>
  );
}
