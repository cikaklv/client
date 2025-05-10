export default (sequelize, Sequelize) => {
    const Product = sequelize.define("product", {
        productId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING(100),
            allowNull: false
        },
        stockUnit: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        categoryId: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'categories',
                key: 'categoryId'
            }
        },
        price: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false
        },
        minimumStock: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        imageUrl: {
            type: Sequelize.STRING(255),
            allowNull: true
        }
    }, {
        timestamps: true,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    });

    return Product;
}; 