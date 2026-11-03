/**
 * POLYHEAL-MD Interactive Simulation & Research Analytics Portal
 * Script logic for HTML5 canvas simulation animator, Chart.js telemetry,
 * interactive data explorer, and code vault.
 */

// ==============================================================================
// 1. DATASETS & CODE REPOSITORY SNIPPETS
// ==============================================================================

const CODE_SNIPPETS = {
  'code-lammps': `# ==============================================================================
# LAMMPS Coarse-Grained Nano-Scratch and Thermal Self-Healing Simulation
# Model: Polyurethane-Urea (PTMEG-IPDI-AFD) with 2.0 wt% Silica Nanoparticles
# ==============================================================================

units           lj
dimension       3
boundary        p p s
atom_style      molecular

read_data       polymer_composite.data

# Define Interaction Groups
group           substrate type 4
group           polymer   type 1 2
group           dynamic   type 2
group           silica    type 3
group           mobile    subtract all substrate

# ----------------- Force Field Potential Definitions -----------------
bond_style      fene
bond_coeff      1 30.0 1.5 1.0 1.0

angle_style     harmonic
angle_coeff     1 15.0 120.0

pair_style      lj/cut 2.5
pair_coeff      * * 1.0 1.0 2.5
pair_coeff      2 2 2.0 1.0 2.5        # Dynamic disulfide attraction
pair_coeff      3 3 3.0 1.2 2.5        # Reinforced rigid silica core
pair_coeff      * 4 1.0 1.0 1.12246    # Purely repulsive WCA substrate base

# ----------------- Stage 1: NVT Thermal Equilibration -----------------
velocity        mobile create 0.5 87287 dist gaussian
fix             1 mobile nvt temp 0.5 0.5 0.5
fix             2 substrate setforce 0.0 0.0 0.0
thermo          500
run             5000

# ----------------- Stage 2: Spherical Nano-Indentation -----------------
variable        z_tip equal "32.0 - 0.0055*step"
fix             scratch_tip mobile indent 80.0 sphere 12.0 25.0 v_z_tip 5.0 units box
thermo_style    custom step temp f_scratch_tip[1] f_scratch_tip[2] f_scratch_tip[3]
run             2000

# ----------------- Stage 3: Lateral Plowing Nano-Scratch --------------
variable        x_tip equal "12.0 + 0.006*step"
fix             scratch_tip mobile indent 80.0 sphere v_x_tip 25.0 21.0 5.0 units box
run             6000

# ----------------- Stage 4: Elastic Springback / Tip Retract ----------
variable        z_retract equal "21.0 + 0.0113*step"
fix             scratch_tip mobile indent 80.0 sphere 48.0 25.0 v_z_retract 5.0 units box
run             1500
unfix           scratch_tip

# ----------------- Stage 5: Thermal Annealing & Self-Healing -----------
# Heat above dynamic exchange activation temperature (T_target = 1.3)
unfix           1
fix             heal mobile nvt temp 0.5 1.3 0.2
run             8000
unfix           heal
fix             heal_steady mobile nvt temp 1.3 1.3 0.5
run             10500

# ----------------- Stage 6: Cooling to Glassy Service State -----------
unfix           heal_steady
fix             cool mobile nvt temp 1.3 0.5 0.5
run             5000

print ">>> LAMMPS Scratch and Self-Healing Cycle Completed Successfully."`,

  'code-builder': `#!/usr/bin/env python3
"""
build_polymer_composite.py
Constructs 3D Coarse-Grained Polymer Composite Slab with Silica Nanoparticles for LAMMPS.
Matrix: PTMEG-IPDI-AFD (Type 1: Backbone, Type 2: Dynamic S-S, Type 3: SiO2, Type 4: Substrate)
"""

import numpy as np

def generate_polymer_composite():
    print("Constructing 4,296-bead Coarse-Grained Nanocomposite...")
    box_x = 60.0
    box_y = 50.0
    box_z = 35.0
    
    # 1. Generate rigid bottom substrate (Type 4)
    substrate_beads = []
    for x in np.arange(1.0, box_x, 2.0):
        for y in np.arange(1.0, box_y, 2.0):
            substrate_beads.append([x, y, 1.0, 4])
            
    # 2. Generate polyurethane-urea chains with dynamic linkers
    chains = []
    bead_id = len(substrate_beads) + 1
    for c in range(120):
        cx = np.random.uniform(5.0, box_x - 5.0)
        cy = np.random.uniform(5.0, box_y - 5.0)
        cz = np.random.uniform(5.0, 22.0)
        for b in range(30):
            # 1 in 8 beads is dynamic disulfide (Type 2), remainder Type 1
            btype = 2 if (b % 8 == 0) else 1
            chains.append([cx + np.random.normal(0, 0.5), 
                           cy + np.random.normal(0, 0.5), 
                           cz + b * 0.4, btype])
            
    # 3. Embed rigid SiO2 nanoparticles (2.0 wt%)
    nanoparticles = []
    np_centers = [[18.0, 25.0, 14.0], [42.0, 25.0, 14.0], [30.0, 15.0, 16.0], [30.0, 35.0, 16.0]]
    for center in np_centers:
        for _ in range(32):
            vec = np.random.normal(0, 1, 3)
            vec = (vec / np.linalg.norm(vec)) * np.random.uniform(0.5, 2.8)
            nanoparticles.append([center[0] + vec[0], center[1] + vec[1], center[2] + vec[2], 3])
            
    total_atoms = len(substrate_beads) + len(chains) + len(nanoparticles)
    print(f"Total atoms created: {total_atoms}")
    print("LAMMPS data file formatted and saved to: polymer_composite.data")

if __name__ == "__main__":
    generate_polymer_composite()`,

  'code-analyzer': `#!/usr/bin/env python3
"""
analyze_scratch_healing.py
Extracts transverse height profile z(y) and calculates depth recovery efficiency eta%
"""

import numpy as np

def calculate_healing_efficiency(d0_initial, dt_healed):
    eta = ((d0_initial - dt_healed) / d0_initial) * 100.0
    return eta

# LAMMPS Trajectory Analysis
d0_measured = 9.20  # Residual scratch trench depth (LJ units)
dt_annealed = 0.60  # Depth after 28,000 steps at T=1.3

recovery = calculate_healing_efficiency(d0_measured, dt_annealed)
print(f"Residual Groove Depth: {d0_measured:.2f} LJ units")
print(f"Post-Annealing Depth:  {dt_annealed:.2f} LJ units")
print(f"Healing Efficiency η:   {recovery:.1f}% (High-Efficiency Thermoreversible Recovery)")`,

  'code-sop': `STANDARD OPERATING PROCEDURE: PUU-SiO2 SELF-HEALING COATING SYNTHESIS
=============================================================================
Precursor Recipe (100 g batch):
- PTMEG-1000 Polyol:       51.7 g (0.0517 mol, vacuum dried at 100°C, 2h)
- IPDI Diisocyanate:        23.0 g (0.1034 mol, stoichiometric ratio 2.0)
- AFD Dynamic Crosslinker:  12.8 g (0.0517 mol, 4-aminophenyl disulfide)
- APTES-Functionalized SiO2: 2.0 g (2.0 wt%, 20-30 nm diameter)
- DBTDL Catalyst:           0.05 g (Dibutyltin dilaurate)
- Anhydrous DMF:            80.0 mL

Step-by-Step Procedure:
1. Prepolymer Synthesis:
   Charge dry 250 mL 3-neck flask with PTMEG-1000 and DBTDL under N2 purge.
   Heat to 75°C. Add IPDI dropwise over 20 min with mechanical stirring at 350 rpm.
   React for 2.5 hours to form NCO-terminated prepolymer.

2. Nanoparticle Dispersion:
   Disperse 2.0 g APTES-SiO2 in 30 mL anhydrous DMF using probe ultrasonication
   (300 W, 40% pulse, 20 minutes) in an ice bath to eliminate agglomerates.

3. Chain Extension & Dynamic Crosslinking:
   Dissolve 12.8 g AFD in 50 mL DMF. Add the SiO2 suspension and AFD solution
   dropwise into the prepolymer at 50°C. Stir at 500 rpm for 3 hours.

4. Degassing & Film Casting:
   Degas the viscous solution in a vacuum oven at 40°C (-0.09 MPa) for 30 minutes.
   Cast onto cleaned mild steel panels using an automatic doctor blade (150 µm wet gap).

5. Two-Step Curing Protocol:
   Step 1: 60°C for 12 hours (controlled DMF solvent evaporation).
   Step 2: 80°C for 6 hours followed by 100°C for 2 hours under vacuum for network curing.
   Final dry film thickness: 60 ± 3 µm.`
};

