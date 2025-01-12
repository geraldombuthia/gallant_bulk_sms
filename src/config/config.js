module.exports= {
    development: {
        username: process.env.DB_USERNAME,
        password: process.env.PASSWORD,
        database: process.env.DATABASE,
        host: process.env.DB_HOST,
        dialect: "mysql"
    },
}