#!/usr/bin/env python3
"""Generate placeholder logos for all portfolio companies using initials."""

import json
from PIL import Image, ImageDraw, ImageFont
import os

# Company data from the JSON
companies_data = {
    "Cologix": {"filename": "cologix.png", "color": "#003B73"},
    "Astound Broadband": {"filename": "astound-broadband.png", "color": "#00A3E0"},
    "CoreSite (JV)": {"filename": "coresite.png", "color": "#003B73"},
    "Digital Edge": {"filename": "digital-edge.png", "color": "#00A3E0"},
    "euNetworks": {"filename": "eunetworks.png", "color": "#003B73"},
    "DELTA Fiber": {"filename": "delta-fiber.png", "color": "#00B34A"},
    "Cirion Technologies": {"filename": "cirion-technologies.png", "color": "#003B73"},
    "Cellnex Nordics": {"filename": "cellnex-nordics.png", "color": "#00A3E0"},
    "Extenet": {"filename": "extenet.png", "color": "#003B73"},
    "Intrado": {"filename": "intrado.png", "color": "#00A3E0"},
    "GTA TeleGuam": {"filename": "gta-teleguam.png", "color": "#003B73"},
    "Xplore Inc": {"filename": "xplore-inc.png", "color": "#00B34A"},
    "Philippines Tower JVCo": {"filename": "philippines-tower-jvco.png", "color": "#003B73"},
    "Princeton Digital Group": {"filename": "princeton-digital-group.png", "color": "#00A3E0"},
    "Montera Infrastructure": {"filename": "montera-infrastructure.png", "color": "#003B73"},
    "Clean Energy Fuels": {"filename": "clean-energy-fuels.png", "color": "#00B34A"},
    "Venture Global Calcasieu Pass": {"filename": "venture-global.png", "color": "#00B34A"},
    "Oryx Midstream": {"filename": "oryx-midstream.png", "color": "#00B34A"},
    "Evolve Transition Infrastructure": {"filename": "evolve-transition-infrastructure.png", "color": "#00B34A"},
    "Peak Energy": {"filename": "peak-energy.png", "color": "#00B34A"},
    "Synera Renewable Energy": {"filename": "synera-renewable-energy.png", "color": "#00B34A"},
    "Coastal Virginia Offshore Wind": {"filename": "coastal-virginia-offshore-wind.png", "color": "#00B34A"},
    "Maas Energy Works": {"filename": "maas-energy-works.png", "color": "#00B34A"},
    "KAPS": {"filename": "kaps.png", "color": "#00B34A"},
    "AGP Sustainable Real Assets": {"filename": "agp-sustainable-real-assets.png", "color": "#00B34A"},
    "Stonepeak Island Transition": {"filename": "stonepeak-island-transition.png", "color": "#00B34A"},
    "Kingdom Energy Storage": {"filename": "kingdom-energy-storage.png", "color": "#00B34A"},
    "TerraWind Renewables": {"filename": "terrawind-renewables.png", "color": "#00B34A"},
    "Orsted US Onshore Wind": {"filename": "orsted-us-onshore-wind.png", "color": "#00B34A"},
    "IOR": {"filename": "ior.png", "color": "#00B34A"},
    "JouleTerra": {"filename": "jouleterra.png", "color": "#00B34A"},
    "Longview Infrastructure": {"filename": "longview-infrastructure.png", "color": "#00B34A"},
    "Lestari Cooling Energy": {"filename": "lestari-cooling-energy.png", "color": "#00B34A"},
    "Pelican Pipeline": {"filename": "pelican-pipeline.png", "color": "#00B34A"},
    "Repsol US Renewables": {"filename": "repsol-us-renewables.png", "color": "#00B34A"},
    "WahajPeak": {"filename": "wahajpeak.png", "color": "#00B34A"},
    "Woodside Louisiana LNG": {"filename": "woodside-louisiana-lng.png", "color": "#00B34A"},
    "Lineage": {"filename": "lineage.png", "color": "#00A3E0"},
    "TRAC Intermodal": {"filename": "trac-intermodal.png", "color": "#00A3E0"},
    "Textainer": {"filename": "textainer.png", "color": "#00A3E0"},
    "ATSG": {"filename": "atsg.png", "color": "#00A3E0"},
    "The AA": {"filename": "the-aa.png", "color": "#00A3E0"},
    "Emergent Cold LatAm": {"filename": "emergent-cold-latam.png", "color": "#00A3E0"},
    "Seapeak": {"filename": "seapeak.png", "color": "#00A3E0"},
    "Logistec": {"filename": "logistec.png", "color": "#00A3E0"},
    "GeelongPort": {"filename": "geelongport.png", "color": "#00A3E0"},
    "Rinchem": {"filename": "rinchem.png", "color": "#00A3E0"},
    "Equalbase": {"filename": "equalbase.png", "color": "#00A3E0"},
    "Forgital": {"filename": "forgital.png", "color": "#7C3AED"},
    "Akumin": {"filename": "akumin.png", "color": "#7C3AED"},
    "Arvida": {"filename": "arvida.png", "color": "#7C3AED"},
    "Inspired Education Group": {"filename": "inspired-education-group.png", "color": "#7C3AED"},
    "Cosmopolitan Las Vegas": {"filename": "cosmopolitan-las-vegas.png", "color": "#F59E0B"},
    "Stonepeak Aviation Platform": {"filename": "stonepeak-aviation-platform.png", "color": "#00A3E0"},
    "Stonepeak Infrastructure Logistics Platform": {"filename": "stonepeak-infrastructure-logistics-platform.png", "color": "#00A3E0"},
}

def get_initials(name):
    """Get initials from company name."""
    # Handle special cases
    if name == "The AA":
        return "AA"
    if name == "ATSG":
        return "AT"
    if name == "IOR":
        return "IR"
    if name == "KAPS":
        return "KP"
    
    # Remove common suffixes
    name = name.replace(" (JV)", "").replace(" Inc", "").replace(" Group", "")
    
    words = name.split()
    if len(words) == 1:
        return words[0][:2].upper()
    else:
        # Get first letter of first two significant words
        initials = ""
        for word in words[:2]:
            if word.lower() not in ["the", "of", "and", "&"]:
                initials += word[0].upper()
        return initials[:2] if initials else words[0][:2].upper()

def create_logo(name, filename, color, output_dir):
    """Create a simple logo with initials."""
    size = 128
    img = Image.new('RGBA', (size, size), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)
    
    # Draw rounded rectangle background
    padding = 4
    draw.rounded_rectangle(
        [padding, padding, size - padding, size - padding],
        radius=16,
        fill=color
    )
    
    # Get initials
    initials = get_initials(name)
    
    # Use default font (larger size)
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 48)
    except:
        font = ImageFont.load_default()
    
    # Center text
    bbox = draw.textbbox((0, 0), initials, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    x = (size - text_width) // 2
    y = (size - text_height) // 2 - 4
    
    # Draw text
    draw.text((x, y), initials, fill="white", font=font)
    
    # Save
    output_path = os.path.join(output_dir, filename)
    img.save(output_path, "PNG")
    print(f"Created: {filename}")

def main():
    output_dir = "/home/ubuntu/stonepeak-ai/client/public/logos"
    os.makedirs(output_dir, exist_ok=True)
    
    for name, data in companies_data.items():
        filename = data["filename"]
        color = data["color"]
        # Only create if doesn't exist
        output_path = os.path.join(output_dir, filename)
        if not os.path.exists(output_path):
            create_logo(name, filename, color, output_dir)
        else:
            print(f"Skipped (exists): {filename}")

if __name__ == "__main__":
    main()
