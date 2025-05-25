import { useEffect, useCallback } from "react";
import SocketService from "../services/socketService";

interface UseSocketProps {
  token: string;
  electionId?: string;
  onElectionData?: (data: {
    electionId: string;
    voteCount: number;
    status: string;
    startDate: string;
    endDate: string;
  }) => void;
  onVoteUpdate?: (data: {
    electionId: string;
    totalVotes: number;
    candidateVotes: number;
    candidateId: string;
  }) => void;
  onElectionStatus?: (data: { electionId: string; status: string }) => void;
  onLiveResults?: (data: {
    electionId: string;
    results: Array<{ candidateId: string; votes: number }>;
  }) => void;
}

export const useSocket = ({
  token,
  electionId,
  onElectionData,
  onVoteUpdate,
  onElectionStatus,
  onLiveResults,
}: UseSocketProps) => {
  const socketService = SocketService.getInstance();

  useEffect(() => {
    // Connect to socket when component mounts
    socketService.connect(token);

    // Join election room if electionId is provided
    if (electionId) {
      socketService.joinElectionRoom(electionId);
    }

    // Set up event listeners
    if (onElectionData) {
      socketService.onElectionData(onElectionData);
    }

    if (onVoteUpdate) {
      socketService.onVoteUpdate(onVoteUpdate);
    }

    if (onElectionStatus) {
      socketService.onElectionStatus(onElectionStatus);
    }

    if (onLiveResults) {
      socketService.onLiveResults(onLiveResults);
    }

    // Cleanup on unmount
    return () => {
      socketService.disconnect();
    };
  }, [
    token,
    electionId,
    onElectionData,
    onVoteUpdate,
    onElectionStatus,
    onLiveResults,
  ]);

  const getLiveResults = useCallback((electionId: string) => {
    socketService.getLiveResults(electionId);
  }, []);

  return {
    getLiveResults,
  };
};
