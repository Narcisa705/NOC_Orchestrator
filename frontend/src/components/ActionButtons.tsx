interface ActionButtonsProps {
  generatedConfig: string;
  onLoadCiscoSample: () => void;
  onLoadHuaweiSample: () => void;
  onLoadFortiGateSample: () => void;
}

function ActionButtons({
  generatedConfig,
  onLoadCiscoSample,
  onLoadHuaweiSample,
  onLoadFortiGateSample,
}: ActionButtonsProps) {
  const copyToClipboard = async () => {
    if (!generatedConfig.trim()) {
      alert("Nu există configurație generată.");
      return;
    }

    try {
      await navigator.clipboard.writeText(generatedConfig);
      alert("Configurația a fost copiată.");
    } catch {
      alert("Copierea a eșuat.");
    }
  };

  const exportConfig = () => {
    if (!generatedConfig.trim()) {
      alert("Nu există configurație generată.");
      return;
    }

    const blob = new Blob([generatedConfig], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "generated_config.cfg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <section className="panel actions-panel">
      <div className="actions-block">
        <h2>Quick Actions</h2>
        <div className="toolbar-actions">
          <button className="primary-btn" onClick={copyToClipboard}>
            Copy Config
          </button>
          <button className="secondary-btn" onClick={exportConfig}>
            Export .cfg
          </button>
        </div>
      </div>

      <div className="actions-block">
        <h2>Load Sample Config</h2>
        <div className="toolbar-actions">
          <button className="ghost-btn" onClick={onLoadCiscoSample}>
            Cisco Sample
          </button>
          <button className="ghost-btn" onClick={onLoadHuaweiSample}>
            Huawei Sample
          </button>
          <button className="ghost-btn" onClick={onLoadFortiGateSample}>
            FortiGate Sample
          </button>
        </div>
      </div>
    </section>
  );
}

export default ActionButtons;