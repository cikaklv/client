export default {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "",
    DB: "tectona_furniture",
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
}; 