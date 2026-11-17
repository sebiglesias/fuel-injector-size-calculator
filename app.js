
const STANDARD_SIZES = [440, 550, 650, 750, 850, 1000, 1050, 1300, 1700, 2000];

function init() {
  ['targetHp', 'cylCount', 'fuelType', 'dutyCycle'].forEach(id => {
    document.getElementById(id).addEventListener('change', calc);
    document.getElementById(id).addEventListener('input', calc);
  });
  calc();
}

function calc() {
  const hp = parseFloat(document.getElementById('targetHp').value)||550;
  const cyl = parseFloat(document.getElementById('cylCount').value)||4;
  const bsfc = parseFloat(document.getElementById('fuelType').value)||0.55;
  const idc = parseFloat(document.getElementById('dutyCycle').value)||0.85;

  // Formula: Flow (lbs/hr) = (HP * BSFC) / (Cylinders * DutyCycle)
  const flowLbs = (hp * bsfc) / (cyl * idc);
  // Convert lbs/hr to cc/min: multiply by 10.5
  const flowCc = flowLbs * 10.5;

  // Find next commercial standard injector size
  let chosen = STANDARD_SIZES[STANDARD_SIZES.length - 1];
  for (const s of STANDARD_SIZES) {
    if (s >= flowCc) {
      chosen = s;
      break;
    }
  }

  // Total fuel pump capacity: (flowCc * cyl * 60 minutes) / 1000 = Liters Per Hour (LPH) + 20% safety headroom
  const totalCcMin = flowCc * cyl;
  const pumpLph = Math.round((totalCcMin * 60 / 1000) * 1.20);
  const totalGalHour = (pumpLph * 0.264172).toFixed(1);

  document.getElementById('recInjectorCc').textContent = `${chosen.toLocaleString()} cc`;
  document.getElementById('flowLbsText').textContent = `Flows ${(chosen / 10.5).toFixed(1)} lbs/hr per Injector`;
  document.getElementById('exactCc').textContent = `${Math.round(flowCc)} cc / min`;
  document.getElementById('fuelPumpLph').textContent = `${pumpLph} LPH (e.g. Walbro ${pumpLph > 255 ? '450' : '255'})`;
  document.getElementById('totalGalHour').textContent = `≈ ${totalGalHour} Gallons / Hour WOT`;
}
window.addEventListener('DOMContentLoaded', init);
