const fs = require('fs');
const content = `PORT=5001
DB_HOST=localhost
DB_USER=root
DB_PASS="Sagar@123"
DB_NAME=telemed_db
JWT_SECRET="supersecretkey123"`;

fs.writeFileSync('.env', content);
console.log('.env updated');
