import Editor from "@monaco-editor/react";

interface ConfigEditorProps {
  title: string;
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  height?: string;
}

function ConfigEditor({
  title,
  value,
  onChange,
  readOnly = false,
  height = "520px",
}: ConfigEditorProps) {
  return (
    <div className="panel">
      <h2>{title}</h2>
      <div className="monaco-wrap">
        <Editor
          height={height}
          defaultLanguage="plaintext"
          theme="vs-dark"
          value={value}
          onChange={(newValue) => onChange?.(newValue ?? "")}
          options={{
            readOnly,
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: "on",
            automaticLayout: true,
            scrollBeyondLastLine: false,
            roundedSelection: true,
            padding: { top: 12, bottom: 12 },
          }}
        />
      </div>
    </div>
  );
}

export default ConfigEditor;