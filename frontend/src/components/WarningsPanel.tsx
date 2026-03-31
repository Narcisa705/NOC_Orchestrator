import type { WarningModel } from "../types";

interface WarningsPanelProps {
  warnings: WarningModel[];
}

function WarningsPanel({ warnings }: WarningsPanelProps) {
  return (
    <div className="panel">
      <h2>Warnings</h2>

      {warnings.length === 0 ? (
        <p className="muted">No warnings.</p>
      ) : (
        <div className="warnings-list">
          {warnings.map((warning, index) => (
            <div
              key={`${warning.code}-${index}`}
              className={`warning-item ${warning.severity}`}
            >
              <div className="warning-code">{warning.code}</div>
              <div className="warning-message">{warning.message}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WarningsPanel;