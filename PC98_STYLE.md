# PC-98 art direction

The visual reference is the original PC-98 edition of **Policenauts**, with our own colorful miniature neighborhood and characters. This art pass replaces the earlier smooth SVG illustration with a native pixel renderer.

## Research and observations

- [Policenauts: Old Los Angeles 2040 screenshot](https://www.mobygames.com/game/10538/policenauts/screenshots/pc98/447530/): the city image uses dense architectural silhouettes, narrow window strips, small roof details, dark outlines, and stippled shadows. These are observations from the actual game screenshot. Our interpretation keeps that density and pixel treatment while using a playful violet, pink, and cyan dusk palette.
- [PC-9801 palette tool and notes](https://honorless.net/palette/): describes 16 colors per 640 × 400 image selected from a 12-bit RGB range of 4,096 colors. This supplied the working resolution and palette constraints for the new renderer.
- [PC-98 Paint manual](https://alammofm.com/pc98-paint-manual/): documents a contemporary editor built around 640 × 400, 16-color artwork, 4-bit color channels, unaliased drawing, and patterned tone tools. Its workflow informed the use of explicit pixel primitives and ordered dithering.

The source screenshot was viewed as a reference. All artwork, characters, lettering, and drawing code shipped in this project are locally created.

## Rules for this city

1. **Draw at 640 × 400.** Every line, sprite, character, and weather particle belongs on the same logical pixel grid.
2. **Use one 16-color palette per scene.** Each RGB channel is a multiple of 17, within the referenced 12-bit color range. Morning, day, dusk, and night replace all 16 colors while preserving the scene limit.
3. **Use patterned color transitions.** A 4 × 4 ordered dither mixes neighboring palette colors in the sky, wall shadows, and pavement. Keep text and small facial features clear.
4. **Give architecture small, deliberate details.** Single-pixel outlines, window mullions, ventilation grilles, roof equipment, pipes, and sagging cables establish scale.
5. **Draw neon as pixels.** Bright edges, pale cores, dark surrounds, and broken pavement reflections provide the light effect.
6. **Use bitmap lettering.** The local 5 × 7 glyph set renders digits; Japanese signs are rasterized to one-bit glyphs on the same pixel grid and palette.
7. **Keep the city playful.** An original android radio host, the orbit sign, arcade cabinets, and a rooftop cat provide future animation subjects.

## Implementation

`pixel-art.js` provides a palette-index framebuffer, integer lines, rectangles, polygon fills, ellipses, dithering, and bitmap text. It expands palette indices into an opaque canvas image when presenting the frame. `city.js` composes the sky, skyline, buildings, clock, signs, shopfronts, wires, rail car, and frame as separate drawing functions.

The page uses whole-number magnification when at least 2× fits. Smaller windows fit the complete image with CSS pixel rendering; fractional scales can produce uneven pixel widths, and very small screens lose some fine detail. This is a modern PC-98-inspired presentation, rather than a hardware or CRT emulator.

Animation now copies a cached static scene and redraws the moving objects at roughly 10 frames per second. It uses the same indexed palette for every frame. The pause control and six toy targets are real DOM buttons mapped over the canvas. The canvas exposes a text description, and a live region announces toy results.

The static scene keeps its palette indices when the lighting mode changes; `pixel-art.js` maps them through the selected 16-color palette when presenting a frame. The clock hands and digital time are drawn over the cached scene from Tokyo time, independently of decorative motion. Weather from Open-Meteo adds clouds, rain, or snow on that grid.

## Art checkpoint

- [New desktop preview](previews/phase-2-pc98-desktop.png)
- [New narrow-window preview](previews/phase-2-pc98-narrow.png)
- [Native 640 × 400 image](previews/phase-2-pc98-native.png)
- [Previous SVG direction](previews/phase-1-desktop.png)

Chrome checks verify the native image has exactly 16 opaque colors, compatible channel values, deterministic redraws, and an accessible description. Desktop, laptop, narrow, and mobile layouts fit without document overflow. The [Tokyo rain preview](previews/tokyo-rain.png) shows the current rail scene. Earlier [lighting previews](previews/phase-5-day.png) and the [animated checkpoint](previews/phase-3-motion.gif) document previous phases.
