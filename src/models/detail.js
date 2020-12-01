import {
  reqOwnProjects,
  reqNewOut,
  deleteOutCome,
  reqUploadZipFile,
  reqProjectProcess,
  reqProjectDetail,
  reqKeyProjectProcess,
  reqUploadApplyFile,
  deleteFile,
  reqUploadOverFile,
  reqUploadAttFile,
  reqUploadEquipmentFile,
} from '../services/detail';
import { message } from 'antd';
import router from 'umi/router';
import { reqApplyForm } from '@/pages/project-t/apply/service';
/**
 * 获取详情后跳转的路由地址-普通立项
 * 由传入role参数决定
 * 0-实验室详情，
 * 1-二级单位详情，
 * 2-职能部门详情，
 * 3-公示项目详情，
 * 4-学生申请项目，
 * 5-指导老师查看详情,
 * 6-学生申请页公示项目详情,
 * 7-学生查看详情,
 * 8-老师修改立项申请
 * 9-实验室查看拟题项目详情
 */
const roleURL = [
  '/auth/lab/project/detail',
  '/auth/second/project/detail',
  '/auth/equipment/project/detail',
  '/openProjects/detail',
  '/sproject/join/all/apply',
  '/tproject/manage/detail',
  '/sproject/join/all/detail',
  '/sproject/manage/detail',
  '/tproject/manage/edit',
  '/auth/lab/pre-project/detail',
  '/midtermcheck/project/detail',
  '/overcheck/project/detail',
  '/overcheckfunction/project/detail',
  '/overall/college/detail',
  '/overall/function/detail',
  '/overfunctionall/normal/detail',
  '/approval/project/detail', //测试
];
/**
 * 将传入role映射为对应身份unit(查看普通项目)
 * 0-实验室
 * 1-二级单位
 * 2-职能部门
 * 9-其他
 */
const roleToUnitMap = {
  '0': '0',
  '1': '1',
  '2': '2',
  '3': '9',
  '4': '9',
  '5': '9',
  '6': '9',
  '7': '9',
  '8': '9',
  '9': '0',
};

/**
 * 获取详情后跳转的路由地址-重点立项
 * 0-实验室重点项目详情，
 * 1-二级单位重点项目详情，
 * 2-职能部门重点项目详情，
 * 4-学生申请重点项目页，
 * 5-指导老师查看重点项目详情,
 */
const keyRoleURL = [
  '/auth/lab/key-project/detail',
  '/auth/second/key-project/detail',
  '/auth/equipment/key-project/detail',
  '/openProjects/key-detail',
  '/sproject/join/all/apply',
  '/tproject/manage/key-detail',
  '/sproject/join/all/detail',
  '/sproject/manage/key-detail',
  '/midtermcheck/key-project/detail',
  '/inner/all/detail',
  '/sproject/manage/overproject',
  '/overcheck/key-project/detail',
  '/overcheckfunction/keyproject/detail',
  '/overall/keycollege/detail',
  '/overall/keyfunction/detail',
  '/overfunctionall/key/detail',
  '/approval/keyproject/detail', // 测试
];
/**
 * 将传入role映射为对应身份unit(查看重点项目)
 * 0-实验室
 * 1-二级单位
 * 2-职能部门
 * 3-指导老师
 * 4-学生
 */
const roleToUnitKeyMap = {
  '0': '0',
  '1': '1',
  '2': '2',
  '3': '9',
  '4': '9',
  '5': '3',
  '6': '9',
  '7': '4',
  '8': '9',
};

