const fs = require('fs');
const path = require('path');

const libUtilsImportRegex = /import\s+{[^}]*}\s+from\s+["']@\/lib\/utils["'];?/;

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            walkDir(dirPath, callback);
        } else if (f.endsWith('.tsx') || f.endsWith('.ts')) {
            callback(dirPath);
        }
    });
}

function refactorFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let originalContent = content;
    let modified = false;

    // Remove formatPKR
    const formatPKRRegex = /function\s+formatPKR\s*\(\s*amount\s*:\s*number\s*\)\s*\{\s*return\s*`Rs\.\s*\$\{\s*amount\.toLocaleString\(\s*["']en-PK["']\s*\)\s*\}\`;\s*\}/g;
    if (formatPKRRegex.test(content)) {
        content = content.replace(formatPKRRegex, '');
        modified = true;
    }

    // Remove statusColors
    const statusColorsRegex = /const\s+statusColors\s*:\s*Record\s*<\s*string\s*,\s*string\s*>\s*=\s*\{\s*SCHEDULED\s*:?[^}]*\};/g;
    if (statusColorsRegex.test(content)) {
        content = content.replace(statusColorsRegex, '');
        modified = true;
    }

    // Remove getTreatmentImage
    const getTreatmentImageRegex = /function\s+getTreatmentImage\s*\(\s*name\s*:\s*string\s*\)\s*:\s*string\s*\{[\s\S]*?return\s*["']\/images\/services\/general\.png["'];\s*\}/g;
    if (getTreatmentImageRegex.test(content)) {
        content = content.replace(getTreatmentImageRegex, '');
        modified = true;
    }

    // Remove isSunday
    const isSundayRegex = /function\s+isSunday\s*\(\s*dateStr\s*:\s*string\s*\)\s*:\s*boolean\s*\{\s*if\s*\(!dateStr\)\s*return\s*false;\s*const\s*\[y,\s*m,\s*d\]\s*=\s*dateStr\.split\([\s\S]*?\};?\s*\}/g;
    if (isSundayRegex.test(content)) {
        // Sometimes it's written differently, let's just make sure we catch it.
        const alternateIsSundayRegex = /function\s+isSunday\(dateStr:\s*string\):\s*boolean\s*\{[\s\S]*?return\s*new\s*Date\([\s\S]*?\}\s*/g;
        content = content.replace(alternateIsSundayRegex, '');
        modified = true;
    }

    // Figure out which ones are actually used
    const usesFormatPKR = content.includes('formatPKR(');
    const usesStatusColors = content.includes('statusColors[');
    const usesGetTreatmentImage = content.includes('getTreatmentImage(');
    const usesIsSunday = content.includes('isSunday(');

    const neededImports = [];
    if (usesFormatPKR) neededImports.push('formatPKR');
    if (usesStatusColors) neededImports.push('statusColors');
    if (usesGetTreatmentImage) neededImports.push('getTreatmentImage');
    if (usesIsSunday) neededImports.push('isSunday');

    // Remove existing cn imports if we are going to merge them, or just modify the existing utils import
    if (neededImports.length > 0 && modified) {
        if (libUtilsImportRegex.test(content)) {
            // Find existing imports from "@/lib/utils"
            const match = content.match(libUtilsImportRegex);
            const existingImport = match[0];
            const importsStr = existingImport.match(/\{([^}]+)\}/)[1];
            const existingImportsList = importsStr.split(',').map(i => i.trim()).filter(Boolean);

            for (const imp of neededImports) {
                if (!existingImportsList.includes(imp)) {
                    existingImportsList.push(imp);
                }
            }

            const newImport = `import { ${existingImportsList.join(', ')} } from "@/lib/utils";`;
            content = content.replace(existingImport, newImport);
        } else {
            // Add new import after the last import line
            const importToAdd = `import { ${neededImports.join(', ')} } from "@/lib/utils";\n`;

            // simple insertion after the first couple of imports
            const lines = content.split('\n');
            let lastImportIndex = -1;
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].startsWith('import ')) {
                    lastImportIndex = i;
                }
            }

            if (lastImportIndex >= 0) {
                lines.splice(lastImportIndex + 1, 0, importToAdd);
            } else {
                lines.unshift(importToAdd);
            }
            content = lines.join('\n');
        }
    }

    // Optimize images
    if (content.includes('getTreatmentImage') && content.includes('<img ')) {
        // Convert to Image component
        content = content.replace(/<img\s+src=\{getTreatmentImage\(([^)]+)\)\}\s+alt=\{([^}]+)\}\s+className=(["'][^"']+["'])\s*\/>/g, '<Image src={getTreatmentImage($1)} alt={$2} fill className={$3} />');
        modified = true;

        if (!content.includes('import Image from "next/image"')) {
            const lines = content.split('\n');
            let firstImport = lines.findIndex(l => l.startsWith('import '));
            if (firstImport === -1) firstImport = 0;
            lines.splice(firstImport, 0, 'import Image from "next/image";');
            content = lines.join('\n');
        }
    }

    if (modified && content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log('Refactored:', filePath);
    }
}

walkDir(path.join(__dirname, 'app'), refactorFile);
walkDir(path.join(__dirname, 'components'), refactorFile);

console.log('Done!');
