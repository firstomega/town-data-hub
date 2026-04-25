# Typography Scale

This is the canonical mapping of Tailwind text-size utilities to their roles in
Town Data Hub. When in doubt, pick the smallest size that still reads cleanly
at the relevant viewport.

| Utility        | Size           | Role                                                |
| -------------- | -------------- | --------------------------------------------------- |
| `text-3xl`     | 30px / 36px    | Page hero title (HomePage, PricingPage marketing)   |
| `text-2xl`     | 24px / 32px    | Page title (Dashboard, ProjectDetail H1)            |
| `text-xl`      | 20px / 28px    | Section headline (FAQ, large card title)            |
| `text-lg`      | 18px / 28px    | Subsection title, modal heading                     |
| `text-base`    | 16px / 24px    | **Default body**. Use for primary readable copy.    |
| `text-sm`      | 14px / 20px    | Secondary body, list rows, form labels              |
| `text-xs`      | 12px / 16px    | Helper text, metadata, badges                       |
| `text-caption` | 11px / 16px    | Caption under media, sparse table footnotes         |
| `text-micro`   | 10px / 14px    | Pill-style status badges, dense table cells         |

## Color pairing

| Color utility            | Use with                                           |
| ------------------------ | -------------------------------------------------- |
| `text-foreground`        | Primary readable copy. Default for `text-base/sm`. |
| `text-muted-foreground`  | Secondary/supporting copy. Default for helper text.|
| `text-foreground-subtle` | Decorative icons, disabled-looking labels.         |
| `text-primary`           | Page titles and hero text only.                    |
| `text-accent`            | Inline links and accent emphases.                  |

## Avoid

- `text-[10px]`, `text-[11px]` — use `text-micro` / `text-caption` instead.
- Stacking opacity hacks like `text-muted-foreground/40` — promote to
  `text-foreground-subtle` if it's a recurring need.
- Mixing `font-bold` on body copy — use `font-semibold` for emphasis.
