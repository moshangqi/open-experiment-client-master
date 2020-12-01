import {reqAchievementShowList, reqHomePageNewsList, reqAnnouncementList, reqAchievementList} from './server';
import {message} from 'antd';
const Model = {
  namespace: 'home',
  state: {
    achievementShowList: [], //轮播展示项目 /homePage/getTopPublishedAchievementShowList
    newsList: [], //发布新闻 /homePage/getHomePageNewsList
    achievementList: [], //项目 homePage/getPublishedAchievementShowList
    announcementList: [], //公告 homePage/getHomePageAnnouncementList

  },
  effects: {
    *fetchShowList({ payload }, { call, put }) {
      const {data,code,msg} = yield call(reqAchievementShowList);
      code !=0 && message.error(msg)
      yield put({
        type: 'save',
        payload: {
          achievementShowList: data
        }
      })
      // const {data,code,msg} = yield call(reqHomePageNewsList);
    },

    *fetchAnnouncement({ payload }, { call, put }) {
      const {data,code,msg} = yield call(reqAnnouncementList);
      if(code == 0) {
        yield put({
          type: 'save',
          payload: {
            announcementList: data
          }
        })
      } else {
        message.error(msg)
      }
    },

    *fetchNewsList({ payload }, { call, put }) {
      const {data,code,msg} = yield call(reqHomePageNewsList);
      code !=0 && message.error(msg)
      yield put({
        type: 'save',
        payload: {
          newsList: data
        }
      })
    },

    *fetchAchievementList({ payload }, { call, put }) {
      const {data,code,msg} = yield call(reqAchievementList);
      code !=0 && message.error(msg)
      yield put({
        type: 'save',
        payload: {
          achievementList: data
        }
      })
    }

  },
  reducers: {
    save(state, action) {
      return { ...state,  ...action.payload};
    }
  },
};
export default Model;
