const fs = require('fs');
const path = require('path');

const MIN_LINES = 20;

function getFiles(dir, files = []) {
    if (!fs.existsSync(dir)) return files;
    const list = fs.readdirSync(dir);
    for (const file of list) {
        const fullPath = path.resolve(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            getFiles(fullPath, files);
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
            files.push(fullPath);
        }
    }
    return files;
}

const rootDir = __dirname;
const appFiles = getFiles(path.resolve(rootDir, 'app'));
const componentFiles = getFiles(path.resolve(rootDir, 'components'));
const allFiles = [...appFiles, ...componentFiles];

const fileContents = allFiles.map(file => {
    const content = fs.readFileSync(file, 'utf8');
    // Strip imports, empty lines, and comments to find actual logic/UI duplication
    const rawLines = content.split('\n');
    const normalizedLines = [];
    const lineMap = []; // maps back to original line number

    for (let i = 0; i < rawLines.length; i++) {
        const l = rawLines[i].trim();
        if (l.length > 0 && !l.startsWith('//') && !l.startsWith('import ') && !l.startsWith('export ') && l !== '{' && l !== '}' && l !== ');' && l !== 'return (') {
            normalizedLines.push(l);
            lineMap.push(i + 1);
        }
    }

    return {
        file: file.replace(rootDir, ''),
        lines: normalizedLines,
        originalLines: lineMap
    };
});

const duplicates = [];

for (let i = 0; i < fileContents.length; i++) {
    // Only compare with files after `i` to avoid double counting, and compare with itself to find internal duplication
    for (let j = i; j < fileContents.length; j++) {
        const file1 = fileContents[i];
        const file2 = fileContents[j];

        // Find common sequences of lines
        let k = 0;
        while (k <= file1.lines.length - MIN_LINES) {
            const block1 = file1.lines.slice(k, k + MIN_LINES).join('\\n');
            let found = false;

            const startL = (i === j) ? k + MIN_LINES : 0;

            for (let l = startL; l <= file2.lines.length - MIN_LINES; l++) {
                const block2 = file2.lines.slice(l, l + MIN_LINES).join('\\n');

                if (block1 === block2) {
                    duplicates.push({
                        file1: file1.file,
                        file2: file2.file,
                        linesMatch: MIN_LINES,
                        file1StartLine: file1.originalLines[k],
                        file1EndLine: file1.originalLines[k + MIN_LINES - 1],
                        file2StartLine: file2.originalLines[l],
                        file2EndLine: file2.originalLines[l + MIN_LINES - 1],
                    });

                    k += MIN_LINES; // Skip ahead
                    found = true;
                    break;
                }
            }
            if (!found) {
                k++;
            }
        }
    }
}

// Group by files
const report = {};
duplicates.forEach(d => {
    const pair = [d.file1, d.file2].sort().join(' AND ');
    if (!report[pair]) {
        report[pair] = [];
    }
    report[pair].push(`Lines ${d.file1StartLine}-${d.file1EndLine} in ${d.file1} matches Lines ${d.file2StartLine}-${d.file2EndLine} in ${d.file2}`);
});

console.log("---- DUPLICATION REPORT ----");
let dupCount = 0;
Object.entries(report).forEach(([pair, details]) => {
    if (details.length > 0) {
        dupCount++;
        console.log(`\nDUPLICATION BETWEEN: ${pair}`);
        details.forEach(detail => console.log(`  - ${detail}`));
    }
});

if (dupCount === 0) {
    console.log("No significant duplication found.");
}
