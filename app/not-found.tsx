function Custom404() {
	return (
		<div className="flex w-full flex-1 flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0">
			<span className="flex text-2xl font-bold sm:text-3xl">404</span>
			<span className="hidden select-none px-5 text-3xl font-thin sm:flex">
				|
			</span>
			<span className="flex text-lg font-light">
				This page coud not be found.
			</span>
		</div>
	);
}

export default Custom404;
