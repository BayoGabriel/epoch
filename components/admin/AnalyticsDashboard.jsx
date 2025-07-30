"use client";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

export default function AnalyticsDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [timeFilter, setTimeFilter] = useState("weekly");
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    endDate: new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          startDate: new Date(dateRange.startDate).toISOString(),
          endDate: new Date(dateRange.endDate).toISOString(),
          timeFilter,
        });
        const res = await fetch(`/api/analytics?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch analytics");
        setData(await res.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, [dateRange, timeFilter]);

  return (
    <div className="bg-white p-8 rounded-lg shadow mb-8">
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold">Website Analytics</h2>
        <select
          value={timeFilter}
          onChange={e => setTimeFilter(e.target.value)}
          className="border rounded px-3 py-1"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
        <input
          type="date"
          value={dateRange.startDate}
          onChange={e => setDateRange(r => ({ ...r, startDate: e.target.value }))}
          className="border rounded px-3 py-1"
        />
        <span>-</span>
        <input
          type="date"
          value={dateRange.endDate}
          onChange={e => setDateRange(r => ({ ...r, endDate: e.target.value }))}
          className="border rounded px-3 py-1"
        />
      </div>
      {loading ? (
        <div>Loading analytics...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : data ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <Stat label="Visitors" value={data.totalVisitors} />
            <Stat label="Pageviews" value={data.totalPageviews} />
            <Stat label="Opportunity Views" value={data.totalOpportunityViews} />
            <Stat label="Top Opportunities" value={data.topOpportunities?.[0]?.title || "-"} />
          </div>
          <div className="mb-8">
            <h3 className="font-semibold mb-2">Traffic Over Time</h3>
            <Line
              data={{
                labels: data.timeSeriesData.map(
                  d => d._id.week ? `Week ${d._id.week}` : d._id.day ? `${d._id.month}/${d._id.day}` : d._id.month ? `Month ${d._id.month}` : ""
                ),
                datasets: [
                  {
                    label: "Pageviews",
                    data: data.timeSeriesData.map(d => d.pageviews),
                    fill: false,
                    borderColor: "#2563eb",
                    tension: 0.2,
                  },
                  {
                    label: "Opportunity Views",
                    data: data.timeSeriesData.map(d => d.opportunityViews),
                    fill: false,
                    borderColor: "#16a34a",
                    tension: 0.2,
                  },
                ],
              }}
              options={{ responsive: true, plugins: { legend: { position: "top" } } }}
            />
          </div>
          <div>
            <h3 className="font-semibold mb-2">Most Visited Opportunities</h3>
            <ol className="list-decimal ml-6">
              {data.topOpportunities?.map((opp, i) => (
                <li key={opp.slug}>
                  <a href={`/prospecta/${opp.slug}`} className="text-blue-600 hover:underline">{opp.title}</a>
                  {" "}
                  <span className="text-gray-500">({opp.views} views)</span>
                </li>
              ))}
            </ol>
          </div>
        </>
      ) : null}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-gray-50 rounded p-4 text-center">
      <div className="text-lg font-bold">{value}</div>
      <div className="text-gray-500 text-sm">{label}</div>
    </div>
  );
}
