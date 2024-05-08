import PageLoader from "@/components/PageLoader";

function Loading() {
	return (
		<div className="flex w-full flex-1 flex-col items-center py-12">
			<PageLoader />
		</div>
	);
}

export default Loading;
