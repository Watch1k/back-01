import { ResourceType } from '../../../core/types/resource-type';
import { BlogAttributes } from '../../application/dtos/blog-attributes';

export type BlogUpdateInput = {
  data: {
    type: ResourceType.Posts;
    id: string;
    attributes: BlogAttributes;
  };
};
