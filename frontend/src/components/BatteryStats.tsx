import { useState, useEffect } from "react";

interface BatteryStats {
  percent: number;
  power_plugged: boolean;
  time_left: number;
  status: string;
}

const BatteryStats = () => {
  const [batteryStats, setBatteryStats] = useState<BatteryStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBatteryStats = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/battery-stats`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setBatteryStats(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching battery stats:", error);
        setError(error instanceof Error ? error.message : "An error occurred");
      }
    };

    fetchBatteryStats();
    const interval = setInterval(fetchBatteryStats, 5000);
    return () => clearInterval(interval);
  }, []);

  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!batteryStats) return <div>Loading...</div>;

  // Don't render anything if there's no battery (desktop computer)
  if (batteryStats === null) return null;

  return (
    <div className="cores-container">
      <div className="cores-header">
        <h2 className="glow-text">Battery Status</h2>
      </div>
      <div className="cores-grid">
        {/* Battery Percentage */}
        <div className="core-box">
          <div className="core-info mb-4">
            <span className="core-name">Battery Level</span>
            <span
              className={batteryStats.percent > 20 ? "glow-blue" : "glow-pink"}
            >
              {batteryStats.percent}%
            </span>
          </div>
          <div className="core-bar">
            <div
              className={`core-fill ${
                batteryStats.percent > 20 ? "blue-fill" : "pink-fill"
              }`}
              style={{ width: `${batteryStats.percent}%` }}
            />
          </div>
        </div>

        {/* Power Status */}
        <div className="core-box">
          <div className="core-info">
            <span className="core-name">Status</span>
            <span
              className={batteryStats.power_plugged ? "glow-blue" : "glow-pink"}
            >
              {batteryStats.status}
            </span>
          </div>
        </div>

        {/* Time Remaining */}
        {!batteryStats.power_plugged && (
          <div className="core-box">
            <div className="core-info">
              <span className="core-name">Time Remaining</span>
              <span className="glow-blue">
                {batteryStats.time_left} minutes
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BatteryStats;
