import type { AnalyzeResponse } from "../types";

interface JsonViewerProps {
  analysis: AnalyzeResponse | null;
}

function JsonViewer({ analysis }: JsonViewerProps) {
  return (
    <div className="panel">
      <h2>Raw Analysis JSON</h2>
      <pre className="json-box">
        {analysis ? JSON.stringify(analysis, null, 2) : "No analysis yet."}
      </pre>
    </div>
  );
}

export default JsonViewer;