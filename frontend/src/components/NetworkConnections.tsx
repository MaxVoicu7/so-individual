import { useState, useEffect } from "react";

interface NetworkConnection {
  local_address: string;
  remote_address: string;
  status: string;
  process: string;
  type: string;
}

interface NetworkConnectionsData {
  connections: NetworkConnection[];
}

const NetworkConnections = () => {
  const [connections, setConnections] = useState<NetworkConnectionsData | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/network-connections`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setConnections(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching network connections:", error);
        setError(error instanceof Error ? error.message : "An error occurred");
      }
    };

    fetchConnections();
    const interval = setInterval(fetchConnections, 2000);
    return () => clearInterval(interval);
  }, []);

  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!connections) return <div>Loading...</div>;

  return (
    <div className="cores-container">
      <div className="cores-header">
        <h2 className="glow-text">Network Connections</h2>
      </div>
      <div className="cores-grid">
        {connections.connections.map((conn, index) => (
          <div key={index} className="core-box">
            <div className="core-info mb-2">
              <span className="core-name">Process</span>
              <span className="glow-blue">{conn.process}</span>
            </div>
            <div className="core-info mb-2">
              <span className="core-name">Type</span>
              <span className="glow-pink">{conn.type}</span>
            </div>
            <div className="core-info mb-2">
              <span className="core-name">Local</span>
              <span className="glow-blue">{conn.local_address}</span>
            </div>
            <div className="core-info mb-2">
              <span className="core-name">Remote</span>
              <span className="glow-pink">{conn.remote_address}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NetworkConnections;
