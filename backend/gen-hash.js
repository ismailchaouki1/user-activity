const bcrypt = require('bcryptjs');
const password = 'Admin123!';
const hash = bcrypt.hashSync(password, 10);
console.log(hash);
