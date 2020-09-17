import defaultSettings from './defaultSettings'; // https://umijs.org/config/

import slash from 'slash2';
import webpackPlugin from './plugin.config';
const { pwa, primaryColor } = defaultSettings; // preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。

const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION } = process.env;
const isAntDesignProPreview = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site';

//开发模式代理
const proxyURL = 'http://192.168.1.100:8083'; //'http://220.167.105.201:8083'//172.23.252.212 //'http://192.168.43.153:8083' //'http://10.20.0.77:8083'
const proxyKeys = [
  '/anon',
  '/user/getMyInfo',
  '/project/',
  '/funds',
  '/announcemen',
  '/file',
  '/permission',
  '/amount',
  '/timeLimit',
  '/user/getMyInfo',
  '/user/getUserInfoByUserId',
  '/user/updateUserInfo',
  '/user/keyWord',
  '/newCertificate/applyCertificate',
  '/newCertificate/viewMyApplication',
  '/newCertificate/deleteMyApplication',
  '/newCertificate/openApply',
  '/newCertificate/closeApply',
  '/newCertificate/emptyTheTable',
  '/newCertificate/downloadList',
  '/project/getIntermediateInspectionProject',
  '/project/getIntermediateInspectionKeyProject',
  '/project/rejectIntermediateInspectionProject',
  '/project/rejectIntermediateInspectionKeyProject',
  '/project/midTermKeyProjectHitBack',
  '/info/getMessageTips',
  '/info/getAllMyMessage',
  '/info/confirmReceiptOfMidtermReminder',
  '/project/getMidTermReturnProject',
  '/project/getKeyProjectMidTermReturnProject',
  '/project/midTermReviewPassed',
  '/project/KeyProjectMidTermKeyProjectHitBack',
  '/project/KeyProjectMidTermReviewPassed',
  '/project/FunctionCreateCommonApply',
  '/project/getFunctionCreateCommonApply',
  '/project/selectByKeyword',
  '/project/selectKeyProjectByKeyword',
  '/file/uploadConcludingReport',
  '/file/uploadAttachmentFile',
  '/file/uploadExperimentReport',
  '/file/deleteFile',
  '/file/uploadAchievementAnnex',
  '/project/deleteIconicResult',
  '/project/insertIconicResult',
  '/project/collegeGetsTheItemsToBeCompleted',
  '/project/CollegeHitBack',
  '/project/CollegeRejectToBeConcludingProject',
  '/project/CollegeGivesRating',
  '/project/getToBeConcludingProject',
  '/project/rejectToBeConcludingProject',
  '/project/functionHitBack',
  '/project/functionGivesRating',
  '/project/getFunctionReturnProject',
  '/project/getCollegeReturnProject',
  '/project/functionReviewPassed',
  '/project/CollegeReviewPassed',
  '/project/getCollegeKeyProject',
  '/project/collegeKeyProjectHitBack',
  '/project/collegeGivesKeyProjectRating',
  '/project/rejectCollegeKeyProject',
  '/project/getCollegeReturnKeyProject',
  '/project/collegeReviewPassed',
  '/project/getToBeConcludingKeyProject',
  '/project/rejectToBeConcludingKeyProject',
  '/project/functionKeyProjectHitBack',
  '/project/functionGivesKeyProjectRating',
  '/project/functionReviewPassedKeyProject',
  '/project/getFunctionReturnKeyProject',
  '/project/instructorsToDeleteItems',
  '/project/deleteKeyProject',
  '/project/collegeGetsTheProjects',
  '/project/getTheSchoolHasCompletedProject',
  '/project/getTheCollegeHasCompletedKeyProject',
  '/project/getTheSchoolHasCompletedKeyProject',
  '/project/getCompleteKeyProject',
  '/project/getConclusionProject',
  '/project/selectConclusionKeyProjectByKeyword',
  '/project/selectConclusionByKeyword',
];
const proxyOptions = {
  target: proxyURL,
  changeOrigin: true,
};
const proxy = {};
proxyKeys.forEach(item => {
  proxy['/api' + item] = proxyOptions;
});

