import { Cast as CastType } from '@neynar/nodejs-sdk/build/neynar-api/v2';
import AuthorDetails from './AuthorDetails';
import PlayButton from './PlayButton';
import Upvote from './Upvote';
import { Address } from 'viem';

const Cast = ({ cast = {} as CastType }: { cast: CastType }) => {
  const embed = (cast?.embeds?.[0] as any)?.url;
  const { hash } = cast;

  return (
    <div className="flex flex-col gap-3 mb-[20px] border border-500-[#ddd] p-[10px]">
      <AuthorDetails pfpUrl={cast.author.pfp_url} displayName={cast.author.display_name} />
      <div className="flex items-center w-full">
        <Upvote target={hash as Address} />
        <PlayButton embed={embed} />
      </div>
    </div>
  );
};

export default Cast;
