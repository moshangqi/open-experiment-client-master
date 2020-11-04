import {
  reqEquipmentKeyProjects,
  reqExportConclusionExcel,
  reqRejectedKeyProjects,
  reqFilter,
  reqKeytoNormalProject,
  reqReturnKeyProject,
  reqHitBackKeyProject,
  reqReviewPassed,
} from './service';
import { message } from 'antd';
import { saveAs } from 'file-saver';

const Model = {
  namespace: 'equipmentKeyProjects',
  state: {
    projects: [],
    tabActiveKey: '0',
  },
  effects: {
    *fetchProjects({ payload }, { call, put }) {
      const response =
        payload.status === '0'
          ? yield call(reqEquipmentKeyProjects, payload.data)
          : payload.status === '3'
          ? yield call(reqReturnKeyProject)
          : yield call(reqRejectedKeyProjects, payload.data);
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: response.data,
        });
      } else {
        message.error(`请求审批项目出错${res.msg}`);
      }
    },
    *filter({ payload }, { call, put }) {
      const res = yield call(reqFilter, payload);
      if (res.code === 0) {
        yield put({
          type: 'save',
          payload: res.data,
        });
      } else {
        message.error(`查询出错${res.msg}`);
      }
    },
    *export({ payload }, { call, put }) {
      const res = yield call(reqExportConclusionExcel);
      console.log(res);
      saveAs(res, '结题一览表.xlsx');
    },
    *keyToProject({ payload }, { call, put }) {
      const res = yield call(reqKeytoNormalProject, payload);
      if (res.code == 0) {
        yield put({
          type: 'fetchProjects',
          payload: {
            status: '0',
          },
        });
        message.success('转为普通项目成功');
      } else {
        message.error(res.msg);
      }
    },
    *hitBack({ payload }, { call, put }) {
      const res = yield call(reqHitBackKeyProject, payload);
      if (res.code == 0) {
        yield put({
          type: 'fetchProjects',
          payload: {
            status: '0',
          },
        });
        message.success('退回修改成功');
      } else {
        message.error(res.msg);
      }
    },
    *reviewPassed({ payload }, { call, put }) {
      const res = yield call(reqReviewPassed, payload);
      if (res.code == 0) {
        yield put({
          type: 'fetchProjects',
          payload: {
            status: '3',
          },
        });
        message.success('复核成功');
      } else {
        message.error(res.msg);
      }
      // reqReviewPassed
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, projects: payload };
    },
    changeTabActiveKey(state, { payload }) {
      return { ...state, tabActiveKey: payload };
    },
  },
};
export default Model;
