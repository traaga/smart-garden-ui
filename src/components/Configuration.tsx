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
						<Badge variant="secondary">Saved to DB</Badge>
						<Badge variant="secondary">v{config.version}</Badge>
					</div>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<form>
					<div className="flex gap-6">
						<div className="flex flex-col gap-2 whitespace-nowrap">
							<Label htmlFor="config-id" className="h-9 flex items-center">ID</Label>
							<Label htmlFor="config-name" className="h-9 flex items-center">Name</Label>
							<Label htmlFor="config-interval" className="h-9 flex items-center">Interval</Label>
							<Label htmlFor="config-led_state" className="h-9 flex items-center">Led state</Label>
						</div>
						<div className="flex flex-col gap-2 w-full">
							<Input
								id="config-id"
								disabled value={config.id}
							/>
							<Input
								id="config-name"
								disabled={!editConfig}
								value={config.name}
								onChange={(e) => handleChange('name', e.target.value)}
							/>
							<Input
								id="config-interval"
								disabled={!editConfig}
								type="number"
								value={config.interval}
								onChange={(e) => handleChange('interval', parseInt(e.target.value) || 0)}
							/>
							<div className="h-9 flex items-center pl-1">
								<Switch
									id="config-led_state"
									disabled={!editConfig}
									checked={config.led_state}
									onCheckedChange={(checked) => handleChange('led_state', checked)}
								/>
							</div>
						</div>
					</div>
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
