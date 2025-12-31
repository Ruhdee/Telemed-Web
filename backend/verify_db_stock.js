const { Inventory } = require('./models');
const { createDatabaseIfNotExists } = require('./config/database');
require('dotenv').config();

const verifyStock = async () => {
    try {
        await createDatabaseIfNotExists();
        const items = await Inventory.findAll({
            attributes: ['id', 'name', 'stock']
        });
        console.table(items.map(i => i.toJSON()));
    } catch (err) {
        console.error(err);
    }
    process.exit();
};

verifyStock();
