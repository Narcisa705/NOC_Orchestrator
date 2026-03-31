import { useState } from "react";
import type { AnalyzeResponse } from "../types";
import InterfacesTable from "./InterfacesTable";
import RoutesTable from "./RoutesTable";
import WarningsPanel from "./WarningsPanel";
import JsonViewer from "./JsonViewer";

type TabKey = "interfaces" | "routes" | "warnings" | "json";

interface TabsPanelProps {
  analysis: AnalyzeResponse | null;
}

function TabsPanel({ analysis }: TabsPanelProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("interfaces");

  const interfaces = analysis?.data?.interfaces ?? [];
  const routes = analysis?.data?.static_routes ?? [];
  const warnings = analysis?.data?.warnings ?? [];

  return (
    <section className="tabs-section">
      <div className="tabs-header">
        <button
          className={`tab-btn ${activeTab === "interfaces" ? "active" : ""}`}
          onClick={() => setActiveTab("interfaces")}
        >
          Interfaces
        </button>

        <button
          className={`tab-btn ${activeTab === "routes" ? "active" : ""}`}
          onClick={() => setActiveTab("routes")}
        >
          Routes
        </button>

        <button
          className={`tab-btn ${activeTab === "warnings" ? "active" : ""}`}
          onClick={() => setActiveTab("warnings")}
        >
          Warnings
        </button>

        <button
          className={`tab-btn ${activeTab === "json" ? "active" : ""}`}
          onClick={() => setActiveTab("json")}
        >
          JSON
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "interfaces" && <InterfacesTable interfaces={interfaces} />}
        {activeTab === "routes" && <RoutesTable routes={routes} />}
        {activeTab === "warnings" && <WarningsPanel warnings={warnings} />}
        {activeTab === "json" && <JsonViewer analysis={analysis} />}
      </div>
    </section>
  );
}

export default TabsPanel;