import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { mapToBlogOutput } from '../mappers/map-to-blog-output.util';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { blogsService } from '../../application/blogs.service';

export const getBlogByIdHandler = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const blog = await blogsService.findByIdOrFail(id);

    res.status(HttpStatus.Ok).send(mapToBlogOutput(blog));
  } catch (e) {
    errorsHandler(e, res);
  }
};
