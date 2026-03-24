const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const apiPackageJsonPath = path.join(__dirname, "..", "apps", "api", "package.json");
const prismaSchemaPath = path.join(
  __dirname,
  "..",
  "apps",
  "api",
  "src",
  "prisma",
  "schema.prisma"
);

if (!fs.existsSync(apiPackageJsonPath)) {
  console.log("Skipping Prisma generate: apps/api workspace not present.");
  process.exit(0);
}

if (!fs.existsSync(prismaSchemaPath)) {
  console.log("Skipping Prisma generate: Prisma schema not present.");
  process.exit(0);
}

execSync("npm run prisma:generate -w @fusehotel/api", {
  cwd: path.join(__dirname, ".."),
  stdio: "inherit",
});
