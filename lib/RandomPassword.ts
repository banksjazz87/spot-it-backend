/**
 * @param takes on a parameter of number for how long you would like the password to be.
 * Used to generate a random password.
 */


export default class RandomPassword {
	bank: string;
	length: number;

	constructor(length: number) {
		this.bank = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
		this.length = length;
	}

	getBankArray(): string[] {
		const array = this.bank.split("");
		return array;
	}

    getRandomNumber(): number {
        const array = this.getBankArray();
		const random = Math.floor(Math.random() * array.length);
		return random;
	}

	getPassword(): string {
		let password = "";
		const bankArray = this.getBankArray();

		for (let i = 0; i < this.length; i++) {
	        let index = this.getRandomNumber();
			password += bankArray[index];
		}

		return password;
	}
}
