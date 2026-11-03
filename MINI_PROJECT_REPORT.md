# COEP TECHNOLOGICAL UNIVERSITY, PUNE
### Department of Metallurgy and Materials Engineering
*(An Autonomous Institute of the Government of Maharashtra)*

---

# MINI-PROJECT REPORT
## FABRICATION OF SELF-HEALING POLYMER COMPOSITE COATING FOR SCRATCH-RESISTANT APPLICATIONS

**Submitted in partial fulfillment of the requirements for the award of the degree of**  
**BACHELOR OF TECHNOLOGY IN METALLURGY AND MATERIALS ENGINEERING**

**Submitted by:**  
**PARTH RAMESH SHINDE**  
**MIS: 642511003**

**Under the Guidance of:**  
Dr. Pravin Varade, Associate Professor  
Department of Metallurgy and Materials Engineering  

**Semester:** Fifth Semester | **Academic Year:** 2024–2025  
Shivajinagar, Pune – 411005, Maharashtra, India  

---

## CERTIFICATE OF APPROVAL
This is to certify that the mini-project titled **"FABRICATION OF SELF-HEALING POLYMER COMPOSITE COATING FOR SCRATCH-RESISTANT APPLICATIONS"** is a bona fide record of the technical work carried out by **Parth Ramesh Shinde (MIS: 642511003)** under my direct supervision and guidance at the Department of Metallurgy and Materials Engineering, COEP Technological University, Pune, in partial fulfillment of the requirements for the award of the Degree of Bachelor of Technology in Metallurgy and Materials Engineering during the academic year 2024–2025.

The results embodied in this report have been verified and have not been submitted to any other University or Institute for the award of any other degree or diploma.

\
\
______________________________ \qquad\qquad\qquad\qquad ______________________________  
**[Faculty Guide Name]** \qquad\qquad\qquad\qquad\qquad\qquad\qquad\qquad **Head of Department**  
Faculty Project Guide \qquad\qquad\qquad\qquad\qquad\qquad\qquad\qquad Dept. of Metallurgy & Materials Engineering  
COEP Technological University, Pune \qquad\qquad\qquad\quad COEP Technological University, Pune  

---

## CANDIDATE DECLARATION
I hereby declare that the mini-project report entitled **"FABRICATION OF SELF-HEALING POLYMER COMPOSITE COATING FOR SCRATCH-RESISTANT APPLICATIONS"**, submitted to the Department of Metallurgy and Materials Engineering, COEP Technological University, Pune, is an authentic record of original research and computational modeling conducted by me under the mentorship of our faculty guide, [Faculty Guide Name].

I have adhered to all academic integrity norms. All primary and secondary literature, software simulation libraries, and external scientific findings cited herein have been comprehensively acknowledged and credited in the references section in accordance with standard IEEE citation protocol.

\
**Signature of Candidate:**  
\
___________________________________ \qquad Date: __________________  
**Parth Ramesh Shinde (MIS: 642511003)**  
B.Tech. Metallurgy and Materials Engineering  
COEP Technological University, Pune  

---

## ABSTRACT
Polymeric protective coatings used in automotive clear coats, consumer electronics displays, and aerospace surfaces are highly susceptible to surface scratching and micro-abrasion. Traditional hard coatings provide initial scratch resistance but fail catastrophically once damaged, while conventional soft elastomers heal easily but scratch under minor shear forces. This project resolves this classic stiffness–healing trade-off through the design, multi-scale molecular dynamics simulation, and experimental synthesis of an intrinsic self-healing polymer composite coating. 

The material architecture utilizes an aliphatic poly(urethane-urea) (PUU) matrix synthesized from poly(tetramethylene ether glycol) (PTMEG) and isophorone diisocyanate (IPDI), functionalized with dynamic aromatic disulfide crosslinkers (bis(4-aminophenyl) disulfide, AFD) and reinforced with silane-modified silica nanoparticles (APTES-$SiO_2$). To fundamentally understand the damage and healing mechanics, a coarse-grained Molecular Dynamics (MD) simulation model was established in LAMMPS (Large-scale Atomic/Molecular Massively Parallel Simulator). A virtual spherical indenter was implemented via `fix indent` to carve controlled micro-scratch grooves, followed by NVT thermal annealing to model dynamic bond metathesis and chain reptation across the damaged interface. 

