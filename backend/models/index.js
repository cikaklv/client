import { Sequelize } from "sequelize";
import dbConfig from "../config/db.config.js";
import userModel from "./user.model.js";
import categoryModel from "./category.model.js";
import productModel from "./product.model.js";
import inventoryModel from "./inventory.model.js";
import stockMovementModel from "./stockMovement.model.js";

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.users = userModel(sequelize, Sequelize);
db.categories = categoryModel(sequelize, Sequelize);
db.products = productModel(sequelize, Sequelize);
db.inventory = inventoryModel(sequelize, Sequelize);
db.stockMovements = stockMovementModel(sequelize, Sequelize);

// Define relationships
db.products.belongsTo(db.categories, { foreignKey: 'categoryId' });
db.categories.hasMany(db.products, { foreignKey: 'categoryId' });

db.inventory.belongsTo(db.products, { foreignKey: 'productId' });
db.products.hasOne(db.inventory, { foreignKey: 'productId' });

db.stockMovements.belongsTo(db.products, { foreignKey: 'productId' });
db.products.hasMany(db.stockMovements, { foreignKey: 'productId' });

db.stockMovements.belongsTo(db.users, { foreignKey: 'userId' });
db.users.hasMany(db.stockMovements, { foreignKey: 'userId' });

export default db;