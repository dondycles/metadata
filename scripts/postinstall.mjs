import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { existsSync } from "node:fs";
import chromium from "@sparticuz/chromium";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = dirname(__dirname);

async function main() {
  try {
    console.log("📦 Starting postinstall script...");

    // Resolve chromium package location
    const executablePath = await chromium.executablePath();
    if (!executablePath) {
      console.log("⚠️  No executable path found, skipping archive creation");
      return;
    }

    // On Windows, the path might not have file:// prefix if returned directly by the lib
    const chromiumPath =
      typeof executablePath === "string"
        ? executablePath.replace(/^file:\/\//, "")
        : "";

    if (!chromiumPath) {
      console.log("⚠️  Could not resolve a valid chromium path");
      return;
    }

    // The executable is usually in a deep subdirectory, we need to find the 'bin' directory
    // or just the package root. For @sparticuz/chromium, the bin folder is what we want.
    // Let's try to find the 'bin' directory relative to the executable or package.
    let binDir = "";
    if (chromiumPath.includes("node_modules")) {
      const pkgRoot =
        chromiumPath.split("node_modules")[0] +
        "node_modules/@sparticuz/chromium";
      binDir = join(pkgRoot, "bin");
    } else {
      // Fallback: try to navigate up from the executable path
      binDir = join(dirname(chromiumPath), "bin");
      if (!existsSync(binDir)) {
        binDir = dirname(chromiumPath); // Use the directory containing the executable
      }
    }

    if (!existsSync(binDir)) {
      console.log(
        "⚠️  Chromium bin directory not found, skipping archive creation",
      );
      return;
    }

    // Create tar archive in public folder
    const publicDir = join(projectRoot, "public");
    const outputPath = join(publicDir, "chromium-pack.tar");

    console.log("📦 Creating chromium tar archive...");
    console.log("   Source:", binDir);
    console.log("   Output:", outputPath);

    // Tar the contents of bin/ directly (without bin prefix)
    execSync(
      `mkdir -p ${publicDir} && tar -cf "${outputPath}" -C "${binDir}" .`,
      {
        stdio: "inherit",
        cwd: projectRoot,
      },
    );

    console.log("✅ Chromium archive created successfully!");
  } catch (error) {
    console.error("❌ Failed to create chromium archive:", error.message);
    console.log("⚠️  This is not critical for local development");
    process.exit(0); // Don't fail the install
  }
}

main();
