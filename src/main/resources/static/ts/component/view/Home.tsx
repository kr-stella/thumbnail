import React, { useState } from "react";

interface Thumbnail { src:string; alt:string; video:File; }

const Home = () => {

	const [ thumbnails, setThumbnails ] = useState<Thumbnail[]>([]);
	const onChange = (e:React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if(files) {
			Array.from(files).forEach(file => {

				const videoElement = document.createElement(`video`);
				videoElement.preload = `metadata`;

				const url = URL.createObjectURL(file);
				videoElement.src = url;
				videoElement.onloadedmetadata = () => {
					extractThumbnail(file, videoElement);
					// URL.revokeObjectURL(url);
				};

			});
		}
	};

	const extractThumbnail = (file:File, element:HTMLVideoElement) => {

		const canvas = document.createElement(`canvas`);
		const context = canvas.getContext(`2d`);
		if(context) {

			canvas.width = element.videoWidth;
			canvas.height = element.videoHeight;
			element.currentTime = element.duration * 0.075;
			element.addEventListener(`seeked`, () => {

				context.drawImage(element, 0, 0, canvas.width, canvas.height);
				const src = canvas.toDataURL(`image/png`);
				setThumbnails(thumbs => [ ...thumbs, { src, alt: `Thumbnail for ${file.name}`, video: file }]);

				canvas.remove();
				URL.revokeObjectURL(src);

			}, { once: true });

		}
	};

	const onSend = () => {

		const formData = new FormData();
		thumbnails.forEach((thumbnail, index) => {
			// const blob = dataURLtoBlob(thumbnail.src);
			formData.append(`files[${index}].video`, thumbnail.video);
			formData.append(`files[${index}].image`, dataURLtoBlob(thumbnail.src), `${thumbnail.video.name}_thumbnail.png`);
		});

		fetch(`/api/upload`, { method: `POST`, body: formData })
		.then(response => response.json())
		.then(data => console.log(`Uploaded successfully:`, data))
		.catch(error => console.error(`Upload failed:`, error));

	};

	const dataURLtoBlob = (url:string) => {

		const arr = url.split(`,`);
		// MIME 타입 추출을 위한 정규식 매치
		const match = arr[0].match(/:(.*?);/);
		if(!match)
			throw new Error("Failed to extract MIME type from data URL");

		const mime = match[1];
		const bstr = atob(arr[1]);
		let n = bstr.length;
		const u8arr = new Uint8Array(n);
		while(n--)
			u8arr[n] = bstr.charCodeAt(n);

		return new Blob([u8arr], { type: mime });

	}

	return (
	<div>
		<input type={`file`} multiple accept={`video/*`} onChange={onChange} />
		<div>
			{thumbnails.map((thumbnail, index) => (
			<div key={index}>
				<img className={`thumbnail`} src={thumbnail.src} alt={thumbnail.alt} />
				<p>{thumbnail.video.name}</p>
			</div>
			))}
		</div>
		<button onClick={onSend}>Send</button>
	</div>
	);

};

export default React.memo(Home);