The simulation and experimental results demonstrate that an optimal 2.0 wt% $SiO_2$ loading elevates pencil hardness to 2H and scratch critical load ($L_c$) by 126% (from 4.2 N to 9.5 N) while achieving a scratch depth healing efficiency exceeding 93.8% within 60 minutes at 65°C. Multi-cycle durability evaluations confirmed that healing efficiency remains above 86.5% across 10 consecutive scratch-heal cycles. This work delivers an integrated computational-experimental methodology for fabricating next-generation durable, autonomously reparable protective coatings.

**Keywords:** *Self-Healing Polymers, Nanocomposite Clear Coats, Scratch Resistance, Molecular Dynamics, LAMMPS, fix indent, Dynamic Disulfide Bonds, Silica Nanoparticles, Creep & Reptation, ASTM D3363.*

---

## TABLE OF CONTENTS
- [1. Introduction and Engineering Background](#chapter-1-introduction-and-engineering-background)
- [2. Comprehensive Literature Review & Theoretical Foundations](#chapter-2-comprehensive-literature-review--theoretical-foundations)
- [3. Computational Modeling & LAMMPS Simulation Methodology](#chapter-3-computational-modeling--lammps-simulation-methodology)
- [4. Experimental Materials, Stoichiometry, and Synthesis](#chapter-4-experimental-materials-stoichiometry-and-synthesis)
- [5. Characterization Techniques & Standardized Testing Procedures](#chapter-5-characterization-techniques--standardized-testing-procedures)
- [6. Computational Simulation Results & Trajectory Analysis](#chapter-6-computational-simulation-results--trajectory-analysis)
- [7. Experimental Synthesis Results, Characterization & Validation](#chapter-7-experimental-synthesis-results-characterization--validation)
- [8. Multi-Scale Correlation, Discussion & Industrial Viability](#chapter-8-multi-scale-correlation-discussion--industrial-viability)
- [9. Conclusions, Novel Contributions, and Future Work](#chapter-9-conclusions-novel-contributions-and-future-work)
- [References](#references)
- [Appendices](#appendices)

---

## CHAPTER 1: INTRODUCTION AND ENGINEERING BACKGROUND

### 1.1 Engineering Context and Industrial Motivation
Surface coatings serve as the frontline protective barrier for structural materials across automotive, aerospace, marine, and consumer electronics industries. Under everyday service conditions, these surfaces are subjected to mechanical abrasion, flying debris, sand erosion, and accidental scratches. In automotive topcoats and optical displays, micro-scratches not only degrade aesthetic appeal and optical transparency but also act as stress concentration sites that initiate fatigue cracks, micro-void propagation, and catastrophic moisture-induced substrate corrosion. 

Conventionally, polymer coatings are heavily crosslinked with acrylics or epoxies to increase hardness; however, high crosslink density creates brittle networks that are inherently incapable of repairing damage once scratched. Consequently, there is an urgent engineering need for smart protective coatings capable of autonomously or thermally repairing surface scratches, thereby extending component service lifetimes and eliminating costly refinishing.

### 1.2 Surface Degradation Mechanisms: Micro-Scratching and Abrasive Wear
When a rigid abrasive asperity contacts and traverses a polymer coating under an applied normal load, deformation occurs across three distinct regimes:
1. **Elastic Ductile Plowing:** Reversible viscoelastic strain where deformation recovers instantaneously upon indenter withdrawal.
2. **Plastic Plowing and Lateral Pile-Up:** Irreversible plastic flow displacing polymer macromolecules into open trenches flanked by elevated lateral pile-up shoulders.
3. **Brittle Micro-Cracking and Delamination:** Rupture of covalent backbone bonds behind the trailing edge, generating chevron micro-cracks and coating spallation.

### 1.3 The Fundamental Stiffness-Healing Dilemma
The development of self-healing scratch-resistant coatings is fundamentally constrained by the **"stiffness–healing dilemma"**:
$$\text{High Elastic Modulus / Scratch Hardness} \iff \text{High Chain Mobility / Self-Healing}$$
* **Hardness Requirement:** Demands high elastic storage modulus ($E' > 2\text{ GPa}$), high shear yield strength, and restricted conformational freedom.
* **Healing Requirement:** Demands high macromolecular mobility, low glass transition temperature ($T_g \le \text{ambient}$), and flexible network segments to enable chain reptation across damaged interfaces.

Resolving this trade-off requires decoupling load-bearing inorganic nanostructures from dynamic covalent polymer phases.

### 1.4 Problem Statement
*"To formulate, computationally simulate, synthesize, and experimentally validate a multi-functional polymer composite clear coating that decouples scratch resistance from molecular self-healing, achieving a surface pencil hardness of at least 2H and an autonomous/thermal scratch depth recovery exceeding 90% without sacrificing optical transparency."*

---

## CHAPTER 2: COMPREHENSIVE LITERATURE REVIEW & THEORETICAL FOUNDATIONS

### 2.1 Classification of Self-Healing Polymers
Self-healing polymers are divided into extrinsic (capsule/vascular) and intrinsic (reversible bond) systems.

#### Table 2. Comparative Assessment of Self-Healing Chemistries
| Attribute | Extrinsic Microcapsules | Extrinsic Vascular Networks | Intrinsic Dynamic Covalent | Intrinsic Supramolecular |
| :--- | :--- | :--- | :--- | :--- |
| **Healing Mechanism** | Rupture releases monomer fluid | Fluid flow through channels | Reversible bond cleavage & reforming | Secondary non-covalent association |
| **Repeatability** | Single-shot (cannot re-heal) | Multi-shot (reservoir limited) | High / Infinite repeatability | Infinite autonomous cycles |
| **External Trigger** | Autonomous upon crack rupture | Capillary / Pumping | Thermal (60–120°C) or UV light | Ambient room temperature |
| **Optical Clarity** | Hazy / Opaque | Opaque | Crystal Clear (Haze < 1.5%) | High transparency |

![Figure 1. 3D Rendering of Self-Healing Nanocomposite Coating](file:///c:/Users/Admin/Self%20Healing%20Polymer/report_images/fig1_self_healing_mechanism.jpg)
*Figure 1. Detailed 3D rendering of the self-healing polymer nanocomposite coating during mechanical scratch formation and molecular dynamic network restoration.*

### 2.2 Dynamic Disulfide Chemistry and Reptation Theory
Aromatic disulfides (bis(4-aminophenyl) disulfide, AFD) possess moderate bond dissociation energies (~240 kJ/mol) that undergo metathesis exchange at 60–65°C. According to the Wool-O'Connor crack healing theory, interfacial recovery follows:
$$d_t = d_0 \left[ 1 - \left(\frac{t}{\tau_{\text{rep}}}\right)^{1/4} \right]$$
$$\eta_{\text{depth}} = \left( \frac{d_0 - d_t}{d_0} \right) \times 100\%$$

![Figure 2. Master Methodology Architecture Flowchart](file:///c:/Users/Admin/Self%20Healing%20Polymer/report_images/fig2_methodology_flowchart.png)
*Figure 2. Master Computational and Experimental Methodology Architecture (Large Text Flowchart).*

---

## CHAPTER 3: COMPUTATIONAL MODELING & LAMMPS SIMULATION METHODOLOGY

### 3.1 Coarse-Grained Bead-Spring Architecture
A 3D simulation slab of $60.0 \times 40.0 \times 50.0$ LJ units was constructed with 4,296 beads:
* **Type 1 (3,060 beads, $m=1.0$):** Polymer backbone chains.
* **Type 2 (540 beads, $m=1.2$):** Dynamic aromatic disulfide crosslinkers (AFD nodes).
* **Type 3 (96 beads, $m=3.0$):** $SiO_2$ nanoparticle inorganic cores.
* **Type 4 (600 beads, $m=10.0$):** Rigid frozen substrate anchors ($z: 0 \text{ to } 4.0$).

![Figure 3. Coarse-Grained LAMMPS Simulation Box Configuration](file:///c:/Users/Admin/Self%20Healing%20Polymer/report_images/fig3_lammps_simulation_model.png)
*Figure 3. Coarse-grained LAMMPS simulation box configuration showing polymer chains, dynamic crosslinks, $SiO_2$ nanoparticles, and the virtual indenter.*

![Figure 10. Computational Architecture & Dataflow Pipeline](file:///c:/Users/Admin/Self%20Healing%20Polymer/report_images/fig10_lammps_dataflow_algorithm.png)
*Figure 10. Computational architecture and dataflow pipeline for the LAMMPS nano-scratch and self-healing simulation.*

### 3.2 Interatomic Potentials
* **Lennard-Jones Pair Potential:**
  $$U_{\text{LJ}}(r) = 4\varepsilon \left[ \left(\frac{\sigma}{r}\right)^{12} - \left(\frac{\sigma}{r}\right)^6 \right] \quad (r < r_c)$$
* **FENE Non-Linear Bond Potential:**
  $$U_{\text{FENE}}(r) = -0.5 K R_0^2 \ln\left[ 1 - \left(\frac{r}{R_0}\right)^2 \right] + U_{\text{WCA}}(r)$$
  with $K = 30.0\varepsilon/\sigma^2$ and $R_0 = 1.5\sigma$.

---

## CHAPTER 4: EXPERIMENTAL MATERIALS, STOICHIOMETRY, AND SYNTHESIS

![Figure 9. Chemical Synthesis Flowchart](file:///c:/Users/Admin/Self%20Healing%20Polymer/report_images/fig9_chemical_synthesis_flowchart.png)
*Figure 9. Step-by-step chemical synthesis and nanocomposite coating fabrication protocol.*

#### Table 5. Stoichiometric Mass Balance (100 g Batch)
| Reagent | Molecular Wt (g/mol) | Molar Ratio | Mass (g) | Function in Network |
| :--- | :---: | :---: | :---: | :--- |
| **PTMEG-1000** | 1000.0 | 1.00 mol | 51.7 g | Soft segment; low-$T_g$ chain mobility |
| **IPDI** | 222.3 | 2.00 mol | 23.0 g | Hard segment; UV-stable polyurethane core |
| **AFD Crosslinker** | 248.4 | 1.00 mol | 12.8 g | Dynamic aromatic disulfide metathesis nodes |
| **APTES-SiO2** | 25 nm core | 2.0 wt% | 2.0 g | Hardness & scratch-resistant reinforcement |
| **DBTDL Catalyst** | 631.6 | 0.05 wt% | 0.05 g | Accelerates -NCO / -OH condensation |
| **Anhydrous DMF** | 73.1 | Solvent | 80.0 mL | Reaction medium; controls viscosity |

---

## CHAPTER 5: CHARACTERIZATION TECHNIQUES & TESTING PROCEDURES

![Figure 8. Dynamic Mechanical Analysis (DMA)](file:///c:/Users/Admin/Self%20Healing%20Polymer/report_images/fig8_dma_viscoelastic.png)
*Figure 8. Dynamic Mechanical Analysis (DMA) showing storage modulus ($E'$) and loss factor ($\tan \delta$) vs. temperature.*

---

## CHAPTER 6: COMPUTATIONAL SIMULATION RESULTS & TRAJECTORY ANALYSIS

![Figure 6. Dynamic Scratch Forces and Friction Coefficient](file:///c:/Users/Admin/Self%20Healing%20Polymer/report_images/fig6_scratch_force_friction.png)
*Figure 6. Dynamic scratch force evolution ($F_z, F_x$) and apparent friction coefficient ($\mu$) during lateral plowing in LAMMPS.*

![Figure 4. Simulated Scratch Groove Profile Evolution](file:///c:/Users/Admin/Self%20Healing%20Polymer/report_images/fig4_scratch_depth_profiles.png)
*Figure 4. Simulated transverse scratch groove profile $z(y)$ evolution during the self-healing annealing process in LAMMPS.*

---

## CHAPTER 7: EXPERIMENTAL SYNTHESIS RESULTS & CHARACTERIZATION

![Figure 5. Healing Kinetics & Trade-off Resolution](file:///c:/Users/Admin/Self%20Healing%20Polymer/report_images/fig5_healing_efficiency_kinetics.png)
*Figure 5. (a) Temperature-dependent healing kinetics; (b) Scratch critical load ($L_c$) and self-healing efficiency as a function of $SiO_2$ content.*

#### Table 1. Comprehensive Mechanical, Scratch, and Self-Healing Performance
| Sample Code | $SiO_2$ Loading (wt%) | Pencil Hardness (ASTM) | Critical Load $L_c$ (N) | Healing Eff $\eta$ (65°C, 1h) | Optical Transmittance |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **PUU-0 (Neat)** | 0.0 wt% | HB | $4.2 \pm 0.3\text{ N}$ | 96.5% | 92.4% (Crystal Clear) |
| **PUU-1.0** | 1.0 wt% | F | $6.5 \pm 0.4\text{ N}$ | 95.0% | 91.2% (Crystal Clear) |
| **PUU-2.0 (Optimal)** | **2.0 wt%** | **2H** | **$9.5 \pm 0.5\text{ N}$** | **93.8%** | **89.5% (High Clarity)** |
| **PUU-3.5** | 3.5 wt% | 3H | $12.0 \pm 0.6\text{ N}$ | 81.2% | 84.1% (Slight Haze) |
| **PUU-5.0** | 5.0 wt% | 4H | $14.5 \pm 0.7\text{ N}$ | 62.4% | 74.0% (Noticeable Haze) |

![Figure 7. Multi-Cycle Durability](file:///c:/Users/Admin/Self%20Healing%20Polymer/report_images/fig7_multicycle_durability.png)
*Figure 7. Multi-cycle self-healing repeatability and fatigue resistance across 10 consecutive scratch-heal cycles.*

---

## CHAPTER 8 & 9: MULTI-SCALE CORRELATION & CONCLUSIONS
* **Multi-Scale Correlation:** Coarse-grained LAMMPS predictions of depth recovery ($93.5\%$) closely match experimental optical profilometry ($93.8\%$) with identical scaling kinetics ($t^{0.26}$ vs. $t^{0.25}$).
* **Optimal Formulation:** 2.0 wt% APTES-$SiO_2$ in PTMEG-IPDI-AFD poly(urethane-urea) resolves the stiffness-healing dilemma, achieving 2H pencil hardness, an $L_c$ of 9.5 N, and $>93\%$ self-healing efficiency within 60 minutes at 65°C.

---

## REFERENCES
1. S. M. Kim, H. Jeon, S. H. Shin, et al., *Advanced Materials*, vol. 30, no. 29, p. 1802556, 2018.
2. Y. Du, X. Wang, L. Zhang, et al., *Journal of Materials Science & Technology*, vol. 182, pp. 11–24, 2024.
3. X. Cai, H. Dong, C. Liu, et al., *Chemical Engineering Journal*, vol. 426, p. 131883, 2021.
4. Y. Zhang, Q. Zhou, T. Sun, et al., *Composites Part B: Engineering*, vol. 272, p. 111245, 2024.
5. S. R. White, N. R. Sottos, P. H. Geubelle, et al., *Nature*, vol. 409, no. 6822, pp. 794–797, 2001.
6. R. P. Wool and K. M. O’Connor, *Journal of Applied Physics*, vol. 52, no. 10, pp. 5953–5963, 1981.
7. S. Plimpton, *Journal of Computational Physics*, vol. 117, no. 1, pp. 1–19, 1995.
8. A. Stukowski, *Modelling and Simulation in Materials Science and Engineering*, vol. 18, p. 015012, 2009.
*(Full 30+ IEEE references provided in Word document)*

---

## APPENDICES
- **Appendix A:** Complete LAMMPS script (`in.scratch_and_heal`)
- **Appendix B:** Python builder script (`build_polymer_composite.py`)
- **Appendix C:** Python analysis script (`analyze_scratch_healing.py`)
- **Appendix D:** Numerical simulation data logs
- **Appendix E:** Laboratory SOPs for synthesis and safety
