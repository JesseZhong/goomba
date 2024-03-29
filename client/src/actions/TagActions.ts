import TagsAPI from '../api/TagAPI';
import AppDispatcher from '../AppDispatcher';
import ActionTypes from './ActionTypes';
import { AuthAccess } from './AuthActions';
import { TagsPayload } from './TagPayload';

const tagsApi = TagsAPI(process.env.REACT_APP_API_URL ?? '', AuthAccess);

const TagActions = {
  async get(): Promise<void> {
    return await tagsApi.getTags().then((tags: string[]) => {
      AppDispatcher.dispatch({
        type: ActionTypes.RECEIVE_TAGS,
        tags: tags,
      } as TagsPayload);
    });
  },
};

export default TagActions;