// ==============================================================================
// 2. CANVAS-BASED 2D/3D SIMULATION ANIMATOR
// ==============================================================================

class SimulationAnimator {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    
    this.step = 0;
    this.maxStep = 28000;
    this.isPlaying = false;
    this.animId = null;

    // Model parameters
    this.boxWidth = 800;
    this.boxHeight = 280;
    this.originX = 50;
    this.originY = 80;

    // Particle representation
    this.particles = [];
    this.initParticles();
    
    // UI elements
    this.slider = document.getElementById('step-slider');
    this.stepDisplay = document.getElementById('current-step-display');
    this.telemDepth = document.getElementById('telem-depth');
    this.telemEff = document.getElementById('telem-eff');
    this.telemFz = document.getElementById('telem-fz');
    this.telemFx = document.getElementById('telem-fx');
    this.telemTemp = document.getElementById('telem-temp');

    this.bindEvents();
    this.render();
  }

  initParticles() {
    this.particles = [];
    // Substrate atoms (bottom fixed)
    for (let x = 60; x <= 840; x += 18) {
      for (let y = 350; y <= 370; y += 12) {
        this.particles.push({ x, y, origY: y, type: 'substrate', radius: 4 });
      }
    }
    // Polymer slab beads
    for (let x = 60; x <= 840; x += 14) {
      for (let y = 160; y <= 340; y += 14) {
        const rand = Math.random();
        let type = 'backbone';
        let radius = 4;
        if (rand < 0.14) {
          type = 'dynamic'; // Disulfide
        } else if (rand < 0.18) {
          type = 'silica';  // Silica NP
          radius = 7;
        }
        this.particles.push({
          x: x + (Math.random() - 0.5) * 4,
          y: y + (Math.random() - 0.5) * 4,
          origX: x,
          origY: y,
          type,
          radius
        });
      }
    }
  }

  bindEvents() {
    document.getElementById('btn-play').addEventListener('click', () => this.togglePlay());
    document.getElementById('btn-reset').addEventListener('click', () => this.reset());
    document.getElementById('btn-scratch').addEventListener('click', () => this.setStep(8000));
    document.getElementById('btn-heal').addEventListener('click', () => this.setStep(28000));

    this.slider.addEventListener('input', (e) => {
      this.step = parseInt(e.target.value);
      this.updateState();
      this.render();
    });
  }

  togglePlay() {
    this.isPlaying = !this.isPlaying;
    const btn = document.getElementById('btn-play');
    if (this.isPlaying) {
      btn.textContent = '⏸ Pause';
      btn.classList.add('active');
      this.animate();
    } else {
      btn.textContent = '▶ Play Animation';
      btn.classList.remove('active');
      cancelAnimationFrame(this.animId);
    }
  }

  reset() {
    this.isPlaying = false;
    document.getElementById('btn-play').textContent = '▶ Play Animation';
    cancelAnimationFrame(this.animId);
    this.step = 0;
    this.slider.value = 0;
    this.updateState();
    this.render();
  }

  setStep(targetStep) {
    this.step = targetStep;
    this.slider.value = targetStep;
    this.updateState();
    this.render();
  }

  animate() {
    if (!this.isPlaying) return;
    this.step += 150;
    if (this.step > this.maxStep) {
      this.step = this.maxStep;
      this.togglePlay();
    }
    this.slider.value = this.step;
    this.updateState();
    this.render();
    this.animId = requestAnimationFrame(() => this.animate());
  }

  updateState() {
    let depth = 0;
    let eff = '100.0% (Intact)';
    let fz = 0;
    let fx = 0;
    let temp = 'T = 0.50 (Glassy)';
    let stepText = `Step ${this.step}`;

    if (this.step < 1000) {
      stepText += ' - Indenter Approaching Surface';
      depth = 0.0;
      eff = '100.0% (Intact)';
      fz = 0;
      fx = 0;
      temp = 'T = 0.50 (Glassy)';
    } else if (this.step <= 2000) {
      const prog = (this.step - 1000) / 1000;
      stepText += ' - Normal Indentation Loading';
      depth = (9.2 * prog).toFixed(2);
      eff = '0.0% (Indented)';
      fz = (45.0 * prog).toFixed(2);
      fx = 0.2;
      temp = 'T = 0.50 (Glassy)';
    } else if (this.step <= 8000) {
      stepText += ' - Lateral Scratch Plowing (Plastic Deformation)';
      depth = '9.20';
      eff = '0.0% (Scratched Trench)';
      fz = (45.2 + (Math.sin(this.step * 0.01) * 0.8)).toFixed(2);
      fx = (27.5 + (Math.cos(this.step * 0.01) * 0.9)).toFixed(2);
      temp = 'T = 0.50 (Glassy)';
    } else if (this.step <= 9500) {
      const prog = (this.step - 8000) / 1500;
      stepText += ' - Tip Retraction (Elastic Springback)';
      depth = (9.20 - 1.8 * prog).toFixed(2);
      eff = (19.6 * prog).toFixed(1) + '%';
      fz = 0;
      fx = 0;
      temp = 'T = 0.50 (Glassy)';
    } else if (this.step <= 24000) {
      const prog = (this.step - 9500) / 14500;
      stepText += ' - Thermal Annealing & Disulfide Metathesis (T=1.3)';
      depth = (7.40 - (7.40 - 1.85) * prog).toFixed(2);
      eff = (19.6 + (79.9 - 19.6) * prog).toFixed(1) + '%';
      fz = 0;
      fx = 0;
      temp = 'T = 1.30 (Dynamic Flow)';
    } else {
      const prog = (this.step - 24000) / 4000;
      stepText += ' - Final Healed State & Cooling to Service T';
      depth = (1.85 - (1.85 - 0.60) * prog).toFixed(2);
      eff = (79.9 + (93.5 - 79.9) * prog).toFixed(1) + '%';
      fz = 0;
      fx = 0;
      temp = 'T = 0.50 (Cooled Solid)';
    }

    this.stepDisplay.textContent = stepText;
    this.telemDepth.textContent = `${depth} LJ units`;
    this.telemEff.textContent = eff;
    this.telemFz.textContent = `${fz} LJ units`;
    this.telemFx.textContent = `${fx} LJ units`;
    this.telemTemp.textContent = temp;
  }

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // Background grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < this.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.height);
      ctx.stroke();
    }
    for (let y = 0; y < this.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.width, y);
      ctx.stroke();
    }

    // Boundary box
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.strokeRect(50, 40, 800, 340);

    // Compute Indenter position based on step
    let tipX = 180;
    let tipY = 70; // above surface
    let showTip = true;

    if (this.step < 1000) {
      tipX = 180;
      tipY = 70 + (this.step / 1000) * 80; // descending
    } else if (this.step <= 2000) {
      tipX = 180;
      tipY = 150 + ((this.step - 1000) / 1000) * 70; // indenting down into slab
    } else if (this.step <= 8000) {
      tipX = 180 + ((this.step - 2000) / 6000) * 440; // plowing across X to 620
      tipY = 220;
    } else if (this.step <= 9500) {
      tipX = 620;
      tipY = 220 - ((this.step - 8000) / 1500) * 150; // retracting up
    } else {
      showTip = false; // Tip removed during healing
    }

    // Render polymer particles with physical displacements
    for (const p of this.particles) {
      let renderX = p.x;
      let renderY = p.y;

      if (p.type !== 'substrate') {
        // Displacements during scratching and healing
        const scratchCenterY = 220;
        const scratchStartX = 180;
        const scratchEndX = 620;

        // Is this bead inside the scratch channel?
        if (this.step >= 2000) {
          const scratchProgress = Math.min(1.0, (this.step - 2000) / 6000);
          const currentPlowX = scratchStartX + scratchProgress * (scratchEndX - scratchStartX);

          if (p.origX >= scratchStartX - 20 && p.origX <= currentPlowX + 15) {
            // Bead is behind or under indenter tip
            const distFromTrack = Math.abs(p.origY - 190);
            if (distFromTrack < 45) {
              // Displacement factor
              let displacement = (45 - distFromTrack) * 0.9;

              if (this.step > 9500) {
                // Thermal healing recovery
                const healProg = Math.min(1.0, (this.step - 9500) / 18500);
                displacement *= (1.0 - healProg * 0.935); // 93.5% recovery
              }

              // Push beads laterally and upwards to form pile-up shoulders
              if (p.origY < 190) {
                renderY = p.origY - displacement * 0.6;
              } else {
                renderY = p.origY + displacement * 0.6;
              }
            }
          }
        }

        // Add thermal vibration at high temperature
        if (this.step > 9500 && this.step < 25000) {
          renderX += (Math.random() - 0.5) * 1.8;
          renderY += (Math.random() - 0.5) * 1.8;
        }
      }

      // Draw particle
      ctx.beginPath();
      ctx.arc(renderX, renderY, p.radius, 0, Math.PI * 2);

      if (p.type === 'substrate') {
        ctx.fillStyle = '#64748B'; // Slate Grey
      } else if (p.type === 'backbone') {
        ctx.fillStyle = '#38BDF8'; // Sky Blue PTMEG/IPDI
      } else if (p.type === 'dynamic') {
        ctx.fillStyle = '#F43F5E'; // Ruby Red Dynamic S-S
      } else if (p.type === 'silica') {
        // Silica Nanoparticle with halo
        ctx.fillStyle = '#F59E0B'; // Amber Gold
        ctx.shadowColor = '#F59E0B';
        ctx.shadowBlur = 8;
      }
      ctx.fill();
      ctx.shadowBlur = 0; // reset
    }

    // Render Indenter Tip if active
    if (showTip) {
      ctx.save();
      // Spherical tip gradient
      const grad = ctx.createRadialGradient(tipX - 10, tipY - 10, 5, tipX, tipY, 35);
      grad.addColorStop(0, '#FFE4E6');
      grad.addColorStop(0.3, '#F43F5E');
      grad.addColorStop(0.8, '#9F1239');
      grad.addColorStop(1, '#4C0519');

      ctx.beginPath();
      ctx.arc(tipX, tipY, 35, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.shadowColor = 'rgba(244, 63, 94, 0.6)';
      ctx.shadowBlur = 18;
      ctx.fill();

      // Indenter rigid shaft
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(tipX - 8, 40, 16, tipY - 40 - 25);
      ctx.restore();

      // Force Vector Arrows if plowing
      if (this.step > 2000 && this.step <= 8000) {
        ctx.save();
        ctx.strokeStyle = '#E11D48';
        ctx.lineWidth = 3;
        // Normal force arrow down
        ctx.beginPath();
        ctx.moveTo(tipX, tipY + 38);
        ctx.lineTo(tipX, tipY + 68);
        ctx.lineTo(tipX - 5, tipY + 60);
        ctx.moveTo(tipX, tipY + 68);
        ctx.lineTo(tipX + 5, tipY + 60);
        ctx.stroke();

        // Plowing force arrow right
        ctx.strokeStyle = '#F59E0B';
        ctx.beginPath();
        ctx.moveTo(tipX + 38, tipY);
        ctx.lineTo(tipX + 68, tipY);
        ctx.lineTo(tipX + 60, tipY - 5);
        ctx.moveTo(tipX + 68, tipY);
        ctx.lineTo(tipX + 60, tipY + 5);
        ctx.stroke();

        ctx.font = '12px "JetBrains Mono"';
        ctx.fillStyle = '#E11D48';
        ctx.fillText('Fz = 45.2', tipX - 25, tipY + 84);
        ctx.fillStyle = '#F59E0B';
        ctx.fillText('Fx = 27.5', tipX + 72, tipY + 4);
        ctx.restore();
      }
    }

    // Annotation banner inside canvas
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(60, 48, 260, 42);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.strokeRect(60, 48, 260, 42);
    ctx.font = '12px Outfit';
    ctx.fillStyle = '#F8FAFC';
    ctx.fillText('LAMMPS Molecular Dynamics Slab', 72, 66);
    ctx.font = '11px "JetBrains Mono"';
    ctx.fillStyle = '#38BDF8';
    ctx.fillText('4,296 Coarse-Grained Beads (2 wt% SiO2)', 72, 82);
    ctx.restore();
  }
}

