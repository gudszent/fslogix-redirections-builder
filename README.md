# FSLogix Redirections.xml Generator

A simple, static web tool for generating and debugging FSLogix `redirections.xml` files.

![FSLogix Redirections Builder](./images/screenshot.png)

## Features

- **Generate XML** - Add folder redirections with proper FSLogix format
- **Quick Add** - Common exclusions (Teams, Outlook, Chrome cache, etc.)
- **Import/Parse** - Paste existing XML to edit and debug
- **Download** - Export as `redirections.xml` file
- **Copy to Clipboard** - Quick copy of generated XML
- **Persistent Storage** - Saves your work in browser localStorage
- **Offline Ready** - No internet connection required

## Usage

### GitHub Pages

1. Fork or clone this repository
2. Enable GitHub Pages in repository settings
3. Access at [`https://gudszent.github.io/fslogix-redirections-builder`](https://gudszent.github.io/fslogix-redirections-builder){target="_blank"}

### Local

Simply open `index.html` in any modern browser.

## FSLogix Redirections Reference

### Flags (Type)

| Value | Description |
|-------|-------------|
| 1 | Exclude - Folder is not copied to/from the VHD(X) |
| 2 | Include - Folder is copied to/from the VHD(X) |

### CopyBase

| Value | Description |
|-------|-------------|
| 0 | No flags |
| 1 | Copy base directory only |
| 2 | Copy base and subdirectories |

### Example XML Output

```xml
<?xml version="1.0" encoding="UTF-8"?>
<FrxProfileFolderRedirection ExcludeCommonFolders="0">
<Excludes>
  <Exclude Copy="0">AppData\Local\Microsoft\Teams</Exclude>
  <Exclude Copy="0">AppData\Local\Temp</Exclude>
</Excludes>
<Includes>
</Includes>
</FrxProfileFolderRedirection>
```

## Deployment Location

Place the generated `redirections.xml` in:

```
\\<server>\<share>\redirections.xml
```

Or configure via Group Policy/Registry.

## No Dependencies

This tool is completely self-contained:

- No JavaScript frameworks
- No CSS frameworks
- No external fonts or icons
- No CDN resources
- Works offline

## License

MIT
