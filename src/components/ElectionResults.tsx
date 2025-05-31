import React, { useState, useEffect } from "react";

interface ElectionResultsProps {
  electionId: string;
  token: string;
}

interface CandidateVotes {
  candidateId: string;
  votes: number;
}

const ElectionResults: React.FC<ElectionResultsProps> = ({
  electionId,
  token,
}) => {
  const [voteCount, setVoteCount] = useState<number>(0);
  const [status, setStatus] = useState<string>("");
  const [results, setResults] = useState<CandidateVotes[]>([]);

  const fetchResults = async () => {
    try {
      const response = await fetch(
        `http://localhost:5174/api/vote/results/${electionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch results");
      }

      const data = await response.json();
      setVoteCount(data.totalVotes);
      setStatus(data.status);
      setResults(data.results);
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchResults();

    // Set up polling every 5 seconds
    const interval = setInterval(fetchResults, 5000);

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, [electionId, token]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Election Results</h2>
      <div className="mb-4">
        <p className="text-lg">Status: {status}</p>
        <p className="text-lg">Total Votes: {voteCount}</p>
      </div>
      <div className="space-y-4">
        {results.map((result) => (
          <div
            key={result.candidateId}
            className="bg-white p-4 rounded-lg shadow"
          >
            <p className="font-semibold">Candidate ID: {result.candidateId}</p>
            <p>Votes: {result.votes}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ElectionResults;
