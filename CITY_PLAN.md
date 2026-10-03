# Neon Daydream: a tiny anime city

## Direction

A miniature cyberpunk neighborhood to watch and play with whenever a new tab opens. Think a quiet establishing shot from a 1990s PC-98 adventure such as Policenauts: a 640 × 400 pixel scene, 16 colors, patterned dithering, dark outlines, bitmap signage, tangled cables, rooftop equipment, and small moments of life. Colorful and whimsical, with no scores or tasks.

The city sits in a simple adventure-game frame that fits the screen. Controls stay small so it feels like a place. Start with one fixed camera looking slightly down into a compact streetscape.

### Composition

- Background: changing sky, distant skyline, clouds, and moon or sun.
- Middle: six to eight buildings, a prominent clock tower, hologram billboards, and a rooftop creature.
- Foreground: a ramen shop, arcade, vending machine, platform, and a full train car.
- Palette: 16 colors drawn from 12-bit RGB, including indigo outlines, lavender walls, peach skies, cyan, pink, and amber signs. Dithered shadows and bright pixel edges supply depth and light. See [PC98_STYLE.md](PC98_STYLE.md).

## Short phases

Each phase leaves the extension runnable. At the end, capture a screenshot, summarize what changed, and list the interactions available to try. Incorporate feedback into the next phase without requiring approval for every routine step.

### 1. Build the miniature city

- Create the full-screen scene and separate HTML, CSS, and JavaScript files.
- Draw the sky, ground, building silhouettes, tower, and billboard frames.
- Establish the fixed camera, scale, and clear focal point.
- Keep this phase static and use a dusk palette to judge the composition.

**Visible checkpoint:** opening a new tab shows a complete, simple miniature city instead of Hello World. Check that the scene fills a laptop screen and remains usable in a narrower window.

### 2. Give it the anime look

- Add ink outlines, cel shading, window patterns, rooftop machinery, pipes, cables, and shop signs.
- Add a ramen shop, arcade, and a small rooftop mascot.
- Add bright pixel edges and broken street reflections within the fixed palette.
- Use locally drawn artwork; no downloaded assets or font dependency.

**Visible checkpoint:** a still screenshot communicates the intended 1990s anime mood before any animation is needed.

### 3. Bring the signs to life

- Give three main billboards distinct short loops: a rotating holographic planet, a bouncing mascot, and a scrolling fictional advertisement.
- Randomly select the next animation from a small local set, with staggered timing.
- Add a passing tram, slowly moving clouds, and gentle hologram movement.
- Add a pause control and respect the system's reduced-motion preference from this phase onward. Avoid rapid flashing.

**Visible checkpoint:** the city feels alive when left alone; pause freezes decorative movement. All animated advertisements are fictional and stored locally.

### 4. Make the city a fidget toy

- Clicking a billboard switches its animation.
- Clicking the tower sends a ring of light through the neighborhood.
- Clicking the vending machine releases a small holographic surprise.
- Clicking the rooftop mascot makes it react.
- Provide subtle hover hints, visible keyboard focus, and Enter/Space activation.

**Visible checkpoint:** four discoverable interactions respond immediately and can be repeated without accumulating endless objects or effects.

### 5. Connect the city to time

- Put the actual device-local time on the main clock tower and a smaller digital sign.
- Transition the sky and window lighting through morning, daytime, dusk, and night based on local hour.
- Add a small lighting preview control so every palette can be explored at any time, plus an Auto option.
- Keep clocks correct when the tab resumes after being hidden or the device wakes.

**Visible checkpoint:** the clocks match the computer; previewing the four lighting modes visibly transforms the city. These are artistic time-of-day palettes, not calculated sunrise times.

### 6. Move to Tokyo and add its weather

