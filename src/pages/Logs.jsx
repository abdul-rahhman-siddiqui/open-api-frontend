import { useEffect, useState } from "react";
import api from "../api/api";

export default function Logs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    api.get("/report/logs").then((res) => setLogs(res.data));
  }, []);

  return (
    <div className="p-6 overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4">Latest Logs (500)</h2>
      <table className="border-collapse table-auto w-full text-sm">
        <thead>
          <tr>
            {["Path", "Method", "Status", "Success", "Time"].map((h) => (
              <th key={h} className="border px-2 py-1 bg-gray-100">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {logs.map((l) => (
            <tr key={l._id} className={l.success ? "bg-green-50" : "bg-red-50"}>
              <td className="border px-2">{l.path}</td>
              <td className="border px-2 uppercase">{l.method}</td>
              <td className="border px-2">{l.status}</td>
              <td className="border px-2">{l.success ? "✅" : "❌"}</td>
              <td className="border px-2">
                {new Date(l.createdAt).toLocaleTimeString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
