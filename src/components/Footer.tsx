import "./Footer.css";
import type { NetworkStats } from "../types";

import lightning from "../assets/lightning.png";
import tower from "../assets/icon_tower.png";
import line from "../assets/icon_line.png";
import ruler from "../assets/icon_ruler.png";
import transformer from "../assets/icon_transformator.png";
import info from "../assets/info_stroke.png";

type Props = {
  stats: NetworkStats;
};

function Footer({ stats }: Props) {
  return (
    <div className="footer-content">
      <div className="footer-statistics">
        <div className="footer-title">
          <img src={lightning} alt="" />
          <span>Статистика мережі:</span>
        </div>

        <div className="footer-stat">
          <img src={tower} alt="" />
          <span>Опор: {stats.poles}</span>
        </div>

        <div className="footer-stat">
          <img src={line} alt="" />
          <span>Ліній: {stats.lines}</span>
        </div>

        <div className="footer-stat">
          <img src={ruler} alt="" />
          <span>Довжина: {stats.length.toFixed(1)}</span>
        </div>

        <div className="footer-stat">
          <img src={transformer} alt="" />
          <span>Трансформаторів: {stats.transformers}</span>
        </div>
      </div>

      <div className="footer-hint">
        <img src={info} alt="" />
        <span>Натисніть на опору, щоб переглянути її властивості</span>
      </div>
    </div>
  );
}

export default Footer;