- Translate the new-tab interface, scene signs, and accessible labels into Japanese.
- Replace the street with a full train car and platform inspired by Tokyo's Yamanote line.
- Use Tokyo time for the clock and automatic lighting.
- Fetch current weather for fixed Shibuya coordinates through Open-Meteo, without geolocation or a city search.
- Display temperature and conditions on a weather board, with clear, cloudy, rain, and snow scene effects.
- Cache successful results for 15 minutes and clearly mark saved, stale, or unavailable weather.

**Visible checkpoint:** the scene reads as Tokyo; weather changes the scene and is clearly identified as live, saved, stale, or unavailable.

### 7. Finish the extension

- Check the scene at common laptop and desktop sizes and in a narrow window.
- Pause decorative JavaScript work when the tab is hidden; limit particles and clean up temporary effects.
- Check keyboard access, pause, reduced motion, saved preferences, and extension reloads.
- Update the extension name, description, and README with installation, controls, live-weather behavior, and attribution.
- Verify loading through Chrome's **Load unpacked** flow and inspect console errors. Packaging validation alone does not prove that the new-tab override works.

**Visible checkpoint:** a finished city that opens reliably in new tabs, with a concise guide to its toys and settings.

## Technical approach

- Keep Manifest V3 and the existing new-tab override.
- Use a 640 × 400 indexed pixel buffer presented on canvas, CSS for responsive framing, and external JavaScript for drawing, animation, interaction, clocks, preferences, and weather. The PC-98 art pass supersedes the original SVG renderer.
- Draw weather and animation on the same pixel grid. Cache static artwork and update small animated areas at a limited frame rate.
- Keep the project dependency-free with no build step. Bundle all executable code locally and avoid inline script handlers so it works with Chrome extension security rules.
- Keep the scene usable offline. Live weather is the only planned network feature.
- Use an explicit pause state for decorative animation and stop it when the page is hidden. Timekeeping remains accurate when decorative animation is paused. Canvas interactions need accessible DOM controls.

## Current status

- [x] Restore the working Hello World baseline after the interrupted edit.
- [x] Define the visual direction and phased implementation.
- [x] Phase 1: miniature city
- [x] Phase 2: PC-98 anime pixel artwork
- [x] Phase 3: ambient animation
- [x] Phase 4: interactive toys
- [x] Phase 5: local time and lighting
- [x] Phase 6: Tokyo scene and live local weather
- [ ] Phase 7: polish and extension verification

### Phase 1 checkpoint

Implemented a static dusk scene with nine main building shapes (including the tower and two foreground shops), a distant skyline, three neon billboard frames, and a street. The artwork used named SVG layers, with separate HTML, CSS, and JavaScript files. At this checkpoint, clocks and billboard illustrations were decorative.

Chrome page checks cover desktop (1440 × 900), narrow (768 × 900), and small (390 × 844) windows, with no JavaScript errors, failed local resources, or document overflow. This checks page rendering; extension loading through **Load unpacked** remains part of Phase 7.

- [Desktop screenshot](previews/phase-1-desktop.png)
- [Narrow-window screenshot](previews/phase-1-narrow.png)

### Phase 2 checkpoint: PC-98 art direction

Researched the original Policenauts city imagery and PC-98 palette workflows. Replaced smooth SVG drawing with an original 640 × 400 scene using exactly 16 colors, ordered dithering, and a local bitmap alphabet. Added fine architectural details, rooftop equipment, cables, ramen and arcade shopfronts, neon reflections, an android billboard portrait, and a rooftop cat.

Chrome checks cover 1440 × 900, 1366 × 768, 768 × 900, and 390 × 844. The native buffer uses exactly 16 opaque colors with 4-bit-compatible channel values. Redraws remain identical across window sizes, the image fits without overflow, and there are no browser errors or failed local resources.

- [Research and style rules](PC98_STYLE.md)
- [Desktop screenshot](previews/phase-2-pc98-desktop.png)
- [Native pixel image](previews/phase-2-pc98-native.png)

### Phase 3 checkpoint: ambient animation

