import { useState } from "react";
import "./App.css";
import { analyzeConfig, convertConfig } from "./api/orchestrator";
import type {
  AnalyzeResponse,
  TargetVendor,
  Vendor,
} from "./types";

function App() {
  const [rawConfig, setRawConfig] = useState<string>(`hostname CORE-R1
interface Vlan10
 description USERS
 ip address 10.10.10.1 255.255.255.0
!
interface Vlan20
 description SERVERS
 ip address 10.20.20.1 255.255.255.0
!
ip route 0.0.0.0 0.0.0.0 10.10.10.254`);

  const [sourceVendor, setSourceVendor] = useState<Vendor>("unknown");
  const [targetVendor, setTargetVendor] = useState<TargetVendor>("huawei");
  const [analysis, setAnalysis] = useState<AnalyzeResponse | null>(null);
  const [generatedConfig, setGeneratedConfig] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // ------------------ SAMPLE CONFIGS ------------------

  const loadCiscoSample = () => {
    setRawConfig(`hostname CORE-R1
interface Vlan10
 description USERS
 ip address 10.10.10.1 255.255.255.0
!
interface Vlan20
 description SERVERS
 ip address 10.20.20.1 255.255.255.0
!
ip route 0.0.0.0 0.0.0.0 10.10.10.254`);
    resetState();
  };

  const loadHuaweiSample = () => {
    setRawConfig(`sysname SW1
interface Vlanif 10
 description USERS
 ip address 192.168.10.1 255.255.255.0
#
interface Vlanif 20
 description SERVERS
 ip address 192.168.20.1 255.255.255.0
#
ip route-static 0.0.0.0 0.0.0.0 192.168.10.254`);
    resetState();
  };

  const loadFortiGateSample = () => {
    setRawConfig(`config system global
    set hostname "FGT1"
end

config system interface
    edit "vlan10"
        set alias "Users"
        set ip 192.168.10.1 255.255.255.0
    next
end

config router static
    edit 1
        set dst 0.0.0.0 0.0.0.0
        set gateway 192.168.10.254
    next
end`);
    resetState();
  };

  const resetState = () => {
    setAnalysis(null);
    setGeneratedConfig("");

    setError("");
  };

  // ------------------ API CALLS ------------------

  const runAnalyze = async () => {
    setLoading(true);
    setError("");
    setGeneratedConfig("");

    try {
      const data = await analyzeConfig({
        raw_config: rawConfig,
        source_vendor: sourceVendor,
      });

      setAnalysis(data);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.detail || "Analyze failed");
    } finally {
      setLoading(false);
    }
  };

  const runConvert = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await convertConfig({
        raw_config: rawConfig,
        source_vendor: sourceVendor,
        target_vendor: targetVendor,
      });

      setAnalysis({
        detected_vendor: data.detected_vendor,
        confidence: data.confidence,
        data: data.data,
      });

      setGeneratedConfig(data.generated_config);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.detail || "Convert failed");
    } finally {
      setLoading(false);
    }
  };

  // ------------------ UI ------------------

  return (
    <div className="page">
      {/* HEADER */}
      <header className="page-header">
        <div className="page-title">
          <h1>NOC Orchestrator</h1>
          <p className="subtitle">
            Multi-vendor configuration analysis and migration platform
          </p>
        </div>

        <div className="version-badge">
          Master Thesis Demo • v1.0
        </div>
      </header>

      {/* TOOLBAR */}
      <section className="panel topbar">
        <div className="controls-row">
          <div className="field-group">
            <label>Source Vendor</label>
            <select
              value={sourceVendor}
              onChange={(e) => setSourceVendor(e.target.value as Vendor)}
            >
              <option value="unknown">Auto Detect</option>
              <option value="cisco">Cisco</option>
              <option value="huawei">Huawei</option>
              <option value="fortigate">FortiGate</option>
            </select>
          </div>

          <div className="field-group">
            <label>Target Vendor</label>
            <select
              value={targetVendor}
              onChange={(e) => setTargetVendor(e.target.value as TargetVendor)}
            >
              <option value="cisco">Cisco</option>
              <option value="huawei">Huawei</option>
              <option value="fortigate">FortiGate</option>
            </select>
          </div>

          <div className="button-row">
            <button className="primary-btn" onClick={runAnalyze} disabled={loading}>
              {loading ? "Analyzing..." : "Analyze"}
            </button>

            <button className="secondary-btn" onClick={runConvert} disabled={loading}>
              {loading ? "Converting..." : "Convert"}
            </button>
<button className="ghost-btn" onClick={resetState} style={{ borderColor: "#ef4444", color: "#ef4444" }}>
    Clear All
  </button>
          </div>
        </div>

        <div className="button-row samples-row">
          <button className="ghost-btn" onClick={loadCiscoSample}>Cisco Sample</button>
          <button className="ghost-btn" onClick={loadHuaweiSample}>Huawei Sample</button>
          <button className="ghost-btn" onClick={loadFortiGateSample}>FortiGate Sample</button>
        </div>
      </section>

      {/* ERROR */}
      {error && <div className="error">{error}</div>}

      {/* EDITORS */}
      <section className="grid">
        <div className="panel">
          <h2 className="editor-title">Input Configuration</h2>
          <textarea
            value={rawConfig}
            onChange={(e) => setRawConfig(e.target.value)}
          />
        </div>

        <div className="panel">
          <h2 className="editor-title">Generated Configuration</h2>
          <textarea value={generatedConfig} readOnly />
        </div>
      </section>

      {/* ANALYSIS */}
      <section className="panel">
        <h2 className="section-title">Analysis Summary</h2>

        <div className="analysis-summary">
          <div className="summary-box">
            <span>Detected Vendor</span>
            <strong>{analysis?.detected_vendor ?? "-"}</strong>
          </div>

          <div className="summary-box">
            <span>Hostname</span>
            <strong>{analysis?.data.hostname ?? "-"}</strong>
          </div>


        </div>

        <h2 className="section-title">Raw Analysis Data</h2>

        <pre>
          {analysis ? JSON.stringify(analysis, null, 2) : "No analysis yet."}
        </pre>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          marginTop: "20px",
          color: "#94a3b8",
          fontSize: "0.85rem",
        }}
      >
        Developed for multi-vendor configuration migration research.
      </footer>
    </div>
  );
}

export default App;