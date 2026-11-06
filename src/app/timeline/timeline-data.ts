import type { Edge, Node } from "@xyflow/react";

export type TimelineEvent = {
  id: string;
  year: string;
  title: string;
  description: string;
  player: string;
  stats: string[];
  parent: string;
  path: "alternate" | "original";
  position: { x: number; y: number };
};

export const timelineEvents: TimelineEvent[] = [
  {
    id: "divergence",
    year: "2018",
    title: "Ronaldo stays at Real Madrid",
    description: "The transfer to Juventus never happens. Ronaldo signs a new Madrid deal and the branch begins to drift from the sacred record.",
    player: "Cristiano Ronaldo",
    stats: ["Contract: renewed", "Branch integrity: 87.4%"],
    parent: "Divergence point · Sacred record: transfer to Juventus",
    path: "alternate",
    position: { x: 40, y: 190 },
  },
  {
    id: "ucl",
    year: "2019",
    title: "Madrid wins the Champions League",
    description: "A late Ronaldo volley changes the semi-final and Madrid complete a fifth European title in six seasons.",
    player: "Cristiano Ronaldo",
    stats: ["Final: 2-1", "Ronaldo: 1 goal"],
    parent: "2018 · Ronaldo stays at Real Madrid",
    path: "alternate",
    position: { x: 350, y: 72 },
  },
  {
    id: "goals",
    year: "2019",
    title: "Ronaldo scores 38 goals",
    description: "With the attack built around him, Ronaldo finishes the season as Madrid's leading scorer across every competition.",
    player: "Cristiano Ronaldo",
    stats: ["Goals: 38", "Assists: 11"],
    parent: "2018 · Ronaldo stays at Real Madrid",
    path: "alternate",
    position: { x: 350, y: 310 },
  },
  {
    id: "liga",
    year: "2020",
    title: "Real Madrid wins La Liga",
    description: "A compact, unbeaten home run delivers Madrid the league title as the branch stabilizes around its new centre of gravity.",
    player: "Cristiano Ronaldo",
    stats: ["League position: 1st", "Home run: 16 matches"],
    parent: "2019 · Ronaldo scores 38 goals",
    path: "alternate",
    position: { x: 690, y: 310 },
  },
  {
    id: "contract",
    year: "2021",
    title: "Ronaldo signs a new contract",
    description: "A final extension keeps Ronaldo in Madrid and turns the temporary anomaly into a persistent alternate timeline.",
    player: "Cristiano Ronaldo",
    stats: ["Term: 3 years", "Status: branch locked"],
    parent: "2020 · Real Madrid wins La Liga",
    path: "alternate",
    position: { x: 1020, y: 310 },
  },
  {
    id: "sacred-transfer",
    year: "2018",
    title: "Ronaldo transfers to Juventus",
    description: "The recorded sacred timeline: Ronaldo leaves Madrid for Turin in a landmark transfer.",
    player: "Cristiano Ronaldo",
    stats: ["Transfer: Juventus", "Record: preserved"],
    parent: "Sacred timeline reference",
    path: "original",
    position: { x: 350, y: 555 },
  },
  {
    id: "sacred-season",
    year: "2019",
    title: "Juventus rebuilds around Ronaldo",
    description: "The original record continues along its known path, retained here as a comparison signal for TVA monitors.",
    player: "Cristiano Ronaldo",
    stats: ["Path: original", "Variance: none"],
    parent: "2018 · Ronaldo transfers to Juventus",
    path: "original",
    position: { x: 690, y: 555 },
  },
];

export const timelineNodes: Node<TimelineEvent>[] = timelineEvents.map((event) => ({
  id: event.id,
  type: "timelineEvent",
  position: event.position,
  data: event,
}));

export const timelineEdges: Edge[] = [
  { id: "divergence-ucl", source: "divergence", target: "ucl", type: "timelineEdge", data: { path: "alternate" } },
  { id: "divergence-goals", source: "divergence", target: "goals", type: "timelineEdge", data: { path: "alternate" } },
  { id: "goals-liga", source: "goals", target: "liga", type: "timelineEdge", data: { path: "alternate" } },
  { id: "liga-contract", source: "liga", target: "contract", type: "timelineEdge", data: { path: "alternate" } },
  { id: "sacred-transfer-season", source: "sacred-transfer", target: "sacred-season", type: "timelineEdge", data: { path: "original" } },
];
