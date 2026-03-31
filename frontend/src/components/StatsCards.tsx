import type { AnalyzeResponse } from "../types";

interface StatsCardsProps {
  analysis: AnalyzeResponse | null;
}

function StatsCards({ analysis }: StatsCardsProps) {
  const interfaces = analysis?.data?.interfaces ?? [];
  const routes = analysis?.data?.static_routes ?? [];
  const warnings = analysis?.data?.warnings ?? [];

  return (
    <section className="stats-grid">
      <div className="stat-card">
        <span className="stat-label">Detected Vendor</span>
        <strong>{analysis?.detected_vendor ?? "-"}</strong>
      </div>

      <div className="stat-card">
        <span className="stat-label">Confidence</span>
        <strong>
          {analysis ? `${Math.round(analysis.confidence * 100)}%` : "-"}
        </strong>
      </div>

      <div className="stat-card">
        <span className="stat-label">Hostname</span>
        <strong>{analysis?.data.hostname ?? "-"}</strong>
      </div>

      <div className="stat-card">
        <span className="stat-label">Interfaces</span>
        <strong>{interfaces.length}</strong>
      </div>

      <div className="stat-card">
        <span className="stat-label">Static Routes</span>
        <strong>{routes.length}</strong>
      </div>

      <div className="stat-card">
        <span className="stat-label">Warnings</span>
        <strong>{warnings.length}</strong>
      </div>
    </section>
  );
}

export default StatsCards;