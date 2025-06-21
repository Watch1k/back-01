import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { blogsRepository } from '../../repositories/blogs-repository';
import { createErrorMessages } from '../../../core/utils/error.utils';

export const getBlogByIdHandler = async (req: Request, res: Response) => {
  const id = req.params.id;
  const blog = await blogsRepository.findBlog(id);

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

  res.status(HttpStatus.Ok).send(blog);
};
