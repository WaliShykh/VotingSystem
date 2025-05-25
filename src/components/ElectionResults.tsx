import React, { useState, useEffect } from "react";
import { useSocket } from "../hooks/useSocket";

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

  const { getLiveResults } = useSocket({
    token,
    electionId,
    onElectionData: (data) => {
      setVoteCount(data.voteCount);
      setStatus(data.status);
    },
    onVoteUpdate: (data) => {
      setVoteCount(data.totalVotes);
    },
    onElectionStatus: (data) => {
      setStatus(data.status);
    },
    onLiveResults: (data) => {
      setResults(data.results);
    },
  });

  useEffect(() => {
    // Request live results when component mounts
    getLiveResults(electionId);
  }, [electionId, getLiveResults]);

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
