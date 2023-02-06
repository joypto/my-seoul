import { Collection } from '../collection.entity';

export type CollectionResponse = Collection & { viewCount: number };
