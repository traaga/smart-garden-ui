import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { Image } from 'lucide-react';
import { uploadImage } from "@/api-client";

interface UploadImageModalProps {
	id: string;
}

export function UploadImageModal(props: UploadImageModalProps) {
	const [previewURL, setPreviewURL] = useState('');
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [loading, setLoading] = useState(false);

	const handleOnInput = () => {
		const el = document.querySelector('#plant-image-input') as HTMLInputElement;
		if (el && el.files?.length) {
			setPreviewURL(URL.createObjectURL(el.files[0]));
			setSelectedFile(el.files[0]);
		} else {
			setSelectedFile(null);
		}
	}

	const handleOnLoad = () => {
		URL.revokeObjectURL(previewURL);
	}

	const handleOnOpenChange = () => {
		setPreviewURL('');
		setSelectedFile(null);
	}

	const handleSubmit = () => {
		if(!selectedFile) {
			return;
		}

		setLoading(true);

		const formData = new FormData();
		formData.append('id', props.id);
		formData.append('image', selectedFile);

		uploadImage(formData).then(() => {
			setLoading(false);
			window.location.reload();
		});
	}

	return (
		<Dialog onOpenChange={handleOnOpenChange}>
			<DialogTrigger asChild>
				<Button>Upload image</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Upload image</DialogTitle>
					<DialogDescription>
						Make sure to upload an image that was taken in portait mode.
					</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col gap-4 items-center justify-center">
					<div className="bg-slate-100 w-64 h-64 flex items-center justify-center rounded-xl">
						{!previewURL && <Image size={32} />}
						{previewURL && <img src={previewURL} className="max-h-64" onLoad={handleOnLoad} />}
					</div>
					<Input id="plant-image-input" type="file" accept="image/*" onInput={handleOnInput} />
				</div>
				<DialogFooter>
					<Button disabled={!selectedFile || loading} onClick={handleSubmit}>Upload</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

