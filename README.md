# FSLogix Redirections.xml Generator

A simple, static web tool for generating and debugging FSLogix `redirections.xml` files. Its main purpose is to help users create a valid XML structure for folder redirections used with FSLogix Profile Containers. Another goal is to collect common folder redirection use cases in one place, share them with the community, and encourage others to contribute their own.

If you have suggestions or improvements, please open an issue or pull request, or contact me directly.

![FSLogix Redirections Builder](./images/screenshot.png)

## Features

- **Generate XML** - Add folder redirections with proper FSLogix format
- **Quick Community Add** - Common exclusions (Teams, Outlook, Chrome cache, etc.) from Community Contributions
- **Import/Parse** - Paste existing XML to edit and debug
- **Download** - Export as `redirections.xml` file
- **Copy to Clipboard** - Quick copy of generated XML
- **Offline Ready** - No internet connection required, I don't want your data

## Usage

### GitHub Pages

Access at [`https://gudszent.github.io/fslogix-redirections-builder`](https://gudszent.github.io/fslogix-redirections-builder)

### Local

Simply open `index.html` in any modern browser.

## FSLogix Redirections Reference

### Type

| Value | Description |
|-------|-------------|
| 1 | Exclude - Folder is not copied to/from the VHD(X) |
| 2 | Include - Folder is copied to/from the VHD(X) |

### CopyBase

| Copy | Behavior | Use Case |
|------|----------|----------|
| 0 | Creates empty folder. No files copied. Data written during session is removed at sign-out. | Cache folders that regenerate (most common) |
| 1 | Copies files FROM container at sign-in. New data is lost at sign-out. | Need existing data but don't want to save changes |
| 2 | Starts empty, copies data TO container at sign-out. | ⚠️ **Use only if directed by Microsoft support** |
| 3 | Copies FROM at sign-in, copies TO at sign-out (combines 1+2). | Full sync: preserve existing + save new data |

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

This repository is distributed under a custom license. The `LICENSE` file contains the full terms and includes restrictions on commercial use.

See `LICENSE` for details.
