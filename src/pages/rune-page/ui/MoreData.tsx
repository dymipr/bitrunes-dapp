'use client';

import {
   Select,
   SelectContent,
   SelectTrigger
} from "~/shared/ui/common";
import {
   useQuery,
} from '@tanstack/react-query'
import { cn } from "~/shared/lib/utils";
import { createClient } from "~/shared/supabase/client"
import Link from "next/link";
import { usePathname } from 'next/navigation'
import telegram from '../../../../public/images/telegram.svg'
import Image from 'next/image';

export const currencySelectVariants = new Map();

interface CurrencyElement {
   currency: string,
   url: string,
   className?: string,
}

export function CurrencyLabel({ currency, url, className }: CurrencyElement) {
   return (
      <div className={cn('flex items-center gap-[0.375rem]', className)}>
         <a href={url}>{currency}</a>
      </div>
   );
}

interface SvgData {
   website : string,
   twitter : string,
   telegram : string,
   discord : string

}
const svgData : SvgData = {
   'website':'/images/website.svg',
   'twitter':'/images/twitter.svg',
   'telegram':'/images/telegram.svg',
   'discord':'/images/discord.svg'
};

interface Props {
   address: string,
}

export function MoreData({ address }: Props) {
   const supabase = createClient();
   const pathname = usePathname();
   const { isPending, error, data } = useQuery({
      queryKey: ['repoData'],
      queryFn: async () => await supabase
         .from("Rune")
         .select("*")
         .eq('wallet_address', address)
         .maybeSingle()
   })
   if (isPending) return 'Loading...'

   if (error) return 'An error has occurred: ' + error.message

   return (
      <div className="flex space-x-1">
         {data.data && Object.entries(data.data.urls).map(([network, link]) => (
            link !== "" ?
               <Link href={link as string} key={network}>
                  <Image src={svgData[network as keyof typeof svgData]} alt={network} width={20} height={20} />
               </Link>
               :
               ''
         ))}
      </div >
   );
}
