import { Cast } from '@neynar/nodejs-sdk/build/neynar-api/v2';
import getCastsMetadataLink from './getCastsMetadataLink';
import getCastContractMapping from './mapCastToContract';

const thirdwebId = process.env.THIRDWEB_CLIENT_ID!;

async function filterZoraFeed(casts: Cast[]) {
  const batchSize = 99;
  const castsMetadata: Response[] = [];
  const response: Cast[] = [];

  try {
    const data = await getCastsMetadataLink(getCastContractMapping(casts));

    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);

      castsMetadata.push(...await Promise.all(
        batch.map(cast => {
          const ipfs = cast.ipfs.replace('ipfs://', '');
          return fetch(`https://${thirdwebId}.ipfscdn.io/ipfs/${ipfs}`);
        }))
      );
    }

    for (let i = 0; i < data.length; i++) {
      const cast = data[i];

      const metadata: {
        content?: {
          mime?: string;
          uri?: string
        }
      } = await castsMetadata[i].json();

      if (
        metadata &&
        metadata?.content &&
        metadata.content?.mime &&
        metadata.content?.uri &&
        metadata.content?.mime.includes('audio')
      ) {
        cast.embeds.unshift({ url: metadata.content?.uri });
        delete (cast as any).ipfs;
        response.push(cast as Cast);
      }
    }
    return response;
  } catch (error) {
    console.error('filterZoraFeed', 'ERROR', error);
    return [];
  }
}

export default filterZoraFeed;