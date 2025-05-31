import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

interface Candidate {
  name: string;
  votesSecured: number;
  percentage: number;
  status: string;
}

interface ElectionResults {
  election: {
    id: string;
    name: string;
    status: string;
    startDate: string;
    endDate: string;
    totalVotesCast: number;
  };
  candidates: Candidate[];
}

export default function StatisticsChart() {
  const { id } = useParams<{ id: string }>();
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token"); // Get token from localStorage

      if (!token) {
        console.error("No authentication token found");
        setLoading(false);
        return;
      }

      if (!id) {
        console.error("No election ID found");
        setLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:5174/api/results/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ElectionResults = await response.json();

      // Sort candidates by votes and take top 5
      const topCandidates = [...data.candidates]
        .sort((a, b) => b.votesSecured - a.votesSecured)
        .slice(0, 5);

      const seriesData = [
        {
          name: "Votes",
          data: topCandidates.map((candidate) => ({
            x: candidate.name,
            y: candidate.votesSecured,
          })),
        },
      ];

      setChartData(seriesData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching election results:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchData();

    // Set up polling every 5 seconds
    const interval = setInterval(fetchData, 5000);

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, [id]);

  const options: ApexOptions = {
    legend: {
      show: false,
    },
    colors: [
      "#4F46E5",
      "#4F46E5",
      "#14B8A6",
      "#EF4444",
      "#FACC15",

      "#6366F1",
      "#2DD4BF",
      "#F87171",
      "#FDE047",

      "#4338CA",
      "#0F766E",
      "#B91C1C",
      "#CA8A04",
    ],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "bar",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val + " votes";
      },
      style: {
        fontSize: "12px",
        colors: ["#fff"],
      },
    },
    xaxis: {
      categories: chartData[0]?.data.map((item: any) => item.x) || [],
      title: {
        text: "Votes",
        style: {
          fontSize: "14px",
          fontWeight: 500,
        },
      },
      min: 0,
      max:
        chartData[0]?.data.reduce(
          (max: number, item: any) => Math.max(max, item.y),
          0
        ) * 1.4,
      tickAmount: 5,
      labels: {
        formatter: (value: string) => {
          return Math.round(Number(value)).toString();
        },
      },
    },
    yaxis: {
      title: {
        text: "Candidates",
        style: {
          fontSize: "14px",
          fontWeight: 500,
        },
      },
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " votes";
        },
      },
    },
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Candidate Statistics
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Vote distribution for each candidate
          </p>
        </div>
      </div>

      <div className="max-w-full">
        <div className="min-w-full">
          {!loading && chartData.length > 0 ? (
            <Chart
              options={options}
              series={chartData}
              type="bar"
              height={310}
            />
          ) : (
            <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
              <div className="flex flex-col mb-6 sm:flex-row sm:justify-between">
                <div className="w-full">
                  <div className="flex gap-x-4 justify-center items-center">
                    <div className="h-12 w-12 rounded-full border-4 border-gray-200 border-t-[#4F46E5] border-r-[#14B8A6] border-b-[#FACC15] border-l-[#EF4444] animate-spin bg-transparent duration-700 ease-linear"></div>
                    <p className="text-gray-500">Loading chart data...</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
