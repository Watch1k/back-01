import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { postsService } from '../../application/posts.service';
import { mapToPostOutput } from '../mappers/map-to-post-output.util';
import { PostAttributes } from '../../application/dtos/post-attributes';

export const createPostHandler = async (
  req: Request<{}, {}, PostAttributes>,
  res: Response,
) => {
  try {
    const respId = await postsService.createPost(req.body);
    const createdPost = await postsService.findByIdOrFail(respId);
    const postOutput = mapToPostOutput(createdPost);

    res.status(HttpStatus.Created).send(postOutput);
  } catch {
    res.status(HttpStatus.InternalServerError).send();
  }
};

// import { Request, Response } from 'express';
// import { HttpStatus } from '../../../core/types/http-statuses';
// import { mapToPostViewModel } from '../../mappers/map-to-post-view-model.util';
// import { PostCreateInput } from '../input/post-create.input';
// import { postsService } from '../../application/posts.service';
// import { PostAttributes } from '../../application/dtos/post-attributes';
//
// export const createPostWithAttributes = async (
//   res: Response,
//   attributes: PostAttributes,
// ) => {
//   try {
//     const resp = await postsService.createPost(attributes);
//     if (!resp.data) {
//       res.status(HttpStatus.InternalServerError).send();
//       return;
//     }
//     res.status(HttpStatus.Created).send(mapToPostViewModel(resp.data));
//   } catch {
//     res.status(HttpStatus.InternalServerError).send();
//   }
// };
//
// export const createPostHandler = async (
//   req: Request<{}, {}, PostCreateInput>,
//   res: Response,
// ) => {
//   return createPostWithAttributes(res, req.body.data.attributes);
// };