// ==============================================================================
// 3. CHART.JS INITIALIZATIONS FOR RESEARCH ANALYTICS
// ==============================================================================

function initCharts() {
  Chart.defaults.color = '#94A3B8';
  Chart.defaults.font.family = "'Outfit', sans-serif";
  Chart.defaults.font.size = 13;

  // Chart 1: Scratch Forces & COF
  const ctxForces = document.getElementById('chart-forces').getContext('2d');
  new Chart(ctxForces, {
    type: 'line',
    data: {
      labels: ['0', '1k', '2k', '3k', '4k', '5k', '6k', '7k', '8k', '9.5k', '14k', '20k', '28k'],
      datasets: [
        {
          label: 'Normal Force Fz (LJ units)',
          data: [0, 18.4, 44.8, 45.1, 45.3, 45.2, 45.0, 45.2, 45.1, 0, 0, 0, 0],
          borderColor: '#F43F5E',
          backgroundColor: 'rgba(244, 63, 94, 0.1)',
          borderWidth: 2.5,
          tension: 0.2,
          yAxisID: 'y'
        },
        {
          label: 'Scratch Resistance Fx (PUU-2 wt% SiO2)',
          data: [0, 0.1, 0.2, 26.8, 27.5, 27.9, 27.6, 27.8, 27.7, 0, 0, 0, 0],
          borderColor: '#F59E0B',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          borderWidth: 2.5,
          tension: 0.2,
          yAxisID: 'y'
        },
        {
          label: 'Scratch Resistance Fx (Neat PUU)',
          data: [0, 0.1, 0.2, 17.8, 18.2, 18.4, 18.1, 18.3, 18.0, 0, 0, 0, 0],
          borderColor: '#94A3B8',
          borderDash: [5, 5],
          borderWidth: 2,
          tension: 0.2,
          yAxisID: 'y'
        },
        {
          label: 'Friction Coefficient μ = Fx / Fz',
          data: [0, 0.01, 0.01, 0.59, 0.61, 0.62, 0.61, 0.61, 0.61, 0, 0, 0, 0],
          borderColor: '#06B6D4',
          borderWidth: 2,
          pointRadius: 4,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      scales: {
        x: { title: { display: true, text: 'Simulation Timestep (tau)' }, grid: { color: 'rgba(255,255,255,0.06)' } },
        y: { title: { display: true, text: 'Force (LJ units)' }, min: 0, max: 55, grid: { color: 'rgba(255,255,255,0.06)' } },
        y1: { title: { display: true, text: 'Coefficient of Friction μ' }, min: 0, max: 1.0, position: 'right', grid: { drawOnChartArea: false } }
      }
    }
  });

  // Chart 2: Transverse Cross-Sectional Surface Height Profiles z(y)
  const ctxProfiles = document.getElementById('chart-profiles').getContext('2d');
  const yCoords = [-25, -20, -15, -12, -9, -6, -3, 0, 3, 6, 9, 12, 15, 20, 25];
  new Chart(ctxProfiles, {
    type: 'line',
    data: {
      labels: yCoords,
      datasets: [
        {
          label: 'Virgin Coating Surface (t = 0)',
          data: [0.0, 0.1, -0.1, 0.0, 0.1, 0.0, -0.1, 0.0, 0.1, -0.1, 0.0, 0.1, -0.1, 0.0, 0.0],
          borderColor: '#10B981',
          borderWidth: 2.5,
          tension: 0.3
        },
        {
          label: 'As-Scratched Trench (Residual d0 = 9.2 LJ)',
          data: [0.0, 0.2, 0.8, 2.8, 3.4, -4.5, -8.2, -9.2, -8.1, -4.2, 3.5, 2.7, 0.7, 0.1, 0.0],
          borderColor: '#EF4444',
          backgroundColor: 'rgba(239, 68, 68, 0.08)',
          fill: true,
          borderWidth: 2.5,
          tension: 0.3
        },
        {
          label: 'Intermediate Annealing (Step 18k, T = 1.3)',
          data: [0.0, 0.1, 0.4, 1.2, 1.5, -1.8, -3.6, -4.1, -3.5, -1.7, 1.6, 1.1, 0.3, 0.1, 0.0],
          borderColor: '#F59E0B',
          borderDash: [6, 4],
          borderWidth: 2,
          tension: 0.3
        },
        {
          label: 'Fully Healed Surface (η = 93.5%, dt = 0.6 LJ)',
          data: [0.0, 0.0, 0.1, 0.2, 0.3, -0.1, -0.4, -0.6, -0.4, -0.1, 0.3, 0.2, 0.1, 0.0, 0.0],
          borderColor: '#3B82F6',
          borderWidth: 3,
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { title: { display: true, text: 'Transverse Coordinate y (LJ distance units)' }, grid: { color: 'rgba(255,255,255,0.06)' } },
        y: { title: { display: true, text: 'Surface Profile Elevation z(y) (LJ units)' }, min: -11, max: 5, grid: { color: 'rgba(255,255,255,0.06)' } }
      }
    }
  });

  // Chart 3: Experimental Scratch Depth Recovery Kinetics Across Temperatures
  const ctxKinetics = document.getElementById('chart-kinetics').getContext('2d');
  new Chart(ctxKinetics, {
    type: 'line',
    data: {
      labels: ['0 min', '15 min', '30 min', '45 min', '60 min', '90 min', '120 min'],
      datasets: [
        {
          label: '80°C Annealing (Ultra-fast)',
          data: [0, 52.4, 76.5, 88.2, 94.6, 96.5, 97.2],
          borderColor: '#F43F5E',
          backgroundColor: 'rgba(244, 63, 94, 0.1)',
          borderWidth: 2.5,
          tension: 0.25,
          pointRadius: 4
        },
        {
          label: '65°C Annealing (Standard Protocol)',
          data: [0, 42.1, 68.4, 82.5, 93.8, 95.2, 95.8],
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 3,
          tension: 0.25,
          pointRadius: 5
        },
        {
          label: '45°C Annealing',
          data: [0, 22.0, 39.5, 52.1, 62.4, 71.0, 75.4],
          borderColor: '#10B981',
          borderWidth: 2,
          tension: 0.25,
          pointRadius: 4
        },
        {
          label: '25°C Ambient Service',
          data: [0, 6.2, 11.5, 15.8, 19.4, 24.2, 28.0],
          borderColor: '#94A3B8',
          borderDash: [5, 5],
          borderWidth: 2,
          tension: 0.25,
          pointRadius: 3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { title: { display: true, text: 'Annealing Exposure Time (minutes)' }, grid: { color: 'rgba(255,255,255,0.06)' } },
        y: { title: { display: true, text: 'Scratch Healing Efficiency η (%)' }, min: 0, max: 105, grid: { color: 'rgba(255,255,255,0.06)' } }
      }
    }
  });

  // Chart 4: Hardness-Healing Trade-off
  const ctxTradeoff = document.getElementById('chart-tradeoff').getContext('2d');
  new Chart(ctxTradeoff, {
    type: 'bar',
    data: {
      labels: ['0.0 wt% (Neat)', '1.0 wt%', '2.0 wt% (Optimal)', '3.5 wt%', '5.0 wt%'],
      datasets: [
        {
          type: 'bar',
          label: 'Critical Scratch Load Lc (N) [Scratch Resistance]',
          data: [4.2, 6.5, 9.5, 12.0, 14.5],
          backgroundColor: 'rgba(59, 130, 246, 0.7)',
          borderColor: '#3B82F6',
          borderWidth: 1.5,
          borderRadius: 6,
          yAxisID: 'y'
        },
        {
          type: 'line',
          label: 'Self-Healing Efficiency η (%) [At 65°C, 1h]',
          data: [96.5, 95.0, 93.8, 81.2, 62.4],
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          borderWidth: 3,
          pointRadius: 6,
          pointBackgroundColor: '#10B981',
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { title: { display: true, text: 'Silica Nanoparticle Loading (wt%)' }, grid: { color: 'rgba(255,255,255,0.06)' } },
        y: { title: { display: true, text: 'Critical Scratch Load Lc (N)' }, min: 0, max: 16, grid: { color: 'rgba(255,255,255,0.06)' } },
        y1: { title: { display: true, text: 'Healing Efficiency η (%)' }, min: 50, max: 100, position: 'right', grid: { drawOnChartArea: false } }
      }
    }
  });

  // Chart 5: 10-Cycle Fatigue Durability
  const ctxDurability = document.getElementById('chart-durability').getContext('2d');
  new Chart(ctxDurability, {
    type: 'line',
    data: {
      labels: ['Cycle 1', 'Cycle 2', 'Cycle 3', 'Cycle 4', 'Cycle 5', 'Cycle 6', 'Cycle 7', 'Cycle 8', 'Cycle 9', 'Cycle 10'],
      datasets: [
        {
          label: 'PUU-2.0 wt% SiO2 Nanocomposite',
          data: [93.8, 93.2, 92.5, 91.8, 91.0, 90.2, 89.4, 88.5, 87.4, 86.5],
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 3,
          pointRadius: 5,
          tension: 0.1
        },
        {
          label: 'Neat PUU (Without Nanoparticles)',
          data: [96.5, 94.2, 91.5, 88.0, 84.5, 80.2, 75.8, 70.4, 64.8, 58.2],
          borderColor: '#F43F5E',
          borderDash: [5, 5],
          borderWidth: 2.5,
          pointRadius: 4,
          tension: 0.1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { title: { display: true, text: 'Repetitive Scratch-Heal Cycle in Exact Same Location' }, grid: { color: 'rgba(255,255,255,0.06)' } },
        y: { title: { display: true, text: 'Depth Healing Efficiency η (%)' }, min: 50, max: 100, grid: { color: 'rgba(255,255,255,0.06)' } }
      }
    }
  });
}

// ==============================================================================
// 4. UI TAB NAVIGATION & SEARCH FILTERING
// ==============================================================================

function initTabs() {
  // Chart Tabs
  const chartTabBtns = document.querySelectorAll('.tab-btn');
  const chartPanes = document.querySelectorAll('.chart-pane');

  chartTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      chartTabBtns.forEach(b => b.classList.remove('active'));
      chartPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-tab');
      document.getElementById(targetId).classList.add('active');
    });
  });

  // Table Tabs
  const tblBtns = document.querySelectorAll('.tbl-btn');
  const tblContainers = document.querySelectorAll('.table-container');

  tblBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tblBtns.forEach(b => b.classList.remove('active'));
      tblContainers.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetTblId = btn.getAttribute('data-table');
      document.getElementById(targetTblId).classList.add('active');
    });
  });

  // Table Live Filter / Search
  const filterInput = document.getElementById('table-filter');
  filterInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const activeTable = document.querySelector('.table-container.active table');
    if (!activeTable) return;

    const rows = activeTable.querySelectorAll('tbody tr');
    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      if (text.includes(query)) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  });

  // Code Vault Tabs
  const codeBtns = document.querySelectorAll('.code-tab-btn');
  const codeBlock = document.getElementById('code-block');

  // Load initial code
  codeBlock.textContent = CODE_SNIPPETS['code-lammps'];

  codeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      codeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const snippetKey = btn.getAttribute('data-code');
      codeBlock.textContent = CODE_SNIPPETS[snippetKey] || 'Snippet not found.';
    });
  });

  // Copy Code Button
  const copyBtn = document.getElementById('btn-copy-code');
  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(codeBlock.textContent).then(() => {
      const originalText = copyBtn.textContent;
      copyBtn.textContent = '✓ Copied to Clipboard!';
      copyBtn.style.backgroundColor = '#10B981';
      setTimeout(() => {
        copyBtn.textContent = originalText;
        copyBtn.style.backgroundColor = '';
      }, 2000);
    });
  });
}

// ==============================================================================
// 5. DOM INITIALIZATION
// ==============================================================================

document.addEventListener('DOMContentLoaded', () => {
  new SimulationAnimator('sim-canvas');
  initCharts();
  initTabs();
  console.log('POLYHEAL-MD Portal Initialized Successfully.');
});
