<template>
  <div id="gedInstance" v-bind:class="{ 'gris': utilisateur.loggedIn }">
    <nav class="navbar navbar-inverse navbar-fixed-top" v-show="utilisateur.loggedIn">
      <div class="container-fluid">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="#">Ged</a>
        </div>
        <div id="navbar" class="collapse navbar-collapse">
          <ul class="nav navbar-nav">
            <router-link tag="li" to="/recherche"><a>Recherche</a></router-link>
            <router-link tag="li" to="/tags"><a>Tags</a></router-link>
            <!-- <router-link tag="li" to="/arborescence"><a>Arborescence</a></router-link> -->
            <router-link tag="li" to="/ajout"><a>Ajout</a></router-link>
            <router-link tag="li" to="/configuration"><a>Configuration</a></router-link>
          </ul>
          <ul class="nav navbar-nav navbar-right">
            <li><a>{{ utilisateur.nom }}</a></li>
            <li><a href="#" v-on:click="onDisconnect">[Déconnexion]</a></li>
          </ul>
        </div>
      </div>
    </nav>
    <div class="container-fluid">
      <div class="row" v-bind:class="{ 'col-md-6': utilisateur.loggedIn && $router.currentRoute.path.substr(0,4) != '/doc' }">
        <div class="contenu">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      utilisateur: C.utilisateur
    }
  },
  methods: {
    onDisconnect: function () {
      U.serverCall('server/disconnect')
      C.utilisateur.loggedIn = false
      this.$router.push('/login')
    }
  }
}
</script>

<style>
</style>
