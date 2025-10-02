import { createWebHistory, createRouter } from 'vue-router'

import MainPage from '@/pages/MainPage.vue'
import ExchangePage from '@/pages/Exchange.vue'
import HowItWorksPage from '@/pages/HowItWorks.vue'
import PartnersPage from '@/pages/Partners.vue'
import TermsPage from '@/pages/Terms.vue'
import PrivacyPage from '@/pages/Privacy.vue'
import CoockiePage from '@/pages/Coockie.vue'
import GovermentPage from '@/pages/Goverment.vue'
import KycPage from '@/pages/Kyc.vue'
import AboutUsPage from '@/pages/AboutUs.vue'
import VipClientsPage from '@/pages/VipClients.vue'
import OrderPage from '@/pages/Order.vue'

const routes = [
  { path: '/', component: MainPage },
  { path: '/exchange', component: ExchangePage },
  { path: '/docs/how-it-works', component: HowItWorksPage },
  { path: '/for-partners', component: PartnersPage },
  { path: '/terms', component: TermsPage },
  { path: '/privacy-policy', component: PrivacyPage },
  { path: '/cookie-policy', component: CoockiePage },
  { path: '/goverment-requests-guidelines', component: GovermentPage },
  { path: '/kyc', component: KycPage },
  { path: '/about-us', component: AboutUsPage },
  { path: '/vip-clients', component: VipClientsPage },
  { path: '/order/:id', component: OrderPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router