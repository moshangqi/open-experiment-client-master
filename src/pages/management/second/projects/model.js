import { reqSecondProjects,reqUpdateFunds,reqExportApplyExcel,reqExportProjectInfoExcel} from './service';
import { message } from 'antd';
import {saveAs} from 'file-saver'

const Model = {
  namespace: 'second',
  state: {
    secondProjects:[],
    tabActiveKey:'0'
  },
  effects: {
    *fetchProjects({ payload }, { call, put }) {
      /**
       * payload:{
       *  data:object,
       *  status:string
       * }
       */
      const response = yield call(reqSecondProjects, payload);
      if(response.code===0){
        yield put({
          type: 'save',
          payload: response.data,
        });
      }else{
        message.error('请求审批项目出错')
      }
      
    },
    *export({payload},{call,put}){
      const res = yield call(reqExportApplyExcel)
      console.log(res)
      saveAs(res,'立项一览表.xlsx')
    },
    *exportProjects({payload},{call,put}){
      const res = yield call(reqExportProjectInfoExcel)
      console.log(res)
      saveAs(res,'项目信息总览表.xlsx')
    }
    ,
    *updateFunds({payload},{call,put}){
      console.log('updateFunds',payload)
      const res = yield call(reqUpdateFunds,payload.data)
      if(res.code===0){
        message.success('操作成功')
        yield put({
          type:'fetchProjects',
          payload:{
            status:payload.status
          }
        })
      }else{
        message.error('操作失败')
      }
    },
  },
  
  reducers: {
    save(state, {payload}) {
      return { ...state, secondProjects: payload };
    },
    changeTabActiveKey(state,{payload}){
      return {...state,tabActiveKey:payload}
    }
  },
};
export default Model;
