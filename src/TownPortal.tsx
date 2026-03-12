import { useState } from "react";

interface TownPortalProps {
  townName: string;
  onLeave: () => void;
}

type LocationView = "main" | "market" | "shipyard" | "tavern";

const TRADE_GOODS = [
  { name: "Spices", basePrice: 100 },
  { name: "Rum", basePrice: 75 },
  { name: "Silk", basePrice: 150 },
  { name: "Sugar", basePrice: 80 },
  { name: "Tobacco", basePrice: 120 },
];

const CREW_ROLES = [
  { name: "Navigator", cost: 100, bonus: "+10% speed" },
  { name: "Gunner", cost: 100, bonus: "+1 damage" },
  { name: "Medic", cost: 100, bonus: "20 HP after battle" },
];

const UPGRADES = [
  {
    type: "cannon",
    name: "Cannon Upgrade",
    cost: 200,
    bonus: "+1 damage",
  },
  { type: "hull", name: "Hull Upgrade", cost: 150, bonus: "+10 max HP" },
  { type: "sail", name: "Sail Upgrade", cost: 150, bonus: "+0.1 speed" },
];

export default function TownPortal({ townName, onLeave }: TownPortalProps) {
  const [view, setView] = useState<LocationView>("main");
  const [gold, setGold] = useState(500);

  const handleRest = () => {
    if (gold >= 50) {
      setGold(gold - 50);
      alert("You rest and recover your HP!");
    }
  };

  const handleUpgrade = (upgrade: (typeof UPGRADES)[0]) => {
    if (gold >= upgrade.cost) {
      setGold(gold - upgrade.cost);
      alert(`Upgraded: ${upgrade.name}`);
    }
  };

  const handleHireCrew = (crew: (typeof CREW_ROLES)[0]) => {
    if (gold >= crew.cost) {
      setGold(gold - crew.cost);
      alert(`Hired: ${crew.name}`);
    }
  };

  return (
    <div className="town-view ui-panel">
      <h2 className="ui-title">{townName}</h2>
      <div
        style={{
          marginBottom: "12px",
          fontSize: "14px",
          color: "#ffd700",
        }}
      >
        Gold: {gold}
      </div>

      {view === "main" && (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button onClick={() => setView("market")}>Market</button>
          <button onClick={() => setView("shipyard")}>Shipyard</button>
          <button onClick={() => setView("tavern")}>Tavern</button>
          <button onClick={onLeave}>Leave Town</button>
        </div>
      )}

      {view === "market" && (
        <div>
          <h3 style={{ color: "#ffd700" }}>Trade Goods</h3>
          {TRADE_GOODS.map((good) => (
            <div key={good.name} style={{ marginBottom: "8px" }}>
              {good.name}: {good.basePrice} gold
            </div>
          ))}
          <button onClick={() => setView("main")} style={{ marginTop: "12px" }}>
            Back
          </button>
        </div>
      )}

      {view === "shipyard" && (
        <div>
          <h3 style={{ color: "#ffd700" }}>Upgrades</h3>
          {UPGRADES.map((upgrade) => (
            <div key={upgrade.type} style={{ marginBottom: "8px" }}>
              <div>
                {upgrade.name} ({upgrade.bonus}) - {upgrade.cost} gold
              </div>
              <button onClick={() => handleUpgrade(upgrade)}>Buy</button>
            </div>
          ))}

          <h3 style={{ color: "#ffd700", marginTop: "16px" }}>Hire Crew</h3>
          {CREW_ROLES.map((crew) => (
            <div key={crew.name} style={{ marginBottom: "8px" }}>
              <div>
                {crew.name} ({crew.bonus}) - {crew.cost} gold
              </div>
              <button onClick={() => handleHireCrew(crew)}>Hire</button>
            </div>
          ))}

          <button onClick={() => setView("main")} style={{ marginTop: "12px" }}>
            Back
          </button>
        </div>
      )}

      {view === "tavern" && (
        <div>
          <h3 style={{ color: "#ffd700" }}>Tavern</h3>
          <div style={{ marginBottom: "12px" }}>
            <p>
              The tavern is bustling with activity. You hear tales of distant
              lands and lost treasures...
            </p>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <h4>Available Quests</h4>
            <div>Rumors speak of a treasure wreck nearby. Interested?</div>
          </div>

          <button onClick={handleRest} style={{ marginBottom: "8px" }}>
            Rest (50 gold) - Restore HP
          </button>
          <button onClick={() => setView("main")}>Back</button>
        </div>
      )}
    </div>
  );
}
