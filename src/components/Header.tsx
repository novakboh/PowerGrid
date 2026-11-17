import "./Header.css";
import type { NetworkStats } from "../types";
import lightning from "../assets/lightning.png";
import tower from "../assets/icon_tower.png";
import line from "../assets/icon_line.png";
import ruler from "../assets/icon_ruler.png";
import play from "../assets/play.png";
import enabled from "../assets/enabled.png";
import save from "../assets/save.png";
import load from "../assets/load.png";

type Props = {
  stats: NetworkStats;
};

function Header({ stats }: Props) {
  return (
    <div className="header-content">
      <div className="header-brand">
        <img src={lightning} alt="" />
        <span className="brand-name">PowerGrid</span>
        <span className="brand-divider">|</span>
        <span className="brand-subtitle">Редактор електромережі</span>
      </div>

      <div className="header-info">
        <div className="header-stat">
          <img src={tower} alt="" />
          <span>Опор: {stats.poles}</span>
        </div>

        <div className="header-stat">
          <img src={line} alt="" />
          <span>Ліній: {stats.lines}</span>
        </div>

        <div className="header-stat">
          <img src={ruler} alt="" />
          <span>Довжина: {stats.length.toFixed(1)}</span>
        </div>

        <div className="header-current">
          <img src={play} alt="" />
          <span>Струм:</span>
          <img className="enabled-icon" src={enabled} alt="" />
        </div>

        <button className="header-action">
          <img src={save} alt="" />
          <span>Зберегти</span>
        </button>

        <button className="header-action">
          <img src={load} alt="" />
          <span>Завантажити</span>
        </button>
      </div>
    </div>
  );
}

export default Header;