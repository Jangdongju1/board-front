import ResponseDto from "../response.dto";
import {FavoriteListItem} from "../../../types/interface";

export default interface GetBoardFavoriteListResponseDto extends ResponseDto{
    favoriteList : FavoriteListItem[];
}