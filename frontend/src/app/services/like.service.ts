import { Injectable } from '@angular/core';
import { AuthenticationService } from './auth.service';
import { Post } from '../models/post/post';
import { NewReaction } from '../models/reactions/newReaction';
import { PostService } from './post.service';
import { User } from '../models/user';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import {Comment} from "../models/comment/comment";
import {CommentService} from "./comment.service";

@Injectable({ providedIn: 'root' })
export class LikeService {
    public constructor(private authService: AuthenticationService, private postService: PostService,
                       private commentService: CommentService) {}

    public likeComment(comment: Comment, currentUser: User) {
        const innerComment = comment;

        const reaction: NewReaction = {
            entityId: innerComment.id,
            isLike: true,
            userId: currentUser.id
        };

        // update current array instantly
        let hasReaction = innerComment.reactions.some((r) => r.user.id === currentUser.id);
        innerComment.reactions = hasReaction
            ? innerComment.reactions.filter((r) => r.user.id !== currentUser.id)
            : innerComment.reactions.concat({ isLike: true, user: currentUser });
        hasReaction = innerComment.reactions.some((r) => r.user.id === currentUser.id);

        return this.commentService.likeComment(reaction).pipe(
            map(() => innerComment),
            catchError(() => {
                // revert current array changes in case of any error
                innerComment.reactions = hasReaction
                    ? innerComment.reactions.filter((x) => x.user.id !== currentUser.id)
                    : innerComment.reactions.concat({ isLike: true, user: currentUser });

                return of(innerComment);
            })
        );
    }

    public likePost(post: Post, currentUser: User) {
        const innerPost = post;

        const reaction: NewReaction = {
            entityId: innerPost.id,
            isLike: true,
            userId: currentUser.id
        };

        // update current array instantly
        let hasReaction = innerPost.reactions.some((x) => x.user.id === currentUser.id);
        innerPost.reactions = hasReaction
            ? innerPost.reactions.filter((x) => x.user.id !== currentUser.id)
            : innerPost.reactions.concat({ isLike: true, user: currentUser });
        hasReaction = innerPost.reactions.some((x) => x.user.id === currentUser.id);

        return this.postService.likePost(reaction).pipe(
            map(() => innerPost),
            catchError(() => {
                // revert current array changes in case of any error
                innerPost.reactions = hasReaction
                    ? innerPost.reactions.filter((x) => x.user.id !== currentUser.id)
                    : innerPost.reactions.concat({ isLike: true, user: currentUser });

                return of(innerPost);
            })
        );
    }
}
