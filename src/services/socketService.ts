import { io, Socket } from "socket.io-client";

class SocketService {
  private socket: Socket | null = null;
  private static instance: SocketService;

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public connect(token: string): void {
    if (!this.socket) {
      this.socket = io(
        import.meta.env.VITE_SOCKET_URL || "http://localhost:5173",
        {
          auth: {
            token,
          },
        }
      );

      this.setupErrorHandling();
    }
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public joinElectionRoom(electionId: string): void {
    if (this.socket) {
      this.socket.emit("joinElectionRoom", electionId);
    }
  }

  public getLiveResults(electionId: string): void {
    if (this.socket) {
      this.socket.emit("getLiveResults", electionId);
    }
  }

  public onElectionData(
    callback: (data: {
      electionId: string;
      voteCount: number;
      status: string;
      startDate: string;
      endDate: string;
    }) => void
  ): void {
    if (this.socket) {
      this.socket.on("electionData", callback);
    }
  }

  public onVoteUpdate(
    callback: (data: {
      electionId: string;
      totalVotes: number;
      candidateVotes: number;
      candidateId: string;
    }) => void
  ): void {
    if (this.socket) {
      this.socket.on("voteUpdate", callback);
    }
  }

  public onElectionStatus(
    callback: (data: { electionId: string; status: string }) => void
  ): void {
    if (this.socket) {
      this.socket.on("electionStatus", callback);
    }
  }

  public onLiveResults(
    callback: (data: {
      electionId: string;
      results: Array<{ candidateId: string; votes: number }>;
    }) => void
  ): void {
    if (this.socket) {
      this.socket.on("liveResults", callback);
    }
  }

  private setupErrorHandling(): void {
    if (this.socket) {
      this.socket.on("error", ({ message }) => {
        console.error("Socket error:", message);
        // You can add additional error handling here
      });

      this.socket.on("connect_error", (error) => {
        console.error("Connection error:", error.message);
        // You can add additional connection error handling here
      });
    }
  }
}

export default SocketService;
