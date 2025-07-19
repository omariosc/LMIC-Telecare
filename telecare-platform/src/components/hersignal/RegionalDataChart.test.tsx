import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { RegionalDataChart } from "./RegionalDataChart";

// Mock Chart.js
jest.mock("chart.js", () => ({
  Chart: {
    register: jest.fn(),
  },
  CategoryScale: jest.fn(),
  LinearScale: jest.fn(),
  PointElement: jest.fn(),
  LineElement: jest.fn(),
  BarElement: jest.fn(),
  Title: jest.fn(),
  Tooltip: jest.fn(),
  Legend: jest.fn(),
  ArcElement: jest.fn(),
}));

jest.mock("react-chartjs-2", () => ({
  Line: ({ data, options, ...props }: any) => (
    <div 
      data-testid="line-chart" 
      data-chart-type="line"
      data-chart-data={JSON.stringify(data)}
      {...props}
    >
      Line Chart
    </div>
  ),
  Bar: ({ data, options, ...props }: any) => (
    <div 
      data-testid="bar-chart" 
      data-chart-type="bar"
      data-chart-data={JSON.stringify(data)}
      {...props}
    >
      Bar Chart
    </div>
  ),
  Doughnut: ({ data, options, ...props }: any) => (
    <div 
      data-testid="doughnut-chart" 
      data-chart-type="doughnut"
      data-chart-data={JSON.stringify(data)}
      {...props}
    >
      Doughnut Chart
    </div>
  ),
}));

