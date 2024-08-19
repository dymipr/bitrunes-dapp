'use client'

import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '~/shared/ui/common'
import { VTextInput } from '~/pages/crafter/ui/inputs/VTextInput';
import { createClient } from '~/shared/supabase/client';

interface Props {
	open: boolean; // Receive open prop to control modal visibility
	setOpen: (value: boolean) => void; // Receive setOpen function to update open state
	wallet: string;
}
interface Links {
	website: string;
	twitter: string;
	telegram: string;
	discord: string;
}

export function UpdateRuneInfoModal({ open, setOpen, wallet }: Props) {
	
    const supabase = createClient();
	const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const updatedData = {
			website: formData.get('website'),
			twitter: formData.get('twitter'),
			telegram: formData.get('telegram'),
			discord: formData.get('discord'),
		};
		const pendingUpdate = {
			overview: formData.get('overview'),
			urls: updatedData,
			create_at: new Date(),
			approved_at: new Date(),
			status: 'pending', // Mark the update as pending
			wallet_address: wallet
		};
		await supabase
			.from("runeRequest")
			.insert(pendingUpdate);
		setOpen(!open);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className='max-w-[40rem]'>
				<DialogHeader>
					<DialogTitle>
						Update Your Rune Detail
					</DialogTitle>

				</DialogHeader>
				<DialogDescription>
					<form
						className='flex flex-col gap-[1.5rem] w-full grow justify-between'
						onSubmit={onSubmit}
					>
						<VTextInput
							name='overview'
							label='Describe about the rune*'
							placeholder='Describe about the rune*'
						/>
						<div className='space-y-3'>
							<VTextInput
								name='website'
								label='website url*'
								placeholder='enter website url'
							/>
							<VTextInput
								name='twitter'
								label='twitter url*'
								placeholder='twitter website url'
							/>
							<VTextInput
								name='telegram'
								label='telegram url*'
								placeholder='enter telegram url'
							/>
							<VTextInput
								name='discord'
								label='discord url*'
								placeholder='enter discord url'
							/>
						</div>
						<Button colorPallete='primary'>Update</Button>
					</form>

				</DialogDescription>
			</DialogContent>
		</Dialog>
	);
}