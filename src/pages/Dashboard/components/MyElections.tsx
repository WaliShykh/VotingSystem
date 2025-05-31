import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import Badge from "../../../components/ui/badge/Badge";
import Button from "../../../components/ui/button/Button";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";

interface VotingHistory {
  title: string;
  dueDate: string;
  dueTime: string;
  status: "pending" | "voted" | "canceled" | "announced" | "missed";
  id: string; // Adding id for API calls
}

export default function MyElections() {
  const Navigate = useNavigate();
  const [votingHistory, setVotingHistory] = useState<VotingHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVotingHistory = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch(
          "http://localhost:5174/api/user/voting-history",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            Navigate("/login");
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setVotingHistory(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching voting history:", error);
        if (
          error instanceof Error &&
          error.message === "No authentication token found"
        ) {
          Navigate("/login");
          return;
        }
        setError("Failed to load voting history");
        setVotingHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVotingHistory();
  }, [Navigate]);

  const handleVoteNow = (id: string) => {
    Navigate(`/castVote/${id}`);
  };

  const handleViewResults = (id: string) => {
    Navigate(`/viewResults/${id}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!votingHistory.length) {
    return <div>No voting history available</div>;
  }

  return (
    <div className="overflow-y-auto rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.02] sm:px-6">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Title
              </TableCell>
              <TableCell
                isHeader
                className="py-3 px-10 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Due Date
              </TableCell>
              <TableCell
                isHeader
                className="py-3 px-10 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Due Time
              </TableCell>
              <TableCell
                isHeader
                className="py-3 px-10 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>
              <TableCell
                isHeader
                className="py-3 px-10 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Action
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {votingHistory.map((item, index) => (
              <TableRow key={index} className="">
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {item.title}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3 px-10 text-gray-500 text-theme-sm dark:text-gray-400">
                  {item.dueDate}
                </TableCell>
                <TableCell className="py-3 px-10 text-gray-500 text-theme-sm dark:text-gray-400">
                  {item.dueTime}
                </TableCell>
                <TableCell className="py-3 px-10 text-gray-500 text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      item.status === "voted"
                        ? "success"
                        : item.status === "pending"
                        ? "warning"
                        : item.status === "announced"
                        ? "success"
                        : item.status === "missed"
                        ? "error"
                        : "error"
                    }
                  >
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell className="py-3 px-10 text-gray-500 text-theme-sm dark:text-gray-400">
                  {item.status === "pending" ? (
                    <Button size="sm" onClick={() => handleVoteNow(item.id)}>
                      Vote Now
                    </Button>
                  ) : item.status === "canceled" ? (
                    <Button size="sm" variant="outline" disabled>
                      Unavailable
                    </Button>
                  ) : item.status === "voted" || item.status === "missed" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewResults(item.id)}
                    >
                      View Results
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" disabled>
                      Voted
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
