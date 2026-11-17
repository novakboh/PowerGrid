import "./ObjectPanel.css";
import type { ToolType, VoltageType } from "../types";
import wrench from "../assets/wrench.png";
import pointer from "../assets/pointer.png";
import tower from "../assets/icon_tower.png";
import transformer from "../assets/icon_transformator.png";
import house from "../assets/icon_house.png";
import tree from "../assets/icon_tree.png";
import road from "../assets/icon_road.png";
import water from "../assets/icon_water.png";
import lightning from "../assets/lightning.png";
import bin from "../assets/icon_bin.png";

type ObjectPanelProps = {
  selectedTool: ToolType;
  onToolSelect: (tool: ToolType) => void;
  selectedVoltage: VoltageType;
  onVoltageSelect: (voltage: VoltageType) => void;
};

function ObjectPanel({
  selectedTool,
  onToolSelect,
  selectedVoltage,
  onVoltageSelect,
}: ObjectPanelProps) {
  const tools: { id: ToolType; name: string; icon: string }[] = [
    { id: "select", name: "Вибір", icon: pointer },
    { id: "pole", name: "Опора", icon: tower },
    { id: "transformer", name: "Трансформатор", icon: transformer },
    { id: "house", name: "Будинок", icon: house },
    { id: "tree", name: "Дерево", icon: tree },
    { id: "road", name: "Дорога", icon: road },
    { id: "water", name: "Водойма", icon: water },
    { id: "line", name: "Лінія", icon: lightning },
    { id: "delete", name: "Видалити", icon: bin },
  ];

  const voltages: { id: VoltageType; name: string }[] = [
    { id: "low", name: "Низька" },
    { id: "medium", name: "110 кВ" },
    { id: "high", name: "220 кВ" },
  ];

  return (
    <div className="object-panel">
      <div className="panel-header">
        <img src={wrench} alt="" />
        <span>Інструменти</span>
      </div>

      <div className="panel-divider" />

      {tools.slice(0, 7).map((tool) => (
        <button
          key={tool.id}
          className={`panel-button ${
            selectedTool === tool.id ? "active" : ""
          }`}
          onClick={() => onToolSelect(tool.id)}
        >
          <img src={tool.icon} alt="" />
          <span>{tool.name}</span>
        </button>
      ))}

      <div className="panel-divider" />

      {tools.slice(7).map((tool) => (
        <button
          key={tool.id}
          className={`panel-button ${
            selectedTool === tool.id ? "active" : ""
          }`}
          onClick={() => onToolSelect(tool.id)}
        >
          <img src={tool.icon} alt="" />
          <span>{tool.name}</span>
        </button>
      ))}

      <div className="panel-divider" />

      <div className="voltage-selector">
        <span className="voltage-title">Напруга лінії</span>

        {voltages.map((voltage) => (
          <button
            key={voltage.id}
            className={`voltage-button ${
              selectedVoltage === voltage.id ? "active" : ""
            }`}
            onClick={() => onVoltageSelect(voltage.id)}
          >
            {voltage.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ObjectPanel;