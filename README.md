# Akash Sur — Portfolio Website

Single-page portfolio site for [Akash Sur](https://www.linkedin.com/in/akash-sur) — VP – Product Owner, MBA (Finance) IIT Patna.

Pure HTML/CSS/JS, no build step, no dependencies.

## Structure

```
index.html      # all content (hero + career staircase, marquee, now, about, moments, experience,
                # projects, writing, education, skills, life, contact)
styles.css      # v10 "the line":
                #   dark  = ink with indigo / violet / teal tints
                #   light = mist with the same tints; regions alternate, header toggle = all dark
                #   violet = product, cyan = data, gradient = AI
                # bump the ?v= on styles.css/script.js in index.html when changing them
script.js       # persona lens, career line, theme toggle, scroll effects, motion control
                # tag new roles/projects/skills with data-lens="data", "product" or "data product"
serve.py        # local dev server
assets/
  logo-a.svg             # "A." mark, used in the header and as the favicon
  themed/                # what the page shows: graded photos and recoloured marks (generated,
                         # commit them). The files below are the untouched sources.
  compass360-mark.svg    # original compass + snowflake mark (palette from the finale deck);
                         # the animated copy is inlined in the Compass360 card
  fonts/                 # Oxanium, Geist, Geist Mono (SIL Open Font License, see OFL.txt)
  pro_pic.jpeg           # previous headshot (the current one is themed/headshot.jpg, graded from
                         # the gitignored "Professional Office Headshot.png")
  bankwest-home-lockup.svg # brand plate on the Bankwest Home card (from that repo's
                         # assets/img/bankwest-home-outlined.svg)
  commbank-diamond.png   # mark on the CommTravel card's plate (from that repo's
                         # public/commbank-diamond.webp, resized to 96px)
  strava_logo_icon_147232.svg # icon on the Strava link beside the running quote
  celestix-logo.png      # Celestix badge, circle-cropped with alpha from Celestix.png
                         # (regenerate: crop source to the badge circle, apply a round
                         #  alpha mask, resize to 448px — see git history for the script)
  hk-harbour.jpg, philippines-beach.jpg, can4cancer-run.jpg     # life section
  mieca-2025.jpg, bizexpo-2023.jpg, iitp-convocation.jpg,
  genai-squad.jpg                                               # moments strip
  Resume_Akash_sur.pdf # downloadable résumé
  (IMG_*.jpg / DJI_*.jpeg / 1000023545.jpg = camera originals, gitignored;
   the site uses the web-optimized copies above)
```

## Rebuild the résumé

Edit `resume-src/resume.html` (local only, gitignored), then:

```bash
python3 resume-src/build.py
```

The script sizes the type to fill exactly one page and fails rather than spilling onto a second.

"10+ years" carries a "by May 2027" qualifier until it is true. The site drops it by itself on
1 May 2027; the PDF drops it the next time `build.py` runs on or after that date, so rebuild and push then.

## Regenerate themed images

After replacing a photo or mark in `assets/` (scripts are local only, gitignored):

```bash
python3 design-src/grade.py
python3 design-src/icons.py
```

For a new photo, update its face regions in `grade.py` so skin tones stay natural.

## Run locally

```bash
python3 serve.py
# open http://localhost:4174
```

## Deploy (GitHub Pages)

1. Create a repo named `sur-akash.github.io` on GitHub.
2. Push these files to its `main` branch.
3. The site goes live at **https://sur-akash.github.io** within a minute — no configuration needed.

(Alternatively push to any repo and enable Settings → Pages → Deploy from branch.)

## Content sources

- LinkedIn profile (headline, about, articles): linkedin.com/in/akash-sur
- Résumé PDF (experience, education, certifications, awards)
- GitHub repos + READMEs (project descriptions): github.com/sur-akash
