// import { sequelize } from '../config/db.js';

// Import all models
import sequelize from '../config/db.js';
import { SuperAdmin } from './SuperAdmin.js';
// import { Admin } from './Admin.js';
// import { User } from './User.js';
// import { Permission } from './Permission.js';

/**
 * Initialize model associations
 * Define relationships (FKs) between tables here
 */
const initModels = () => {
    // Example associations — uncomment or modify as needed
    // Admin.belongsTo(SuperAdmin, { foreignKey: 'created_by', as: 'creator' });
    // User.belongsTo(Admin, { foreignKey: 'admin_id', as: 'admin' });
    // Permission.belongsTo(Admin, { foreignKey: 'admin_id', as: 'admin' });
};

/**
 * Sync database if explicitly called (not automatic)
 * @param {boolean} force - Drops and recreates all tables if true (use carefully)
 */
const syncDatabase = async (force = false) => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully.');
        initModels();
        await sequelize.sync({ alter: !force, force: false });
        console.log('✅ All models synchronized successfully.');
    } catch (error) {
        console.error('❌ Unable to sync the database:', error.message);
    }
};

// Export everything
export {
    sequelize,
    SuperAdmin,
    // Admin,
    // User,
    // Permission,
    initModels,
    syncDatabase,
};
