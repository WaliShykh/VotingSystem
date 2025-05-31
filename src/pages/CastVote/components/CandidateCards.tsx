import { useState, useEffect } from "react";
import Button from "../../../components/ui/button/Button";
import { Modal } from "../../../components/ui/modal";
import { toast } from "react-toastify";
import Alert from "../../../components/ui/alert/Alert";
import { useParams } from "react-router-dom";

interface Candidate {
  id: string;
  name: string;
  party: string;
  votes: number;
}

interface ElectionData {
  electionTitle: string;
  candidates: Candidate[];
  hasVoted: boolean;
}

export default function CandidateCards() {
  const { id } = useParams<{ id: string }>();
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmationOption, setConfirmationOption] = useState<string>("");
  const [electionData, setElectionData] = useState<ElectionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchElectionData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      if (!id) {
        throw new Error("Election ID is required");
      }

      const response = await fetch(
        `http://localhost:5174/api/vote/candidates/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 401) {
        throw new Error("Authentication failed. Please login again.");
      }

      if (response.status === 500) {
        const errorData = await response.json().catch(() => null);
        console.error("Server Error Details:", errorData);

        // Handle specific MongoDB ObjectId error
        if (errorData?.error?.kind === "ObjectId") {
          throw new Error("Invalid election ID format");
        }

        throw new Error("Server error occurred. Please try again later.");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("API Error Details:", errorData);
        throw new Error("Failed to fetch election data");
      }

      const data = await response.json();
      setElectionData(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching election data:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to load election data. Please try again later.";
      setError(errorMessage);
      toast.error(errorMessage);

      if (errorMessage.includes("Authentication")) {
        // You might want to redirect to login page here
        // window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  // Add retry mechanism for failed requests
  const retryFetch = async (retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        await fetchElectionData();
        return; // Success, exit the retry loop
      } catch (err) {
        if (i === retries - 1) throw err; // Last retry, throw the error
        await new Promise((resolve) => setTimeout(resolve, delay)); // Wait before retrying
      }
    }
  };

  useEffect(() => {
    if (id) {
      retryFetch();
    }
  }, [id]);

  const handleVoteClick = (candidate: Candidate) => {
    if (electionData?.hasVoted) {
      toast.warning("You have already cast your vote");
      return;
    }
    setSelectedCandidate(candidate);
    setIsModalOpen(true);
  };

  const handleConfirmVote = async () => {
    if (confirmationOption === "yes" && selectedCandidate && id) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication required");
        }

        const response = await fetch("http://localhost:5174/api/vote/cast", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            candidateId: selectedCandidate.id,
            electionId: id,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          console.error("Vote Casting Error:", errorData);
          throw new Error("Failed to cast vote");
        }

        setIsModalOpen(false);
        setConfirmationOption("");
        toast.success(
          `Vote Casted for ${selectedCandidate.name} successfully`,
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: "light",
          }
        );

        // Refresh the election data to show updated vote count
        await fetchElectionData();
      } catch (err) {
        console.error("Error casting vote:", err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to cast vote. Please try again.";
        toast.error(errorMessage);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="error" title="Error" message={error} showLink={false} />
    );
  }

  if (!electionData) {
    return (
      <Alert
        variant="warning"
        title="No Data"
        message="No election data available"
        showLink={false}
      />
    );
  }

  return (
    <>
      <div className="space-y-6">
        {electionData.candidates.map((candidate) => (
          <div
            key={candidate.id}
            className="bg-white dark:bg-white/[0.02] rounded-xl border border-gray-200 dark:border-white/[0.05] p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="w-12 h-12 overflow-hidden rounded-full border-2 border-primary flex-shrink-0 bg-gray-100 flex items-center justify-center">
                <span className="text-xl font-semibold text-gray-600">
                  {candidate.name.charAt(0)}
                </span>
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-1">
                    {candidate.name}
                  </h3>
                  <div className="mb-4">
                    <span className="font-medium text-gray-700 dark:text-gray-200">
                      Votes: {candidate.votes.toLocaleString()}
                    </span>
                  </div>
                </div>
                <p className="text-lg text-gray-500 dark:text-gray-400 mb-3">
                  {candidate.party}
                </p>

                <div className="flex justify-end">
                  <Button
                    className="bg-primary hover:bg-primary/90 text-white"
                    onClick={() => handleVoteClick(candidate)}
                    disabled={electionData.hasVoted}
                  >
                    {electionData.hasVoted ? "Already Voted" : "Vote Now"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="max-w-[500px] m-4"
      >
        <div className="no-scrollbar relative w-full max-w-[500px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="custom-scrollbar overflow-y-auto px-2 pb-3">
            <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
              Confirm Your Vote
            </h5>
            <div className="mb-5">
              <Alert
                variant="warning"
                title="Warning Message"
                message="Your vote is final and cannot be changed."
                showLink={false}
              />
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 overflow-hidden rounded-full border-2 border-primary flex-shrink-0 bg-gray-100 flex items-center justify-center">
                  <span className="text-2xl font-semibold text-gray-600">
                    {selectedCandidate?.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h6 className="text-base font-medium text-gray-800 dark:text-white/90">
                    {selectedCandidate?.name}
                  </h6>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedCandidate?.party}
                  </p>
                </div>
              </div>

              <p className="mb-4 text-gray-600 dark:text-gray-300">
                Please confirm your choice by selecting one of the options
                below:
              </p>

              <div className="space-y-3">
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                  <input
                    type="radio"
                    name="confirmation"
                    value="yes"
                    checked={confirmationOption === "yes"}
                    onChange={(e) => setConfirmationOption(e.target.value)}
                    className="mr-3 text-primary"
                  />
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">
                      Yes, confirm my vote
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      I want to vote for {selectedCandidate?.name}
                    </p>
                  </div>
                </label>
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                  <input
                    type="radio"
                    name="confirmation"
                    value="no"
                    checked={confirmationOption === "no"}
                    onChange={(e) => setConfirmationOption(e.target.value)}
                    className="mr-3 text-primary"
                  />
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">
                      No, I want to change
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      I want to select a different candidate
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleConfirmVote}
              disabled={confirmationOption !== "yes"}
            >
              Submit Vote
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
