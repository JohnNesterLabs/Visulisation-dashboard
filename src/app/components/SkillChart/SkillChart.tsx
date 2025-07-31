import React, { useEffect, useRef, useState } from "react";
import cytoscape from "cytoscape";
import qTip from "cytoscape-qtip";
import nodeHtmlLabel from "cytoscape-node-html-label";
import dagre from "cytoscape-dagre";
import $ from "jquery";
import "qtip2/dist/jquery.qtip.css";
import {
  FaCrown,
  FaBullseye,
  FaGem,
  FaUserAlt,
  FaSyncAlt,
  FaCodeBranch,
  FaRunning,
  FaEye,
} from "react-icons/fa";
import { renderToStaticMarkup } from "react-dom/server";

qTip(cytoscape);
nodeHtmlLabel(cytoscape);
cytoscape.use(dagre);
window.$ = $;

declare global {
  interface Window {
    $: typeof $;
  }
}

const iconMap = {
  crown: <FaCrown size={24} color="#a259ff" />,
  bullseye: <FaBullseye size={24} color="#a259ff" />,
  gem: <FaGem size={24} color="#a259ff" />,
  user: <FaUserAlt size={24} color="#a259ff" />,
  sync: <FaSyncAlt size={24} color="#a259ff" />,
  branch: <FaCodeBranch size={20} color="#333" />,
  run: <FaRunning size={20} color="#333" />,
  eye: <FaEye size={20} color="#333" />,
};

const renderedIcons = Object.fromEntries(
  Object.entries(iconMap).map(([key, icon]) => [
    key,
    renderToStaticMarkup(icon),
  ])
);

// TypeScript types for nodes and edges
interface SkillNode {
  id: string;
  icon: string;
  label: string;
  timestamp: string;
  description: string[];
  iconUrl?: string;
}

interface SkillEdge {
  id: string;
  source: string;
  target: string;
  label: string;
}

const fullNodes: SkillNode[] = [
  {
    id: "1",
    icon: "user",
    label: "anant@organization.com",
    timestamp: "2025-07-16",
    description: ["Admin account", "Top-level permissions"],
    iconUrl: "/Frame(2).png",
  },
  {
    id: "2",
    icon: "bullseye",
    label: "app.asana.com",
    timestamp: "2025-07-12",
    description: ["Google Drive access"],
    iconUrl: "/Frame(3).png",
  },
  {
    id: "3",
    icon: "gem",
    label: "reddit.com",
    timestamp: "2025-06-25",
    description: ["Accessed documents", "Top-level permissions"],
    iconUrl: "/Frame(4).png",
  },
  {
    id: "4",
    icon: "user",
    label: "Allowed at 9th July 2025 03:58:31 PM",
    timestamp: "2025-05-01",
    description: ["Upload observed", "Accessed documents"],
  },
  // { id: "5", icon: "eye", label: "tag..", timestamp: "2024-10-01", description: ["Execution policy", "Upload observed"] },
  // { id: "6", icon: "eye", label: "tag", timestamp: "2023-10-01", description: ["Watched tag", "Execution policy"] },
  // { id: "7", icon: "branch", label: "account.google.com", timestamp: "2025-07-11", description: ["Redirected view", "Execution policy"] },
];

const edges: SkillEdge[] = [
  { id: "e1-2", source: "1", target: "2", label: "⚪ Typed " },
  { id: "e2-3", source: "2", target: "3", label: "⚪ click" },
  // { id: "e2-7", source: "2", target: "7", label: "⚪ redirect" },
  { id: "e3-4", source: "3", target: "4", label: "⚪ Policy :Site Visit" },
  // { id: "e4-5", source: "4", target: "5", label: "⚪ policy file" },
  // { id: "e5-6", source: "5", target: "6", label: "⚪ tag" },
  // { id: "e7-2", source: "7", target: "2", label: "⚪ redirect_back" },
];

