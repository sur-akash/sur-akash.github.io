# Akash Sur — Portfolio Website

Single-page portfolio site for [Akash Sur](https://www.linkedin.com/in/akash-sur) — Data Product Manager, MBA (Finance) IIT Patna.

Pure HTML/CSS/JS, no build step, no dependencies.

## Structure

```
index.html      # all content (hero, about, experience, projects, writing, education, skills, contact)
styles.css      # navy + gold theme, Fraunces/Inter type, responsive to 900px and 680px breakpoints
script.js       # mobile menu, scroll-spy, reveal-on-scroll animations
serve.py        # local dev server
assets/
  profile.jpg            # LinkedIn profile photo
  Akash-Sur-Resume.pdf   # downloadable résumé
```

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
