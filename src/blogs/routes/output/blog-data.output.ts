import { Blog } from '../../domain/blog';

export type BlogDataOutput = Blog & {
  id: string;
};