const SkillChart: React.FC = () => {
  const cyRef = useRef<HTMLDivElement>(null);
  const [cyInstance, setCyInstance] = useState<cytoscape.Core | null>(null);
  const lastClickedNodeRef = useRef<cytoscape.NodeSingular | null>(null);

  const getFilteredData = () => ({
    nodes: fullNodes,
    edges,
  });

  const updatePopoverPosition = () => {
    const node = lastClickedNodeRef.current;
    const popover = document.getElementById("node-popover");
    if (node && popover && popover.style.display === "block") {
      const pos = node.renderedPosition();
      popover.style.left = `${pos.x + 20}px`;
      popover.style.top = `${pos.y}px`;
    }
  };

  const animateEdges = (cy: cytoscape.Core) => {
    const animatedLabels = ["upload", "policy file"];
    cy.edges().forEach((edge) => {
      const edgeLabel = edge.data("label")?.toLowerCase();
      const isAnimated = animatedLabels.some((label) =>
        edgeLabel.includes(label)
      );
      if (isAnimated) {
        let i = 0;
        const animate = () => {
          edge.style("line-dash-offset", i % 100);
          edge.style("line-style", "dashed");
          edge.style("line-dash-pattern", [6, 4]);
          i -= 1;
          requestAnimationFrame(animate);
        };
        animate();
      } else {
        edge.style("line-style", "solid");
      }
    });
  };

  const renderGraph = () => {
    const { nodes, edges } = getFilteredData();
    const popover = document.getElementById("node-popover");
    if (popover) popover.style.display = "none";

    const cy = cytoscape({
      container: cyRef.current as HTMLDivElement,
      elements: [
        ...nodes.map((node) => ({
          data: { id: node.id, tooltip: node.label },
        })),
        ...edges.map((e) => ({ data: e })),
      ],
      style: [
        {
          selector: "edge.hovered",
          style: {
            "line-color": "#ff6b81",
            "target-arrow-color": "#ff6b81",
            width: 5,
            "z-index": 9999,
            "curve-style": "bezier",
          },
        },
        {
          selector: "node",
          style: {
            shape: "ellipse",
            width: 70,
            height: 70,
            "background-opacity": 0,
            "border-width": 0,
          },
        },
        {
          selector: "edge",
          style: {
            width: 3,
            "line-color": "#a259ff",
            "target-arrow-color": "#a259ff",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
            "control-point-step-size": 80, // <-- ADD THIS
            label: "data(label)",
            "font-size": "10px",
            color: "#000",
            "text-background-color": "#fff",
            "text-background-opacity": 1,
            "text-background-padding": "6px",
            "text-border-color": "rgba(0,0,0,0.1)",
            "text-border-width": 1,
            "text-border-opacity": 0.15,
            "text-background-shape": "roundrectangle",
            "text-wrap": "wrap",
            "text-justification": "center",
          },
        },
      ],
      layout: {
        name: "dagre",
        rankDir: "LR",
        nodeSep: 50,
        edgeSep: 20,
        rankSep: 100,
        fit: false,
      } as any, // Cast to any to allow dagre-specific options
      zoom: 1,
      pan: { x: 0, y: 0 },
    });

    // @ts-expect-error: nodeHtmlLabel is a plugin and not typed
    cy.nodeHtmlLabel([
      {
        query: "node",
        halign: "center",
        valign: "center",
        tpl: (data: { id: string }) => {
          const node = fullNodes.find((n) => n.id === data.id);
          return `
   <div style="width: auto; display: flex; flex-direction: column; align-items: center; text-align: center;">
  <div class="node-circle" style="width: 70px; height: 70px; border-radius: 50%; background: white; box-shadow: 0px 12px 16px -4px rgba(162, 89, 255, 0.3); display: flex; justify-content: center; align-items: center; margin-bottom: 6px;">
    <div style="width: 48px; height: 48px; border: 2px solid #a259ff; border-radius: 50%; display: flex; justify-content: center; align-items: center;">
      ${node && node.icon in renderedIcons ? renderedIcons[node.icon] : ""}
    </div>
  </div>

  <div style="
    display: flex;
    align-items: center;
    padding: 6px 10px;
    background: #f3ecff;
    border-radius: 16px;
    box-shadow: 0 6px 18px rgba(162, 89, 255, 0.3);
    font-size: 13px;
    font-weight: 500;
    color: #000;
    white-space: nowrap;
    gap: 8px;
  ">
    <img src="${
      node?.iconUrl || "/Frame (2).png"
    }" alt="icon" style="width: 16px; height: 16px; border-radius: 50%;" />
    ${node?.label}
  </div>
</div>

  `;
        },
      },
    ]);

    animateEdges(cy);

    cy.edges().on("mouseover", (event) => event.target.addClass("hovered"));
    cy.edges().on("mouseout", (event) => event.target.removeClass("hovered"));

    cy.nodes().forEach((node) => {
      (node as any).qtip({
        content: node.data("tooltip"),
        position: { my: "top center", at: "bottom center" },
        style: { classes: "qtip-light qtip-rounded qtip-shadow" },
        show: { event: "mouseover" },
        hide: { event: "mouseout unfocus" },
      });
    });
    cy.edges().forEach((edge) => {
      const label = edge.data("label");
      if (label) {
        (edge as any).qtip({
          content: label,
          position: { my: "top center", at: "bottom center" },
          style: { classes: "qtip-light qtip-rounded qtip-shadow" },
          show: { event: "mouseover" },
          hide: { event: "mouseout unfocus" },
        });
      }
    });

    cy.on("tap", "node", (event) => {
      const node = event.target;
      lastClickedNodeRef.current = node;
      const nodeData = fullNodes.find((n) => n.id === node.id());
      if (!nodeData) return;
      const pos = node.renderedPosition();
      const popover = document.getElementById("node-popover");
      if (popover) {
        popover.innerHTML = `<strong>${
          nodeData.label
        }</strong><ul style='padding-left: 16px; margin-top: 6px;'>${(
          nodeData.description || []
        )
          .map((d) => `<li>${d}</li>`)
          .join("")}</ul>`;
        popover.style.left = `${pos.x + 20}px`;
        popover.style.top = `${pos.y}px`;
        popover.style.display = "block";
      }
    });

    cy.on("tap", (event) => {
      if (event.target === cy) {
        const popover = document.getElementById("node-popover");
        if (popover) popover.style.display = "none";
      }
    });

    cy.on("position", "node", () => updatePopoverPosition());

    setCyInstance(cy);
  };

  useEffect(() => {
    renderGraph();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetZoom = () => {
    const popover = document.getElementById("node-popover");
    if (popover) popover.style.display = "none";
    if (cyInstance) {
      cyInstance.destroy();
      setCyInstance(null);
      renderGraph();
    }
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "50vh",
        background: "#f8f8fb",
      }}
    >
      <div
        ref={cyRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 2,
          pointerEvents: "none",
        }}
      >
        <div
          id="node-popover"
          style={{
            position: "absolute",
            display: "none",
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: "6px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            padding: "10px",
            fontSize: "13px",
            zIndex: 100,
            maxWidth: "200px",
            pointerEvents: "auto",
          }}
        ></div>

        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            background: "#fff",
            borderRadius: "6px",
            overflow: "hidden",
            boxShadow: "0 1px 6px rgba(0,0,0,0.15)",
            zIndex: 10,
            pointerEvents: "auto",
          }}
        >
          <button
            style={{
              all: "unset",
              padding: "8px 10px",
              fontSize: "16px",
              cursor: "pointer",
              borderBottom: "1px solid #ddd",
              background: "white",
            }}
            onClick={() => cyInstance && cyInstance.zoom(cyInstance.zoom() * 1.2)}
          >
            +
          </button>
          <button
            style={{
              all: "unset",
              padding: "8px 10px",
              fontSize: "16px",
              cursor: "pointer",
              borderBottom: "1px solid #ddd",
              background: "white",
            }}
            onClick={() => cyInstance && cyInstance.zoom(cyInstance.zoom() * 0.8)}
          >
            –
          </button>
          <button
            style={{
              all: "unset",
              padding: "8px 10px",
              fontSize: "16px",
              cursor: "pointer",
              background: "white",
            }}
            onClick={resetZoom}
          >
            ⟳
          </button>
        </div>
      </div>
      <style>
        {`
    .node-circle:hover {
      box-shadow: 0px 0px 16px 6px rgba(162, 89, 255, 0.3);
    }
    *:focus {
      outline: none;
      box-shadow: none;
    }
  `}
      </style>
    </div>
  );
};

export default SkillChart;