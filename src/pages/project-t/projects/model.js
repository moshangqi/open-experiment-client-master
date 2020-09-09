import { addRule, queryRule, removeRule, updateRule,reqOwnProjects,reqProjectProcess,reqProjectDetail,deleteNormalProject,deleteKeyProject } from './service';
import { message } from 'antd';
import router from 'umi/router';
import {getOverKeycheck, stopOverKeyProject} from "@/pages/overcheck/keyproject/service";

const Model = {
  namespace: 'tprojects',
  state: {
    data: {
      list: [],
      pagination: {},

    },
    projects:[],
    detail:{},
    process:[]
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(reqOwnProjects, payload);
      if(response.code===0){
        yield put({
          type: 'save',
          payload: response.data,
        })
      }else{
        message.error(`请求项目出错${response.msg}`)
      }

    },

    *instructorsToDeleteItems({ payload }, { call,put }) {
      const {data} = payload;
      const res  = yield call(deleteNormalProject, data);
      console.log(res);
      if(res.code===0) {
        message.success('删除普通项目成功');
      }
      else{
        message.error('删除普通项目项目'+res.msg)
      }
      const response = yield call(reqOwnProjects, payload);
      if(response.code===0){
        yield put({
          type: 'save',
          payload: response.data,
        });
      }else{
        message.error(`请求项目出错${response.msg}`)
      }
    },

    *deleteKeyProject({ payload }, { call,put }) {
      const {data} = payload;
      const res  = yield call(deleteKeyProject, data);
      console.log(res);
      if(res.code===0) {
        message.success('删除重点项目成功');
      }
      else{
        message.error('删除重点项目项目'+res.msg)
      }
      const response = yield call(reqOwnProjects, payload);
      if(response.code===0){
        yield put({
          type: 'save',
          payload: response.data,
        });
      }else{
        message.error(`请求项目出错${response.msg}`)
      }
    },

    *fetchProcess({payload},{call,put}){
      const res = yield call(reqProjectProcess,{projectId:payload});
      if(res.code===0){
        yield put({
          type: 'saveProcess',
          payload: res.data
        })
      }else{
        yield put({
          type: 'saveProcess',
          payload: []
        })
        message.error('请求项目进度出错')
      }
    }

    ,
    *fetchDetail({payload},{call,put}){
      const res = yield call(reqProjectDetail,{projectGroupId:payload})
      if(res.code===0){
        yield put({
          type: 'saveDetail',
          payload:res.data
        })
        router.push('/tproject/manage/detail');
      }else{
        yield put({
          type: 'saveDetail',
          payload:{}
        })
        message.error('请求项目详情出错')
      }
    }
    ,

  },
  reducers: {
    save(state, {payload}) {
      return { ...state, projects: payload };
    },
    saveProcess(state,{payload}){
      return {...state,process:payload}
    },
    saveDetail(state,{payload}){
      return {...state,detail:payload}
    },
    //1学生，2指导老师，3职能部门
    saveRole(state,{payload}){
      return {...state,role:payload}
    }
  },
};
export default Model;
