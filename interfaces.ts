export interface SQLResponse {
	code: string;
	sqlMessage: string;
}

export interface DBUser {
    id: number;
    email: string;
    username: string;
    password: string;
    loggedIn: number;
    lastLoggedIn: string;
}

export interface FullSQLResponse {
    fieldCount: number;
    affectedRows: number;
    insertId: number;
    serverStatus: number;
    warningCount: number;
    message: string;
    protocol41: boolean;
    changedRows: number;
}
