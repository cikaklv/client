export default (sequelize, Sequelize) => {
    const Inventory = sequelize.define("inventory", {
        inventoryId: {
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
            allowNull: false,
            defaultValue: 0
        }
    }, {
        timestamps: true,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    });

    return Inventory;
}; 