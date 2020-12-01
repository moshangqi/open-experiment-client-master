import {
  reqEquipmentProjects,
  reqExportConclusionExcel,
  reqfilterProjects,
  reqRejectedProjects,
  reqEquipmentKeyProjects,
  reqHitBcak,
  reqReviewPassed,
  reqResolveProject,
  reqAgree,
} from './service';
import { message } from 'antd';
import { saveAs } from 'file-saver';

const Model = {
  namespace: 'equipment',
  state: {
    projects: [],
    tabActiveKey: '0',
  },
  effects: {
    *fetchProjects({ payload }, { call, put }) {
      const response =
        payload.status === '0'
          ? yield call(reqEquipmentProjects, payload.data)
          : payload.status === '1'
          ? yield call(reqRejectedProjects, payload.data)
          : yield call(reqResolveProject, payload.data);
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: response.data,
        });
      } else {
        message.error('请求审批项目出错');
      }
    },
    *filter({ payload }, { call, put }) {
      const res = yield call(reqfilterProjects, payload);
      if (res.code === 0) {
        yield put({
          type: 'save',
          payload: res.data,
        });
      } else {
        message.error('查询失败');
      }
    },
    *fetchKeyProjects({ payload }, { call, put }) {
      const res = yield call(reqEquipmentKeyProjects, payload);
      if (res.code === 0) {
        yield put({
          type: 'save',
          payload: res.data,
        });
      } else {
        message.error('请求出错');
      }
    },
    *export({ payload }, { call, put }) {
      const res = yield call(reqExportConclusionExcel);
      saveAs(res, '结题一览表.xlsx');
    },
    *agree({ payload }, { call, put }) {
      const res = yield call(reqAgree, payload);
      if (res.code == 0) {
        yield put({
          type: 'fetchProjects',
          payload: {
            status: '0',
          },
        });
        message.success('审核成功');
      } else {
        message.error(res.msg);
      }
    },
    *hitback({ payload }, { call, put }) {
      const res = yield call(reqHitBcak, payload);
      if (res.code == 0) {
        yield put({
          type: 'fetchProjects',
          payload: {
            status: '0',
          },
        });
        message.success('退回成功');
      } else {
        // console.log(res)
        message.error(res.msg);
      }
    },
    *reviewPassed({ payload }, { call, put }) {
      const res = yield call(reqReviewPassed, payload);
      if (res.code == 0) {
        yield put({
          type: 'fetchProjects',
          payload: {
            status: '1',
          },
        });
        message.success('复核成功');
      } else {
        message.error(res.msg);
      }
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
