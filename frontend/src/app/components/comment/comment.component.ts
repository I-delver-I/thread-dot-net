import {Component, Input, OnDestroy} from '@angular/core';
import { Comment } from '../../models/comment/comment';
import {catchError, switchMap, takeUntil} from "rxjs/operators";
import {User} from "../../models/user";
import {AuthenticationService} from "../../services/auth.service";
import {LikeService} from "../../services/like.service";
import {empty, Observable, Subject} from "rxjs";

@Component({
    selector: 'app-comment',
    templateUrl: './comment.component.html',
    styleUrls: ['./comment.component.sass']
})
export class CommentComponent implements OnDestroy {
    @Input() public comment: Comment;
    @Input() public currentUser: User;

    private unsubscribe$ = new Subject<void>();

    public constructor(private authService: AuthenticationService, private likeService: LikeService) {}

    public likeComment() {
        this.authService.getUser()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((user) => {
                if (user) {
                    this.currentUser = user;
                }
            })

        this.likeService
            .likeComment(this.comment, this.currentUser)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((comment) => (this.comment = comment));
    }

    public ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
