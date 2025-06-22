import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { postsRepository } from '../../repositories/posts-repository';
import { createErrorMessages } from '../../../core/utils/error.utils';
import { mapToPostViewModel } from '../../mappers/map-to-post-view-model.util';

export const getPostByIdHandler = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const id = req.params.id;
    const post = await postsRepository.findPost(id);

    if (!post) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: 'id', message: 'Post not found' }]),
        );
      return;
    }
    res.status(HttpStatus.Ok).send(mapToPostViewModel(post));
  } catch {
    res.status(HttpStatus.InternalServerError).send();
  }
};
