import { BoxIconLine, GroupIcon } from "../../../icons";
import Badge from "../../../components/ui/badge/Badge";
import { useEffect, useState } from "react";

interface ElectionStatus {
  hasPendingVotes: boolean;
  upcomingElections: string[];
  ongoingElections: string[];
}

export default function EcommerceMetrics() {
  const [status, setStatus] = useState<ElectionStatus>({
    hasPendingVotes: false,
    upcomingElections: [],
    ongoingElections: [],
  });

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token from localStorage
        const response = await fetch(
          "http://localhost:5174/api/election-status/status",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setStatus(data);
      } catch (error) {
        console.error("Error fetching election status:", error);
      }
    };

    fetchStatus();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3 md:gap-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.02] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Voting Status
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {status.hasPendingVotes ? "Pending Votes" : "No Pending Votes"}
            </h4>
          </div>
          <Badge color={status.hasPendingVotes ? "error" : "success"}>
            {status.hasPendingVotes ? "Pending" : "Complete"}
          </Badge>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.02] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Ongoing Elections
            </span>
            <h4
              title={status.ongoingElections[0] || "No ongoing elections"}
              className="mt-2 font-bold w-74 line-clamp-1 text-wrap text-gray-800 text-title-sm dark:text-white/90"
            >
              {status.ongoingElections[0] || "No ongoing elections"}
            </h4>
          </div>

          {status.ongoingElections.length > 0 && (
            <Badge color="warning">Vote Now</Badge>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.02] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Upcoming Elections
            </span>
            <h4
              title={status.upcomingElections[0] || "No upcoming elections"}
              className="mt-2 font-bold w-74 line-clamp-1 text-wrap text-gray-800 text-title-sm dark:text-white/90"
            >
              {status.upcomingElections[0] || "No upcoming elections"}
            </h4>
          </div>

          {status.upcomingElections.length > 0 && (
            <Badge color="info">Coming Soon</Badge>
          )}
        </div>
      </div>
    </div>
  );
}
