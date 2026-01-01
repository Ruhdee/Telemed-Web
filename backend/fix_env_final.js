const fs = require('fs');
const content = `PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=password
DB_NAME=telemed_db
JWT_SECRET="supersecretkey123"`;

fs.writeFileSync('.env', content);
console.log('.env updated');
