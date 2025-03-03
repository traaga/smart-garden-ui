"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from "./ui/button";
import { useState } from "react";
import { Config } from "@/common";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { updateConfig } from "@/api-client";
import { UploadImageModal } from "./UploadImageModal";

interface ConfigurationProps {
	config: Config
}

export function Configuration(props: ConfigurationProps) {
	const [editConfig, setEditConfig] = useState(false);
	const [config, setConfig] = useState(props.config);

	const handleEdit = () => {
		setEditConfig(true);
	}

	const handleSave = () => {
		updateConfig(config).then(() => window.location.reload());
		setEditConfig(false);
	}

	const handleCancel = () => {
		setConfig(props.config);
		setEditConfig(false);
	}

	const handleChange = (field: keyof Config, value: string | number | boolean) => {
		setConfig(prev => ({
			...prev,
			[field]: value
		}));
	}

	return (
		<Card className="mt-12">
			<CardHeader>
				<CardTitle className="flex items-center justify-between">
					<div>Configuration</div>
					<div className="flex gap-2">
						<Badge variant="secondary" className="line-through">Saved to DB</Badge>
						<Badge variant="secondary">v{config.version}</Badge>
					</div>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<form className="flex flex-col gap-2">
					<div>
						<Label htmlFor="config-id" className="text-xs pl-1">ID</Label>
						<Input
							id="config-id"
							disabled value={config.id}
						/>
					</div>
					<div>
						<Label htmlFor="config-name" className="text-xs pl-1">Name</Label>
						<Input
							id="config-name"
							disabled={!editConfig}
							value={config.name}
							onChange={(e) => handleChange('name', e.target.value)}
						/>
					</div>
					<div>
						<Label htmlFor="config-interval" className="text-xs pl-1">Measure interval <span className="text-gray-400">(seconds)</span></Label>
						<Input
							id="config-interval"
							disabled={!editConfig}
							type="number"
							value={config.interval}
							onChange={(e) => handleChange('interval', parseInt(e.target.value) || 0)}
						/>
					</div>
					<div>
						<Label htmlFor="config-soilMoistureThreshold" className="text-xs pl-1">Soil moisture threshold <span className="text-gray-400">(%)</span></Label>
						<Input
							id="config-soilMoistureThreshold"
							disabled={!editConfig}
							type="number"
							value={config.soilMoistureThreshold || 0}
							onChange={(e) => handleChange('soilMoistureThreshold', parseInt(e.target.value) || 0)}
						/>
					</div>
					{process.env.NODE_ENV === 'development' && <div className="flex items-center gap-4 mt-2">
						<Label htmlFor="config-led_state" className="text-xs pl-1">Debug led</Label>
						<Switch
							id="config-led_state"
							disabled={!editConfig}
							checked={config.led_state}
							onCheckedChange={(checked) => handleChange('led_state', checked)}
						/>
					</div>}
				</form>
			</CardContent>
			<CardFooter className="flex justify-end gap-4">
				{editConfig && <>
					<Button variant="outline" onClick={handleCancel}>Cancel</Button>
					<Button onClick={handleSave}>Save</Button>
				</>}
				{!editConfig && <>
					<UploadImageModal id={config.id} />
					<Button onClick={handleEdit}>Edit configuration</Button>
				</>}
			</CardFooter>
		</Card>
	)
}
