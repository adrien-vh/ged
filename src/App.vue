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
          <a class="navbar-brand" href="#">g<span class="souligne">ed</span></a>
        </div>
        <div id="navbar" class="collapse navbar-collapse">
          <ul class="nav navbar-nav">
            <router-link tag="li" to="/accueil"><a>Accueil</a></router-link>
            <router-link tag="li" to="/recherche"><a>Recherche</a></router-link>
            <router-link tag="li" to="/tags"><a>Tags</a></router-link>
            <router-link tag="li" to="/arborescence"><a>Arborescence</a></router-link>
            <router-link tag="li" to="/ajout" v-show="utilisateur.niveau >= 1"><a>Ajout</a></router-link>
            <router-link tag="li" to="/configuration" v-show="utilisateur.niveau == 2"><a>Configuration</a></router-link>
          </ul>
          <div class="col-sm-3 col-md-3">
            <form class="navbar-form" role="search" @submit.prevent="lanceRecherche">
              <div class="input-group">
                <input type="text" class="form-control" placeholder="Rechercher" name="q" v-model="requete" autofocus>
                <div class="input-group-btn">
                  <button class="btn btn-default" type="submit"><i aria-hidden="true" class="fa fa-search"></i></button>
                </div>
              </div>
            </form>
          </div>
          <ul class="nav navbar-nav navbar-right">
            <li><a href="#/locks"><i class="fa fa-lock" aria-hidden="true"></i> {{ utilisateur.nbLocks }}</a></li>
            <li><a>{{ utilisateur.nom }}</a></li>
            <li><a href="#" v-on:click="onDisconnect">[Déconnexion]</a></li>
          </ul>
        </div>
      </div>
    </nav>
    <div class="container-fluid contenu">
      <div class="row">
          <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      utilisateur: C.utilisateur,
      requete: ''
    }
  },
  methods: {
    onDisconnect: function () {
      U.serverCall('server/disconnect')
      C.utilisateur.loggedIn = false
      this.$router.push('/login')
    },
    lanceRecherche: function () {
      this.$router.push('/recherche/' + this.requete)
    }
  }
}
</script>

<style>
</style>