const plugins = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        // default false
        enable: true,
        // default zh-CN
        default: 'zh-CN',
        // default true, when it is true, will use `navigator.language` overwrite default
        baseNavigator: true,
      },
      // dynamicImport: {
      //   loadingComponent: './components/PageLoading/index',
      //   webpackChunkName: true,
      //   level: 3,
      // },
      pwa: pwa
        ? {
            workboxPluginMode: 'InjectManifest',
            workboxOptions: {
              importWorkboxFrom: 'local',
            },
          }
        : false, // default close dll, because issue https://github.com/ant-design/ant-design-pro/issues/4665
      // dll features https://webpack.js.org/plugins/dll-plugin/
      // dll: {
      //   include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
      //   exclude: ['@babel/runtime', 'netlify-lambda'],
      // },
    },
  ],
  [
    'umi-plugin-pro-block',
    {
      moveMock: false,
      moveService: false,
      modifyRequest: true,
      autoAddMenu: true,
    },
  ],
]; // 针对 preview.pro.ant.design 的 GA 统计代码

if (isAntDesignProPreview) {
  plugins.push([
    'umi-plugin-ga',
    {
      code: 'UA-72788897-6',
    },
  ]);
  plugins.push([
    'umi-plugin-pro',
    {
      serverUrl: 'https://ant-design-pro.netlify.com',
    },
  ]);
}

