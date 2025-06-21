import { useEffect, useState } from "react";
import api from "../api/api";

export default function Report() {
  const [logs, setLogs] = useState([]);
  const [statusSummary, setStatusSummary] = useState({});
  const [uniqueEndpoints, setUniqueEndpoints] = useState(0);

  useEffect(() => {
    api.get("/report/logs").then((res) => {
      setLogs(res.data);

      // Build summary
      const summary = {};
      let successCount = 0;

      // Collect unique endpoint+method combinations
      const endpointSet = new Set();

      res.data.forEach((log) => {
        const code = log.status;
        summary[code] = (summary[code] || 0) + 1;
        if (log.status >= 200 && log.status < 300) successCount++;

        // Unique endpoint: path + method
        endpointSet.add(`${log.path} ${log.method?.toUpperCase()}`);
      });

      setUniqueEndpoints(endpointSet.size);

      setStatusSummary({
        total: res.data.length,
        success: successCount,
        failed: res.data.length - successCount,
        codes: summary,
      });
    });
  }, []);

  const successRate = (statusSummary.success / statusSummary.total) * 100 || 0;

  return (
    <div className="p-6 bg-pink-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Logs Report - Status Code Summary</h2>

      <div className="bg-white shadow rounded p-4 mb-6">
        <h3 className="font-semibold text-lg mb-2">Endpoint Summary</h3>
        <p>
          Total unique endpoints:{" "}
          <strong className="text-blue-600">{uniqueEndpoints}</strong>
        </p>
        
        <p className="text-green-600">Success: <strong>{statusSummary.success}</strong></p>
        <p className="text-red-600">Failed: <strong>{statusSummary.failed}</strong></p>
        <p>Overall Success Rate: <span className="text-blue-700 font-bold">{successRate.toFixed(2)}%</span></p>
      </div>

      <table className="w-full table-auto border text-sm mb-6">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-2 py-1">Status Code</th>
            <th className="border px-2 py-1">Frequency</th>
            <th className="border px-2 py-1">Success Rate (%)</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(statusSummary.codes || {}).map(([code, count]) => (
            <tr key={code}>
              <td className="border px-2 text-center">{code}</td>
              <td className="border px-2 text-center">{count}</td>
              <td className="border px-2 text-center">
                {code.startsWith("2") ? ((count / statusSummary.total) * 100).toFixed(2) : "0.00"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="font-bold text-xl mb-2">Full Logs</h3>
      <table className="w-full table-auto border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2">Method</th>
            <th className="border px-2">URL</th>
            <th className="border px-2">Status Code</th>
            <th className="border px-2">Response Message</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log._id}>
              <td className="border px-2 uppercase">{log.method}</td>
              <td className="border px-2">{log.path}</td>
              <td className="border px-2">{log.status}</td>
              <td className="border px-2">{log.error || "✅ OK"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
