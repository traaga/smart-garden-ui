import { Config, MeasurementSetting } from "@/common";

interface MeasurementCardProps {
	setting: MeasurementSetting;
	value: number;
	config: Config;
}

export function MeasurementCard(props: MeasurementCardProps) {
	let hasBorder = false;

	if(props.setting.type === "moisture") {
		if(props.config.soilMoistureThreshold && props.value <= props.config.soilMoistureThreshold) {
			hasBorder = true;
		}
	}

	return (
		<span key={props.setting.type} style={{ width: "calc(50% - 4px)", border: hasBorder ? "2px solid #f87171" : "none" }} className="flex items-center text-lg bg-slate-100 p-4 rounded-2xl gap-3">
			<span className="flex items-center">{props.setting.iconBig}</span>
			<div className='flex flex-col gap-2'>
				<span className='text-xs uppercase font-bold tracking-wide text-slate-500'>{props.setting.displayName}</span>
				<span className='text-slate-700 font-bold'>{props.value || '--'}{props.setting.unit}</span>
			</div>
		</span>
	)
}

