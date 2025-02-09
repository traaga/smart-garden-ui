import { getImageSource } from "@/api-client";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";

interface AuthenticatedImageProps {
	url?: string;
	className?: string;
	skeletonClassName?: string;
}

export function AuthenticatedImage(props: AuthenticatedImageProps) {
	const [source, setSource] = useState<string>();

	useEffect(() => {
		if (props.url) {
			getImageSource(props.url).then(res => {
				setSource(res);
			});
		}
	}, [props.url]);

	return (
		<>
			{source && <img src={source} className={props.className} />}
			{!source && <Skeleton className={props.skeletonClassName} />}
		</>
	)
}

