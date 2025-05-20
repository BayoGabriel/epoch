"use client"

import { useState, useEffect } from "react"
import {
  FiUsers,
  FiEye,
  FiBarChart2,
  FiFilter,
  FiRefreshCw,
  FiDownload,
  FiBriefcase,
  FiAward,
  FiBookmark,
  FiStar,
  FiCheckCircle,
  FiCalendar,
  FiTrendingUp,
  FiPieChart,
  FiList,
} from "react-icons/fi"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"
import { Line, Bar, Pie } from "react-chartjs-2"
import DateRangePicker from "./DateRangePicker"

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
)

export default function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    endDate: new Date(),
  })
  const [analyticsData, setAnalyticsData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [opportunityTypeFilter, setOpportunityTypeFilter] = useState("all")
  const [timeFilter, setTimeFilter] = useState("weekly")

  useEffect(() => {
    fetchAnalyticsData()
  }, [dateRange, opportunityTypeFilter, timeFilter])

  const fetchAnalyticsData = async () => {
    setLoading(true)
    try {
      let url = `/api/analytics?startDate=${dateRange.startDate.toISOString()}&endDate=${dateRange.endDate.toISOString()}&timeFilter=${timeFilter}`

      if (opportunityTypeFilter !== "all") {
        url += `&opportunityType=${opportunityTypeFilter}`
      }

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error("Failed to fetch analytics data")
      }

      const data = await response.json()
      setAnalyticsData(data)
    } catch (err) {
      console.error("Error fetching analytics data:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Also, let's modify the generateMockData function to ensure it always returns complete data
  // Replace the generateMockData function with this safer version:

  // Generate mock data for demonstration
  const generateMockData = () => {
    // Generate dates based on the selected time filter
    let dates = []
    const currentDate = new Date()

    if (timeFilter === "weekly") {
      // Generate last 12 weeks
      dates = Array.from({ length: 12 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - i * 7)
        return `Week ${12 - i}`
      }).reverse()
    } else if (timeFilter === "monthly") {
      // Generate last 12 months
      dates = Array.from({ length: 12 }, (_, i) => {
        const date = new Date()
        date.setMonth(date.getMonth() - 11 + i)
        return date.toLocaleString("default", { month: "short" })
      })
    } else {
      // Daily for the selected date range
      const dayDiff = Math.round((dateRange.endDate - dateRange.startDate) / (1000 * 60 * 60 * 24))
      const numDays = Math.min(Math.max(dayDiff, 1), 30) // Cap at 30 days for readability, ensure at least 1 day

      dates = Array.from({ length: numDays }, (_, i) => {
        const date = new Date(dateRange.startDate)
        date.setDate(date.getDate() + i)
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      })
    }

    // Generate random visitor counts with an upward trend
    const visitors = dates.map((_, index) => Math.floor(Math.random() * 500) + 1000 + index * 20)

    // Generate pageviews (higher than visitors)
    const pageviews = visitors.map((count) => count + Math.floor(Math.random() * 1000) + 500)

    // Generate opportunity views
    const opportunityViews = dates.map((_, index) => Math.floor(Math.random() * 300) + 500 + index * 15)

    // Top opportunities with titles instead of IDs
    const topOpportunities = [
      {
        _id: "1",
        title: "Software Engineering Internship at Google",
        company: "Google",
        type: "Internship",
        location: "Mountain View, CA",
        views: 1245,
        interactions: 532,
        tracks: 245,
        applies: 187,
        conversionRate: 42.7,
        applyRate: 15.0,
      },
      {
        _id: "2",
        title: "Data Science Scholarship Program",
        company: "Microsoft",
        type: "Scholarship",
        location: "Remote",
        views: 987,
        interactions: 421,
        tracks: 198,
        applies: 143,
        conversionRate: 42.6,
        applyRate: 14.5,
      },
      {
        _id: "3",
        title: "Product Management Training",
        company: "Amazon",
        type: "Training",
        location: "Seattle, WA",
        views: 876,
        interactions: 354,
        tracks: 167,
        applies: 112,
        conversionRate: 40.4,
        applyRate: 12.8,
      },
      {
        _id: "4",
        title: "UX Design Fellowship Program",
        company: "Apple",
        type: "Fellowship",
        location: "Cupertino, CA",
        views: 765,
        interactions: 298,
        tracks: 143,
        applies: 98,
        conversionRate: 38.9,
        applyRate: 12.8,
      },
      {
        _id: "5",
        title: "Marketing Ambassadorship",
        company: "Meta",
        type: "Ambassadorship",
        location: "New York, NY",
        views: 654,
        interactions: 245,
        tracks: 118,
        applies: 87,
        conversionRate: 37.5,
        applyRate: 13.3,
      },
    ]

    // Opportunity types
    const opportunityTypes = {
      Internship: 35.2,
      Job: 25.7,
      Scholarship: 15.4,
      Fellowship: 10.2,
      Training: 8.3,
      Volunteer: 3.1,
      Ambassadorship: 2.1,
    }

    // User engagement by opportunity
    const opportunityEngagement = topOpportunities.map((opp) => ({
      name: opp.title,
      views: opp.views,
      tracks: opp.tracks,
      applies: opp.applies,
    }))

    return {
      dates,
      visitors,
      pageviews,
      opportunityViews,
      topOpportunities,
      opportunityTypes,
      opportunityEngagement,
      totalVisitors: visitors.reduce((a, b) => a + b, 0),
      totalPageviews: pageviews.reduce((a, b) => a + b, 0),
      totalOpportunityViews: opportunityViews.reduce((a, b) => a + b, 0),
      totalOpportunityInteractions: 5432,
      weeklyGrowth: 12.5,
      monthlyGrowth: 32.8,
    }
  }

  // Use mock data until real data is available
  const data = analyticsData || generateMockData()

  // Find the section where we define chart data objects and ensure they have default values
  // Replace the chart data configurations with these safer versions:

  // Chart configurations
  const visitorChartData = {
    labels: data?.dates || [],
    datasets: [
      {
        label: "Visitors",
        data: data?.visitors || [],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Pageviews",
        data: data?.pageviews || [],
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  }

  const opportunityViewsData = {
    labels: data?.dates || [],
    datasets: [
      {
        label: "Opportunity Views",
        data: data?.opportunityViews || [],
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  }

  const opportunityTypeData = data?.opportunityTypes
    ? {
        labels: Object.keys(data.opportunityTypes),
        datasets: [
          {
            data: Object.values(data.opportunityTypes),
            backgroundColor: [
              "rgba(54, 162, 235, 0.8)",
              "rgba(255, 99, 132, 0.8)",
              "rgba(255, 206, 86, 0.8)",
              "rgba(75, 192, 192, 0.8)",
              "rgba(153, 102, 255, 0.8)",
              "rgba(255, 159, 64, 0.8)",
              "rgba(201, 203, 207, 0.8)",
            ],
            borderWidth: 1,
          },
        ],
      }
    : {
        labels: ["No Data"],
        datasets: [
          {
            data: [1],
            backgroundColor: ["rgba(200, 200, 200, 0.8)"],
            borderWidth: 1,
          },
        ],
      }

  const topOpportunitiesChartData = {
    labels: data?.topOpportunities?.map((opp) => opp.title) || ["No Data"],
    datasets: [
      {
        label: "Views",
        data: data?.topOpportunities?.map((opp) => opp.views) || [0],
        backgroundColor: "rgba(54, 162, 235, 0.8)",
        borderRadius: 6,
      },
    ],
  }

  // Helper function to get opportunity type icon
  const getOpportunityTypeIcon = (type) => {
    switch (type) {
      case "Internship":
        return <FiBriefcase className="h-5 w-5 text-blue-500" />
      case "Job":
        return <FiBriefcase className="h-5 w-5 text-green-500" />
      case "Scholarship":
        return <FiAward className="h-5 w-5 text-purple-500" />
      case "Fellowship":
        return <FiAward className="h-5 w-5 text-indigo-500" />
      case "Training":
        return <FiBookmark className="h-5 w-5 text-orange-500" />
      case "Volunteer":
        return <FiCheckCircle className="h-5 w-5 text-red-500" />
      case "Ambassadorship":
        return <FiStar className="h-5 w-5 text-yellow-500" />
      default:
        return <FiStar className="h-5 w-5 text-blue-500" />
    }
  }

  // Export data as CSV
  const exportToCSV = () => {
    if (!data || !data.topOpportunities) return

    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,"

    // Headers
    csvContent += "Title,Company,Type,Location,Views,Interactions,Tracks,Applies,Conversion Rate,Apply Rate\n"

    // Data rows
    data.topOpportunities.forEach((opp) => {
      const row = [
        `"${opp.title || ""}"`,
        `"${opp.company || ""}"`,
        `"${opp.type || ""}"`,
        `"${opp.location || ""}"`,
        opp.views,
        opp.interactions,
        opp.tracks,
        opp.applies,
        typeof opp.conversionRate === "number" ? opp.conversionRate.toFixed(1) : opp.conversionRate,
        typeof opp.applyRate === "number" ? opp.applyRate.toFixed(1) : opp.applyRate,
      ].join(",")
      csvContent += row + "\n"
    })

    // Create download link
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `opportunities_analytics_${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)

    // Trigger download
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    )
  }

  // Add this right after the error check, before the return statement
  if (!data) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Dashboard Header */}
      <div className="p-6 border-b">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-8">
          <h2 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h2>

          <div className="flex flex-col sm:flex-row gap-4">
            <DateRangePicker startDate={dateRange.startDate} endDate={dateRange.endDate} onChange={setDateRange} />

            <div className="flex gap-2">
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="border rounded-md px-3 py-2 text-sm"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>

              <button
                onClick={fetchAnalyticsData}
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <FiRefreshCw /> Refresh
              </button>

              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <FiDownload /> Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Tabs */}
      <div className="border-b">
        <nav className="flex overflow-x-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-3 font-medium text-sm whitespace-nowrap ${activeTab === "overview" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("visitors")}
            className={`px-4 py-3 font-medium text-sm whitespace-nowrap ${activeTab === "visitors" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            Visitors & Pageviews
          </button>
          <button
            onClick={() => setActiveTab("opportunities")}
            className={`px-4 py-3 font-medium text-sm whitespace-nowrap ${activeTab === "opportunities" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            Opportunities
          </button>
          <button
            onClick={() => setActiveTab("engagement")}
            className={`px-4 py-3 font-medium text-sm whitespace-nowrap ${activeTab === "engagement" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            User Engagement
          </button>
        </nav>
      </div>

      {/* Dashboard Content */}
      <div className="p-6">
        {activeTab === "overview" && (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg border p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Visitors</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">{data.totalVisitors.toLocaleString()}</h3>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <FiUsers className="w-6 h-6 text-blue-500" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <span className="flex items-center text-green-500">
                    <FiTrendingUp className="mr-1" /> {data.weeklyGrowth}%
                  </span>
                  <span className="text-gray-500 ml-2">vs. previous period</span>
                </div>
              </div>

              <div className="bg-white rounded-lg border p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Pageviews</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">{data.totalPageviews.toLocaleString()}</h3>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <FiEye className="w-6 h-6 text-purple-500" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <span className="flex items-center text-green-500">
                    <FiTrendingUp className="mr-1" /> 8.3%
                  </span>
                  <span className="text-gray-500 ml-2">vs. previous period</span>
                </div>
              </div>

              <div className="bg-white rounded-lg border p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Opportunity Views</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">
                      {data.totalOpportunityViews.toLocaleString()}
                    </h3>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-full">
                    <FiList className="w-6 h-6 text-orange-500" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <span className="flex items-center text-green-500">
                    <FiTrendingUp className="mr-1" /> 15.2%
                  </span>
                  <span className="text-gray-500 ml-2">vs. previous period</span>
                </div>
              </div>

              <div className="bg-white rounded-lg border p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Opportunity Interactions</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">
                      {data.totalOpportunityInteractions.toLocaleString()}
                    </h3>
                  </div>
                  <div className="p-3 bg-red-100 rounded-full">
                    <FiBarChart2 className="w-6 h-6 text-red-500" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <span className="flex items-center text-green-500">
                    <FiTrendingUp className="mr-1" /> 11.8%
                  </span>
                  <span className="text-gray-500 ml-2">vs. previous period</span>
                </div>
              </div>
            </div>

            {/* Main Chart - Opportunity Views per Week */}
            <div className="bg-white rounded-lg border p-6 shadow-sm mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Opportunity Views Trend</h3>
              <div className="h-80">
                <Line
                  data={opportunityViewsData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: "rgba(0, 0, 0, 0.05)",
                        },
                        title: {
                          display: true,
                          text: "Number of Views",
                        },
                      },
                      x: {
                        grid: {
                          display: false,
                        },
                        title: {
                          display: true,
                          text: timeFilter === "weekly" ? "Week" : timeFilter === "monthly" ? "Month" : "Day",
                        },
                      },
                    },
                    plugins: {
                      legend: {
                        position: "top",
                      },
                      tooltip: {
                        mode: "index",
                        intersect: false,
                      },
                      title: {
                        display: true,
                        text: `Opportunity Views per ${timeFilter === "weekly" ? "Week" : timeFilter === "monthly" ? "Month" : "Day"}`,
                      },
                    },
                    interaction: {
                      mode: "nearest",
                      axis: "x",
                      intersect: false,
                    },
                  }}
                />
              </div>
            </div>

            {/* Top Opportunities */}
            <div className="bg-white rounded-lg border p-6 shadow-sm mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Top Opportunities</h3>
                <div className="flex items-center gap-2">
                  <select
                    className="border rounded-md px-3 py-1.5 text-sm"
                    value={opportunityTypeFilter}
                    onChange={(e) => setOpportunityTypeFilter(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    <option value="Internship">Internship</option>
                    <option value="Job">Job</option>
                    <option value="Scholarship">Scholarship</option>
                    <option value="Fellowship">Fellowship</option>
                    <option value="Training">Training</option>
                    <option value="Volunteer">Volunteer</option>
                    <option value="Ambassadorship">Ambassadorship</option>
                  </select>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Opportunity
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Views
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Interactions
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Conversion Rate
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.topOpportunities.map((opportunity) => (
                      <tr key={opportunity._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                              {getOpportunityTypeIcon(opportunity.type)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{opportunity.title}</div>
                              <div className="text-xs text-gray-500">
                                {opportunity.company} • {opportunity.type} • {opportunity.location}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {opportunity.views.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {(opportunity.interactions || opportunity.totalInteractions || 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm text-gray-900">
                              {typeof opportunity.conversionRate === "number"
                                ? opportunity.conversionRate.toFixed(1)
                                : opportunity.conversionRate}
                              %
                            </span>
                            <div className="ml-2 w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${Math.min(opportunity.conversionRate, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Opportunities Chart */}
            <div className="bg-white rounded-lg border p-6 shadow-sm mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Opportunities by Views</h3>
              <div className="h-80">
                <Bar
                  data={topOpportunitiesChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: "y",
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          display: false,
                        },
                      },
                      x: {
                        grid: {
                          color: "rgba(0, 0, 0, 0.05)",
                        },
                        title: {
                          display: true,
                          text: "Number of Views",
                        },
                      },
                    },
                    plugins: {
                      legend: {
                        display: false,
                      },
                      tooltip: {
                        callbacks: {
                          title: (tooltipItems) => tooltipItems[0].label,
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>

            {/* Distribution Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Opportunity Types Distribution</h3>
                <div className="h-64">
                  <Pie
                    data={opportunityTypeData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "right",
                        },
                      },
                    }}
                  />
                </div>
              </div>

              <div className="bg-white rounded-lg border p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Visitors & Pageviews</h3>
                <div className="h-64">
                  <Line
                    data={visitorChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: {
                            color: "rgba(0, 0, 0, 0.05)",
                          },
                        },
                        x: {
                          grid: {
                            display: false,
                          },
                        },
                      },
                      plugins: {
                        legend: {
                          position: "top",
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "visitors" && (
          <>
            <div className="bg-white rounded-lg border p-6 shadow-sm mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Visitors & Pageviews Trend</h3>
              <div className="h-96">
                <Line
                  data={visitorChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: "rgba(0, 0, 0, 0.05)",
                        },
                      },
                      x: {
                        grid: {
                          display: false,
                        },
                      },
                    },
                    plugins: {
                      legend: {
                        position: "top",
                      },
                      tooltip: {
                        mode: "index",
                        intersect: false,
                      },
                    },
                    interaction: {
                      mode: "nearest",
                      axis: "x",
                      intersect: false,
                    },
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg border p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Visitors</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">{data.totalVisitors.toLocaleString()}</h3>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <FiUsers className="w-6 h-6 text-blue-500" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <span className="flex items-center text-green-500">
                    <FiTrendingUp className="mr-1" /> {data.weeklyGrowth}%
                  </span>
                  <span className="text-gray-500 ml-2">vs. previous period</span>
                </div>
              </div>

              <div className="bg-white rounded-lg border p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Pageviews</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">{data.totalPageviews.toLocaleString()}</h3>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <FiEye className="w-6 h-6 text-purple-500" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <span className="flex items-center text-green-500">
                    <FiTrendingUp className="mr-1" /> 8.3%
                  </span>
                  <span className="text-gray-500 ml-2">vs. previous period</span>
                </div>
              </div>

              <div className="bg-white rounded-lg border p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Pages / Session</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">3.8</h3>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <FiBarChart2 className="w-6 h-6 text-green-500" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <span className="flex items-center text-green-500">
                    <FiTrendingUp className="mr-1" /> 2.1%
                  </span>
                  <span className="text-gray-500 ml-2">vs. previous period</span>
                </div>
              </div>

              <div className="bg-white rounded-lg border p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Avg. Session Duration</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">4:32</h3>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <FiCalendar className="w-6 h-6 text-yellow-500" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <span className="flex items-center text-green-500">
                    <FiTrendingUp className="mr-1" /> 5.3%
                  </span>
                  <span className="text-gray-500 ml-2">vs. previous period</span>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "opportunities" && (
          <>
            {/* Opportunity Views Trend */}
            <div className="bg-white rounded-lg border p-6 shadow-sm mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Opportunity Views Trend</h3>
              <div className="h-80">
                <Line
                  data={opportunityViewsData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: "rgba(0, 0, 0, 0.05)",
                        },
                        title: {
                          display: true,
                          text: "Number of Views",
                        },
                      },
                      x: {
                        grid: {
                          display: false,
                        },
                        title: {
                          display: true,
                          text: timeFilter === "weekly" ? "Week" : timeFilter === "monthly" ? "Month" : "Day",
                        },
                      },
                    },
                    plugins: {
                      legend: {
                        position: "top",
                      },
                      tooltip: {
                        mode: "index",
                        intersect: false,
                      },
                      title: {
                        display: true,
                        text: `Opportunity Views per ${timeFilter === "weekly" ? "Week" : timeFilter === "monthly" ? "Month" : "Day"}`,
                      },
                    },
                    interaction: {
                      mode: "nearest",
                      axis: "x",
                      intersect: false,
                    },
                  }}
                />
              </div>
            </div>

            {/* Top Opportunities */}
            <div className="bg-white rounded-lg border p-6 shadow-sm mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Top Opportunities</h3>
                <div className="flex items-center gap-2">
                  <select
                    className="border rounded-md px-3 py-1.5 text-sm"
                    value={opportunityTypeFilter}
                    onChange={(e) => setOpportunityTypeFilter(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    <option value="Internship">Internship</option>
                    <option value="Job">Job</option>
                    <option value="Scholarship">Scholarship</option>
                    <option value="Fellowship">Fellowship</option>
                    <option value="Training">Training</option>
                    <option value="Volunteer">Volunteer</option>
                    <option value="Ambassadorship">Ambassadorship</option>
                  </select>
                  <button className="flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md text-sm">
                    <FiFilter className="w-4 h-4" /> Filter
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Opportunity
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Views
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Interactions
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Conversion Rate
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Apply Rate
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.topOpportunities.map((opportunity) => (
                      <tr key={opportunity._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                              {getOpportunityTypeIcon(opportunity.type)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{opportunity.title}</div>
                              <div className="text-xs text-gray-500">
                                {opportunity.company} • {opportunity.type} • {opportunity.location}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {opportunity.views.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {(opportunity.interactions || opportunity.totalInteractions || 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm text-gray-900">
                              {typeof opportunity.conversionRate === "number"
                                ? opportunity.conversionRate.toFixed(1)
                                : opportunity.conversionRate}
                              %
                            </span>
                            <div className="ml-2 w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${Math.min(opportunity.conversionRate, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm text-gray-900">
                              {typeof opportunity.applyRate === "number"
                                ? opportunity.applyRate.toFixed(1)
                                : opportunity.applyRate || "0.0"}
                              %
                            </span>
                            <div className="ml-2 w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${Math.min(opportunity.applyRate || 0, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Opportunities Chart */}
            <div className="bg-white rounded-lg border p-6 shadow-sm mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Opportunities by Views</h3>
              <div className="h-80">
                <Bar
                  data={topOpportunitiesChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: "y",
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          display: false,
                        },
                      },
                      x: {
                        grid: {
                          color: "rgba(0, 0, 0, 0.05)",
                        },
                        title: {
                          display: true,
                          text: "Number of Views",
                        },
                      },
                    },
                    plugins: {
                      legend: {
                        display: false,
                      },
                      tooltip: {
                        callbacks: {
                          title: (tooltipItems) => tooltipItems[0].label,
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {opportunityTypeData && (
                <div className="bg-white rounded-lg border p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Opportunity Types</h3>
                  <div className="h-80">
                    <Pie
                      data={opportunityTypeData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: "right",
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="bg-white rounded-lg border p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Opportunity Conversion Funnel</h3>
                <div className="h-80 flex flex-col justify-center">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Views</span>
                        <span className="text-sm font-medium text-gray-700">100%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div className="bg-blue-500 h-4 rounded-full" style={{ width: "100%" }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Tracking/Bookmarking</span>
                        <span className="text-sm font-medium text-gray-700">42%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div className="bg-blue-500 h-4 rounded-full" style={{ width: "42%" }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Interactions</span>
                        <span className="text-sm font-medium text-gray-700">28%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div className="bg-blue-500 h-4 rounded-full" style={{ width: "28%" }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Applied</span>
                        <span className="text-sm font-medium text-gray-700">18%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div className="bg-blue-500 h-4 rounded-full" style={{ width: "18%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "engagement" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg border p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Interactions</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">
                      {data.totalOpportunityInteractions.toLocaleString()}
                    </h3>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <FiBarChart2 className="w-6 h-6 text-blue-500" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <span className="flex items-center text-green-500">
                    <FiTrendingUp className="mr-1" /> 14.2%
                  </span>
                  <span className="text-gray-500 ml-2">vs. previous period</span>
                </div>
              </div>

              <div className="bg-white rounded-lg border p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Tracked Opportunities</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">1,245</h3>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <FiBookmark className="w-6 h-6 text-purple-500" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <span className="flex items-center text-green-500">
                    <FiTrendingUp className="mr-1" /> 8.7%
                  </span>
                  <span className="text-gray-500 ml-2">vs. previous period</span>
                </div>
              </div>

              <div className="bg-white rounded-lg border p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Applied Opportunities</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">876</h3>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <FiCheckCircle className="w-6 h-6 text-green-500" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <span className="flex items-center text-green-500">
                    <FiTrendingUp className="mr-1" /> 12.3%
                  </span>
                  <span className="text-gray-500 ml-2">vs. previous period</span>
                </div>
              </div>

              <div className="bg-white rounded-lg border p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">18.4%</h3>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <FiPieChart className="w-6 h-6 text-yellow-500" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <span className="flex items-center text-green-500">
                    <FiTrendingUp className="mr-1" /> 2.1%
                  </span>
                  <span className="text-gray-500 ml-2">vs. previous period</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6 shadow-sm mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">User Engagement by Opportunity</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Opportunity
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Views
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Tracked
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Applied
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Conversion
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.topOpportunities.map((opportunity) => (
                      <tr key={opportunity._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                              {getOpportunityTypeIcon(opportunity.type)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{opportunity.title}</div>
                              <div className="text-xs text-gray-500">
                                {opportunity.company} • {opportunity.type}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {opportunity.views.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {opportunity.tracks.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {opportunity.applies.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm text-gray-900">
                              {typeof opportunity.conversionRate === "number"
                                ? opportunity.conversionRate.toFixed(1)
                                : opportunity.conversionRate}
                              %
                            </span>
                            <div className="ml-2 w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${Math.min(opportunity.conversionRate, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">User Flow</h3>
              <div className="h-80 flex flex-col justify-center">
                <div className="space-y-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <FiEye className="h-6 w-6 text-blue-500" />
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="h-2 bg-blue-500 rounded-full"></div>
                    </div>
                    <div className="text-sm font-medium">View Opportunity</div>
                    <div className="ml-auto text-sm text-gray-500">100%</div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <FiBookmark className="h-6 w-6 text-purple-500" />
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="h-2 bg-purple-500 rounded-full" style={{ width: "42%" }}></div>
                    </div>
                    <div className="text-sm font-medium">Track Opportunity</div>
                    <div className="ml-auto text-sm text-gray-500">42%</div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <FiBarChart2 className="h-6 w-6 text-green-500" />
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="h-2 bg-green-500 rounded-full" style={{ width: "28%" }}></div>
                    </div>
                    <div className="text-sm font-medium">Interact with Details</div>
                    <div className="ml-auto text-sm text-gray-500">28%</div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <FiCheckCircle className="h-6 w-6 text-orange-500" />
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="h-2 bg-orange-500 rounded-full" style={{ width: "18%" }}></div>
                    </div>
                    <div className="text-sm font-medium">Apply to Opportunity</div>
                    <div className="ml-auto text-sm text-gray-500">18%</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
