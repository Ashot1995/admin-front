import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index';
import Auth from '../pages/Auth'
import AdminAdd from '../pages/admin/AdminAdd'
import AdminEdit from '../pages/admin/AdminEdit'
import AdminList from '../pages/admin/AdminList'
import ClientAdd from '../pages/client/ClientAdd'
import ClientEdit from '../pages/client/ClientEdit'
import ClientList from '../pages/client/ClientList'
import LayerAdd from '../pages/layer/LayerAdd'
import LayerEdit from '../pages/layer/LayerEdit'
import LayerList from '../pages/layer/LayerList'
import FacilityAdd from '../pages/logistic/FacilityAdd'
import FacilityEdit from '../pages/logistic/FacilityEdit'
import FacilityList from '../pages/logistic/FacilityList'
import FacilityTypeAdd from '../pages/logistic/FacilityTypeAdd'
import FacilityTypeEdit from '../pages/logistic/FacilityTypeEdit'
import FacilityTypeList from '../pages/logistic/FacilityTypeList'
import TradeFacilityList from '../pages/logistic/trade/List'
import TradeFacilityEdit from '../pages/logistic/trade/Edit'

Vue.use(VueRouter);

const isAuthorized = (to, from, next) => {
    if(store.getters['Auth/isAuthorized']) {
        next();
    } else {
        next({name: 'Auth'});
    }
};

const routes = [
    {
        path: '/',
        name: 'Dashboard',
        beforeEnter: isAuthorized
    },
    {
        path: '/auth',
        name: 'Auth',
        component: Auth
    },
    {
        path: '/admin',
        name: 'AdminList',
        component: AdminList,
        beforeEnter: isAuthorized
    },
    {
        path: '/admin/add',
        name: 'AdminAdd',
        component: AdminAdd,
        beforeEnter: isAuthorized
    },
    {
        path: '/admin/:id',
        name: 'AdminEdit',
        component: AdminEdit,
        beforeEnter: isAuthorized
    },
    {
        path: '/client',
        name: 'ClientList',
        component: ClientList,
        beforeEnter: isAuthorized
    },
    {
        path: '/client/add',
        name: 'ClientAdd',
        component: ClientAdd,
        beforeEnter: isAuthorized
    },
    {
        path: '/client/:id',
        name: 'ClientEdit',
        component: ClientEdit,
        beforeEnter: isAuthorized
    },
    {
        path: '/logistic/facility',
        name: 'LogisticFacilityList',
        component: FacilityList,
        beforeEnter: isAuthorized
    },
    {
        path: '/logistic/facility/add',
        name: 'LogisticFacilityAdd',
        component: FacilityAdd,
        beforeEnter: isAuthorized
    },
    {
        path: '/logistic/facility/:id',
        name: 'LogisticFacilityEdit',
        component: FacilityEdit,
        beforeEnter: isAuthorized
    },
    {
        path: '/logistic/facility-type',
        name: 'LogisticFacilityTypeList',
        component: FacilityTypeList,
        beforeEnter: isAuthorized
    },
    {
        path: '/logistic/facility-type/add',
        name: 'LogisticFacilityTypeAdd',
        component: FacilityTypeAdd,
        beforeEnter: isAuthorized
    },
    {
        path: '/logistic/facility-type/:id',
        name: 'LogisticFacilityTypeEdit',
        component: FacilityTypeEdit,
        beforeEnter: isAuthorized
    },
    {
        path: '/trade/facility',
        name: 'TradeFacilityList',
        component: TradeFacilityList,
        beforeEnter: isAuthorized
    },
    {
        path: '/trade/facility/add',
        name: 'TradeFacilityAdd',
        component: TradeFacilityEdit,
        beforeEnter: isAuthorized
    },
    {
        path: '/trade/facility/:id',
        name: 'TradeFacilityEdit',
        component: TradeFacilityEdit,
        beforeEnter: isAuthorized
    },
  {
    path: '/layer',
    name: 'LayerList',
    component: LayerList,
    beforeEnter: isAuthorized
  },
  {
    path: '/layer/add',
    name: 'LayerAdd',
    component: LayerAdd,
    beforeEnter: isAuthorized
  },
  {
    path: '/layer/:id',
    name: 'LayerEdit',
    component: LayerEdit,
    beforeEnter: isAuthorized
  }
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

router.beforeEach((to, from, next) => {
    if(store.getters['Auth/isForbidden'])
        store.dispatch('Auth/resetForbidden');
    next();
});

export default router
