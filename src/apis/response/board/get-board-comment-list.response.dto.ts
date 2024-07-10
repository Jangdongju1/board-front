import ResponseDto from "../response.dto";
import {CommentListItem} from "../../../types/interface";

export default interface GetBoardCommentListResponseDto extends ResponseDto{
    commentList : CommentListItem[]
}