"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBMethods = void 0;
const mysql_1 = __importDefault(require("mysql"));
class DBMethods {
    constructor(hostName, userName, userDb, userPassword) {
        this.hostName = hostName;
        this.userName = userName;
        this.userDb = userDb;
        this.userPassword = userPassword;
        this.dbConnection = mysql_1.default.createConnection({
            host: this.hostName,
            user: this.userName,
            database: this.userDb,
            password: this.userPassword,
        });
    }
    getSqlError(obj) {
        const message = `The following error has occurred: ${obj.code} with sqlMessage: ${obj.sqlMessage}`;
        return message;
    }
    db() {
        let connection = mysql_1.default.createConnection({
            host: this.hostName,
            user: this.userName,
            database: this.userDb,
            password: this.userPassword,
        });
        return connection;
    }
    connect() {
        const database = this.dbConnection;
        database.connect((err) => {
            if (err) {
                console.log("err", err);
            }
            else {
                console.log("you are connected");
            }
        });
        database.end((err) => (err ? console.log("error, disconnecting") : console.log("disconnected")));
    }
    endDb() {
        const database = this.dbConnection;
        database.end((err) => {
            err ? console.log("error, disconnecting") : console.log("disconnected");
        });
    }
    insert(table, columns, values) {
        return new Promise((resolve, reject) => {
            const database = this.dbConnection;
            let sql = `INSERT INTO ${table} (${columns}) VALUES (?);`;
            database.query(sql, [values], (err, results) => {
                err ? reject(err) : resolve(results);
            });
            this.endDb();
        });
    }
    searchByValue(table, column, value) {
        return new Promise((resolve, reject) => {
            const database = this.dbConnection;
            let sql = `SELECT * FROM ${table} WHERE ${column} = "${value}";`;
            database.query(sql, (err, results) => {
                err ? reject(err) : resolve(results);
            });
            this.endDb();
        });
    }
    getTable(table, order, column) {
        return new Promise((resolve, reject) => {
            const database = this.dbConnection;
            let sql = "";
            if (column === "lastName") {
                sql = `SELECT * FROM ${table} ORDER BY ${column} ${order}, firstName ${order}`;
            }
            else {
                sql = `SELECT * FROM ${table} ORDER BY ${column} ${order};`;
            }
            database.query(sql, (err, results) => {
                err ? reject(err) : resolve(results);
            });
            this.endDb();
        });
    }
    deletePerson(tableName, id) {
        return new Promise((resolve, reject) => {
            const database = this.dbConnection;
            const neededSql = `DELETE FROM ${tableName} WHERE id = ${id};`;
            database.query(neededSql, (err, results) => {
                err ? reject(err) : resolve(results);
            });
            this.endDb();
        });
    }
    getPerson(tableName, first, last) {
        return new Promise((resolve, reject) => {
            const database = this.dbConnection;
            const neededSql = `SELECT * FROM ${tableName} WHERE firstName = "${first}" AND lastName = "${last}";`;
            database.query(neededSql, (err, results) => {
                err ? reject(err) : resolve(results);
            });
            this.endDb();
        });
    }
    updatePerson(tableName, obj, newPassword) {
        return new Promise((resolve, reject) => {
            const database = this.dbConnection;
            const neededSql = `UPDATE ${tableName} SET username = "${obj.username}", email = "${obj.email}", password = "${newPassword}" WHERE id = ${obj.id};`;
            database.query(neededSql, (err, results) => {
                err ? reject(err) : resolve(results);
            });
            this.endDb();
        });
    }
    addAllApplicants(table) {
        return new Promise((resolve, reject) => {
            const database = this.dbConnection;
            const neededSql = `INSERT INTO ${table} (id, firstName, lastName, age, memberType) SELECT * FROM Attendants;`;
            database.query(neededSql, (err, results) => {
                err ? reject(err) : resolve(results);
            });
            this.endDb();
        });
    }
    logoutUser(table, id, idColumn) {
        return new Promise((resolve, reject) => {
            const database = this.dbConnection;
            const neededSql = `UPDATE ${table} set loggedIn = 0, lastSeen = CURRENT_TIMESTAMP  WHERE ${idColumn} = ${id};`;
            database.query(neededSql, (err, results) => {
                err ? reject(err) : resolve(results);
            });
            this.endDb();
        });
    }
    loginUser(table, idColumn, id) {
        return new Promise((resolve, reject) => {
            const database = this.dbConnection;
            const neededSql = `UPDATE ${table} set loggedIn = 1, lastLoggedIn = CURRENT_TIMESTAMP WHERE ${idColumn} = ${id};`;
            database.query(neededSql, (err, results) => {
                err ? reject(err) : resolve(results);
            });
            this.endDb();
        });
    }
}
exports.DBMethods = DBMethods;
