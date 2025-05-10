import { Sequelize } from "sequelize";
import dbConfig from "../config/db.config.js";

const sequelize = new Sequelize('mysql', dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect
});

const initDatabase = async () => {
    try {
        // Create database if it doesn't exist
        await sequelize.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.DB};`);
        console.log('Database created or already exists');

        // Close the connection
        await sequelize.close();

        // Import models and sync them
        const db = await import('../models/index.js');
        
        // Disable foreign key checks temporarily
        await db.default.sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');
        
        // Sync all models
        await db.default.sequelize.sync({ force: true });
        
        // Re-enable foreign key checks
        await db.default.sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');
        
        console.log('Database synchronized');

        process.exit(0);
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
};

initDatabase(); 