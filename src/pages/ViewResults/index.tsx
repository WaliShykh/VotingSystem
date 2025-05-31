import { useEffect, useState } from "react";
import WinnerCard from "./components/WinnerCard";
import VoteDistributionChart from "./components/DonutChart";
import BasicTables from "./components/BasicTables";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useParams } from "react-router-dom";

interface Candidate {
  candidateId: string;
  name: string;
  party: string;
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
  winner: {
    name: string;
    party: string;
    votesSecured: number;
    winningPercentage: number;
    status: string;
  };
  runnerUp: {
    name: string;
    party: string;
    votesSecured: number;
    percentage: number;
    status: string;
  };
  candidates: Candidate[];
}

const ViewResults = () => {
  const { id } = useParams();
  const [results, setResults] = useState<ElectionResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await fetch(
          `http://localhost:5174/api/results/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 401) {
          throw new Error("Unauthorized: Please login again");
        }

        if (response.status === 500) {
          const errorData = await response.json().catch(() => null);
          throw new Error(
            errorData?.message ||
              "Server error occurred. Please try again later."
          );
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(
            errorData?.message || "Failed to fetch election results"
          );
        }

        const data = await response.json();

        // Validate the response data structure
        if (
          !data.election ||
          !data.winner ||
          !data.runnerUp ||
          !Array.isArray(data.candidates)
        ) {
          throw new Error("Invalid response format from server");
        }

        setResults(data);
      } catch (err) {
        console.error("Error fetching results:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchResults();
    } else {
      setError("Election ID is missing");
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="text-red-500 mb-4 text-center max-w-md">
          <h3 className="text-lg font-semibold mb-2">Error Loading Results</h3>
          <p>{error}</p>
        </div>
        {error.includes("Unauthorized") && (
          <button
            onClick={() => (window.location.href = "/login")}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go to Login
          </button>
        )}
        {error.includes("Server error") && (
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  if (!results) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-500">No results found for this election</div>
      </div>
    );
  }

  return (
    <>
      <PageBreadcrumb pageTitle={`View Results - ${results.election.name}`} />

      <div className="grid grid-cols-1 gap-y-5 xl:grid-cols-3 xl:gap-x-5">
        <WinnerCard
          candidateName={results.winner.name}
          party={results.winner.party}
          country="Pakistan"
          position="1st"
          Badgecolor="success"
          positionWon="Winner"
          electionDate={new Date(results.election.endDate).toLocaleDateString()}
          totalVotes={results.winner.votesSecured.toString()}
          votePercentage={`${results.winner.winningPercentage}%`}
        />
        <div className="grid grid-cols-1 gap-y-4">
          {
            <WinnerCard
              candidateName={results.runnerUp.name}
              party={results.runnerUp.party}
              country="Pakistan"
              position="2nd"
              Badgecolor="info"
              positionWon="Runner-Up"
              electionDate={new Date(
                results.election.endDate
              ).toLocaleDateString()}
              totalVotes={results.runnerUp.votesSecured.toString()}
              votePercentage={`${results.runnerUp.percentage}%`}
            />
          }
        </div>
        <VoteDistributionChart
          candidates={results.candidates.map((candidate) => ({
            name: candidate.name,
            percentage: candidate.percentage,
          }))}
        />
      </div>
      <BasicTables candidates={results.candidates} />
    </>
  );
};

export default ViewResults;