The orbit club, dream mascot, and Luna FM signs animate independently and randomly choose a different short loop after several seconds. A small cloud drifts over the sky and a tram occasionally crosses the street. Three people walk independently along the sidewalk, while the parked car and fixed pedestrians have been removed. The motion runs at about 10 frames per second from a cached static image. A keyboard-accessible pause button freezes the current frame; the scene also starts still for reduced-motion users and stops updating when the tab is hidden.

Chrome checks confirmed the image changes while playing, an orbit animation changes mode after its interval, pause holds the exact frame, play resumes it, and a reduced-motion new tab begins still. The browser reported no JavaScript errors or failed local resources. The preview GIF contains 24 native-resolution frames over 4.8 seconds.

The sidewalk revision was checked separately: a reduced-motion frame includes a walker, the sidewalk changes while motion plays, pause holds it still, and the clear street renders at desktop and narrow sizes. The linked animation preview was updated to show this version.

- [Short animation](previews/phase-3-motion.gif)
- [Desktop screenshot](previews/phase-3-motion-desktop.png)
- [Narrow-window screenshot](previews/phase-3-motion-narrow.png)

### Phase 4 checkpoint: interactive toys

Six button regions now map to the three billboards, clock tower, vending machine, and rooftop cat. Billboards advance their own animation immediately. The tower emits one expanding light wave, the vending machine releases one of three small holograms, and the cat hops. Each transient effect uses one bounded state slot, so repeated activation replaces the previous effect. Hover and keyboard focus show an outline and label; the buttons expose descriptive accessible names and announce results in a live region.

Chrome checks activated the targets with pointer clicks, Enter, and Space. They confirmed the result changed the 16-color canvas, focus hints were visible, the scene stayed still under reduced motion, and all six hit regions remained clickable in a narrow window. No browser errors or failed local resources were reported.

- [Hover preview](previews/phase-4-hover-desktop.png)
- [Effects preview](previews/phase-4-effects-desktop.png)

### Phase 5 checkpoint: local time and lighting

The tower's analog hands and small digital sign now use device-local time. A separate clock update runs when decorative motion is paused, while focus and visibility events refresh the display when the tab returns or the device wakes. Auto lighting follows four local-hour ranges: morning 05:00–09:59, day 10:00–16:59, dusk 17:00–20:59, and night 21:00–04:59. The new Light selector previews any phase without changing the clock. Each phase swaps a complete 16-color palette for the same indexed pixel scene, changing the sky, building surfaces, and window lighting. Pointer hover now uses a muted border and quieter label; keyboard focus remains more visible.

Chrome checks covered every palette, the exact 16-color canvas output, the clock advancing while decorative motion was paused, a simulated local time change after tab focus, muted hover styling, browser errors, and a narrow window. All passed. The screenshot previews use a fixed test time of 07:23 so their clock readouts remain comparable across palettes.

- [Morning preview](previews/phase-5-morning.png)
- [Day preview](previews/phase-5-day.png)
- [Dusk preview](previews/phase-5-dusk.png)
- [Night preview](previews/phase-5-night.png)

### Phase 6 checkpoint: Tokyo rail scene and weather

The page, accessible controls, scene signs, and extension name are in Japanese. The former road is now a full rail car and platform inspired by Tokyo's Yamanote line. The clock and automatic lighting use Japan Standard Time. Current conditions for fixed Shibuya coordinates come from Open-Meteo. Weather codes select clear, cloudy, rain, or snow visuals, and the weather board shows the condition and temperature. Successful results are cached for 15 minutes; saved, stale, and offline states are labeled. No device location is requested.

The live API returned a current temperature and WMO weather code for the selected coordinates. Controlled Chrome checks covered all four visual weather groups, a stale cached result, and an offline result. Each frame retained exactly 16 colors and no JavaScript exceptions were reported. Full Chrome **Load unpacked** verification remains in Phase 7.

- [Rain preview](previews/tokyo-rain.png)
- [Snow preview](previews/tokyo-snow.png)

Next: Phase 7 finishes extension installation checks, responsive polish, and documentation.
