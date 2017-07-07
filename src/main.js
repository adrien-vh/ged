// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

require('./vendor/bootstrap/bootstrap.scss')
require('./vendor/bootstrap/ie10-viewport-bug-workaround.css')
require('./vendor/jqcloud/jqcloud.scss')
require('./vendor/tokenize/tokenize2.css')
require('./vendor/fileUploader/jquery.fileuploader.css')
require('./styles/styles.scss')
require('font-awesome-webpack')
require('./vendor/jquery/jquery.min.js')
require('./vendor/typeAhead/typeahead.bundle.min.js')
require('./vendor/tokenize/tokenize2.js')
require('./commun.js')

Vue.config.productionTip = false

// setTimeout(function () { $('#message').removeClass('invisible').addClass('visible') }, 500)

U.serverCall('server/isConnected', function (data) {
  if (data.connecte) {
    C.utilisateur.informationsRecuperees = true
    C.utilisateur.loggedIn = true
    C.utilisateur.nom = data.nom
    C.utilisateur.num_utilisateur = data.num_utilisateur
    C.utilisateur.niveau = data.niveau
    C.utilisateur.login = data.login
    C.utilisateur.nbLocks = parseInt(data.nbLocks, 10)
  }
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App },
    data: {
      utilisateur: C.utilisateur
    },
    methods: {
      formatDate: function (date) {
        if (typeof date === 'undefined') {
          return ''
        }
        var infos1 = date.split(' ')
        var infos2 = infos1[0].split('-')
        var infos3 = infos1[1].split(':')
        return infos2[2] + '/' + infos2[1] + '/' + infos2[0] + ' à ' + infos3[0] + 'h' + infos3[1]
      }
    }
  })
})
