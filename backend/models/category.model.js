export default (sequelize, Sequelize) => {
    const Category = sequelize.define("category", {
        categoryId: {
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
        }
    }, {
        timestamps: true,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    });

    return Category;
}; 