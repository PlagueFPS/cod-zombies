# Scripts

## Image Optimization

The image optimization CLI processes images with configurable resize and webp conversion. Run it via:

```bash
bun run optimize:images -- [options]
```

### Required Options

| Option | Description |
|--------|-------------|
| `--dir <path>` | Output directory where optimized images will be stored |

### Optional Options

| Option | Description |
|--------|-------------|
| `--source <path>` | Source directory containing images to optimize (default: `./newassets`) |
| `--map` | Resize image to 2048px width then optimize to webp or compress if already webp |
| `--noResize` | Only optimize, do not resize (for images ≤1920px or when resize is undesired) |
| `--preview` | Resize to 640×360 then optimize with max effort and quality |

### Modes

- **Default**: Transform to `.webp` with max CPU effort (6) and quality (100). Resize to 1920px width if the image is larger.
- **`--map`**: Resize to 2048px width only for interactive map layer images.
- **`--noResize`** or image ≤1920px wide: Optimize to webp only, no resizing.
- **`--preview`**: Resize to 640×360, then optimize to webp with max effort and quality.

### Examples

```bash
# Default: optimize to webp, resize if > 1920px
bun run optimize:images --dir ./public/previews

# Preview thumbnails (640×360)
bun run optimize:images --dir ./public/previews --preview

# Map images: resize to 2048
bun run optimize:images --dir ./public/maps --map

# Only optimize, no resize
bun run optimize:images --dir ./public/icons --noResize

# Custom source directory
bun run optimize:images --dir ./public/previews --source ./my-images
```

### Supported Formats

Input: `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif` (any image format supported by sharp)

Output: `.webp`
