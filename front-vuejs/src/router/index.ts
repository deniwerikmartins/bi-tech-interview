import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: import.meta.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/pacientes'
    },
    {
      path: '/pacientes',
      name: 'patients',
      component: () => import('../views/PatientsView.vue')
    },
    {
      path: '/pacientes/novo',
      name: 'patient-create',
      component: () => import('../views/PatientCreateView.vue')
    },
    {
      path: '/pacientes/:id',
      name: 'patient-detail',
      component: () => import('../views/PatientDetailView.vue')
    },
    {
      path: '/pacientes/:id/editar',
      name: 'patient-edit',
      component: () => import('../views/PatientEditView.vue')
    }
  ]
})

export default router
