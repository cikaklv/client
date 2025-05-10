export default (sequelize, Sequelize) => {
    const StockMovement = sequelize.define("stockMovement", {
        movementId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        productId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'products',
                key: 'productId'
            }
        },
        quantity: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        type: {
            type: Sequelize.ENUM('IN', 'OUT'),
            allowNull: false
        },
        notes: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        userId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'userId'
            }
        }
    }, {
        timestamps: true,
        createdAt: 'createdAt',
        updatedAt: false
    });

    return StockMovement;
}; 