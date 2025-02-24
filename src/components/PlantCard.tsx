import { NodeItem } from "@/common";
import { Thermometer, Droplets, TriangleAlert } from "lucide-react"
import { AuthenticatedImage } from "./AuthenticatedImage";

interface PlantCardProps {
	node: NodeItem;
}

export function PlantCard(props: PlantCardProps) {
	return (
		<a href={`/details/${props.node.id}`} className="relative transition duration-300 hover:scale-105 active:scale-95 cursor-pointer h-[33vh]" style={{ width: "calc(50% - 8px)" }}>
			<AuthenticatedImage url={props.node.imageUrl} className="rounded-2xl w-full h-full object-cover" skeletonClassName="h-full flex justify-center items-center bg-gray-200 rounded-2xl" />
			
			{props.node.showWarning && <div className="absolute top-2 right-2 p-3 rounded-xl bg-red-400">
				<TriangleAlert />
			</div>}
			
			<div className="absolute bottom-0 w-full flex gap-2 flex-col text-white p-4 pt-16 rounded-br-2xl rounded-bl-2xl"
				style={{ backgroundImage: "linear-gradient(to bottom, transparent, black)" }}
			>
				<div className="text-lg text-ellipsis overflow-hidden text-nowrap">
					<span className="font-bold">{props.node.name}</span>
				</div>
				<div className="flex items-start justify-between">
					<span className="flex text-lg gap-1">
						<span className="flex items-center"><Droplets size={24} /></span>
						<span>{props.node.fields.moisture || '--'}%</span>
					</span>
					<span className="flex text-lg">
						<span className="flex items-center"><Thermometer size={24} /></span>
						<span>{props.node.fields.temperature || '--'}°C</span>
					</span>
				</div>
			</div>
		</a>
	)
}

