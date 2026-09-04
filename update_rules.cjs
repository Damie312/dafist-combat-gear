const fs = require('fs');
let rules = fs.readFileSync('firestore.rules', 'utf8');

rules = rules.replace(/allow update: if isAdmin\(\) \|\| \([\s\S]*?== 'pending'\s*\);/, 'allow update: if isAdmin();');
rules = rules.replace(/allow create: if isAdmin\(\) \|\| isLegitimateOrder\(orderId\);/, 'allow create: if isAdmin();');

fs.writeFileSync('firestore.rules', rules);