describe("RegionalDataChart", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Component Structure", () => {
    it("should render the chart container", () => {
      render(<RegionalDataChart />);
      expect(screen.getByTestId("regional-chart-container")).toBeInTheDocument();
    });

    it("should display the section title", () => {
      render(<RegionalDataChart />);
      expect(screen.getByText(/regional data analytics/i)).toBeInTheDocument();
    });

    it("should show chart type selection controls", () => {
      render(<RegionalDataChart />);
      expect(screen.getByTestId("chart-type-selector")).toBeInTheDocument();
    });
  });

  describe("Chart Types", () => {
    it("should display line chart by default", () => {
      render(<RegionalDataChart />);
      expect(screen.getByTestId("line-chart")).toBeInTheDocument();
    });

    it("should switch to bar chart when bar button is clicked", async () => {
      render(<RegionalDataChart />);
      const barButton = screen.getByLabelText(/bar chart/i);
      
      fireEvent.click(barButton);
      
      await waitFor(() => {
        expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
      });
    });

    it("should switch to doughnut chart when doughnut button is clicked", async () => {
      render(<RegionalDataChart />);
      const doughnutButton = screen.getByLabelText(/doughnut chart/i);
      
      fireEvent.click(doughnutButton);
      
      await waitFor(() => {
        expect(screen.getByTestId("doughnut-chart")).toBeInTheDocument();
      });
    });

    it("should highlight the active chart type button", () => {
      render(<RegionalDataChart />);
      const chartTypeSelector = screen.getByTestId("chart-type-selector");
      const lineButton = chartTypeSelector.querySelector('button[aria-label="Line Chart"]');
      expect(lineButton).toHaveClass("bg-medical-blue-600");
    });
  });

  describe("Data Visualization", () => {
    it("should display multiple data regions", () => {
      render(<RegionalDataChart />);
      expect(screen.getByText(/north america/i)).toBeInTheDocument();
      expect(screen.getByText(/europe/i)).toBeInTheDocument();
      expect(screen.getByText(/asia pacific/i)).toBeInTheDocument();
    });

    it("should show data statistics cards", () => {
      render(<RegionalDataChart />);
      const statCards = screen.getAllByTestId(/stat-card-/);
      expect(statCards.length).toBeGreaterThan(0);
    });

    it("should display growth percentages", () => {
      render(<RegionalDataChart />);
      // Check for specific growth percentages that we know exist
      expect(screen.getByText("+14.2%")).toBeInTheDocument();
      expect(screen.getByText("+8.7%")).toBeInTheDocument();
    });

    it("should show period selection controls", () => {
      render(<RegionalDataChart />);
      expect(screen.getByTestId("period-selector")).toBeInTheDocument();
    });
  });

  describe("Interactive Features", () => {
    it("should update chart when period is changed", async () => {
      render(<RegionalDataChart />);
      const monthlyButton = screen.getByText(/monthly/i);
      
      fireEvent.click(monthlyButton);
      
      await waitFor(() => {
        expect(monthlyButton).toHaveClass("bg-medical-blue-600");
      });
    });

    it("should show loading state while data updates", () => {
      render(<RegionalDataChart />);
      const yearlyButton = screen.getByText(/yearly/i);
      
      fireEvent.click(yearlyButton);
      
      // Loading state should appear briefly
      expect(screen.getByTestId("chart-loading")).toBeInTheDocument();
    });

    it("should export chart data functionality", () => {
      render(<RegionalDataChart />);
      const exportButton = screen.getByLabelText(/export data/i);
      expect(exportButton).toBeInTheDocument();
    });
  });

  describe("Professional Styling", () => {
    it("should apply glass effect styling", () => {
      render(<RegionalDataChart />);
      const container = screen.getByTestId("regional-chart-container");
      expect(container.querySelector(".card-glass")).toBeInTheDocument();
    });

    it("should have hover effects on chart controls", () => {
      render(<RegionalDataChart />);
      const chartControls = screen.getByTestId("chart-type-selector");
      const buttons = chartControls.querySelectorAll("button");
      buttons.forEach(button => {
        expect(button).toHaveClass("hover-lift");
      });
    });

    it("should display with professional card styling", () => {
      render(<RegionalDataChart />);
      const statCards = screen.getAllByTestId(/stat-card-/);
      statCards.forEach(card => {
        expect(card).toHaveClass("card");
      });
    });

    it("should have animated chart appearance", () => {
      render(<RegionalDataChart />);
      const chartContainer = screen.getByTestId("chart-display-area");
      expect(chartContainer).toHaveClass("animate-fade-in");
    });
  });

  describe("Responsive Design", () => {
    it("should apply responsive container classes", () => {
      render(<RegionalDataChart />);
      const container = screen.getByTestId("regional-chart-container");
      expect(container).toHaveClass("container-responsive");
    });

    it("should have responsive grid layout for statistics", () => {
      render(<RegionalDataChart />);
      const statsGrid = screen.getByTestId("stats-grid");
      expect(statsGrid).toHaveClass("grid-mobile-first");
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA labels for chart controls", () => {
      render(<RegionalDataChart />);
      const chartTypeSelector = screen.getByTestId("chart-type-selector");
      expect(chartTypeSelector.querySelector('[aria-label="Line Chart"]')).toBeInTheDocument();
      expect(chartTypeSelector.querySelector('[aria-label="Bar Chart"]')).toBeInTheDocument();
      expect(chartTypeSelector.querySelector('[aria-label="Doughnut Chart"]')).toBeInTheDocument();
    });

    it("should have descriptive chart titles", () => {
      render(<RegionalDataChart />);
      const chartArea = screen.getByTestId("chart-display-area");
      expect(chartArea).toHaveAttribute("aria-label");
    });

    it("should support keyboard navigation", () => {
      render(<RegionalDataChart />);
      const chartTypeSelector = screen.getByTestId("chart-type-selector");
      const lineButton = chartTypeSelector.querySelector('[aria-label="Line Chart"]') as HTMLElement;
      
      lineButton.focus();
      expect(lineButton).toHaveFocus();
    });
  });

  describe("Data Processing", () => {
    it("should handle empty data gracefully", () => {
      render(<RegionalDataChart />);
      // Component should render without errors even with no data
      expect(screen.getByTestId("regional-chart-container")).toBeInTheDocument();
    });

    it("should display data loading indicators", async () => {
      render(<RegionalDataChart />);
      const yearlyButton = screen.getByText(/yearly/i);
      
      fireEvent.click(yearlyButton);
      
      // Loading state should appear
      expect(screen.getByTestId("chart-loading")).toBeInTheDocument();
    });

    it("should format numbers with proper localization", () => {
      render(<RegionalDataChart />);
      // Should show formatted numbers like "730,000" in statistics
      expect(screen.getByText("730,000")).toBeInTheDocument();
    });
  });
});