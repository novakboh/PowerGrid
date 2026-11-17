import { useCallback, useState } from "react";
import "./App.css";
import type { ToolType, VoltageType, NetworkStats, MapObjectData, PowerLineData, } from "./types";
import GridWorkspace from "./components/GridWorkspace";
import ObjectPanel from "./components/ObjectPanel";
import Header from "./components/Header";
import Footer from "./components/Footer";
import InfoPanel from "./components/InfoPanel";

function App() {
  const [selectedTool, setSelectedTool] =
    useState<ToolType>("select");

  const [selectedVoltage, setSelectedVoltage] =
    useState<VoltageType>("low");

  const [stats, setStats] = useState<NetworkStats>({
    poles: 0,
    lines: 0,
    length: 0,
    transformers: 0,
  });

  const [selectedInfoObject, setSelectedInfoObject] =
    useState<MapObjectData | null>(null);

  const [selectedInfoLines, setSelectedInfoLines] =
    useState<PowerLineData[]>([]);

  const [deleteObjectId, setDeleteObjectId] =
    useState<string | null>(null);

  const handleStatsChange = useCallback(
    (newStats: NetworkStats) => {
      setStats(newStats);
    },
    []
  );

  const handleSelectionChange = useCallback(
    (object: MapObjectData | null, lines: PowerLineData[]) => {
      setSelectedInfoObject(object);
      setSelectedInfoLines(lines);
    },
    []
  );

  const handleDeleteComplete = useCallback(() => {
    setDeleteObjectId(null);
  }, []);

  const handleDeleteObject = () => {
    if (selectedInfoObject) {
      setDeleteObjectId(selectedInfoObject.id);
    }
  };

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
            onSelectionChange={handleSelectionChange}
            deleteObjectId={deleteObjectId}
            onDeleteComplete={handleDeleteComplete}
          />
        </section>

        <aside className="right-panel">
          <InfoPanel
            object={selectedInfoObject}
            lines={selectedInfoLines}
            onDelete={handleDeleteObject}
          />
        </aside>
      </main>

      <footer className="bottom-panel">
        <Footer stats={stats} />
      </footer>
    </div>
  );
}

export default App;