import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/api";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export default function Summary() {
  const { id } = useParams();
  const [summary, setSummary] = useState(null);
  const [totalEndpoints, setTotalEndpoints] = useState(0);

  useEffect(() => {
    api.get(`/report/summary/${id}`).then((res) => {
      setSummary(res.data);

      // Calculate total unique endpoints from the breakdown
      if (res.data.breakdown) {
        const endpointCount = Object.keys(res.data.breakdown).length;
        setTotalEndpoints(endpointCount);
      }
    });
  }, [id]);

  if (!summary) return <p>Loading…</p>;

  const pieData = [
    { name: "Success", value: summary.successes },
    { name: "Failure", value: summary.failures },
  ];

  return (
    <div className="p-6">
      <Link to="/" className="underline">
        ← Back
      </Link>
      <h2 className="text-2xl font-bold mb-4">{summary.specName}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <PieChart width={300} height={300}>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {pieData.map((_, idx) => (
                <Cell key={idx} fill={["#16a34a", "#dc2626"][idx]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg shadow-sm flex flex-col justify-center">
          <div className="text-lg mb-2">
            <p className="font-medium">
              Total unique endpoints:{" "}
              <span className="font-bold text-blue-600">{totalEndpoints}</span>
            </p>
          </div>
          <p className="text-green-600">
            Successful requests: <strong>{summary.successes}</strong>
          </p>
          <p className="text-red-600">
            Failed requests: <strong>{summary.failures}</strong>
          </p>
          <p className="mt-2">
            Total requests: <strong>{summary.total}</strong>
          </p>
          <p className="mt-2 text-gray-600 text-sm">
            Success rate:{" "}
            <strong>
              {((summary.successes / summary.total) * 100).toFixed(1)}%
            </strong>
          </p>
        </div>
      </div>

      <h3 className="text-lg font-medium mb-2">Endpoint Breakdown</h3>
      <div className="bg-white shadow-sm border rounded-md p-3 max-h-80 overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-2">Endpoint</th>
              <th className="text-right p-2">Count</th>
            </tr>
          </thead>
          <tbody>
            {summary.breakdown &&
              Object.entries(summary.breakdown).map(([endpoint, count]) => (
                <tr key={endpoint} className="border-t">
                  <td className="p-2">{endpoint}</td>
                  <td className="text-right p-2">{count}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
