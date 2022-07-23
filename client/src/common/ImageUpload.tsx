import React from 'react';
import events from 'events';
import ImageActions from '../actions/ImageActions';
import { ImageUploadData } from '../api/ImageAPI';

const basename = (path: string) => path.split(/[\\/]/).pop();


const ImageUpload = (props: {
    name?: string,
    className?: string,
    value?: string,
    onChange?: (
        file_key: string,
        image_url?: string
    ) => void
}) => {
    const [value, setValue] = React.useState(props.value ?? '');
    const [progress, setProgress] = React.useState<number | undefined>(undefined);

    const progressEvent = new events.EventEmitter();
    progressEvent.addListener('uploadProgress', (percent: number) => {
        setProgress(Math.round(percent));
    })

    let fileInput: HTMLInputElement | null;
    
    return (
        <>
            <input
                type='file'
                ref={(input) => fileInput = input}
                style={{
                    display: 'none'
                }}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    event.stopPropagation();
                    event.preventDefault();

                    const file = event?.target?.files?.[0];
                    if (file) {
                        const filename = basename(file.name) ?? '';
                        ImageActions.upload(
                            filename,
                            file,
                            progressEvent
                        )
                        .then(
                            (imageUpload: ImageUploadData) => {
                                setValue(imageUpload.image_key);
                                setProgress(undefined);
                                props.onChange?.(
                                    imageUpload.image_key,
                                    imageUpload.image_url
                                );
                            },
                        );
                    }
                }}
            />
            
            <button
                type='button'
                className={props.className}
                onClick={() => fileInput?.click()}
                style={{
                    minWidth: '6rem'
                }}
            >
                {
                    progress ?
                    <div className='progress'>
                        <div
                            className='progress-bar'
                            role='progressbar'
                            style={{
                                width: `${progress}%`
                            }}
                        >
                            {`${progress}%`}
                        </div>
                    </div>
                    : (
                        value
                        ? `File: ${value}`
                        : 'Upload a File'
                    )
                }
            </button>
        </>
    )
}

export default ImageUpload;