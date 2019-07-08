declare namespace API {
	interface Response<T> {
		errcode: number;
		msg: string;
		hint?: string;
		data: T;
		total?: number;
		per_page?: number;
	}

	interface ExtendedResponse<T> extends Response<T> {
		success: boolean;
	}
}