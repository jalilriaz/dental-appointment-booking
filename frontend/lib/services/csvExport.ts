const FORMULA_PREFIX = /^[=+\-@\t\r]/;

export function escapeCsvCell(value: unknown): string {
    if (value === null || value === undefined) return "";
    let str = String(value);
    if (FORMULA_PREFIX.test(str)) {
        str = `'${str}`;
    }
    if (/[",\n\r]/.test(str)) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

export function buildCsvDocument(headers: string[], rows: unknown[][]): string {
    const headerLine = headers.map(escapeCsvCell).join(",");
    const bodyLines = rows.map((row) => row.map(escapeCsvCell).join(","));
    return [headerLine, ...bodyLines].join("\r\n");
}
