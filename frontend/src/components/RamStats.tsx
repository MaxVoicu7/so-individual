import { useState, useEffect } from "react";

interface RamStat {
  label: string;
  value: string;
}

interface RamStats {
  column1: RamStat[];
  column2: RamStat[];
  column3: RamStat[];
}

const RamStats = () => {
  const [ramStats, setRamStats] = useState<RamStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRamStats = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/ram-stats`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Response is not JSON");
        }

        const data = await response.json();
        setRamStats(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching RAM stats:", error);
        setError(error instanceof Error ? error.message : "An error occurred");
        setRamStats(null);
      }
    };

    fetchRamStats();
    const interval = setInterval(fetchRamStats, 5000);
    return () => clearInterval(interval);
  }, []);

  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!ramStats) return <div>Loading...</div>;

  return (
    <div className="cores-container">
      <div className="cores-header">
        <h2 className="glow-text">Memory Distribution</h2>
      </div>
      <div className="cores-grid">
        {ramStats.column1.map((item, index) => (
          <div key={index} className="core-box">
            <div className="core-info">
              <span className="core-name">{item.label}</span>
              <span className="glow-blue">{item.value}</span>
            </div>
          </div>
        ))}

        {ramStats.column2.map((item, index) => (
          <div key={index} className="core-box">
            <div className="core-info">
              <span className="core-name">{item.label}</span>
              <span className="glow-pink">{item.value}</span>
            </div>
          </div>
        ))}

        {ramStats.column3.map((item, index) => (
          <div key={index} className="core-box">
            <div className="core-info">
              <span className="core-name">{item.label}</span>
              <span className="glow-blue">{item.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RamStats;
