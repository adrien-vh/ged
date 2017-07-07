import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Accueil from '@/components/Accueil'
import Recherche from '@/components/Recherche'
import Tags from '@/components/Tags'
import Arborescence from '@/components/Arborescence'
import Ajout from '@/components/Ajout'
import Config from '@/components/Config'
import Doc from '@/components/Doc'
import LockedDocs from '@/components/LockedDocs'

Vue.use(Router)

var router = new Router({
  routes: [
    { path: '/login', name: 'Login', component: Login },
    { path: '/locks', component: LockedDocs },
    { path: '/accueil', component: Accueil },
    { path: '/recherche', component: Recherche },
    { path: '/recherche/:requeteUrl', component: Recherche, props: true },
    { path: '/tags', component: Tags },
    { path: '/tags/:numTags', component: Tags, props: true },
    { path: '/arborescence', component: Arborescence },
    { path: '/ajout', component: Ajout },
    { path: '/configuration', component: Config },
    { path: '/doc/:num_doc', component: Doc, props: true },
    { path: '*', redirect: '/accueil' }
  ],
  linkActiveClass: 'active'
})

router.beforeEach(function (to, from, next) {
  if (!C.utilisateur.loggedIn && to.path !== '/login') {
    C.pathDemande = to.path
    next('/login')
  } else if (C.utilisateur.loggedIn && to.path === '/login') {
    next('/')
  } else {
    next()
  }
})

export default router

/*         { path: '/login', component: compLogin },
        { path: '/doc/:num_doc', component: compDoc },
        { path: '/recherche', component: compRecherche },
        { path: '/tags', component: compTags },
        { path: '/arborescence', component: compArborescence },
        { path: '/ajout', component: compAjout },
        { path: '/configuration', component: compConfiguration },
        { path: '*', redirect: '/recherche' } */
