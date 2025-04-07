"use client"
import { useEffect, useState } from "react";

export default function AnalyticsDashboard() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/getanalytics")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch analytics");
        return res.json();
      })
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="my-40">
      <h2>Analytics Data</h2>
      {error && <p className="text-red-600">{error}</p>}
      <ul>
        {data.map((item, index) => (
          <li key={index}>{item.url} - {item.event}</li>
        ))}
      </ul>
    </div>
  );
}
