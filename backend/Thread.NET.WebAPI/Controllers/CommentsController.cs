using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Thread.NET.BLL.Services;
using Thread.NET.Common.DTO.Comment;
using Thread.NET.Common.DTO.Like;
using Thread.NET.Common.Logic.Abstractions;

namespace Thread.NET.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class CommentsController : ControllerBase
    {
        private readonly CommentService _commentService;
        private readonly LikeService _likeService;
        private readonly IUserIdGetter _userIdGetter;

        public CommentsController(CommentService commentService, LikeService likeService, IUserIdGetter userIdGetter)
        {
            _commentService = commentService;
            _likeService = likeService;
            _userIdGetter = userIdGetter;
        }

        /// <summary>
        /// Adds new comment to post
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<CommentDTO>> CreatePost([FromBody] NewCommentDTO comment)
        {
            comment.AuthorId = _userIdGetter.CurrentUserId;
            return Ok(await _commentService.CreateComment(comment));
        }

        [HttpPost("like")]
        public async Task<ActionResult> LikePost(NewReactionDTO reaction)
        {
            reaction.UserId = _userIdGetter.CurrentUserId;

            await _likeService.LikeComment(reaction);
            return Ok();
        }
    }
}