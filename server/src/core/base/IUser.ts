export enum UserPermissions {
	NONE = 0x0,
	USERS = 0x1,
	ELDERS = 0x2,
	NEWS = 0x4,
	DOCS = 0x8,
	POLLS = 0x16,
};

export default interface IUser {
	_id?: string;

	id: number;
	permissions: number;

	/*
		These values are manually entered for student council's team members.
		They are not connected with Telegram.
	*/
	elder?: boolean;
	name?: string;
	username?: string;
	description?: string;
};