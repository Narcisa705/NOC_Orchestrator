import type { StaticRouteModel } from "../types";

interface RoutesTableProps {
  routes: StaticRouteModel[];
}

function RoutesTable({ routes }: RoutesTableProps) {
  return (
    <div className="panel">
      <h2>Static Routes</h2>

      {routes.length === 0 ? (
        <p className="muted">No static routes found.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Destination</th>
                <th>Mask</th>
                <th>Prefix</th>
                <th>Gateway</th>
              </tr>
            </thead>
            <tbody>
              {routes.map((route, index) => (
                <tr key={`${route.destination}-${index}`}>
                  <td>{route.destination}</td>
                  <td>{route.mask}</td>
                  <td>/{route.prefix}</td>
                  <td>{route.gateway}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default RoutesTable;