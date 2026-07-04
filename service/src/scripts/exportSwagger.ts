import * as fs from "node:fs";
import * as path from "node:path";
import { swaggerSpec } from "../config/swagger.js";

const outputPath = path.resolve("../docs/swagger.json");

fs.writeFileSync(
    outputPath,
    JSON.stringify(swaggerSpec, null, 2),
    "utf8"
);

console.log(`Swagger exportado correctamente en ${outputPath}`);