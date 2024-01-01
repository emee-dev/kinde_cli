class Context {
	private data: any;

	private static instance: Context;

	constructor() {
		if (!Context.instance) {
			Context.instance = this;
		}

		return Context.instance;
	}

	setData(args: unknown) {
		this.data = args;
	}

	getData<T>(): T {
		return this.data;
	}
}

export default new Context();
