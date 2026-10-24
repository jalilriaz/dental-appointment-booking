const fs = require('fs');
const files = [
    'e:/dentalccentre/components/admin/TreatmentManager.tsx',
    'e:/dentalccentre/components/admin/patients/PatientBillingHistory.tsx'
];

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/import\s*\{\s*import\s*\{\s*formatPKR\s*\}\s*from\s*["']@\/lib\/utils["'];?/g, 'import { formatPKR } from "@/lib/utils";\nimport {');
    fs.writeFileSync(f, content);
    console.log('Fixed', f);
});
