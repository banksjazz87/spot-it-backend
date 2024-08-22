import mysql from "mysql";
import { SQLResponse, DBUser } from "../interfaces";



export class DBMethods {
	hostName: any;
	userName: any;
	userDb: any;
	userPassword: any;
	dbConnection: any;

	constructor(hostName: any, userName: any, userDb: any, userPassword: any) {
		this.hostName = hostName;
		this.userName = userName;
		this.userDb = userDb;
		this.userPassword = userPassword;

		this.dbConnection = mysql.createConnection({
			host: this.hostName,
			user: this.userName,
			database: this.userDb,
			password: this.userPassword,
		});
	}

	getSqlError(obj: SQLResponse): string {
		const message = `The following error has occurred: ${obj.code} with sqlMessage: ${obj.sqlMessage}`;
		return message;
	}

	db(): any {
		let connection = mysql.createConnection({
			host: this.hostName,
			user: this.userName,
			database: this.userDb,
			password: this.userPassword,
		});
		return connection;
	}

	connect(): any {
		const database = this.dbConnection;
		database.connect((err: any): void => {
			if (err) {
				console.log("err", err);
			} else {
				console.log("you are connected");
			}
		});
		database.end((err: any): void => (err ? console.log("error, disconnecting") : console.log("disconnected")));
	}

	endDb() {
		const database = this.dbConnection;
		database.end((err: any): void => {
			err ? console.log("error, disconnecting") : console.log("disconnected");
		});
	}

	insert(table: string, columns: string, values: string[]): Promise<string[]> {
		return new Promise<string[]>((resolve, reject) => {
			const database = this.dbConnection;
			let sql = `INSERT INTO ${table} (${columns}) VALUES (?);`;

			database.query(sql, [values], (err: string[], results: string[]) => {
				err ? reject(err) : resolve(results);
			});
			this.endDb();
		});
	}

	searchByValue(table: string, column: string, value: string): Promise<string[]> {
		return new Promise<string[]>((resolve, reject) => {
			const database = this.dbConnection;
			let sql = `SELECT * FROM ${table} WHERE ${column} = "${value}";`;

			database.query(sql, (err: string[], results: string[]) => {
				err ? reject(err) : resolve(results);
			});
			this.endDb();
		});
	}

	getTable(table: string, order: string, column: string): Promise<string[]> {
		return new Promise<string[]>((resolve, reject) => {
			const database = this.dbConnection;
			let sql = "";

			if (column === "lastName") {
				sql = `SELECT * FROM ${table} ORDER BY ${column} ${order}, firstName ${order}`;
			} else {
				sql = `SELECT * FROM ${table} ORDER BY ${column} ${order};`;
			}

			database.query(sql, (err: string[], results: string[]): void => {
				err ? reject(err) : resolve(results);
			});
			this.endDb();
		});
	}

	deletePerson(tableName: string, id: number): Promise<string[]> {
		return new Promise<string[]>((resolve, reject) => {
			const database = this.dbConnection;
			const neededSql = `DELETE FROM ${tableName} WHERE id = ${id};`;

			database.query(neededSql, (err: string[], results: string[]) => {
				err ? reject(err) : resolve(results);
			});
			this.endDb();
		});
	}

	getPerson(tableName: string, first: string, last: string): Promise<string[]> {
		return new Promise<string[]>((resolve, reject) => {
			const database = this.dbConnection;
			const neededSql = `SELECT * FROM ${tableName} WHERE firstName = "${first}" AND lastName = "${last}";`;

			database.query(neededSql, (err: string[], results: string[]) => {
				err ? reject(err) : resolve(results);
			});
			this.endDb();
		});
	}

	updatePerson(tableName: string, obj: DBUser, newPassword: string): Promise<string[]> {
		return new Promise<string[]>((resolve, reject) => {
			const database = this.dbConnection;
			const neededSql = `UPDATE ${tableName} SET username = "${obj.username}", email = "${obj.email}", password = "${newPassword}" WHERE id = ${obj.id};`;

			database.query(neededSql, (err: string[], results: string[]) => {
				err ? reject(err) : resolve(results);
			});
			this.endDb();
		});
	}

	addAllApplicants(table: string): Promise<string[]> {
		return new Promise<string[]>((resolve, reject) => {
			const database = this.dbConnection;
			const neededSql = `INSERT INTO ${table} (id, firstName, lastName, age, memberType) SELECT * FROM Attendants;`;

			database.query(neededSql, (err: string[], results: string[]) => {
				err ? reject(err) : resolve(results);
			});
			this.endDb();
		});
	}

	logoutUser(table: string, id: number, idColumn: string): Promise<string[]> {
		return new Promise<string[]>((resolve, reject) => {
			const database = this.dbConnection;
			const neededSql = `UPDATE ${table} set loggedIn = 0, lastSeen = CURRENT_TIMESTAMP  WHERE ${idColumn} = ${id};`;

			database.query(neededSql, (err: string[], results: string[]) => {
				err ? reject(err) : resolve(results);
			});
			this.endDb();
		});
	}

	loginUser(table: string, idColumn: string, id: number): Promise<string[]> {
		return new Promise<string[]>((resolve, reject) => {
			const database = this.dbConnection;
			const neededSql = `UPDATE ${table} set loggedIn = 1, lastLoggedIn = CURRENT_TIMESTAMP WHERE ${idColumn} = ${id};`;

			database.query(neededSql, (err: string[], results: string[]) => {
				err ? reject(err) : resolve(results);
			});
			this.endDb();
		});
	}

    getValidUser(table: string, userColumn: string, userName: string, passwordColumn: string, password: string): Promise<string[]> {

        return new Promise((resolve, reject) => {
            const database = this.dbConnection;
            const neededSql = `SELECT * FROM ${table} WHERE ${userColumn} = "${userName}" AND ${passwordColumn} = "${password}";`;

            database.query(neededSql, (err: string[], results: string[]) => {
                err ? reject(err) : resolve(results);
            });
            this.endDb();
        });
    }
}
