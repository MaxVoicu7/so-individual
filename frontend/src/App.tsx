import { useState, useEffect } from "react";
import "./App.css";
import RamStats from "./components/RamStats";
import DiskStats from "./components/DiskStats";
import NetworkStats from "./components/NetworkStats";
import BatteryStats from "./components/BatteryStats";
import NetworkConnections from "./components/NetworkConnections";

interface SystemInfo {
  os: string;
  os_version: string;
  architecture: string;
  processor: string;
  hostname: string;
  python_version: string;
  boot_time: string;
}

interface CpuInfo {
  physical_cores: number;
  total_cores: number;
  cpu_usage_per_core: number[];
  total_cpu_usage: number;
  processor_name: string;
}

function App() {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [cpuInfo, setCpuInfo] = useState<CpuInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5055";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sysResponse, cpuResponse] = await Promise.all([
          fetch(`${apiUrl}/api/system-info`),
          fetch(`${apiUrl}/api/cpu-info`),
        ]);

        if (!sysResponse.ok) throw new Error("Failed to fetch system info");
        if (!cpuResponse.ok) throw new Error("Failed to fetch CPU info");

        const sysData = await sysResponse.json();
        const cpuData = await cpuResponse.json();

        setSystemInfo(sysData);
        setCpuInfo(cpuData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 1000);

    return () => clearInterval(interval);
  }, [apiUrl]);

  return (
    <div className="App">
      <div className="dashboard">
        <div className="dashboard-grid">
          <div className="stats-column">
            {systemInfo && (
              <>
                <div className="stat-box">
                  <div className="stat-title">System</div>
                  <div className="stat-value glow-blue">{systemInfo.os}</div>
                  <div className="stat-subtitle">{systemInfo.architecture}</div>
                </div>
                <div className="stat-box mt-4">
                  <div className="stat-title">Host</div>
                  <div className="stat-value glow-pink">
                    {systemInfo.hostname}
                  </div>
                </div>
                <div className="ram-stats-column mt-4">
                  <RamStats />
                </div>
              </>
            )}
          </div>

          {cpuInfo && (
            <div className="cores-container">
              <div className="cores-header">
                <h2 className="glow-text">CPU Core Distribution</h2>
                <div className="processor-name">{cpuInfo.processor_name}</div>
              </div>
              <div className="cores-grid">
                {cpuInfo.cpu_usage_per_core.map((usage, index) => (
                  <div key={index} className="core-box">
                    <div className="core-info">
                      <span className="core-name">Core {index}</span>
                      <span className="core-value glow-blue">
                        {usage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="core-bar">
                      <div
                        className="core-fill"
                        style={{ width: `${usage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="storage-column">
            <DiskStats />

            <div className="battery-column mt-4">
              <BatteryStats />
            </div>
          </div>

          <div className="network-column">
            <NetworkStats />
          </div>
        </div>

        <div className="dashboard-grid mt-4">
          <div className="network-connections-column">
            <NetworkConnections />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
