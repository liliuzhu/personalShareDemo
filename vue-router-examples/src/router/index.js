import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/views/index'
import View1 from '@/views/view1'
import View1Children from '@/views/view1/View1Children'
import View2 from '@/views/view2'
import View2Children1 from '@/views/view2/View2Children1'
import View2Children2 from '@/views/view2/View2Children2'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index,
      mate: {
        title: '首页'
      }
    },
    {
      path: '/view1',
      name: 'view1',
      component: View1,
      mate: {
        title: '页面1'
      },
      children: [
        {
          path: 'view1Children',
          name: 'View1Children',
          component: View1Children,
          mate: {
            title: '页面1子路由'
          }
        }
      ]
    },
    {
      path: '/view2',
      name: 'view2',
      component: View2,
      mate: {
        title: '页面2'
      },
      children: [
        {
          path: 'view2Children',
          name: 'View2Children',
          components: {
            default: View2Children1,
            view2: View2Children2
          },
          mate: {
            title: '页面2子路由'
          }
        }
      ]
    },
    {path: '*', redirect: {path: '/'}}
  ]
})
