<template>
  <div>
    <div id="titreAccueil">g<span>ed</span></div>
    <div id="contLoginForm">
      <h2>Connexion</h2>
      <form id="loginForm" v-on:submit.prevent="onSubmit" action="foo">

        <div class="input-group" v-bind:class="{ 'has-error': !loginValide && !loginEnCours }">
          <div class="input-group-addon"><i class="fa fa-user" aria-hidden="true"></i></div>
          <input type="text" id="inputEmail" class="form-control" placeholder="Login" required autofocus v-model="login">
        </div>
        <div class="input-group" v-bind:class="{ 'has-error': !loginValide && !loginEnCours }">
          <div class="input-group-addon"><i class="fa fa-key" aria-hidden="true"></i></div>
          <input type="password" id="inputPassword" class="form-control" placeholder="Mot de passe" required v-model="password">
        </div>
        <button 
          class="btn btn-lg btn-primary btn-block" type="submit" 
          v-on:click="onSubmit" 
          v-bind:class="{ 'disabled': loginEnCours }">
          S'identifier
        </button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      login: '',
      password: '',
      loginEnCours: false,
      loginValide: true
    }
  },
  methods: {
    onSubmit: function () {
      var me = this

      if (!me.loginEnCours) {
        me.loginEnCours = true
        U.serverCall(
          'server/auth',
          { login: me.login, password: me.password },
          function (data) {
            if (data.loginValide) {
              C.utilisateur.loggedIn = true
              C.utilisateur.nom = data.nom
              C.utilisateur.num_utilisateur = data.num_utilisateur
              me.$router.push('/')
            } else {
              me.loginValide = false
            }
            me.loginEnCours = false
          }
        )
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
