This file provides guidance to AI coding agents like Claude Code (claude.ai/code), Cursor AI, Codex, Gemini CLI, GitHub Copilot, and other AI coding assistants when working with code in this repository.

# Gallery Hugo

A personal photography gallery built with Hugo and the [hugo-theme-gallery](https://github.com/nicokaiser/hugo-theme-gallery) theme.

## Commands

### Development Server
```bash
hugo server -D
```
Start the Hugo development server with drafts enabled. Site will be available at http://localhost:1313/

### Build
```bash
hugo
```
Generate the static site in the `public/` directory.

### Theme Development (from themes/gallery/)
```bash
npm run prettier    # Format code
npm run lint        # Lint CSS/SCSS files
```

## Architecture

### Content Structure

This is a Hugo-based photo gallery where **content organization follows a specific page bundle pattern**:

- **Leaf Bundles** (`index.md`) = Individual galleries (displayed with `single` layout)
  - Must contain `index.md` + images
  - No child pages
  - Example: `content/nature/index.md`

- **Branch Bundles** (`_index.md`) = Album lists (displayed with `list` layout)
  - Must contain `_index.md`
  - Can have child pages/albums
  - Example: `content/animals/_index.md`

**Critical**: Pages without images are not displayed in album lists. At least one image resource is required for an album to appear.

### Image Organization

Images must be organized within the content bundle:
```
content/
├── nature/
│   ├── index.md          # Leaf bundle
│   └── images/
│       ├── photo1.jpg
│       └── photo2.jpg
```

Front matter controls image behavior:
```yaml
resources:
  - src: images/*          # Glob pattern to include images
  - src: tree.jpg
    params:
      cover: true          # Set as album cover
      hidden: true         # Hide from gallery, show only as cover
```

### Album Cover Selection Priority
1. Image with `cover: true` in front matter resources
2. Image with `*feature*` in filename (deprecated method)
3. First image in the album

### Image Sorting
Configure in front matter:
- `params.sort_by`: `Name` (default, by filename) or `Date` (by EXIF/resource date)
- `params.sort_order`: `asc` (default) or `desc`

### Important Limitations

**DO NOT USE WEBP IMAGES** - Hugo's WebP implementation has a bug causing dull/incorrect image levels on resize. Use JPG/JPEG instead. See [nicokaiser/hugo-theme-gallery#102](https://github.com/nicokaiser/hugo-theme-gallery/issues/102).

### Content Parameters

Key front matter parameters:
- `title` - Album title
- `date` - For sorting (newest first)
- `description` - Rendered as markdown on album page
- `weight` - Manual sort override
- `categories` - If used, homepage displays category list
- `params.private: true` - Hide from album overview and RSS
- `params.featured: true` - Show on homepage (even if private)
- `params.theme` - Page-specific theme override

### Hugo Configuration Context

- Theme installed as Git submodule in `themes/gallery/`
- Requires **Hugo Extended >= 0.123.0**
- Site config in `hugo.toml` (not `config.toml`)
- Timezone: America/Toronto
- Default theme: dark
- Image quality: 75, CatmullRom resampling

### Adding New Albums

1. Create directory in `content/` (e.g., `content/architecture/`)
2. Add `index.md` for leaf bundle OR `_index.md` for branch bundle
3. Create `images/` subdirectory
4. Add images to `images/`
5. Set front matter with title, description, and resource configuration
6. Optionally set a cover image using `resources.params.cover: true`

### Theme Customization

- Custom CSS: `assets/css/custom.css`
- Custom JavaScript: `assets/js/custom.js`
- These files override theme defaults via Hugo's asset pipeline

### Image Metadata

Image titles in lightbox view are sourced from:
1. `ImageDescription` EXIF tag (preferred)
2. Front matter `resources.title` parameter

Set via exiftool:
```bash
exiftool -ImageDescription="Description text" image.jpg
```

Or in front matter:
```yaml
resources:
  - src: cat-1.jpg
    title: Brown tabby cat on white stairs
```
