"use client"

import { Leaf } from 'lucide-react';
import { PlantCard } from "./PlantCard"
import { useEffect, useState } from 'react';
import { getOnlineNodes } from '@/api-client';
import { NodeItem } from '@/common';
import { Skeleton } from './ui/skeleton';
import NotificationSubscriptionStatus from './NotificationSubscriptionStatus';

export function Dashboard() {
	const [nodes, setNodes] = useState<NodeItem[]>([]);

	useEffect(() => {
		getOnlineNodes().then(nodes => {
			setNodes(nodes);
		});
	}, []);

	return (
		<div className="container mx-auto p-4 max-w-xl min-h-screen bg-white">
			<div className="flex items-center mb-6  pt-2 pl-2 gap-2">
				<Leaf size={32} strokeWidth={2.5} color='#178237'/>
				<h1 className="text-3xl font-bold text-slate-700">Smart Garden</h1>
			</div>

			<div className="mt-4 flex flex-wrap gap-4">
				{nodes.map((node) => <PlantCard key={node.id} node={node}/>)}
				{!nodes.length && [1,2,3,4].map((node) => <Skeleton key={node} style={{width: "calc(50% - 8px)"}} className="h-[33vh] rounded-2xl" />)}
			</div>

			<div className='mt-16'>
				<NotificationSubscriptionStatus/>
			</div>
		</div>
	)
}

