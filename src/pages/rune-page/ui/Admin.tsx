'use client';

import { useState } from "react";
import { cn } from "~/shared/lib/utils";
import { Button, Skeleton } from "~/shared/ui/common";

import { Paginator } from "~/shared/ui/paginator";
import { createClient } from "~/shared/supabase/client"
import {
    useQuery,
} from '@tanstack/react-query'
const columns = [
    {
        label: 'Wallet Address',
        type: 'name',
        width: '20%'
    },
    {
        label: 'Overview',
        type: 'progress',
        width: '20%',
    },
    {
        label: 'Created At',
        type: 'mints',
        width: '15%',
    },
    {
        label: 'Approved At',
        type: 'number',
        width: '15%',
    },
    {
        label: 'status',
        type: 'status',
        width: '10%',
    },
    {
        label: '',
        type: 'buttons',
        width: '10%'
    },
] as const;


const getColStyle = (index: number) => ({
    width: columns[index].width,
    padding: '0 0.5rem'
})
export function Admin() {
    const limit = 10;
    const [page, setPage] = useState(1);

    const supabase = createClient();
    const { isPending, error, data } = useQuery({
        queryKey: ['repoData'],
        queryFn: async () => await supabase
            .from("runeRequest")
            .select("*")
    })
    if (error)
        return error;
    const handleClickApprove = async () => {
        if (!data || !data.data || data.data.length === 0) {
            console.error('No data available');
            return;
        }
        const update_data = data?.data[0];

        console.log(update_data);
        const { data: existingData, error } = await supabase
            .from("Rune")
            .select("*")
            .eq("wallet_address", update_data.wallet_address);
        if (error) {
            alert("Error fetching existing data");
            return;
        }
        for (const record of existingData) {
            const updatedUrls = { ...record, ...update_data.urls };
            await supabase
                .from("Rune")
                .update({ overview: update_data.overview, urls: updatedUrls })
                .eq("id", record.id);
        }
        if (existingData.length === 0) {
            await supabase
                .from("Rune")
                .insert({ overview: update_data.overview, urls: update_data.urls, wallet_address: update_data.wallet_address });
        }
        await supabase
            .from("runeRequest")
            .update({ status: 'approved', approved_at: new Date() })
            .eq("id", update_data.id);
    }
    const handleClickReject = async () => {
        if (!data || !data.data || data.data.length === 0) {
            console.error('No data available');
            return;
        }
        console.log(data?.data[0])
        const update_data = data?.data[0];
        await supabase
            .from("runeRequest")
            .update({ status: 'rejected' })
            .eq("id", update_data.id);
    }
    console.log(data?.data?.length);
    const total = data?.data?.length;
    return (
        <div className='flex flex-col gap-[1rem] size-full justify-center'>
            <div className='w-full max-w-full overflow-x-auto grow'>
                <div
                    className='flex flex-col h-full gap-[1.5rem] text-black-60 light:text-black/80'
                    style={{ width: 'max(100%, 50rem)' }}
                >
                    <nav className='flex px-[0.75rem] py-[0.625rem] rounded-[0.875rem] border border-secondary'>
                        {columns.map((col, index) => (
                            <div key={col.type} style={getColStyle(index)}>{col.label}</div>
                        ))}
                    </nav>

                    <div className='shrink-0 grow'>
                        {data?.data ? (
                            data?.data?.map((row, index: number) => {
                                return (
                                    <div
                                        key={index}
                                        className={cn(
                                            'px-[0.75rem] h-[3.375rem] rounded-[1rem] flex items-center text-[0.875rem]',
                                            index % 2 == 0 && 'bg-white/[.06] light:bg-black/[.06]',
                                        )}
                                    >
                                        <div className="truncate" style={getColStyle(0)}>
                                            {row.wallet_address}
                                        </div>


                                        <div style={getColStyle(1)}>
                                            {row.overview}
                                        </div>

                                        <div style={getColStyle(2)}>
                                            {row.create_at}
                                        </div>
                                        <div style={getColStyle(3)}>
                                            {row.approved_at}
                                        </div>
                                        <div style={getColStyle(4)}>
                                            {row.status}
                                        </div>
                                        <div
                                            className='sticky right-2'
                                        >
                                            <Button
                                                colorPallete='primary' size='sm'
                                                onClick={handleClickApprove}
                                            >
                                                Approve
                                            </Button>
                                        </div>
                                        <div
                                            className='sticky right-2'
                                            style={getColStyle(5)}
                                        >
                                            <Button
                                                colorPallete='primary' size='sm'
                                                onClick={handleClickReject}
                                            >
                                                Reject
                                            </Button>
                                        </div>
                                    </div>
                                )
                            })
                        ) : (
                            Array.from({ length: limit }).map((_, index) => (
                                <Skeleton
                                    key={index}
                                    className={cn(
                                        'w-full h-[3.375rem] rounded-[1rem]',
                                        index % 2 !== 0 && 'bg-transparent dark:bg-transparent'
                                    )}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>

            {total && total > limit && (
                <Paginator
                    value={page} onChange={setPage}
                    totalItems={total} limit={limit}
                    disabled={isPending}
                />
            )}
        </div>
    );
}