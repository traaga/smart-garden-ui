"use client"

import { ChevronLeft, Flower2 } from 'lucide-react';
import { Config, HistoryMeasurements, measurementSettings } from '@/common';
import { HistoryChart } from './HistoryChart';
import { Configuration } from './Configuration';
import { useEffect, useState } from 'react';
import { getConfig, getCurrentMeasurements, getHistoryMeasurements, getImageSource } from '@/api-client';
import { useParams } from 'next/navigation';
import { MeasurementCard } from './MeasurementCard';
import { Skeleton } from './ui/skeleton';
import { AuthenticatedImage } from './AuthenticatedImage';

export function Details() {
	const params = useParams<{ id: string }>();
	const [config, setConfig] = useState<Config>();
	const [currentMeasurements, setCurrentMeasurements] = useState<{[key: string]: number}>({});
	const [historyMeasurements, setHistoryMeasurements] = useState<HistoryMeasurements>({
		day: [],
        week: [],
        month: [],
	});

	useEffect(() => {
		getConfig(params.id).then(response => {
			if (response) {
				setConfig(response);
			}
		});
		getCurrentMeasurements(params.id).then(response => {
			if (response) {
				setCurrentMeasurements(response);
			}
		});
		getHistoryMeasurements(params.id).then(response => {
			if (response) {
				setHistoryMeasurements(response);
			}
		});
	}, []);

	return (
		<div className="container mx-auto max-w-xl relative min-h-screen bg-white">
			<a href='/' className='absolute top-4 left-4 transition duration-150 active:scale-75 cursor-pointer'>
				<ChevronLeft size={48} color='#334155' />
			</a>
			<AuthenticatedImage url={config?.imageUrl} className='w-full max-h-[70vh] object-cover' skeletonClassName="w-full h-[70vh] flex justify-center items-center bg-gray-200"/>
			<div id="content" className='relative px-4 pb-6'>
				<div className='absolute h-12 w-full bg-white top-[-47px] left-0 rounded-tr-full rounded-tl-full pt-8 pl-10 pr-6'>
					<div className='font-bold text-3xl text-ellipsis overflow-hidden text-nowrap'>
						{config?.name}
						{!config && <Skeleton className="h-6 w-64 mt-2 rounded-full" />}
					</div>
					<div className='text-sm italic font-normal text-slate-400'>
						{config && 'Ocimum basilicum'}
						{!config && <Skeleton className="w-32 h-4 rounded-full mt-2" />}
					</div>
				</div>

				<div className="pt-20 flex flex-wrap gap-2">
					{config && measurementSettings.map(setting =>
						<MeasurementCard key={setting.type} setting={setting} value={currentMeasurements[setting.type]} />
					)}
					{!config && measurementSettings.map(setting =>
						<Skeleton key={setting.type} style={{width: "calc(50% - 4px)"}} className="h-[84px] rounded-2xl" />
					)}
				</div>

				<div className="pt-12 flex flex-col gap-12">
					{historyMeasurements.month[0] && measurementSettings.map(setting => {
						if(Object.keys(historyMeasurements.month[0]).includes(setting.type)) {
							return <HistoryChart key={setting.type} setting={setting} data={historyMeasurements}/>
						}
					})}
				</div>

				{config && <Configuration config={config}/>}
			</div>
		</div>
	)
}

