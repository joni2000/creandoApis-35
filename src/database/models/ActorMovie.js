module.exports = (sequelize, dataTypes) => {
    let alias = 'actor_movie';
    let cols = {
        id: {
            type: dataTypes.BIGINT(10).UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },

        actor_id: {
            type: dataTypes.INTEGER(10).UNSIGNED,
            allowNull: false
        },
        Movie_id: {
            type: dataTypes.INTEGER(10).UNSIGNED,
            allowNull: false
        },
    };
    let config = {
        tableName: 'actor_movie',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: false
    }
    const Actor = sequelize.define(alias, cols, config); 

    return Actor
};