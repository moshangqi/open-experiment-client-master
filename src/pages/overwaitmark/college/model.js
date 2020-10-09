import { getOvercollegeGetsTheProjects, reqExportExcel } from './service';
import { message } from 'antd';
import { saveAs } from 'file-saver';

const Model = {
  namespace: 'overwaitmark',
  state: {
    projects: [],
    project: [],
  },
  effects: {
    *collegeGetsTheProjects({ payload }, { call, put }) {
      const response = yield call(getOvercollegeGetsTheProjects, payload);
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: response.data,
        });
      } else {
        message.error('获取项目出错' + response.msg);
      }
    },

    *export({ payload }, { call, put }) {
      const res = yield call(reqExportExcel);
      saveAs(res, 'a.xlsx');
      console.log(res);
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, projects: payload };
    },
  },
};
export default Model;
