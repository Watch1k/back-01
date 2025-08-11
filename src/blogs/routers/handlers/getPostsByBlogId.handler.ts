import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { blogsRepository } from '../../repositories/blogs-repository';
import { createErrorMessages } from '../../../core/utils/error.utils';
import { postsCollection } from '../../../db/mongo.db';

export const getPostsByBlogIdHandler = async (req: Request, res: Response) => {
  const blogId = req.params.id;
  const pageNumber = Number(req.query.pageNumber) || 1;
  const pageSize = Number(req.query.pageSize) || 10;
  const sortBy = req.query.sortBy?.toString() || 'createdAt';
  const sortDirection =
    req.query.sortDirection?.toString() === 'asc' ? 'asc' : 'desc';
  const blog = await blogsRepository.findBlog(blogId);

  if (!blog) {
    res.status(HttpStatus.NotFound).send(
      createErrorMessages([
        {
          field: 'id',
          message: `Blog not found`,
        },
      ]),
    );
    return;
  }

  const skip = (pageNumber - 1) * pageSize;
  const posts = await postsCollection
    .find({ blogId })
    .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
    .skip(skip)
    .limit(pageSize)
    .toArray();

  res.status(HttpStatus.Ok).send(posts);
};
