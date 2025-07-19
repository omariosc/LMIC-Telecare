"use client";

import React, { useState, useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

type ChartType = "line" | "bar" | "doughnut";
type Period = "weekly" | "monthly" | "quarterly" | "yearly";

const REGIONAL_DATA = {
  weekly: {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "North America",
        data: [2400, 2600, 2800, 3000],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
      },
      {
        label: "Europe",
        data: [1800, 2000, 2200, 2400],
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.4,
      },
      {
        label: "Asia Pacific",
        data: [1200, 1400, 1600, 1800],
        borderColor: "rgb(244, 63, 94)",
        backgroundColor: "rgba(244, 63, 94, 0.1)",
        tension: 0.4,
      },
    ],
  },
  monthly: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "North America",
        data: [12000, 13500, 14200, 15800, 16400, 17200],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
      },
      {
        label: "Europe",
        data: [9500, 10200, 11000, 11800, 12300, 13100],
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.4,
      },
      {
        label: "Asia Pacific",
        data: [6800, 7200, 7900, 8400, 9100, 9800],
        borderColor: "rgb(244, 63, 94)",
        backgroundColor: "rgba(244, 63, 94, 0.1)",
        tension: 0.4,
      },
    ],
  },
  quarterly: {
    labels: ["Q1", "Q2", "Q3", "Q4"],
    datasets: [
      {
        label: "North America",
        data: [45000, 52000, 58000, 65000],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
      },
      {
        label: "Europe",
        data: [35000, 38000, 42000, 46000],
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.4,
      },
      {
        label: "Asia Pacific",
        data: [22000, 26000, 29000, 33000],
        borderColor: "rgb(244, 63, 94)",
        backgroundColor: "rgba(244, 63, 94, 0.1)",
        tension: 0.4,
      },
    ],
  },
  yearly: {
    labels: ["2020", "2021", "2022", "2023", "2024"],
    datasets: [
      {
        label: "North America",
        data: [180000, 220000, 250000, 280000, 320000],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
      },
      {
        label: "Europe",
        data: [140000, 160000, 180000, 200000, 230000],
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.4,
      },
      {
        label: "Asia Pacific",
        data: [90000, 110000, 130000, 150000, 180000],
        borderColor: "rgb(244, 63, 94)",
        backgroundColor: "rgba(244, 63, 94, 0.1)",
        tension: 0.4,
      },
    ],
  },
};

const STATISTICS = [
  {
    label: "Total Signals",
    value: "730,000",
    growth: "+14.2%",
    color: "medical-blue-600",
  },
  {
    label: "Active Regions",
    value: "156",
    growth: "+8.7%",
    color: "medical-green-600",
  },
  {
    label: "Data Points",
    value: "12.4M",
    growth: "+22.1%",
    color: "medical-purple-600",
  },
  {
    label: "Coverage",
    value: "94.8%",
    growth: "+3.2%",
    color: "medical-orange-600",
  },
];