export default {
  plugins,
  block: {
    // 国内用户可以使用码云
    defaultGitUrl: 'https://gitee.com/ant-design/pro-blocks', // defaultGitUrl: 'https://github.com/ant-design/pro-blocks',
  },
  hash: true,
  targets: {
    ie: 11,
  },
  devtool: isAntDesignProPreview ? 'source-map' : false,
  // umi routes: https://umijs.org/zh/guide/router.html
  routes: [
    {
      path: '/',
      component: '../layouts/BlankLayout',
      routes: [
        {
          path: '/user',
          component: '../layouts/UserLayout',
          routes: [
            {
              path: '/user',
              redirect: '/user/login',
            },
            {
              name: 'login',
              path: '/user/login',
              component: './user/login',
            },
            {
              name: 'register-result',
              path: '/user/register-result',
              component: './user/register-result',
            },
            {
              name: 'register',
              path: '/user/register',
              component: './user/register',
            },
            {
              component: '404',
            },
          ],
        },
        {
          path: '/',
          component: '../layouts/BasicLayout',
          Routes: ['src/pages/Authorized'],
          routes: [
            {
              path: '/',
              name: '首页',
              icon: 'home',
              component: './home',
            },
            {
              path: '/timeLimit/detail',
              name: '项目时间限制',
              icon: 'home',
              component: './management/second/time-check',
              hideInMenu: true,
            },
            {
              path: '/openProjects/detail',
              name: '详情',
              icon: 'home',
              component: './common/detail',
              hideInMenu: true,
            },
            {
              path: '/announcement/detail',
              name: '公告详情',
              icon: 'home',
              component: './settings/announcement/detail',
              hideInMenu: true,
            },
            // {
            //   path: '/tproject',
            //   name: '项目管理',
            //   icon: 'project',
            //   authority:[3],
            //   routes: [
            {
              name: '项目拟题',
              path: '/tproject/apply',
              component: './project-t/apply',
              authority: [3],
              icon: 'file-add',
            },
            {
              name: '修改立项申请表',
              path: '/tproject/manage/edit',
              component: './project-t/edit',
              hideInMenu: true,
              authority: [3],
              icon: 'file-add',
            },
            {
              name: '项目详情',
              path: '/tproject/manage/detail',
              component: './common/detail',
              authority: [3],
              hideInMenu: true,
              icon: 'file-add',
            },
            {
              name: '重点项目申请',
              path: '/tproject/manage/key-detail',
              component: './common/key-detail',
              authority: [3],
              hideInMenu: true,
              icon: 'file-add',
            },
            {
              name: '已报项目',
              path: '/tproject/manage',
              component: './project-t/projects',
              authority: [3],
              icon: 'file-done',
            },
            {
              name: '拟题审批',
              path: '/tproject/manage/key-project',
              component: './project-t/key-projects',
              authority: [3],
              icon: 'file-done',
              hideInMenu: true,
            },
            {
              name: '成员审批',
              path: '/tproject/members',
              component: './project-t/members',
              authority: [3],
              icon: 'usergroup-add',
            },
            //   ],
            // },
            // {
            //   path: '/sproject',
            //   name: '项目管理',
            //   icon: 'project',
            //   authority:[1,2],
            //   routes: [
            {
              name: '项目申请',
              path: '/sproject/join/all',
              component: './project-s/join/projects',
              authority: [1, 2],
              icon: 'file-add',
            },
            {
              name: '证书申领',
              path: '/certificate/stu',
              component: './certificate/stu-certificate',
              authority: [1, 2],
              icon: 'file-add',
            },
            {
              name: '项目申请表',
              path: '/sproject/join/all/apply',
              component: './project-s/join/basic-form',
              authority: [1, 2],
              icon: 'file-add',
              hideInMenu: true,
            },
            {
              name: '已选项目',
              path: '/sproject/manage',
              component: './project-s/manage/projects',
              authority: [1, 2],
              icon: 'file-done',
            },
            {
              name: '项目结题',
              path: '/sproject/manage/overproject',
              component: './project-s/manage/overproject',
              authority: [1, 2],
              icon: 'file-done',
              hideInMenu: true,
            },
            {
              name: '重点项目申请',
              path: '/sproject/manage/keyProject',
              component: './project-s/manage/key-project',
              authority: [1, 2],
              icon: 'file-add',
              hideInMenu: true,
            },
            {
              name: '重点项目申请',
              path: '/sproject/manage/key-detail',
              component: './common/key-detail',
              authority: [1, 2],
              icon: 'file-add',
              hideInMenu: true,
            },
            {
              name: '项目详情',
              path: '/sproject/join/all/detail',
              component: './common/detail',
              authority: [1, 2],
              hideInMenu: true,
              icon: 'file-add',
            },
            {
              name: '项目详情',
              path: '/sproject/manage/detail',
              component: './common/detail',
              authority: [1, 2],
              hideInMenu: true,
              icon: 'file-add',
            },
            // {
            //   name: '证书申领',
            //   path: '/sproject/certificate',
            //   component: './project-s/certificate',
            //   authority:[1,2],
            //   icon: 'read'
            // },
            //   ],
            // },
            // {
            //   path: '/project/auth',
            //   name: '项目审批',
            //   icon: 'diff',
            //   routes: [
            {
              name: '实验室审批',
              path: '/auth/lab',
              authority: [4],
              routes: [
                {
                  name: '拟题审批',
                  path: '/auth/lab/pre-project',
                  component: './management/lab/pre-projects',
                  icon: 'solution',
                },
                {
                  name: '普通项目审批',
                  path: '/auth/lab/project',
                  component: './management/lab/projects',
                  icon: 'solution',
                },
                {
                  name: '重点项目审批',
                  path: '/auth/lab/key-project',
                  component: './management/lab/key-projects',
                  icon: 'solution',
                },
                {
                  name: '项目详情',
                  path: '/auth/lab/project/detail',
                  component: './common/detail',
                  hideInMenu: true,
                  icon: 'team',
                },
                {
                  name: '项目详情',
                  path: '/auth/lab/pre-project/detail',
                  component: './common/detail',
                  hideInMenu: true,
                  icon: 'team',
                },
                {
                  name: '重点项目详情',
                  path: '/auth/lab/key-project/detail',
                  component: './common/key-detail',
                  hideInMenu: true,
                  icon: 'team',
                },
              ],
              icon: 'experiment',
            },
            {
              name: '时限设置',
              authority: [4],
              path: '/auth/second/settings',
              component: './management/second/settings',
              icon: 'setting',
            },
            {
              name: '二级单位审批',
              path: '/auth/second',
              authority: [5],
              routes: [
                {
                  name: '普通项目审批',
                  path: '/auth/second/project',
                  component: './management/second/projects',
                  icon: 'solution',
                },

                {
                  name: '重点项目审批',
                  path: '/auth/second/key-project',
                  component: './management/second/key-projects',
                  icon: 'solution',
                },
                {
                  name: '项目详情',
                  path: '/auth/second/project/detail',
                  component: './common/detail',
                  hideInMenu: true,
                  icon: 'team',
                },
                {
                  name: '重点项目详情',
                  path: '/auth/second/key-project/detail',
                  component: './common/key-detail',
                  hideInMenu: true,
                  icon: 'team',
                },
              ],
              icon: 'team',
            },
            // {
            //   name:'test',
            //   path:'test',
            //   component:'./common/test'
            // },
            {
              name: '职能部门审批',
              path: 'auth/equipment',
              authority: [6, 7],
              routes: [
                {
                  name: '普通项目审批',
                  path: '/auth/equipment/project',
                  component: './management/equipment/projects',
                  icon: 'solution',
                },
                {
                  name: '重点项目审批',
                  path: '/auth/equipment/key-project',
                  component: './management/equipment/key-projects',
                  icon: 'solution',
                },
                {
                  name: '项目详情',
                  path: '/auth/equipment/project/detail',
                  component: './common/detail',
                  hideInMenu: true,
                  icon: 'team',
                },
                {
                  name: '重点项目详情',
                  path: '/auth/equipment/key-project/detail',
                  component: './common/key-detail',
                  hideInMenu: true,
                  icon: 'team',
                },
              ],
              icon: 'reconciliation',
            },
            //   ],
            // },

            {
              path: '/midtermcheck',
              name: '中期项目管理',
              routes: [
                {
                  name: '普通项目审批',
                  path: '/midtermcheck/project',
                  component: './midtermcheck',
                  icon: 'solution',
                },
                {
                  name: '重点项目审批',
                  path: '/midtermcheck/key-project',
                  component: './midtermcheck/project',
                  icon: 'solution',
                },
                {
                  name: '普通退回项目复核',
                  path: '/midtermcheck/return-project',
                  component: './midtermcheck/hitproject',
                  icon: 'solution',
                },
                {
                  name: '重点退回项目复核',
                  path: '/midtermcheck/return-keyproject',
                  component: './midtermcheck/hitkeyproject',
                  icon: 'solution',
                },
                {
                  name: '项目详情',
                  path: '/midtermcheck/project/detail',
                  component: './common/detail',
                  hideInMenu: true,
                  icon: 'team',
                },
                {
                  name: '重点项目详情',
                  path: '/midtermcheck/key-project/detail',
                  component: './common/key-detail',
                  hideInMenu: true,
                  icon: 'team',
                },
              ],
              icon: 'solution',
              authority: [6, 7],
            },
            {
              name: '结题总览',
              path: '/overall',
              routes: [
                {
                  name: '普通项目学院结题已通过',
                  path: '/overall/college',
                  component: './overwaitmark/college',
                  icon: 'solution',
                },
                {
                  name: '普通项目学院项目详情',
                  path: '/overall/college/detail',
                  component: './project-s/manage/overproject',
                  hideInMenu: true,
                  icon: 'team',
                },
                {
                  name: '普通项目职能部门结题已通过',
                  path: '/overall/function',
                  component: './overwaitmark/function',
                  icon: 'solution',
                },
                {
                  name: '普通项目部门项目详情',
                  path: '/overall/function/detail',
                  component: './project-s/manage/overproject',
                  hideInMenu: true,
                  icon: 'team',
                },
                {
                  name: '重点项目学院结题已通过',
                  path: '/overall/keycollege',
                  component: './overwaitmark/keycollege',
                  icon: 'solution',
                },
                {
                  name: '重点项目学院项目详情',
                  path: '/overall/keycollege/detail',
                  component: './project-s/manage/overproject',
                  hideInMenu: true,
                  icon: 'team',
                },
                {
                  name: '重点项目职能部门结题已通过',
                  path: '/overall/keyfunction',
                  component: './overwaitmark/keyfunction',
                  icon: 'solution',
                },
                {
                  name: '重点项目职能部门项目详情',
                  path: '/overall/keyfunction/detail',
                  component: './project-s/manage/overproject',
                  hideInMenu: true,
                  icon: 'team',
                },
              ],
              icon: 'safety-certificate',
              authority: [4, 5, 9],
            },
            {
              name: '结题总览',
              path: '/overfunctionall',
              routes: [
                {
                  name: '已结题重点项目',
                  path: '/overfunctionall/key',
                  component: './overall/key',
                  icon: 'solution',
                },
                {
                  name: '重点项目详情',
                  path: '/overfunctionall/key/detail',
                  component: './project-s/manage/overproject',
                  hideInMenu: true,
                  icon: 'team',
                },
                {
                  name: '已结题普通项目',
                  path: '/overfunctionall/normal',
                  component: './overall/normal',
                  icon: 'solution',
                },
                {
                  name: '普通项目详情',
                  path: '/overfunctionall/normal/detail',
                  component: './project-s/manage/overproject',
                  hideInMenu: true,
                  icon: 'team',
                },
              ],
              icon: 'safety-certificate',
              authority: [6],
            },
            {
              path: '/overcheck',
              name: '结题项目管理',
              routes: [
                {
                  name: '普通项目审批',
                  path: '/overcheck/project',
                  component: './overcheck/project',
                  icon: 'solution',
                },
                {
                  name: '重点项目审批',
                  path: '/overcheck/key-project',
                  component: './overcheck/keyproject',
                  icon: 'solution',
                },
                {
                  name: '普通退回项目复核',
                  path: '/overcheck/return-project',
                  component: './overcheck/project-return',
                  icon: 'solution',
                },
                {
                  name: '重点退回项目复核',
                  path: '/overcheck/return-keyproject',
                  component: './overcheck/keyproject-return',
                  icon: 'solution',
                },
                {
                  name: '普通项目详情',
                  path: '/overcheck/project/detail',
                  component: './project-s/manage/overproject',
                  hideInMenu: true,
                  icon: 'team',
                },
                {
                  name: '重点项目详情',
                  path: '/overcheck/key-project/detail',
                  component: './project-s/manage/overproject',
                  hideInMenu: true,
                  icon: 'team',
                },
              ],
              icon: 'solution',
              authority: [9],
            },
            {
              path: '/overcheckfunction',
              name: '结题项目管理',
              routes: [
                {
                  name: '普通项目审批',
                  path: '/overcheckfunction/project',
                  component: './overcheck/project-f',
                  icon: 'solution',
                },
                {
                  name: '重点项目审批',
                  path: '/overcheckfunction/keyproject',
                  component: './overcheck/keyproject-f',
                  icon: 'solution',
                },
                {
                  name: '普通退回项目复核',
                  path: '/overcheckfunction/return-project',
                  component: './overcheck/project-f-return',
                  icon: 'solution',
                },
                {
                  name: '重点退回项目复核',
                  path: '/overcheckfunction/return-keyproject',
                  component: './overcheck/keyproject-f-return',
                  icon: 'solution',
                },
                {
                  name: '普通项目详情',
                  path: '/overcheckfunction/project/detail',
                  component: './project-s/manage/overproject',
                  hideInMenu: true,
                  icon: 'team',
                },
                {
                  name: '重点项目详情',
                  path: '/overcheckfunction/keyproject/detail',
                  component: './project-s/manage/overproject',
                  hideInMenu: true,
                  icon: 'team',
                },
              ],
              icon: 'solution',
              authority: [6],
            },
            {
              name: '内定项目管理',
              path: '/inner',
              authority: [6, 7],
              routes: [
                {
                  name: '内定项目申请',
                  path: '/inner/project',
                  component: './innerproject/normal',
                  icon: 'solution',
                },
                {
                  name: '已申请项目',
                  path: '/inner/all',
                  component: './innerproject/readyproject',
                  icon: 'solution',
                },
                {
                  name: '成员管理',
                  path: '/inner/member',
                  component: './innerproject/member',
                  icon: 'solution',
                },
                {
                  name: '重点项目详情',
                  path: '/inner/all/detail',
                  component: './common/key-detail',
                  hideInMenu: true,
                  icon: 'team',
                },
              ],
              icon: 'reconciliation',
            },
            {
              path: '/funds',
              name: '资金管理',
              component: './funds',
              icon: 'account-book',
              authority: [6, 7],
            },
            {
              path: '/achievement',
              name: '成果统计',
              component: './achievement',
              icon: 'bar-chart',
              authority: [6, 7],
            },
            {
              path: '/certificate/tec',
              name: '证书管理',
              component: './certificate/tec-certificate',
              icon: 'file-add',
              authority: [6, 7],
            },
            {
              path: '/selfInformation/edit',
              name: '完善个人信息',
              component: './user-information',
              hideInMenu: true,
              icon: 'user',
            },
            {
              path: '/account/message',
              name: '消息中心',
              component: './message',
              hideInMenu: true,
              icon: 'message',
            },
            // {
            //   path: '/settings',
            //   name: '系统设置',
            //   icon: 'setting',
            //   authority:[5,6,7],
            //   routes: [
            {
              name: '基本设置',
              path: '/settings/basic',
              component: './settings/basic',
              icon: 'profile',
              authority: [6, 7],
            },
            {
              name: '权限设置',
              path: '/settings/authority',
              component: './settings/authority',
              icon: 'safety-certificate',
              authority: [6, 7],
            },
            {
              name: '公告管理',
              path: '/settings/announcement',
              component: './settings/announcement/announcements',
              icon: 'file-text',
              authority: [4, 6, 7],
            },
            {
              name: '新增公告',
              path: '/settings/announcement/append',
              component: './settings/announcement/append',
              icon: 'file-text',
              hideInMenu: true,
              authority: [4, 6, 7],
            },
            {
              name: '公告详情',
              path: '/settings/announcement/detail',
              component: './settings/announcement/detail',
              icon: 'file-text',
              hideInMenu: true,
              authority: [4, 6, 7],
            },
            //   ],
            // },
            // {
            //   path: '/dashboard',
            //   name: 'dashboard',
            //   icon: 'dashboard',
            //   routes: [
            //     {
            //       name: 'analysis',
            //       path: '/dashboard/analysis',
            //       component: './dashboard/analysis',
            //     },
            //     {
            //       name: 'monitor',
            //       path: '/dashboard/monitor',
            //       component: './dashboard/monitor',
            //     },
            //     {
            //       name: 'workplace',
            //       path: '/dashboard/workplace',
            //       component: './dashboard/workplace',
            //     },
            //   ],
            // },
            // {
            //   path: '/form',
            //   icon: 'form',
            //   name: 'form',
            //   routes: [
            //     {
            //       name: 'basic-form',
            //       path: '/form/basic-form',
            //       component: './form/basic-form',
            //     },
            //     {
            //       name: 'step-form',
            //       path: '/form/step-form',
            //       component: './form/step-form',
            //     },
            //     {
            //       name: 'advanced-form',
            //       path: '/form/advanced-form',
            //       component: './form/advanced-form',
            //     },
            //   ],
            // },
            // {
            //   path: '/list',
            //   icon: 'table',
            //   name: 'list',
            //   routes: [
            //     {
            //       path: '/list/search',
            //       name: 'search-list',
            //       component: './list/search',
            //       routes: [
            //         {
            //           path: '/list/search',
            //           redirect: '/list/search/articles',
            //         },
            //         {
            //           name: 'articles',
            //           path: '/list/search/articles',
            //           component: './list/search/articles',
            //         },
            //         {
            //           name: 'project',
            //           path: '/list/search/project',
            //           component: './list/search/project',
            //         },
            //         {
            //           name: 'applications',
            //           path: '/list/search/applications',
            //           component: './list/search/applications',
            //         },
            //       ],
            //     },
            //     {
            //       name: 'table-list',
            //       path: '/list/table-list',
            //       component: './list/table-list',
            //     },
            //     {
            //       name: 'basic-list',
            //       path: '/list/basic-list',
            //       component: './list/basic-list',
            //     },
            //     {
            //       name: 'card-list',
            //       path: '/list/card-list',
            //       component: './list/card-list',
            //     },
            //   ],
            // },
            // {
            //   path: '/profile',
            //   name: 'profile',
            //   icon: 'profile',
            //   routes: [
            //     {
            //       name: 'basic',
            //       path: '/profile/basic',
            //       component: './profile/basic',
            //     },
            //     {
            //       name: 'advanced',
            //       path: '/profile/advanced',
            //       component: './profile/advanced',
            //     },
            //   ],
            // },
            // {
            //   name: 'result',
            //   icon: 'check-circle-o',
            //   path: '/result',
            //   routes: [
            //     {
            //       name: 'success',
            //       path: '/result/success',
            //       component: './result/success',
            //     },
            //     {
            //       name: 'fail',
            //       path: '/result/fail',
            //       component: './result/fail',
            //     },
            //   ],
            // },
            // {
            //   name: 'exception',
            //   icon: 'warning',
            //   path: '/exception',
            //   routes: [
            //     {
            //       name: '403',
            //       path: '/exception/403',
            //       component: './exception/403',
            //     },
            //     {
            //       name: '404',
            //       path: '/exception/404',
            //       component: './exception/404',
            //     },
            //     {
            //       name: '500',
            //       path: '/exception/500',
            //       component: './exception/500',
            //     },
            //   ],
            // },
            // {
            //   name: 'account',
            //   icon: 'user',
            //   path: '/account',
            //   routes: [
            //     {
            //       name: 'center',
            //       path: '/account/center',
            //       component: './account/center',
            //     },
            //     {
            //       name: 'settings',
            //       path: '/account/settings',
            //       component: './account/settings',
            //     },
            //   ],
            // },
            // {
            //   name: 'editor',
            //   icon: 'highlight',
            //   path: '/editor',
            //   routes: [
            //     {
            //       name: 'flow',
            //       path: '/editor/flow',
            //       component: './editor/flow',
            //     },
            //     {
            //       name: 'mind',
            //       path: '/editor/mind',
            //       component: './editor/mind',
            //     },
            //     {
            //       name: 'koni',
            //       path: '/editor/koni',
            //       component: './editor/koni',
            //     },
            //   ],
            // },
            {
              path: '/',
              redirect: '/dashboard/analysis',
            },
            {
              component: '404',
            },
          ],
        },
      ],
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': primaryColor,
  },
  define: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
      ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '', // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, _, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },
  chainWebpack: webpackPlugin,

  proxy /*: {
    '/anon': {
      target: 'http://47.107.61.232:8666',
      changeOrigin: true,
      //pathRewrite: { '^/server': '' },
    },
    '/user/getMyInfo': {
      target: 'http://47.107.61.232:8666',
      changeOrigin: true,
      //pathRewrite: { '^/server': '' },
    },
    '/project/createApply': {
      target: 'http://47.107.61.232:8666',
      changeOrigin: true,
      //pathRewrite: { '^/server': '' },
    },
  },*/,
};
