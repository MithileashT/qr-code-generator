# QR Code Generator

A Node.js command-line tool that generates QR code PNG images from any URL. Supports **Append** and **Overwrite** modes so you can either build a history of QR codes or simply replace the last one.

---

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [File Modes Explained](#file-modes-explained)
- [Output Examples](#output-examples)
- [How It Works](#how-it-works)
- [Dependencies](#dependencies)
- [License](#license)

---

## Features

- Interactive terminal prompts — no flags or config needed
- URL validation — rejects empty input and malformed URLs before generating anything
- QR code PNG files named after the **domain** of the URL (e.g. `github.com.png`)
- **Append mode** — each new QR is saved with a timestamp suffix; URL is added to the log without touching previous entries
- **Overwrite mode** — replaces the existing QR image and URL log with the new entry
- `output/` directory is created automatically on first run

---

## Project Structure

```
qr-code-generator/
├── index.js            # Main CLI entry point — all logic lives here
├── package.json        # Project metadata, run scripts, and dependencies
├── package-lock.json   # Exact locked dependency versions (commit this)
├── .gitignore          # Excludes node_modules/ and output/ from Git
├── README.md           # This file
└── output/             # Auto-created at runtime (git-ignored)
    ├── <domain>.png                  # QR image — Overwrite mode
    ├── <domain>-<timestamp>.png      # QR image — Append mode
    └── URL.txt                       # URL history log
```

> The `output/` folder is listed in `.gitignore` and will **not** be pushed to GitHub. It is created automatically when you run the tool.

---

## Prerequisites

- [Node.js](https://nodejs.org/) **v16 or higher**
- **npm** — bundled with Node.js

Verify your versions:
```bash
node -v
npm -v
```

---

## Installation

**Clone the repository:**
```bash
git clone https://github.com/your-username/qr-code-generator.git
cd qr-code-generator
```

**Install dependencies:**
```bash
npm install
```

That's it — no global packages required.

---

## Usage

```bash
npm start
```

The tool will prompt you for two inputs:

### Step 1 — Enter the URL

```
? Enter the URL:  https://github.com
```

- Must be a valid, full URL including the protocol (`https://` or `http://`)
- Blank input or invalid URLs are rejected with a helpful message before anything is written

### Step 2 — Choose file mode

```
? File mode:
❯ Append  — add URL to URL.txt, save QR as <domain>-<timestamp>.png
  Overwrite — replace URL.txt and <domain>.png
```

Use the **↑ ↓ arrow keys** to select, then press **Enter**.

---

## File Modes Explained

### Append mode
- The URL is **added to the bottom** of `output/URL.txt` — previous URLs are kept
- The QR image is saved as `output/<domain>-<timestamp>.png` — each run produces a new file, no old QR is ever deleted
- Use this when you want to track multiple URLs over time

### Overwrite mode
- `output/URL.txt` is **completely replaced** with only the new URL
- The QR image is saved as `output/<domain>.png` — any previously generated file with the same domain name is replaced
- Use this when you only care about the latest QR code

| | Append | Overwrite |
|---|---|---|
| **URL.txt** | New URL added at the bottom | Replaced with the new URL only |
| **QR filename** | `github.com-1741234567890.png` | `github.com.png` |
| **Previous data** | Preserved | Deleted |

---

## Output Examples

**Generating a QR code for `https://github.com` in Overwrite mode:**
```
✔  QR code saved → output/github.com.png
✔  URL saved     → output/URL.txt
```

**Running again for `https://google.com` in Append mode:**
```
✔  QR code saved → output/google.com-1741234567890.png
✔  URL appended  → output/URL.txt
```

**Contents of `output/URL.txt` after the two runs above:**
```
https://github.com
https://google.com
```

**Contents of `output/` after the two runs above:**
```
github.com.png
google.com-1741234567890.png
URL.txt
```

---

## How It Works

1. **`inquirer`** renders the interactive terminal prompts
2. The URL is validated using the built-in `URL` constructor — if it throws, the input is rejected
3. The domain is extracted from the URL with `new URL(url).hostname` and `www.` is stripped
4. **`qr-image`** generates a PNG QR code stream which is piped directly to a file
5. `fs.writeFile` (overwrite) or `fs.appendFile` (append) updates `URL.txt`
6. All output files go into the `output/` directory which is auto-created if missing

---

## Dependencies

| Package | Version | Purpose |
|---|---|---|
| [inquirer](https://www.npmjs.com/package/inquirer) | ^13.3.0 | Interactive CLI prompts with list selection and validation |
| [qr-image](https://www.npmjs.com/package/qr-image) | ^3.2.0 | Generates QR code images as PNG streams |

> `package.json` and `package-lock.json` are the Node.js equivalent of Python's `requirements.txt`. Always commit `package-lock.json` to ensure reproducible installs.

---

## License

ISC © Mithileash
