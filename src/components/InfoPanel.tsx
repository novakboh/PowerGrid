import "./InfoPanel.css";
import type { MapObjectData, PowerLineData } from "../types";
import info from "../assets/info_fill.png";
import tower from "../assets/tower.png";
import transformer from "../assets/transformator.png";
import move from "../assets/move.png";
import bin from "../assets/bin.png";

type Props = {
  object: MapObjectData | null;
  lines: PowerLineData[];
  onDelete: () => void;
};

function InfoPanel({ object, lines, onDelete }: Props) {
  const isSupported =
    object?.type === "pole" || object?.type === "transformer";

  const isPole = object?.type === "pole";

  const voltageInfo = {
    low: { label: "Низька напруга", color: "#303030" },
    medium: { label: "110 кВ", color: "#E5A323" },
    high: { label: "220 кВ", color: "#2878D0" },
  };

  return (
    <div className="info-panel">
      <div className="info-header">
        <img src={info} alt="" />
        <span>Інформація про об'єкт</span>
      </div>

      {!isSupported ? (
        <div className="info-empty">
          <img src={info} alt="" />
          <span>
            Виберіть опору або трансформатор, щоб переглянути інформацію
          </span>
        </div>
      ) : (
        <>
          <div className="info-object">
            <img
              className="info-object-image"
              src={isPole ? tower : transformer}
              alt=""
            />

            <div className="info-object-name">
              <span className="info-object-title">
                {isPole ? "Електрична опора" : "Трансформатор"}
              </span>

              <span className="info-object-subtitle">
                {isPole ? "Металева" : "Металевий"}
              </span>
            </div>
          </div>

          <div className="info-divider" />

          <div className="info-properties">
            <div className="info-property">
              <span>ID:</span>
              <strong>{object.id}</strong>
            </div>

            <div className="info-property">
              <span>Координати:</span>
              <strong>
                ({Math.round(object.x)}, {Math.round(object.y)})
              </strong>
            </div>

            <div className="info-property">
              <span>Висота:</span>
              <strong>{isPole ? "35 м" : "2,5 м"}</strong>
            </div>

            <div className="info-property">
              <span>Підключених ліній:</span>
              <strong>{lines.length}</strong>
            </div>
          </div>

          <div className="info-divider" />

          <div className="info-connected">
            <span className="info-section-title">
              Підключені лінії:
            </span>

            {lines.length === 0 ? (
              <span className="info-no-lines">
                Немає підключених ліній
              </span>
            ) : (
              <div className="info-line-list">
                {lines.map((line) => {
                  const voltage = voltageInfo[line.voltage];

                  return (
                    <div className="info-line-item" key={line.id}>
                      <span
                        className="info-line-color"
                        style={{ backgroundColor: voltage.color }}
                      />

                      <span>
                        Лінія {line.id} ({voltage.label})
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="info-actions">
            <button
              className="info-move-button"
              type="button"
              disabled
            >
              <img src={move} alt="" />
              <span>Перемістити</span>
            </button>

            <button
              className="info-delete-button"
              type="button"
              onClick={onDelete}
            >
              <img src={bin} alt="" />
              <span>Видалити</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default InfoPanel;