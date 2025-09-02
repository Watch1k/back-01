import { Post } from '../../domain/post';

export type PostDataOutput = Post & {
  id: string;
};
