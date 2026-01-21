# WebTools Design System

## Intent

**Who:** Developers, students, professionals — anyone needing quick file processing tools

**What they do:** Format, convert, merge, split, compress — all in the browser without server uploads

**Feel:** Friendly and capable — like having a reliable colleague who handles the technical stuff so you can focus on your work

---

## Foundation

### Palette

Warm-neutral foundation with tool-specific accents for navigation and identity.

```
Background Layers:
├── bg-background     # oklch(1 0 0)      - Pure white (main canvas)
├── bg-muted          # oklch(0.97 0 0)   - Warm off-white (sections)
├── bg-card          # oklch(1 0 0)      - White (cards)
└── bg-secondary     # oklch(0.97 0 0)   - Warm gray (active states)

Foreground:
├── text-foreground   # oklch(0.145 0 0)  - Near black (primary)
├── text-muted       # oklch(0.556 0 0)  - Medium gray (secondary)
└── border           # oklch(0.922 0 0)  - Light gray (separators)

Tool Accents (identity + navigation):
├── Rose  (PDF Tools)    # oklch(0.577 0.245 27.325)
├── Amber (JSON)         # oklch(0.646 0.222 41.116)
├── Teal  (XML)          # oklch(0.6 0.118 184.704)
├── Emerald (Notes)      # oklch(0.696 0.17 162.48)
└── Purple (Base64)      # oklch(0.627 0.265 303.9)

Functional:
├── Primary (actions)    # oklch(0.205 0 0) - Near black
└── Destructive          # oklch(0.577 0.245 27.325) - Rose
```

**Why this palette:**
- Warm grays feel friendlier than cool, clinical tones
- Tool colors create instant recognition without being overwhelming
- High contrast for readability (WCAG AA compliant)

---

## Depth System

### Borders
Primary separator for structure. Subtle but present.

```
Structure: border-border (oklch(0.922 0 0))
Input:     border-input  (oklch(0.922 0 0))
Focus:     ring          (oklch(0.708 0 0))
```

### Shadows
Used sparingly for elevation during interaction.

```
static:    shadow-sm (subtle lift)
hover:     shadow-md + border accent/50
focus:     ring-3 ring-ring/50
```

### Elevation Scale
```
0:  border-border
1:  border-border + shadow-sm
2:  border-border + shadow-md + hover accent
3:  modal + backdrop blur
```

**Why mixed approach:**
- Borders define structure clearly (what is what)
- Shadows provide feedback (when something responds)
- Hover adds both shadow + color accent (delight)

---

## Surfaces

```
Surface 0 (base):     bg-background
Surface 1 (section):  bg-muted/20
Surface 2 (card):     bg-card
Surface 3 (input):    bg-background
Surface 4 (popover):  bg-popover
```

Temperature: Warm-neutral — not clinical, not cozy. Just right for tools.

---

## Typography

```
Font Family:
├── Sans:  Geist Sans (var(--font-geist-sans))
└── Mono: Geist Mono (var(--font-geist-mono))

Scale:
├── Display:     text-4xl md:text-5xl lg:text-6xl (hero)
├── Title:       text-2xl md:text-3xl (section headings)
├── Card Title:  text-xl (component headers)
├── Body:        text-sm md:text-base (content)
├── Small:       text-xs (metadata)
└── Mono:        font-mono text-xs (code, input)

Weights:
├── Bold:    font-bold (headings, emphasis)
├── Medium:  font-medium (UI elements, nav)
└── Normal:  (body text)
```

**Why Geist:** Modern, legible, designed for UI. Mono variant is excellent for code.

---

## Spacing

Base unit: 4px (0.25rem)

```
2xs:  0.25rem  (4px)   - Tight icon spacing
xs:   0.5rem   (8px)   - Related items
sm:   0.75rem  (12px)  - Inline gap
md:   1rem     (16px)  - Default padding
lg:   1.5rem   (24px)  - Section spacing
xl:   2rem     (32px)  - Component separation
2xl:  3rem     (48px)  - Page margins
```

Container spacing:
```
Mobile:  px-4 py-6
Desktop: px-6 md:px-8 py-8 md:py-12
```

---

## Components

### Button

```
Variants:
├── Primary:    bg-primary text-primary-foreground (action)
├── Secondary:  bg-secondary text-secondary-foreground (alternative)
├── Outline:    border bg-background (subtle)
├── Ghost:      hover:bg-accent (minimal)
└── Destructive: bg-destructive (danger)

Sizes:
├── sm:    h-8 px-3
├── md:    h-9 px-4 (default)
└── lg:    h-10 px-6
```

### Card

```
Structure:
├── Header:  py-3 px-4 border-b
├── Content: px-6
└── Footer:  px-6 border-t

States:
├── Static:  border border-border + shadow-sm
├── Hover:   shadow-lg + border-[accent]/50
└── Active:  bg-secondary
```

### Input

```
Base:     h-9 px-3 py-2 border border-input
Focus:    ring-2 ring-ring/50
Error:    ring-destructive/20 border-destructive
```

---

## Tool Color Application

Each tool category uses its accent for:

1. **Navigation:** Icon background, active state, hover border
2. **Cards:** Icon container, hover border tint
3. **Buttons:** Primary action buttons (optional)
4. **Feedback:** Success toasts, loading states

```
PDF Tools:    Rose    # oklch(0.577 0.245 27.325)
JSON:         Amber   # oklch(0.646 0.222 41.116)
XML:          Teal    # oklch(0.6 0.118 184.704)
Notes:        Emerald # oklch(0.696 0.17 162.48)
Base64:       Purple  # oklch(0.627 0.265 303.9)
```

---

## Patterns

### Tool Page Layout

```
Container: h-[calc(100vh-4rem)] (full height minus nav)
├── Header:  mb-6 (title + description)
└── Content: flex-1 (main tool interface)
```

### Two-Panel Editor

```
Grid: md:grid-cols-2 gap-4
├── Input panel:  Card with textarea
└── Output panel: Card with copy button
```

### Home Cards

```
Hover: shadow-lg + border-[accent]/50 + -translate-y-1
Icon:  bg-[accent]/10 text-[accent] → bg-[accent] text-white
```

---

## Motion

Transitions should feel responsive but not flashy.

```css
duration-200  /* Fast: hover, focus */
duration-300  /* Medium: card lift */
duration-500  /* Slow: page transitions */
```

```css
ease-out     /* Decelerate: feels natural */
```

---

## Accessibility

- Focus: `ring-2 ring-ring/50` on all interactive elements
- Min touch target: 44px × 44px (h-11)
- Color contrast: WCAG AA minimum
- Semantic HTML: proper button/link/heading hierarchy
