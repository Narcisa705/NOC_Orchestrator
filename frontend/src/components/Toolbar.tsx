import type { TargetVendor, Vendor } from "../types";

interface ToolbarProps {
  sourceVendor: Vendor;
  targetVendor: TargetVendor;
  loading: boolean;
  onSourceVendorChange: (value: Vendor) => void;
  onTargetVendorChange: (value: TargetVendor) => void;
  onAnalyze: () => void;
  onConvert: () => void;
  onClear: () => void;
}

function Toolbar({
  sourceVendor,
  targetVendor,
  loading,
  onSourceVendorChange,
  onTargetVendorChange,
  onAnalyze,
  onConvert,
  onClear,
}: ToolbarProps) {
  return (
    <section className="toolbar panel">
      <div className="toolbar-group">
        <label>Source Vendor</label>
        <select
          value={sourceVendor}
          onChange={(e) => onSourceVendorChange(e.target.value as Vendor)}
        >
          <option value="unknown">Auto Detect</option>
          <option value="cisco">Cisco</option>
          <option value="huawei">Huawei</option>
          <option value="fortigate">FortiGate</option>
        </select>
      </div>

      <div className="toolbar-group">
        <label>Target Vendor</label>
        <select
          value={targetVendor}
          onChange={(e) => onTargetVendorChange(e.target.value as TargetVendor)}
        >
          <option value="cisco">Cisco</option>
          <option value="huawei">Huawei</option>
          <option value="fortigate">FortiGate</option>
        </select>
      </div>

      <div className="toolbar-actions">
        <button
          className="primary-btn"
          onClick={() => {
            console.log("Analyze clicked");
            onAnalyze();
          }}
          disabled={loading}
        >
          {loading ? "Loading..." : "Analyze"}
        </button>

        <button
          className="secondary-btn"
          onClick={() => {
            console.log("Convert clicked");
            onConvert();
          }}
          disabled={loading}
        >
          {loading ? "Loading..." : "Convert"}
        </button>

        <button className="ghost-btn" onClick={onClear} disabled={loading}>
          Clear
        </button>
      </div>
    </section>
  );
}

export default Toolbar;