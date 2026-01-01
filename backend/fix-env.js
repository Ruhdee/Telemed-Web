const fs = require('fs');
const path = require('path');

const envContent = `PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=Sagar@123
DB_NAME=telemed_db
JWT_SECRET=supersecretkey123
`;

fs.writeFileSync(path.join(__dirname, '.env'), envContent, { encoding: 'utf8' });
console.log('.env file rewritten successfully');
