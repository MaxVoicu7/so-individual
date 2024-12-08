import { useState, useEffect } from "react";

interface NetworkSpeeds {
  upload: string;
  download: string;
}

interface NetworkTransfer {
  sent: string;
  received: string;
}

interface NetworkPackets {
  sent: number;
  received: number;
}

interface NetworkStats {
  current_speeds: NetworkSpeeds;
  total_transfer: NetworkTransfer;
  packets: NetworkPackets;
}

const NetworkStats = () => {
  const [networkStats, setNetworkStats] = useState<NetworkStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNetworkStats = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/network-stats`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setNetworkStats(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching network stats:", error);
        setError(error instanceof Error ? error.message : "An error occurred");
      }
    };

    fetchNetworkStats();
    const interval = setInterval(fetchNetworkStats, 1000); // Update every second
    return () => clearInterval(interval);
  }, []);

  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!networkStats) return <div>Loading...</div>;

  return (
    <div className="cores-container">
      <div className="cores-header">
        <h2 className="glow-text">Network Activity</h2>
      </div>
      <div className="cores-grid">
        {/* Current Speeds */}
        <div className="core-box">
          <div className="mb-2">
            <span className="core-name">Current Speeds</span>
          </div>
          <div className="core-info mb-2">
            <span className="core-name">Upload</span>
            <span className="glow-pink">
              {networkStats.current_speeds.upload}
            </span>
          </div>
          <div className="core-info">
            <span className="core-name">Download</span>
            <span className="glow-blue">
              {networkStats.current_speeds.download}
            </span>
          </div>
        </div>

        {/* Total Transfer */}
        <div className="core-box">
          <div className="mb-2">
            <span className="core-name">Total Transfer</span>
          </div>
          <div className="core-info mb-2">
            <span className="core-name">Sent</span>
            <span className="glow-pink">
              {networkStats.total_transfer.sent}
            </span>
          </div>
          <div className="core-info">
            <span className="core-name">Received</span>
            <span className="glow-blue">
              {networkStats.total_transfer.received}
            </span>
          </div>
        </div>

        {/* Packets */}
        <div className="core-box">
          <div className="mb-2">
            <span className="core-name">Packets</span>
          </div>
          <div className="core-info mb-2">
            <span className="core-name">Sent</span>
            <span className="glow-pink">
              {networkStats.packets.sent.toLocaleString()}
            </span>
          </div>
          <div className="core-info">
            <span className="core-name">Received</span>
            <span className="glow-blue">
              {networkStats.packets.received.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkStats;
