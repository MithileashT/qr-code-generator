import inquirer from "inquirer";
import qr from "qr-image";
import fs from "fs";
import path from "path";

const OUTPUT_DIR = "output";

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
}

inquirer
    .prompt([
        {
            message: "Enter the URL: ",
            name: "URL",
            validate: (input) => {
                if (!input.trim()) return "URL cannot be empty.";
                try {
                    new URL(input.trim());
                    return true;
                } catch {
                    return "Please enter a valid URL (e.g. https://example.com).";
                }
            },
        },
        {
            type: "list",
            message: "File mode:",
            name: "mode",
            choices: [
                { name: "Append  — add URL to URL.txt, save QR as <domain>-<timestamp>.png", value: "append" },
                { name: "Overwrite — replace URL.txt and <domain>.png", value: "overwrite" },
            ],
        },
    ])
    .then((answers) => {
        const url = answers.URL.trim();
        const append = answers.mode === "append";

        // ── QR Code ──────────────────────────────────────────────
        const domain = new URL(url).hostname.replace(/^www\./, "");
        const qrFileName = append
            ? path.join(OUTPUT_DIR, `${domain}-${Date.now()}.png`)
            : path.join(OUTPUT_DIR, `${domain}.png`);

        const qrStream = qr.image(url, { type: "png" });
        qrStream.pipe(fs.createWriteStream(qrFileName));
        console.log(`✔  QR code saved → ${qrFileName}`);

        // ── URL log ───────────────────────────────────────────────
        const urlFile = path.join(OUTPUT_DIR, "URL.txt");
        if (append) {
            fs.appendFile(urlFile, url + "\n", (err) => {
                if (err) throw err;
                console.log(`✔  URL appended  → ${urlFile}`);
            });
        } else {
            fs.writeFile(urlFile, url + "\n", (err) => {
                if (err) throw err;
                console.log(`✔  URL saved     → ${urlFile}`);
            });
        }
    })
    .catch((error) => {
        if (error.isTtyError) {
            console.error("✖  Prompt could not be rendered in this environment.");
        } else {
            console.error("✖  An unexpected error occurred:", error.message);
        }
        process.exit(1);
    });