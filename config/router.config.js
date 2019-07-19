export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', name: 'login', component: './User/Login' },
      { path: '/user/register', name: 'register', component: './User/Register' },
      {
        path: '/user/register-result',
        name: 'register.result',
        component: './User/RegisterResult',
      },
      {
        component: '404',
      },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      //  stats
      {
        name: '数据',
        icon: 'profile',
        path: '/stats',
        routes: [
          {
            path: '/stats/data',
            name: '数据统计（新）',
            component: './Stats/Stats',
          },
          {
            path: '/stats/bargain-overview',
            name: '砍价大盘',
            component: './Stats/BargainOverview',
          },
          {
            path: '/stats/bargain-funnel',
            name: '砍价大盘漏斗',
            component: './Stats/BargainFunnel',
          },
          {
            path: '/stats/bargain-shop-funnel',
            name: '砍价商铺漏斗',
            component: './Stats/BargainShopFunnel',
          },
        ],
      },
      // user
      {
        name: '用户',
        icon: 'user',
        path: '/account',
        routes: [
          {
            path: '/account/user-list',
            name: '用户列表',
            component: './Account/UserList',
          },
          {
            path: '/account/user/:id',
            name: '用户详情',
            component: './Account/UserDetail',
            hideInMenu: true,
            routes: [
              {
                id: 'user-detail',
                path: '/account/user/:id/subjects',
                component: './Account/partials/UserSubjectList',
              },
              {
                id: 'user-detail-subjects',
                path: '/account/user/:id/subjects',
                component: './Account/partials/UserSubjectList',
              },
            ],
          },
          {
            path: '/account/shieled-users',
            name: '屏蔽用户',
            component: './Account/ShieldedUsers',
          },
        ],
      },
      {
        name: '主题',
        icon: 'book',
        path: '/subject',
        routes: [
          {
            id: "subject-region-list",
            path: "/subject/region-list",
            name: "热门商圈",
            component: "./Subject/SubjectRegionList"
          },
          {
            id: "create-subject-region",
            path: "/subject/region/create",
            component: "./Subject/SubjectRegion",
            hideInMenu: true
          },
          {
            id: "subject-region",
            path: "/subject/region/:id",
            component: "./Subject/SubjectRegion",
            hideInMenu: true
          },
          {
            name: '首页推送设置',
            path: "/subject/pool-regions",
            component: "./Subject/SubjectPoolRegionList",
          },
          {
            id: "create-subject-pool",
            path: "/subject/pool/create",
            component: "./Subject/SubjectPool",
            hideInMenu: true
          },
        ]
      },
      // dashboard
      { path: '/', redirect: '/dashboard/analysis', authority: ['admin', 'user'] },
      {
        path: '/dashboard',
        name: 'dashboard',
        icon: 'dashboard',
        routes: [
          {
            path: '/dashboard/analysis',
            name: 'analysis',
            component: './Dashboard/Analysis',
          },
          {
            path: '/dashboard/monitor',
            name: 'monitor',
            component: './Dashboard/Monitor',
          },
          {
            path: '/dashboard/workplace',
            name: 'workplace',
            component: './Dashboard/Workplace',
          },
        ],
      },
      // forms
      {
        path: '/form',
        icon: 'form',
        name: 'form',
        routes: [
          {
            path: '/form/basic-form',
            name: 'basicform',
            component: './Forms/BasicForm',
          },
          {
            path: '/form/step-form',
            name: 'stepform',
            component: './Forms/StepForm',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/form/step-form',
                redirect: '/form/step-form/info',
              },
              {
                path: '/form/step-form/info',
                name: 'info',
                component: './Forms/StepForm/Step1',
              },
              {
                path: '/form/step-form/confirm',
                name: 'confirm',
                component: './Forms/StepForm/Step2',
              },
              {
                path: '/form/step-form/result',
                name: 'result',
                component: './Forms/StepForm/Step3',
              },
            ],
          },
          {
            path: '/form/advanced-form',
            name: 'advancedform',
            authority: ['admin'],
            component: './Forms/AdvancedForm',
          },
        ],
      },
      // list
      {
        path: '/list',
        icon: 'table',
        name: 'list',
        routes: [
          {
            path: '/list/table-list',
            name: 'searchtable',
            component: './List/TableList',
          },
          {
            path: '/list/basic-list',
            name: 'basiclist',
            component: './List/BasicList',
          },
          {
            path: '/list/card-list',
            name: 'cardlist',
            component: './List/CardList',
          },
          {
            path: '/list/search',
            name: 'searchlist',
            component: './List/List',
            routes: [
              {
                path: '/list/search',
                redirect: '/list/search/articles',
              },
              {
                path: '/list/search/articles',
                name: 'articles',
                component: './List/Articles',
              },
              {
                path: '/list/search/projects',
                name: 'projects',
                component: './List/Projects',
              },
              {
                path: '/list/search/applications',
                name: 'applications',
                component: './List/Applications',
              },
            ],
          },
        ],
      },
      {
        path: '/profile',
        name: 'profile',
        icon: 'profile',
        routes: [
          // profile
          {
            path: '/profile/basic',
            name: 'basic',
            component: './Profile/BasicProfile',
          },
          {
            path: '/profile/basic/:id',
            name: 'basic',
            hideInMenu: true,
            component: './Profile/BasicProfile',
          },
          {
            path: '/profile/advanced',
            name: 'advanced',
            authority: ['admin'],
            component: './Profile/AdvancedProfile',
          },
        ],
      },
      {
        name: 'result',
        icon: 'check-circle-o',
        path: '/result',
        routes: [
          // result
          {
            path: '/result/success',
            name: 'success',
            component: './Result/Success',
          },
          { path: '/result/fail', name: 'fail', component: './Result/Error' },
        ],
      },
      {
        name: 'exception',
        icon: 'warning',
        path: '/exception',
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            hideInMenu: true,
            component: './Exception/TriggerException',
          },
        ],
      },
      //  editor
      {
        name: 'editor',
        icon: 'highlight',
        path: '/editor',
        routes: [
          {
            path: '/editor/flow',
            name: 'flow',
            component: './Editor/GGEditor/Flow',
          },
          {
            path: '/editor/mind',
            name: 'mind',
            component: './Editor/GGEditor/Mind',
          },
          {
            path: '/editor/koni',
            name: 'koni',
            component: './Editor/GGEditor/Koni',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
