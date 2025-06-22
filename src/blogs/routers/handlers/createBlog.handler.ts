import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { BlogCreateInput } from '../../dto/blog-create.input';
import { blogsRepository } from '../../repositories/blogs-repository';
import { mapToBlogModel } from '../mappers/map-to-blog-view-model.util';

export const createBlogHandler = async (
  req: Request<{}, {}, BlogCreateInput>,
  res: Response,
) => {
  const result = await blogsRepository.createBlog(req.body);
  if (!result.data) {
    res
      .status(HttpStatus.InternalServerError)
      .send({ message: 'Failed to create blog' });
  } else {
    const viewModel = mapToBlogModel(result.data);
    res.status(HttpStatus.Created).send(viewModel);
  }
};
