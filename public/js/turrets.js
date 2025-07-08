const turretsDataRaw = [
  {
    Turret: "Cannon",
    Damage: 375,
    "Crit Damage": 375,
    "Fire Rate": 6, 
    "AOE Type": "Circle AOE",
    "AOE Size": 10,
    Range: 6,
    "Requires Weld?": "TRUE",
    Notes: "Great for hoards"
  },
  {
    Turret: "Ballista",
    Damage: 85,
    "Crit Damage": 170,
    "Fire Rate": 3.2,
    "AOE Type": "Single Target",
    "AOE Size": 1,
    Range: 10,
    "Requires Weld?": "TRUE",
    Notes: "Great Werewolf Killer"
  },
  {
    Turret: "Maxim Machine Gun",
    Damage: 22,
    "Crit Damage": 44,
    "Fire Rate": 0.35,
    "AOE Type": "Single Target",
    "AOE Size": 1,
    Range: 8,
    "Requires Weld?": "TRUE",
    Notes: "Great Single-Target DPS, Bad at hoards."
  },
  {
    Turret: "Bottle Rocket Launcher",
    Damage: 10,
    "Crit Damage": 20,
    "Fire Rate": 0.45,
    "AOE Type": "Circle AOE",
    "AOE Size": 10,
    Range: 7,
    "Requires Weld?": "FALSE",
    Notes: "Super spammable for the damage output and aoe. Really good to use. Can be used from anywhere."
  }
];

function normalize(value, min, max) {
  if (max === min) return 1; 
  return (value - min) / (max - min);
}

function calculateTotalScores(data) {
  const damageVals = data.map(d => d.Damage);
  const critVals = data.map(d => d["Crit Damage"]);
  const fireRateVals = data.map(d => d["Fire Rate"]);
  const aoeSizeVals = data.map(d => d["AOE Size"]);
  const rangeVals = data.map(d => d.Range);

  const minDamage = Math.min(...damageVals);
  const maxDamage = Math.max(...damageVals);
  const minCrit = Math.min(...critVals);
  const maxCrit = Math.max(...critVals);
  const minFireRate = Math.min(...fireRateVals);
  const maxFireRate = Math.max(...fireRateVals);
  const minAoeSize = Math.min(...aoeSizeVals);
  const maxAoeSize = Math.max(...aoeSizeVals);
  const minRange = Math.min(...rangeVals);
  const maxRange = Math.max(...rangeVals);

  data.forEach(turret => {
    // Normalize all numeric fields
    const normDamage = normalize(turret.Damage, minDamage, maxDamage);
    const normCrit = normalize(turret["Crit Damage"], minCrit, maxCrit);
    // For fire rate: lower is better, so invert normalization
    const normFireRate = 1 - normalize(turret["Fire Rate"], minFireRate, maxFireRate);
    const normAoeSize = normalize(turret["AOE Size"], minAoeSize, maxAoeSize);
    const normRange = normalize(turret.Range, minRange, maxRange);

    let aoeMultiplier = 1;
    if (turret["AOE Type"] === "Circle AOE") aoeMultiplier = 1.1;
    else if (turret["AOE Type"] === "Line AOE") aoeMultiplier = 1.05;

    const totalScoreRaw =
      (normDamage * 0.4) +
      (normCrit * 0.2) +
      (normFireRate * 0.2) +
      (normAoeSize * 0.1) +
      (normRange * 0.1);

    turret["Total Score"] = (totalScoreRaw * aoeMultiplier * 10).toFixed(2);

    turret["Requires Weld?"] = turret["Requires Weld?"] === "TRUE" ? "Yes" : "No";
  });
  return data;
}

const turretsData = calculateTotalScores(turretsDataRaw);

createTierlist("Turrets", turretsData);
