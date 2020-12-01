import { reqPublishSave, reqGetAll, reqDeleteOne, reqGetOnePassage, 
  reqChangeStatus, reqUpdatePassage, reqChangeShow }  from './server';
import {message} from 'antd'
const Model = {
  namespace: 'webAppend',
  state: {
    list: [],
    type: '1', // 门户网站：1公告 2新闻 3展示项目
    publishType: '1', // 1 发布 0未发布
    pagination: {},
    loading: false,
    content: {
      detail: '', //暂存的文章
      title: ''
    },
    project: {
      content: "", //文本编辑器
      endTime: "2020-11-16T03:41:25.990Z", //项目结束时间
      experimentType: 1, //项目分组
      id: 0, //项目id
      imgUrl: "", //项目图片
      projectName: "", // 项目标题
      projectType: 1, //项目类型
      startDate: "2020-11-16T03:41:25.990Z", //项目开始时间
      status: 1, //项目状态 1 发布 2 保存
      subordinateCollege: '1', //项目学院
      isTop: 0
    }
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      // 重新请求公告
      yield put({
        type: 'changeState',
        payload: {
          ...payload,
          loading: true
        }
      })
      const {code , msg, data} = yield call(reqGetAll,payload)
      code != 0 && message.error(msg)
      yield put({
        type: 'changeState',
        payload: {
          loading: false,
          list: data
        }
      })
    },

    *publishSave({payload}, {call, put}) { //保存-
      const {code, msg} = yield call(reqPublishSave, {...payload, status: 2})
      if(code == 0) {
        message.success('保存成功');
      } else {
        message.error(msg)
      }
      // payload.type决定选择哪一个接口，1公告 2新闻 3展示项目
    },

    *publish({payload}, {call, put}) {
      const {code, msg} = yield call(reqPublishSave, {...payload, status: 1})
      if(code == 0) {
        message.success('发布成功')
        yield put({
          type: 'changeState',
          payload: {
            project: {
              detail: '', 
              title: ''
            },
            project: {
              content: "", //文本编辑器
              endTime: "2020-11-16T03:41:25.990Z", //项目结束时间
              experimentType: 1, //项目分组
              id: 0, //项目id
              imgUrl: "", //项目图片
              projectName: "", // 项目标题
              projectType: 1, //项目类型
              startDate: "2020-11-16T03:41:25.990Z", //项目开始时间
              status: 1, //项目状态 1 发布 2 保存
              subordinateCollege: '1', //项目学院
              isTop: 0
            }
          }
        })
      } else {
        message.error(msg)
      }
    },

    *delete({ payload }, { call, put }) {
      const { code, msg, data } = yield call(reqDeleteOne, payload);
      console.log(code,msg,data);
      code != 0 ? message.error(msg) : message.success('删除成功');
      yield put({
        type: 'fetch',
        payload: {
          type: payload.type
        }
      })
    },

    *getDetail({ payload }, { call, put }) {
      // console.log(payload);
      const {code, data, msg} = yield call(reqGetOnePassage, payload)
      yield put({
        type: 'changeState',
        payload: {
          content: {
            detail: data.content, //暂存的文章
            title: data.title
          }
        }
      })
    },

    *getProjectDetail({ payload }, { call, put }) {
      const {code, data, msg} = yield call(reqGetOnePassage, payload)
      console.log(code,data,msg)
      if(code == 0) {
        yield put({
          type: 'changeProject',
          payload: data
        })
      } else {
        message.error(msg)
      }
    },

    *update({ payload }, { call, put }) {
      console.log(payload)
      const {code,data,msg} = yield reqUpdatePassage(payload)
      console.log(code,data,msg)
      code == 0 ? message.success('修改成功') : message.error(msg)
    },
    *changeStatus({ payload }, { call, put }) {
      // console.log(payload);
      const {msg, code, data} = yield call(reqChangeStatus,payload);
      code == 0 ? message.success('成功' ) : message.error(msg)
      yield put({
        type: 'fetch',
        payload: {
          type:  payload.type
        }
      })
    },
    *changeShow({ payload }, { call, put }) {
      console.log(payload)
    }
  },
  reducers: {
    save(state, action) {
      return { ...state, data: action.payload };
    },
    changeState(state, action) {
      return {...state,...action.payload}
    },
    changePassage(state, action) {
      return {...state, content:{...state.content, ...action.payload}}
    },
    changeProject(state, action) {
      return {...state, project: {...state.project,...action.payload}}
    }
  },
};
export default Model;
