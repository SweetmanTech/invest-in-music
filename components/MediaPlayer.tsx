import { formatDuration } from '@/lib/utils';
import { usePlayer } from '@/providers/PlayerProvider';
import { TrackControls, TrackMetadata } from '@/types/Track';
import Image from 'next/image';
import { useEffect } from 'react';
import { MdPauseCircle, MdPlayCircle } from 'react-icons/md';
import { Skeleton } from '@/components/ui/skeleton';

type MediaPlayerProps = {
  metadata?: TrackMetadata;
  controls?: TrackControls | null;
  position: number;
  className?: string;
};

export default function MediaPlayer({
  metadata,
  controls,
  position,
  className = '',
}: MediaPlayerProps) {
  const [player, dispatch] = usePlayer();

  const currentTrack = player?.metadata?.id === metadata?.id;
  const displayPosition = currentTrack ? player.position : position;
  const displayDuration = metadata?.duration || 0;

  useEffect(() => {
    if (controls && player?.status == 'LOADED_METADATA') {
      dispatch({ type: 'PLAY', payload: { controls } });
    }
  }, [dispatch, controls, player]);

  const handlePlay = () => {
    if (!metadata || !controls) return;
    dispatch({ type: 'PLAY', payload: { controls } });
  };

  const handlePause = () => {
    dispatch({ type: 'PAUSE' });
  };

  return (
    <div
      data-type={metadata?.type}
      className={`flex w-full flex-col gap-4 rounded-lg border p-2 ${className}`}
    >
      <div className="flex gap-4">
        <div className="relative my-auto aspect-square w-16 shrink-0 overflow-hidden rounded-lg shadow-md">
          {metadata?.artworkUrl ? (
            <Image
              src={metadata.artworkUrl}
              alt=""
              fill
              style={{ objectFit: 'cover', objectPosition: 'center' }}
              unoptimized
            />
          ) : (
            <Skeleton className="size-full" />
          )}
        </div>

        <div className="flex grow flex-col gap-1 pt-2 text-left">
          <div className="line-clamp-2 font-inter text-sm font-bold">
            {metadata?.trackName ? (
              <>{metadata.trackName}</>
            ) : (
              <Skeleton className="h-2 w-32 rounded-sm" />
            )}
          </div>
          <div className="line-clamp-2 font-inter text-xs font-extralight">
            {metadata?.artistName ? (
              <>{metadata.artistName}</>
            ) : (
              <Skeleton className="h-2 w-12 rounded-sm" />
            )}
          </div>
        </div>
        <div className="my-auto">
          {controls ? (
            currentTrack && player.playing ? (
              <button onClick={handlePause}>
                <MdPauseCircle className="text-4xl" />
              </button>
            ) : (
              <button onClick={handlePlay}>
                <MdPlayCircle className="text-4xl" />
              </button>
            )
          ) : (
            <Skeleton className="h-8 w-8 rounded-full" />
          )}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex justify-between font-inter text-xs font-light">
          <span>{formatDuration(displayPosition)}</span>
          <span>{formatDuration(displayDuration)}</span>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-lg bg-gray-300">
          <div
            className="h-1 rounded-lg bg-black"
            style={{ width: `${(displayPosition / displayDuration) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
