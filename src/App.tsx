import { useCallback, useState } from "react";
import "./App.css";

import type { ToolType, VoltageType, NetworkStats } from "./types";

import GridWorkspace from "./components/GridWorkspace";
import ObjectPanel from "./components/ObjectPanel";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  const [selectedTool, setSelectedTool] = useState<ToolType>("select");

  const [selectedVoltage, setSelectedVoltage] =
    useState<VoltageType>("low");

  const [stats, setStats] = useState<NetworkStats>({
    poles: 0,
    lines: 0,
    length: 0,
    transformers: 0,
  });

  const handleStatsChange = useCallback((newStats: NetworkStats) => {
    setStats(newStats);
  }, []);

  return (
    <div className="app">
      <header className="top-panel">
        <Header stats={stats} />
      </header>

      <main className="main-layout">
        <aside className="left-panel">
          <ObjectPanel
            selectedTool={selectedTool}
            onToolSelect={setSelectedTool}
            selectedVoltage={selectedVoltage}
            onVoltageSelect={setSelectedVoltage}
          />
        </aside>

        <section className="map-container">
          <GridWorkspace
            selectedTool={selectedTool}
            selectedVoltage={selectedVoltage}
            onStatsChange={handleStatsChange}
          />
        </section>

        <aside className="right-panel"></aside>
      </main>

      <footer className="bottom-panel">
        <Footer stats={stats} />
      </footer>
    </div>
  );
}

export default App;