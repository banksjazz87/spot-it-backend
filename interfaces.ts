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
