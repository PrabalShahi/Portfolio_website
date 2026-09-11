import sys

css_fixes = """
/* ==========================================================
   ENHANCED MOBILE RESPONSIVENESS FIXES
   ========================================================== */

/* Restore the logo/brand on mobile (it was hidden at 1050px) */
@media(max-width:900px){
  .brand { display: flex !important; margin-bottom: 4px; }
}

/* Reduce padding on cards for smaller screens to save space */
@media(max-width:780px){
  .project-card, .cert-card, .resume-card, .feature-card, .timeline-card, .skills-shell, .skill-panel {
    padding: 16px;
  }
  .cert-card h2, .project-card h2, .resume-card h2 {
    font-size: 16px;
  }
}

/* Scale down the planetary navigation on very small screens to prevent horizontal overflow */
@media(max-width:400px){
  .planet-nav { transform: scale(0.85); transform-origin: top center; margin-bottom: -15px; }
  .filter { padding: 6px 10px; font-size: 8px; }
  .social-wormhole { transform: scale(0.75); transform-origin: top center; }
}
@media(max-width:340px){
  .planet-nav { transform: scale(0.75); transform-origin: top center; margin-bottom: -20px; }
}
"""

with open(r"C:\Users\RYLIE\.gemini\antigravity\scratch\portfolio\assets\style-fixes.css", "w", encoding="utf-8") as f:
    f.write(css_fixes)

print("Created style-fixes.css")

