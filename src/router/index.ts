import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/products',
    },
    {
      path: '/products',
      name: 'product-list',
      component: () => import('../views/ProductList.vue'),
      meta: { title: 'Product Management', breadcrumb: 'Products' },
    },
    {
      path: '/products/create',
      name: 'product-create',
      component: () => import('../views/ProductCreate.vue'),
      meta: { title: 'Create Product', breadcrumb: 'Create Product' },
    },
    {
      path: '/products/:id/edit',
      name: 'product-edit',
      component: () => import('../views/ProductEdit.vue'),
      meta: { 
        title: 'Edit Product', 
        breadcrumb: 'Edit Product',
        parentPath: '/products'
      },
    },
  ],
})

export default router
