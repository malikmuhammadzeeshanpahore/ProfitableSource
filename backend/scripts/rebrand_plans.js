const { sequelize, models, seed } = require('../models.js')

async function run() {
    try {
        console.log('--- Cleaning Packages Table ---')
        await models.Package.destroy({ where: {}, truncate: true })
        console.log('--- Re-seeding with new Plans ---')
        await seed()
        console.log('--- Success ---')
        process.exit(0)
    } catch (e) {
        console.error('Migration failed:', e)
        process.exit(1)
    }
}

run()
