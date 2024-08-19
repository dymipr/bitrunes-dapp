import { fetchRuneDetails } from "../api";
import { DetailsSection } from "./DetailsSection";
import { HoldersSection } from "./HoldersSection";
// import { MoreData } from "./MoreData";

interface PageProps {
	runeName: string
}

export async function Page({ runeName }: PageProps) {
	const details = await fetchRuneDetails(runeName);

	return (
		<div className='flex flex-col gap-[1.25rem] h-full'>
			<DetailsSection details={details} />
			{/* <MoreData details={details} /> */}
			<HoldersSection rune={details} />
			
		</div>
	);
}