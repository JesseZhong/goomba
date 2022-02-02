import React from 'react';
import { Video, Videos } from '../videos/Video';
import EditableVideoCard from './EditableVideoCard';


const EditMultiSelectVideoList = (props: {
    videos: Videos | Video[],
    disableEdit?: boolean,
    selected?: Set<string>,
    onSelected?: (videos: Set<string>) => void,
    className?: string
}) => {
    const videos = props.videos instanceof Videos
        ? [...props.videos.values()]
        : props.videos;

    const onSelected = props.onSelected;
    const className = props.className;

    const [selected, setSelected] = React.useState<Set<string>>(props.selected ?? new Set());

    return (
        <div
            className={
                'video-list d-flex flex-wrap flex-row' +
                (className ? ` ${className}` : '')
            }
        >
            {
                videos &&
                videos.map(
                    (video: Video) =>
                        <EditableVideoCard
                            key={video.id}
                            video={video}
                            disableEdit={props.disableEdit}
                            onClick={(
                                video: Video
                            ) => {
                                const id = video.id;

                                // Toggle: Remove if it already exists.
                                if (selected.has(id)) {
                                    selected.delete(id);
                                }
                                else {
                                    selected.add(id);
                                }

                                setSelected(selected);
                                onSelected?.(selected);
                            }}
                        />
                )
            }
        </div>
    )
}

export default EditMultiSelectVideoList;