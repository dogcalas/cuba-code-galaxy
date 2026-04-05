# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cuba Code Galaxy is a **single-page 3D visualization** of the Cuban open-source GitHub ecosystem. It renders an interactive galaxy using Three.js where:

- **Suns** = Programming languages (size based on repo count)
- **Planets** = GitHub repositories (orbit their language's sun; size based on stars+forks)
- **Moons** = Repo owners (orbit their repo's planet)
- **Asteroids** = Cuban developers (orbit the galaxy perimeter; size based on followers)

The UI is entirely in **Spanish**.

## Architecture

The entire app is two files — no build system, no bundler, no package manager:

- **`index.html`** — All HTML, CSS, and JS in one file. The `<script type="module">` block (~850 lines) contains the full Three.js scene: renderer setup, galaxy construction, orbit animation loop, raycasting/interaction, search, legend, detail panel, and the GitHub API fetch button.
- **`cuba-data.js`** — Static data exported via `window.*` globals:
  - `CUBA_REPOS` / `EXTRA_REPOS` — repo objects `{repo, lang, stars, forks, pushed, desc}`
  - `CUBAN_DEVS` — dev objects `{login, name, followers, repos, bio}`
  - `LANGUAGE_COLORS` — hex color per language (sun color)
  - `PLANET_PALETTES` — array of hex colors per language (planet variety)
  - `REPO_OWNER_MAP` — `{repoFullName: loginHandle}` mapping repos to owners (drives moons)
  - `USER_PROFILES` — `{login: {name, bio, followers, repos, color}}` for moon/asteroid enrichment

## Development

Open `index.html` directly in a browser (or use any static file server). No install or build step.

Three.js v0.165.0 is loaded via CDN import map — no local copy.

## Key Concepts

- **Orbit system**: Planets are placed in concentric orbit rings around their sun. Each ring has a random 3D tilt (`tiltX`, `tiltZ`). The `orbits[]` array drives animation. Repos sorted by `pushed_at` (most recent = innermost orbit).
- **Hover-pause**: When the mouse is near a sun (screen-space distance), `pausedSunIdx` is set and orbits belonging to that sun stop animating. Identified by `o.sunPos.distanceTo(sunMeshes[pausedSunIdx].position) < 5`.
- **Moons**: Created via `makeMoon()` which pushes to `moonOrbits[]`. Each moon stores a `centerFn` closure that returns the parent planet's live position.
- **Galaxy layout**: Suns are placed on a Fibonacci sphere of radius `GALAXY_R`. Each solar system's planets fill concentric rings outward from the sun.
- **Raycasting priority**: planets > dev asteroids > moons (moons use manual distance check due to small size).
