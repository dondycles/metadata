const fs = require("fs");
const path = require("path");

// Update with the new favicon
const sourcePath =
  "C:\\Users\\dondy\\.gemini\\antigravity\\brain\\bf930826-90d9-4106-a7fd-807fb4e661cd\\hashtag_musical_note_1770389200381.png";
const destPathIco = path.join(__dirname, "public", "favicon.ico");
const destPathPng = path.join(__dirname, "public", "favicon.png");

// Copy the file as both .ico and .png
fs.copyFileSync(sourcePath, destPathIco);
console.log("✅ Favicon saved to public/favicon.ico");

fs.copyFileSync(sourcePath, destPathPng);
console.log("✅ Favicon saved to public/favicon.png");
