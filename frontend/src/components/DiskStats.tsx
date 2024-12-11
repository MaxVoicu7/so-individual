import { useState, useEffect } from "react";

interface DiskInfo {
  device: string;
  mountpoint: string;
  fstype: string;
  total: string;
  used: string;
  free: string;
  percent: number;
}

interface DiskStats {
  disks: DiskInfo[];
}

const DiskStats = () => {
  const [diskStats, setDiskStats] = useState<DiskStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDiskStats = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/disk-stats`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setDiskStats(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching disk stats:", error);
        setError(error instanceof Error ? error.message : "An error occurred");
      }
    };

    fetchDiskStats();
    const interval = setInterval(fetchDiskStats, 5000);
    return () => clearInterval(interval);
  }, []);

  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!diskStats) return <div>Loading...</div>;

  return (
    <div className="cores-container">
      <div className="cores-header">
        <h2 className="glow-text">Storage Distribution</h2>
      </div>
      <div className="cores-grid">
        {diskStats.disks.map((disk, index) => (
          <div key={index} className="core-box">
            <div className="core-info mb-2">
              <span className="core-name">Free</span>
              <span className="glow-blue">{disk.free}</span>
            </div>
            <div className="core-info mb-2">
              <span className="core-name">Total</span>
              <span className="glow-blue">{disk.total}</span>
            </div>
            <div className="core-bar">
              <div className="core-fill" style={{ width: `${56.73}%` }} />
            </div>
            <div className="text-right text-sm mt-1 glow-pink">56.73%</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiskStats;
