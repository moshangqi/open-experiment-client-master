import {reqOwnProjects,reqProjectProcess,reqProjectDetail } from '../services/detail';
import {reqApproval,reqKeyApply } from '../services/approval';
import { message } from 'antd';
import router from 'umi/router';
const roleURL =  ['','/tproject/manage/detail','/auth/lab/project/detail','']
/**
 * 普通项目操作接口
 * 单位unit:0-实验室，1-学院，2-职能部门，3-指导老师
 * 操作类型type:0-驳回，1-通过，2-上报
 */
//'/project/rejectProjectApplyByLabAdministrator'
const approvalUrl = [
  ['/project/rejectProjectReportByLabAdministrator','/project/approveProjectApplyByLabAdministrator','/project/reportToCollegeLeader','/project/rejectProjectApplyByLabAdministrator'],
  ['/project/rejectProjectApplyBySecondaryUnit','/project/approveProjectApplyBySecondaryUnit','/project/reportToFunctionalDepartment'],
  ['/project/rejectProjectApplyByFunctionalDepartment','/project/agreeEstablish']
]

/**
 * 重点项目操作接口
 * 单位unit:0-实验室，1-学院，2-职能部门，3-指导老师
 * 操作类型type:0-驳回，1-通过，2-上报
 */
const keyApprovalUrl = [
  ['/project/rejectKeyProjectByLabAdministrator','/project/agreeKeyProjectByLabAdministrator','/project/reportKeyProjectByLabAdministrator','/project/changeKeyProjectToGeneral'],
  ['/project/rejectKeyProjectBySecondaryUnit','/project/agreeKeyProjectBySecondaryUnit','/project/reportKeyProjectBySecondaryUnit'],
  ['/project/rejectKeyProjectByFunctionalDepartment','/project/agreeKeyProjectByFunctionalDepartment',],
  ['/project/rejectKeyProjectByGuideTeacher','/project/agreeKeyProjectByGuideTeacher']
]

/**
 * 审核操作后调用action重新获取项目列表
 * approvalType:获取立项列表
 * keyApprovalType:获取重点申请列表
 * 0-实验室，1-二级单位，2-职能部门，3-指导老师
 */
const approvalType = ['lab/fetchProjects','second/fetchProjects','equipment/fetchProjects','tproject/fetch']
const keyApprovalType = ['labKeyProjects/fetchProjects','secondKeyProjects/fetchProjects','equipmentKeyProjects/fetchProjects','tprojectsKeyProjects/fetch']

const Model = {
  namespace: 'approval',
  state: {
  },
  effects: {
    /**
     * 普通项目的审批操作-批准，上报，驳回
     * payload:{
     *  data:object  //传给后端的数据
     *  unit:string  //操作单位
     *  type:string  //操作类型0-驳回，1-上报，2-通过
     *  isDetail:boolean  //是否在详情页进行操作，用来判断操作后请求刷新的接口
     *  status:string  //操作列表所处状态，0-待审核，1-待上报，2-已驳回，3-已上报
     * }
     */
    *normal({payload},{call,put}){
      const {data,type,unit,isDetail,status=0} = payload
      console.log('normal',payload)
      const res = yield call(reqApproval,approvalUrl[unit][type],data)
      if(res.code===0){
        message.success('操作成功！')
        if(isDetail){
          yield put({
            type:'detail/fetchDetail',
            payload:{
              projectGroupId:typeof data[0]==='object'?data[0].projectId:data[0],
              role:unit
            }
          })
          yield put({
            type:'detail/fetchProcess',
            payload:{
              projectId:data[0].projectId,
              role:unit
            }
          })
        }else{
          yield put({
            type:approvalType[unit],
            payload:{
              status
            }
          })

        }
      }else{
        message.error(`操作失败:${res.msg}`)
      }

    }
    ,
    /**
     * 重点项目的审批操作-批准，上报，驳回
     * payload:{
     *  data:object  //传给后端的数据
     *  unit:string  //操作单位
     *  type:string  //操作类型0-驳回，1-上报，2-通过
     *  isDetail:boolean  //是否在详情页进行操作，用来判断操作后请求刷新的接口
     *  status:string  //操作列表所处状态，0-待审核，1-待上报，2-已驳回，3-已上报
     * }
     */
    *key({payload},{call,put}){
      const {data,type,unit,isDetail,status=0,role=0} = payload
      console.log('key',payload)
      const res = yield call(reqApproval,keyApprovalUrl[unit][type],data)
      if(res.code===0){
        message.success('操作成功！')
        if(isDetail){
          yield put({
            type:'detail/fetchDetail',
            payload:{
              projectGroupId:typeof data[0]==='object'?data[0].projectId:data[0],
              role,//***************************************** */
              projectType:2
            }
          })
          yield put({
            type:'detail/fetchProcess',
            payload:{
              projectId:data[0].projectId,
              role,
              projectType:2
            }
          })
        }else{
          console.log('ssssssss',approvalType[unit])
          yield put({
            type:keyApprovalType[unit],
            payload:{
              status
            }
          })

        }
      }else{
        message.error(`操作失败:${res.msg}`)
      }
    }
    ,

    /**
     * 学生提交重点项目申请接口,提交后重新请求详情刷新页面
     * payload:{
     *  projectId:string
     *  ...
     * }
     */
    *apply({payload},{call,put}){
      const res = yield call(reqKeyApply,payload)
      if(res.code===0){
        message.success('操作成功')
        yield put({
          type:'detail/fetchDetail',
          payload:{
            projectGroupId:payload.projectId,
            role:7,
            projectType:2
          }
        })
        yield put({
          type:'detail/fetchProcess',
          payload:{
            projectId:payload.projectId,
            role:7,
            projectType:2
          }
        })
      }else{
        message.error(`操作失败:${res.msg}`)
      }
    }
  },
};
export default Model;