export const DataChart: React.FC = () => {
  const [chartType, setChartType] = useState<ChartType>("line");
  const [period, setPeriod] = useState<Period>("monthly");
  const [isLoading, setIsLoading] = useState(false);

  const currentData = useMemo(() => REGIONAL_DATA[period], [period]);

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top" as const,
          labels: {
            usePointStyle: true,
            padding: 20,
          },
        },
        title: {
          display: true,
          text: `Regional Data Analytics - ${period.charAt(0).toUpperCase() + period.slice(1)} View`,
          font: {
            size: 16,
            weight: "bold" as const,
          },
        },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          titleColor: "white",
          bodyColor: "white",
          borderColor: "rgba(255, 255, 255, 0.1)",
          borderWidth: 1,
          cornerRadius: 8,
          callbacks: {
            label: function (context: any) {
              return `${context.dataset.label}: ${context.parsed.y.toLocaleString()}`;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value: any) {
              return value.toLocaleString();
            },
          },
          grid: {
            color: "rgba(0, 0, 0, 0.1)",
          },
        },
        x: {
          grid: {
            color: "rgba(0, 0, 0, 0.1)",
          },
        },
      },
      animation: {
        duration: 1000,
        easing: "easeInOutQuart" as const,
      },
    }),
    [period]
  );

  const doughnutData = useMemo(
    () => ({
      labels: currentData.datasets.map((dataset) => dataset.label),
      datasets: [
        {
          data: currentData.datasets.map((dataset) =>
            dataset.data.reduce((sum, value) => sum + value, 0)
          ),
          backgroundColor: [
            "rgba(59, 130, 246, 0.8)",
            "rgba(16, 185, 129, 0.8)",
            "rgba(244, 63, 94, 0.8)",
          ],
          borderColor: [
            "rgb(59, 130, 246)",
            "rgb(16, 185, 129)",
            "rgb(244, 63, 94)",
          ],
          borderWidth: 2,
        },
      ],
    }),
    [currentData]
  );

  const handlePeriodChange = (newPeriod: Period) => {
    if (newPeriod === period) return;

    setIsLoading(true);
    setPeriod(newPeriod);

    // Simulate data loading
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const handleExportData = () => {
    // TODO: Implement actual CSV download
    // In a real app, this would process currentData.datasets
    // to create and download a CSV file
  };

  const renderChart = () => {
    if (isLoading) {
      return (
        <div
          data-testid="chart-loading"
          className="flex items-center justify-center h-96"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-blue-600"></div>
        </div>
      );
    }

    switch (chartType) {
      case "line":
        return (
          <Line
            data={currentData}
            options={chartOptions}
            data-testid="line-chart"
          />
        );
      case "bar":
        return (
          <Bar
            data={currentData}
            options={chartOptions}
            data-testid="bar-chart"
          />
        );
      case "doughnut":
        return (
          <Doughnut
            data={doughnutData}
            options={{
              ...chartOptions,
              scales: undefined,
            }}
            data-testid="doughnut-chart"
          />
        );
      default:
        return (
          <Line
            data={currentData}
            options={chartOptions}
            data-testid="line-chart"
          />
        );
    }
  };

  return (
    <section
      className="py-24 md:py-32 relative overflow-hidden medical-gradient"
      role="region"
      aria-label="regional data analytics dashboard"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-medical-green-400 rounded-full blur-2xl animate-float" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-medical-blue-400 rounded-full blur-2xl animate-pulse-slow" />
      </div>

      <div
        data-testid="regional-chart-container"
        className="container-responsive relative z-10"
      >
        <div className="text-center max-w-5xl mx-auto mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-medical-green-100 rounded-full text-medical-green-700 font-medium text-sm mb-6">
            📊 Data Visualization
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6">
            <span className="text-gradient">Regional Data Analytics</span>
          </h2>

          <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
            Comprehensive regional performance metrics and data insights
          </p>
        </div>

        {/* Statistics Cards */}
        <div data-testid="stats-grid" className="grid-mobile-first gap-6 mb-16">
          {STATISTICS.map((stat, index) => (
            <div
              key={stat.label}
              data-testid={`stat-card-${index}`}
              className="card card-medical hover-lift text-center group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className={`text-3xl font-black text-${stat.color} mb-2 group-hover:scale-110 transition-transform`}
              >
                {stat.value}
              </div>
              <div className="text-sm font-medium text-gray-700 uppercase tracking-wide mb-2">
                {stat.label}
              </div>
              <div className="text-medical-green-600 font-semibold text-sm">
                {stat.growth}
              </div>
            </div>
          ))}
        </div>

        {/* Chart Controls */}
        <div className="card-glass p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-6 justify-between items-center mb-8">
            {/* Chart Type Selector */}
            <div
              data-testid="chart-type-selector"
              className="flex gap-2 bg-gray-100 p-1 rounded-lg"
            >
              {[
                { type: "line" as ChartType, icon: "📈", label: "Line Chart" },
                { type: "bar" as ChartType, icon: "📊", label: "Bar Chart" },
                {
                  type: "doughnut" as ChartType,
                  icon: "🍩",
                  label: "Doughnut Chart",
                },
              ].map(({ type, icon, label }) => (
                <button
                  key={type}
                  aria-label={label}
                  className={`px-4 py-2 rounded-md transition-all hover-lift ${
                    chartType === type
                      ? "bg-medical-blue-600 text-white shadow-md"
                      : "bg-transparent text-gray-600 hover:bg-gray-200"
                  }`}
                  onClick={() => setChartType(type)}
                >
                  <span className="mr-2">{icon}</span>
                  {label.split(" ")[0]}
                </button>
              ))}
            </div>

            {/* Period Selector */}
            <div
              data-testid="period-selector"
              className="flex gap-2 bg-gray-100 p-1 rounded-lg"
            >
              {[
                { period: "weekly" as Period, label: "Weekly" },
                { period: "monthly" as Period, label: "Monthly" },
                { period: "quarterly" as Period, label: "Quarterly" },
                { period: "yearly" as Period, label: "Yearly" },
              ].map(({ period: periodType, label }) => (
                <button
                  key={periodType}
                  className={`px-4 py-2 rounded-md transition-all hover-lift ${
                    period === periodType
                      ? "bg-medical-blue-600 text-white shadow-md"
                      : "bg-transparent text-gray-600 hover:bg-gray-200"
                  }`}
                  onClick={() => handlePeriodChange(periodType)}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Export Button */}
            <button
              aria-label="Export data"
              className="btn-outline hover-lift"
              onClick={handleExportData}
            >
              <span>📤</span>
              Export
            </button>
          </div>

          {/* Chart Display Area */}
          <div
            data-testid="chart-display-area"
            aria-label={`${chartType} chart showing regional data for ${period} period`}
            className="h-96 animate-fade-in"
          >
            {renderChart()}
          </div>
        </div>

        {/* Regional Performance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              region: "North America",
              performance: "Leading",
              trend: "↗️",
              description: "Consistent growth across all metrics",
              color: "medical-blue-600",
            },
            {
              region: "Europe",
              performance: "Strong",
              trend: "📈",
              description: "Steady performance with good adoption",
              color: "medical-green-600",
            },
            {
              region: "Asia Pacific",
              performance: "Growing",
              trend: "🚀",
              description: "Rapid expansion and market penetration",
              color: "medical-red-600",
            },
          ].map((region, index) => (
            <div
              key={region.region}
              className="card card-medical hover-lift group"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  {region.region}
                </h3>
                <span className="text-2xl">{region.trend}</span>
              </div>
              <div className={`text-${region.color} font-semibold mb-2`}>
                {region.performance}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {region.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