const Model = {
  namespace: 'detail',
  state: {
    baseInfo: {}, //项目基本信息
    process: [], //操作历史
    projectType: 1, //项目类型-普通，重点
    role: 0, //0-实验室，1-学院，2-职能部门，3-指导老师
    fileList: [],
    OverList: [],
    ZipList: [],
    EquipmentList: [],
    PicsList: [],
    unit: 9,
    reportToAgree: false, //实验室查看详情，是否上报来审批通过
    budget: undefined, //重点项目经费预算
    membersInfo: undefined, //重点项目成员简介
  },
  effects: {
    /**
     * 获取操作历史
     * payload:{
     *  projectId:string
     *  role:string  //调用接口的角色
     * }
     */
    *fetchProcess({ payload }, { call, put }) {
      const { projectType } = payload;
      const res = yield call(reqProjectProcess, { projectId: payload.projectId });
      localStorage.setItem('payload-p', JSON.stringify(payload));
      if (res.code === 0) {
        yield put({
          type: 'saveProcess',
          payload: res.data,
        });
        yield put({
          type: 'saveRole',
          payload: payload.role,
        });
        if (projectType) {
          yield put({
            type: 'saveProjectType',
            payload: projectType,
          });
        }
      } else {
        yield put({
          type: 'saveProcess',
          payload: [],
        });
        message.error(`请求项目进度出错${res.msg}`);
      }
    },

    //从写匹配，解决刷新bug
    *fetchNewProcess({ payload }, { call, put }) {
      const { projectType } = payload;
      const res = yield call(reqProjectProcess, { projectId: payload.projectId });
      if (res.code === 0) {
        yield put({
          type: 'saveProcess',
          payload: res.data,
        });
        yield put({
          type: 'saveRole',
          payload: payload.role,
        });
        if (projectType) {
          yield put({
            type: 'saveProjectType',
            payload: projectType,
          });
        }
      } else {
        yield put({
          type: 'saveProcess',
          payload: [],
        });
        message.error(`请求项目进度出错${res.msg}`);
      }
    },

    *fetchKeyProcess({ payload }, { call, put }) {
      const { projectType } = payload;
      const res = yield call(reqKeyProjectProcess, { projectId: payload.projectId });
      if (res.code === 0) {
        yield put({
          type: 'saveProcess',
          payload: res.data,
        });
        yield put({
          type: 'saveRole',
          payload: payload.role,
        });
        if (projectType) {
          yield put({
            type: 'saveProjectType',
            payload: projectType,
          });
        }
      } else {
        yield put({
          type: 'saveProcess',
          payload: [],
        });
        message.error(`请求项目进度出错${res.msg}`);
      }
    },

    /**
     * 获取项目详情
     * payload:{
     *  projectGroupId:string,
     *  role:string,   //0-实验室，1-学院，2-职能部门，3-指导老师
     *  [projectType:number]  //2-重点项目 ，其它或不传为普通项目
     * }
     */
    *fetchDetail({ payload }, { call, put }) {
      const { projectType, role, reportToAgree } = payload;
      const res = yield call(reqProjectDetail, { id: payload.projectGroupId });
      console.log(res);
      localStorage.setItem('payload-d', JSON.stringify(payload));
      if (res.code === 0) {
        yield put({
          type: 'saveDetail',
          payload: res.data,
        });
        yield put({
          type: 'saveRole',
          payload: payload.role,
        });
        if (projectType) {
          yield put({
            type: 'saveProjectType',
            payload: projectType,
          });
        }
        if (typeof reportToAgree !== 'undefined') {
          yield put({
            type: 'saveReportToAgree',
            payload: reportToAgree,
          });
        }
        yield put({
          type: 'saveUnit',
          payload: (projectType === 2 ? roleToUnitKeyMap : roleToUnitMap)[role],
        });
        yield put({
          type: 'saveFileList',
          payload: [
            {
              uid: '1',
              name: res.data.applyUrl ? res.data.applyUrl.replace(/.+\/\d+_/g, '') : '',
              status: 'done',
              response: 'Server Error 500', // custom error message to show
              url: res.data.applyUrl,
            },
          ],
        });
        if (res.data.conclusionPdf !== null) {
          yield put({
            type: 'saveOverFileList',
            payload: [
              {
                uid: res.data.conclusionPdf.id,
                name: res.data.conclusionPdf.url
                  ? res.data.conclusionPdf.url.replace(/.+\/\d+_/g, '')
                  : '',
                status: 'done',
                response: 'Server Error 500', // custom error message to show
                url: res.data.conclusionPdf.url,
              },
            ],
          });

          yield put({
            type: 'saveOverUrl',
            payload: res.data.conclusionPdf.url,
          });
        }

        if (res.data.achievementAnnex !== null) {
          yield put({
            type: 'saveZipList',
            payload: [
              {
                uid: res.data.achievementAnnex.id,
                name: res.data.achievementAnnex.fileName,
                status: 'done',
                response: 'Server Error 500', // custom error message to show
                url: res.data.achievementAnnex.url,
              },
            ],
          });

          yield put({
            type: 'saveZipUrl',
            payload: res.data.achievementAnnex.fileName,
          });
        }

        if (res.data.experimentReportPdf !== null) {
          yield put({
            type: 'saveEquipmentFileList',
            payload: [
              {
                uid: res.data.experimentReportPdf.id,
                name: res.data.experimentReportPdf.url
                  ? res.data.experimentReportPdf.url.replace(/.+\/\d+_/g, '')
                  : '',
                status: 'done',
                response: 'Server Error 500', // custom error message to show
                url: res.data.experimentReportPdf.url,
              },
            ],
          });
          yield put({
            type: 'saveEquipmentUrl',
            payload: res.data.experimentReportPdf.url,
          });
        }
        let arr = [];
        for (let i = 0; i < res.data.annexes.length; i++) {
          arr[i] = {
            uid: res.data.annexes[i].id,
            name: res.data.annexes[i].url ? res.data.annexes[i].url.replace(/.+\/\d+_/g, '') : '',
            status: 'done',
            response: 'Server Error 500', // custom error message to show
            url: res.data.annexes[i].url,
          };
        }

        yield put({
          type: 'savePicFileList',
          payload: arr,
        });
        // console.log(router, arr, payload.role, '>>>>>');
        if (window.location.pathname === roleURL[payload.role]) {
          router.replace((projectType === 2 ? keyRoleURL : roleURL)[payload.role]);
        } else {
          router.push((projectType === 2 ? keyRoleURL : roleURL)[payload.role]);
        }
      } else {
        yield put({
          type: 'saveDetail',
          payload: {},
        });
        message.error(`请求项目详情出错:${res.msg}`);
      }
    },

    //从写获取详情，解决刷新bug
    *fetchNewDetail({ payload }, { call, put }) {
      const { projectType, role, reportToAgree } = payload;
      const res = yield call(reqProjectDetail, { id: payload.projectGroupId });
      // console.log(res);
      if (res.code === 0) {
        yield put({
          type: 'saveDetail',
          payload: res.data,
        });
        yield put({
          type: 'saveRole',
          payload: payload.role,
        });
        if (projectType) {
          yield put({
            type: 'saveProjectType',
            payload: projectType,
          });
        }
        if (typeof reportToAgree !== 'undefined') {
          yield put({
            type: 'saveReportToAgree',
            payload: reportToAgree,
          });
        }
        yield put({
          type: 'saveUnit',
          payload: (projectType === 2 ? roleToUnitKeyMap : roleToUnitMap)[role],
        });
        yield put({
          type: 'saveFileList',
          payload: [
            {
              uid: '1',
              name: res.data.applyUrl ? res.data.applyUrl.replace(/.+\/\d+_/g, '') : '',
              status: 'done',
              response: 'Server Error 500', // custom error message to show
              url: res.data.applyUrl,
            },
          ],
        });
        if (res.data.conclusionPdf !== null) {
          yield put({
            type: 'saveOverFileList',
            payload: [
              {
                uid: res.data.conclusionPdf.id,
                name: res.data.conclusionPdf.url
                  ? res.data.conclusionPdf.url.replace(/.+\/\d+_/g, '')
                  : '',
                status: 'done',
                response: 'Server Error 500', // custom error message to show
                url: res.data.conclusionPdf.url,
              },
            ],
          });

          yield put({
            type: 'saveOverUrl',
            payload: res.data.conclusionPdf.url,
          });
        }

        if (res.data.achievementAnnex !== null) {
          yield put({
            type: 'saveZipList',
            payload: [
              {
                uid: res.data.achievementAnnex.id,
                name: res.data.achievementAnnex.fileName,
                status: 'done',
                response: 'Server Error 500', // custom error message to show
                url: res.data.achievementAnnex.url,
              },
            ],
          });

          yield put({
            type: 'saveZipUrl',
            payload: res.data.achievementAnnex.fileName,
          });
        }

        if (res.data.experimentReportPdf !== null) {
          yield put({
            type: 'saveEquipmentFileList',
            payload: [
              {
                uid: res.data.experimentReportPdf.id,
                name: res.data.experimentReportPdf.url
                  ? res.data.experimentReportPdf.url.replace(/.+\/\d+_/g, '')
                  : '',
                status: 'done',
                response: 'Server Error 500', // custom error message to show
                url: res.data.experimentReportPdf.url,
              },
            ],
          });
          yield put({
            type: 'saveEquipmentUrl',
            payload: res.data.experimentReportPdf.url,
          });
        }
        let arr = [];
        for (let i = 0; i < res.data.annexes.length; i++) {
          arr[i] = {
            uid: res.data.annexes[i].id,
            name: res.data.annexes[i].url ? res.data.annexes[i].url.replace(/.+\/\d+_/g, '') : '',
            status: 'done',
            response: 'Server Error 500', // custom error message to show
            url: res.data.annexes[i].url,
          };
        }

        yield put({
          type: 'savePicFileList',
          payload: arr,
        });
        // console.log(router, arr);
      } else {
        yield put({
          type: 'saveDetail',
          payload: {},
        });
        message.error(`请求项目详情出错:${res.msg}`);
      }
    },

    *uploadApplyFile({ payload }, { call, put }) {
      const res = yield call(reqUploadApplyFile, payload.data);
      // console.log(payload);
      if (res.code === 0) {
        message.success('上传成功');

        yield put({
          type: 'saveFileList',
          payload: [
            {
              uid: '1',
              name: res.data.url ? res.data.url.replace(/.+\/\d+_/g, '') : '',
              status: 'done',
              response: 'Server Error 500', // custom error message to show
              url: res.data.url,
            },
          ],
        });
        yield put({
          type: 'saveApplyUrl',
          payload: res.data.url,
        });
      } else {
        message.error(`${res.msg}`);
      }
    },

    *uploadConcludingReport({ payload }, { call, put }) {
      const response = yield call(reqUploadOverFile, payload.data);
      // console.log(response);
      // console.log(payload);
      if (response.code === 0) {
        message.success('上传成功');

        yield put({
          type: 'saveOverFileList',
          payload: [
            {
              uid: response.data.id,
              name: response.data.url ? response.data.url.replace(/.+\/\d+_/g, '') : '',
              status: 'done',
              response: 'Server Error 500', // custom error message to show
              url: response.data.url,
            },
          ],
        });
        yield put({
          type: 'saveOverUrl',
          payload: response.data.url,
        });
      } else {
        message.error(`${response.msg}`);
      }
      // const res = yield call(reqProjectDetail, { id:payload.id});
      // console.log(res);
      // if (res.code === 0) {
      //   yield put({
      //     type: 'saveOverFileList',
      //     payload: [
      //       {
      //         uid: res.data.conclusionPdf.id,
      //         name: res.data.conclusionPdf.url ? res.data.conclusionPdf.url.replace(/.+\/\d+_/g, '') : '',
      //         status: 'done',
      //         response: 'Server Error 500', // custom error message to show
      //         url: res.data.conclusionPdf.url,
      //       },
      //     ]
      //   })
      //   yield put({
      //     type: 'saveOverUrl',
      //     payload: res.data.conclusionPdf.url
      //   })
      //
      // }
    },

    *uploadAchievementAnnex({ payload }, { call, put }) {
      const response = yield call(reqUploadZipFile, payload.data);
      // console.log(response);
      if (response.code === 0) {
        message.success('上传成功');

        yield put({
          type: 'saveZipList',
          payload: [
            {
              uid: response.data.id,
              name: response.data.fileName,
              status: 'done',
              response: 'Server Error 500', // custom error message to show
              url: response.data.fileName,
            },
          ],
        });
        yield put({
          type: 'saveZipUrl',
          payload: response.data.fileName,
        });
      } else {
        message.error(`${response.msg}`);
      }
      // const res = yield call(reqProjectDetail, { id:payload.id});
      // console.log(res);
      // if (res.code === 0) {
      //   yield put({
      //     type: 'saveOverFileList',
      //     payload: [
      //       {
      //         uid: res.data.conclusionPdf.id,
      //         name: res.data.conclusionPdf.url ? res.data.conclusionPdf.url.replace(/.+\/\d+_/g, '') : '',
      //         status: 'done',
      //         response: 'Server Error 500', // custom error message to show
      //         url: res.data.conclusionPdf.url,
      //       },
      //     ]
      //   })
      //   yield put({
      //     type: 'saveOverUrl',
      //     payload: res.data.conclusionPdf.url
      //   })
      //
      // }
    },

    *uploadAttachmentFile({ payload }, { call, put }) {
      const response = yield call(reqUploadAttFile, payload.data);
      // console.log(response, payload.id);
      let arr = [];
      for (let i = 0; i < response.data.length; i++) {
        arr[i] = {
          uid: response.data[i].id,
          name: response.data[i].url ? response.data[i].url.replace(/.+\/\d+_/g, '') : '',
          status: 'done',
          response: 'Server Error 500', // custom error message to show
          url: response.data[i].url,
        };
      }
      if (response.code === 0) {
        message.success('上传成功');
        yield put({
          type: 'savePicFileList',
          payload: arr,
        });
      } else {
        message.error(`${response.msg}`);
      }
      const res = yield call(reqProjectDetail, { id: payload.id });
      // console.log(res);
      if (res.code === 0) {
        let arr = [];
        for (let i = 0; i < res.data.annexes.length; i++) {
          arr[i] = {
            uid: res.data.annexes[i].id,
            name: res.data.annexes[i].url ? res.data.annexes[i].url.replace(/.+\/\d+_/g, '') : '',
            status: 'done',
            response: 'Server Error 500', // custom error message to show
            url: res.data.annexes[i].url,
          };
        }

        yield put({
          type: 'savePicFileList',
          payload: arr,
        });
      }
    },

    *uploadExperimentReport({ payload }, { call, put }) {
      const response = yield call(reqUploadEquipmentFile, payload.data);
      // console.log(response);
      if (response.code === 0) {
        message.success('上传成功');
        yield put({
          type: 'saveEquipmentFileList',
          payload: [
            {
              uid: response.data.id,
              name: response.data.url ? response.data.url.replace(/.+\/\d+_/g, '') : '',
              status: 'done',
              response: 'Server Error 500', // custom error message to show
              url: response.data.url,
            },
          ],
        });
        yield put({
          type: 'saveEquipmentUrl',
          payload: response.data.url,
        });
      } else {
        message.error(`${response.msg}`);
      }
      // const res = yield call(reqProjectDetail, { id:payload.id});
      // console.log(res);
      // if (res.code === 0) {
      //   yield put({
      //     type: 'saveDetail',
      //     payload: res.data,
      //   });
      //
      //   yield put({
      //     type: 'saveFileList',
      //     payload: [
      //       {
      //         uid: '1',
      //         name: res.data.applyUrl ? res.data.applyUrl.replace(/.+\/\d+_/g, '') : '',
      //         status: 'done',
      //         response: 'Server Error 500', // custom error message to show
      //         url: res.data.applyUrl,
      //       },
      //     ]
      //   })
      //   yield put({
      //     type: 'saveOverFileList',
      //     payload: [
      //       {
      //         uid: res.data.conclusionPdf.id,
      //         name: res.data.conclusionPdf.url ? res.data.conclusionPdf.url.replace(/.+\/\d+_/g, '') : '',
      //         status: 'done',
      //         response: 'Server Error 500', // custom error message to show
      //         url: res.data.conclusionPdf.url,
      //       },
      //     ]
      //   })
      //   yield put({
      //     type: 'saveOverUrl',
      //     payload: res.data.conclusionPdf.url
      //   })
      //   yield put({
      //     type: 'saveEquipmentFileList',
      //     payload: [
      //       {
      //         uid: res.data.experimentReportPdf.id,
      //         name: res.data.experimentReportPdf.url ? res.data.experimentReportPdf.url.replace(/.+\/\d+_/g, '') : '',
      //         status: 'done',
      //         response: 'Server Error 500', // custom error message to show
      //         url: res.data.experimentReportPdf.url,
      //       },
      //     ]
      //   })
      //   yield put({
      //     type: 'saveEquipmentUrl',
      //     payload: res.data.experimentReportPdf.url
      //   })
      //   let arr = [];
      //   for (let i = 0; i < res.data.annexes.length; i++) {
      //     arr[i] = {
      //       uid: res.data.annexes[i].id,
      //       name: res.data.annexes[i].url ? res.data.annexes[i].url.replace(/.+\/\d+_/g, '') : '',
      //       status: 'done',
      //       response: 'Server Error 500', // custom error message to show
      //       url: res.data.annexes[i].url,
      //     }
      //   }
      //
      //   yield put({
      //     type: 'savePicFileList',
      //     payload: arr
      //   })
      // }
    },

    *deleteFile({ payload }, { call, put }) {
      const { data } = payload;
      const response = yield call(deleteFile, data);
      // console.log(response, data);
      if (response.code === 0) {
        message.success('删除成功');
      } else {
        message.error(`${response.msg}`);
      }
      const res = yield call(reqProjectDetail, { id: payload.theId });
      if (res.code === 0) {
        let arr = [];
        for (let i = 0; i < res.data.annexes.length; i++) {
          arr[i] = {
            uid: res.data.annexes[i].id,
            name: res.data.annexes[i].url ? res.data.annexes[i].url.replace(/.+\/\d+_/g, '') : '',
            status: 'done',
            response: 'Server Error 500', // custom error message to show
            url: res.data.annexes[i].url,
          };
        }

        yield put({
          type: 'savePicFileList',
          payload: arr,
        });

        yield put({
          type: 'saveZipList',
          payload: [],
        });

        yield put({
          type: 'saveZipUrl',
          payload: '',
        });
      }
    },

    *deleteIconicResult({ payload }, { call, put }) {
      const { data } = payload;
      const response = yield call(deleteOutCome, data);
      if (response.code === 0) {
        message.success('删除成功');
      } else {
        message.error(`${response.msg}`);
      }
      const res = yield call(reqProjectDetail, { id: payload.theId });
      if (res.code === 0) {
        yield put({
          type: 'saveDetail',
          payload: res.data,
        });
      }
    },

    *insertIconicResult({ payload }, { call, put }) {
      const res = yield call(reqNewOut, payload);
      if (res.code === 0) {
        message.success('提交成功');
      } else {
        message.error(`提交失败：${res.msg}`);
      }

      const response = yield call(reqProjectDetail, { id: payload[0].projectId });
      if (response.code === 0) {
        yield put({
          type: 'saveDetail',
          payload: response.data,
        });
      }
    },
  },
  reducers: {
    saveApplyUrl(state, { payload }) {
      return { ...state, baseInfo: { ...state.baseInfo, applyurl: payload } };
    },
    saveOverUrl(state, { payload }) {
      return { ...state, baseInfo: { ...state.baseInfo, overurl: payload } };
    },
    saveZipUrl(state, { payload }) {
      return { ...state, baseInfo: { ...state.baseInfo, zipurl: payload } };
    },
    saveEquipmentUrl(state, { payload }) {
      return { ...state, baseInfo: { ...state.baseInfo, equipmenturl: payload } };
    },
    saveProcess(state, { payload }) {
      return { ...state, process: payload };
    },
    saveDetail(state, { payload }) {
      return { ...state, baseInfo: payload };
    },
    saveRole(state, { payload }) {
      return { ...state, role: payload };
    },
    saveProjectType(state, { payload }) {
      return { ...state, projectType: payload };
    },
    saveFileList(state, { payload }) {
      return { ...state, fileList: payload };
    },
    saveOverFileList(state, { payload }) {
      return { ...state, OverList: payload };
    },
    saveZipList(state, { payload }) {
      return { ...state, ZipList: payload };
    },
    saveEquipmentFileList(state, { payload }) {
      return { ...state, EquipmentList: payload };
    },
    savePicFileList(state, { payload }) {
      return { ...state, PicsList: payload };
    },
    saveUnit(state, { payload }) {
      return { ...state, unit: payload };
    },
    saveBudget(state, { payload }) {
      return { ...state, budget: payload };
    },
    saveMembersInfo(state, { payload }) {
      return { ...state, membersInfo: payload };
    },
    saveReportToAgree(state, { payload }) {
      return { ...state, reportToAgree: payload };
    },
  },
};
export default Model;
