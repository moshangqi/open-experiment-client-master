import { reqEquipmentProjects,reqExportConclusionExcel,reqfilterProjects,reqRejectedProjects,reqEquipmentKeyProjects} from './service';
import { message } from 'antd';
import {saveAs} from 'file-saver'

const Model = {
  namespace: 'equipment',
  state: {
    projects:[],
    tabActiveKey:'0'
  },
  effects: {
    *fetchProjects({ payload }, { call, put }) {
      const response = payload.status==='0'?yield call(reqEquipmentProjects, payload.data):yield call(reqRejectedProjects,payload.data);
      if(response.code===0){
        yield put({
          type: 'save',
          payload: response.data,
        });
      }else{
        message.error('请求审批项目出错')
      }

    },
    *filter({payload},{call,put}){
      const res = yield call(reqfilterProjects,payload)
      console.log("aaa");
      if(res.code===0){
        yield put({
          type: 'save',
          payload: res.data,
        });
      }else{
        message.error('查询失败')
      }
    },
    *fetchKeyProjects({payload},{call,put}){
      const res = yield call(reqEquipmentKeyProjects,payload)
      if(res.code===0){
        yield put({
          type: 'save',
          payload: res.data,
        });
      }else{
        message.error('请求出错')
      }
    },
    *export({payload},{call,put}){
      const res = yield call(reqExportConclusionExcel)
      console.log(res)
      saveAs(res,'结题一览表.xlsx')
    }
  },
  reducers: {
    save(state, {payload}) {
      return { ...state, projects: payload };
    },
    changeTabActiveKey(state,{payload}){
      return {...state,tabActiveKey:payload}
    }
  },
};
export default Model;
