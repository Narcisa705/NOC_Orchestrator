import type { InterfaceModel } from "../types";

interface InterfacesTableProps {
  interfaces: InterfaceModel[];
}

function InterfacesTable({ interfaces }: InterfacesTableProps) {
  return (
    <div className="panel">
      <h2>Interfaces</h2>

      {interfaces.length === 0 ? (
        <p className="muted">No interfaces found.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>IP</th>
                <th>Mask</th>
                <th>Prefix</th>
                <th>VLAN</th>
                <th>Shutdown</th>
              </tr>
            </thead>
            <tbody>
              {interfaces.map((iface, index) => (
                <tr key={`${iface.name}-${index}`}>
                  <td>{iface.name}</td>
                  <td>{iface.description}</td>
                  <td>{iface.ip}</td>
                  <td>{iface.mask}</td>
                  <td>/{iface.prefix}</td>
                  <td>{iface.vlan}</td>
                  <td>{iface.shutdown ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default InterfacesTable;