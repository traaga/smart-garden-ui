import { ReactElement } from "react";
import { Droplets, Sun, Thermometer } from 'lucide-react';

export const measurementSettings: MeasurementSetting[] = [
	{
		type: 'moisture',
		displayName: "Soil moisture",
		unit: '%',
		iconBig: <Droplets color='#334155' size={32} />,
		iconMedium: <Droplets color='#334155' size={24} />,
		chartColor: "#85a8ff" // blue 300
	},
	{
		type: 'temperature',
		displayName: "Temperature",
		unit: '°C',
		iconBig: <Thermometer color='#334155' size={32} />,
		iconMedium: <Thermometer color='#334155' size={24} />,
		chartColor: "#ff9494" // red 300
	},
	{
		type: 'ambient-light',
		displayName: "Ambient light",
		unit: ' lux',
		iconBig: <Sun color='#334155' size={32} />,
		iconMedium: <Sun color='#334155' size={24} />,
		chartColor: "#ffda46" // orange 300
	}
];

export interface MeasurementSetting {
	type: string;
	displayName: string;
	unit: string;
	iconBig: ReactElement;
	iconMedium: ReactElement;
	chartColor: string;
}

export interface Config {
	id: string;
	name: string;
	version: number;
	interval: number;
	led_state: boolean;
	imageUrl: string;
	soilMoistureThreshold: number | null;
	updatedAt: string;
	createdAt: string;
}

export interface NodeItem {
	id: string;
	name: string;
	imageUrl: string;
	showWarning: boolean;
	fields: {
        [key: string]: number;
    };
}

export interface HistoryMeasurements {
	day: {
        [key: string]: number | string;
    }[],
	week: {
        [key: string]: number | string;
    }[],
	month: {
        [key: string]: number | string;
    }[],
}
