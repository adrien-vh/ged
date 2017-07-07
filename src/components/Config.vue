<template>
  <div class="col-md-6">
    <ul class="nav nav-pills mb-5">
      <li role="presentation" v-bind:class="{ 'active': pageActive == 1 }"><a href="#" v-on:click.prevent="pageActive = 1">Utilisateur</a></li>
      <li role="presentation" v-bind:class="{ 'active': pageActive == 2 }"><a href="#" v-on:click.prevent="pageActive = 2">Types de documents et catégories liées</a></li>
      <li role="presentation" v-bind:class="{ 'active': pageActive == 3 }"><a href="#" v-on:click.prevent="pageActive = 3">Catégories</a></li>
    </ul>
    <div v-show="pageActive == 1">
      <table class="table table-condensed">
        <thead>
          <tr>
            <th>Utilisateur</th>
            <th style="width: 150px;">Droit</th>
            <th style="width: 150px;"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="utilisateur in utilisateurs">
            <td>{{ utilisateur.nom }}</td>
            <td>
              <button class="btn btn-info btn-sm btn-block"
              v-if="utilisateur.niveau == 0" 
              v-on:click="majUtilisateur(utilisateur, $event)">
                Lecteur
              </button>
              <button class="btn btn-warning btn-sm btn-block"
              v-if="utilisateur.niveau == 1"
              v-on:click="majUtilisateur(utilisateur, $event)">
                Rédacteur
              </button>
              <button class="btn btn-danger btn-sm btn-block"
              v-if="utilisateur.niveau == 2"
              v-on:click="majUtilisateur(utilisateur, $event)">
                Admin
              </button>
            </td>
            <td>
              <button type="button" class="btn btn-link texteRouge" v-on:click="supprimeUtilisateur(utilisateur)">
                <i class="fa fa-times" aria-hidden="true"></i> Supprimer
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <label>Nouvel utilisateur</label>
      <inUtilisateur v-on:input="submitUtilisateur" v-model="nouvelUtilisateur" inactifs></inUtilisateur>
    </div>
    <div v-show="pageActive == 2">
      <table class="table table-condensed">
        <thead>
          <tr>
            <th>Types</th>
            <th>Catégories</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="type in types">
            <td>{{ type.nom }}</td>
            <td>
              <div v-for="categorie in type.categories">{{ categorie }}</div>

              <form class="form-inline">
                <select class="form-control input-sm" v-model="type.nouvelleCategorie">
                  <option v-for="categorie in categories":value="categorie.num_categorie">{{ categorie.nom }}</option>
                </select>
                <a href="#" v-on:click.prevent="submitCategorieType(type, $event)"><i class="fa fa-plus-circle fa-lg" aria-hidden="true"></i></a>
              </form>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <form class="form-inline">
                <input 
                class="form-control input-sm"
                type="text"
                placeholder="Nouveau type"
                v-model="nouveauType"
                v-on:keyup.enter="submitType"
                >
                <a href="" @click.prevent="submitType"><i class="fa fa-plus-circle fa-lg" aria-hidden="true"></i></a>
              </form>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-show="pageActive == 3">
      <div class="ml-1" v-for="categorie in categories">
        {{ categorie.nom }}
      </div>
      <br>
      <form class="form-inline">
        <input 
        class="form-control input-sm"
        type="text"
        placeholder="Nouvelle catégorie"
        v-model="nouvelleCategorie"
        v-on:keyup.enter="submitCategorie"
        >
        <a href="" v-on:click.prevent="submitCategorie"><i class="fa fa-plus-circle fa-lg" aria-hidden="true"></i></a>
      </form>
    </div>
  </div>
</template>

<script>
  import inUtilisateur from '@/components/inUtilisateur'
  export default {
    components: { inUtilisateur },
    data: function () {
      return {
        categories: [],
        types: [],
        nouvelleCategorie: '',
        nouveauType: '',
        nouvelUtilisateur: '',
        utilisateurs: [],
        pageActive: 1
      }
    },
    methods: {
      majUtilisateur: function (utilisateur, e) {
        e.preventDefault()
        utilisateur.niveau += 1
        utilisateur.niveau %= 3
        U.serverCall('server/majUtilisateur/' + utilisateur.login + '/' + utilisateur.niveau)
      },
      supprimeUtilisateur: function (utilisateur) {
        var me = this
        U.serverCall('server/supprimeUtilisateur/' + utilisateur.login, function () {
          U.serverCall('server/utilisateursActifs', function (data) { me.utilisateurs = data.utilisateurs })
        })
      },
      loadTypes: function (data) {
        var i
        for (i = 0; i < data.length; i += 1) {
          data[i].categories = data[i].categories.split(',')
          if (data[i].categories.length === 1 && data[i].categories[0] === '') {
            data[i].categories = []
          }
        }
        this.types = data
      },
      submitCategorie: function () {
        var me = this
        U.serverCall('server/ajoutCategorie/' + this.nouvelleCategorie, function () {
          me.nouvelleCategorie = ''
          U.serverCall('server/categories', function (data) { me.categories = data.categories })
        })
      },
      submitType: function () {
        var me = this
        U.serverCall('server/ajoutType/' + this.nouveauType, function () {
          me.nouveauType = ''
          U.serverCall('server/types', function (data) { me.loadTypes(data.types) })
        })
      },
      submitCategorieType: function (type, e) {
        e.preventDefault()
        var me = this
        U.serverCall('server/ajoutCategorieType/' + type.num_tag + '/' + type.nouvelleCategorie, function () {
          U.serverCall('server/types', function (data) { me.loadTypes(data.types) })
        })
      },
      submitUtilisateur: function () {
        var me = this
        U.serverCall('server/ajoutUtilisateur/' + this.nouvelUtilisateur, function () {
          U.serverCall('server/utilisateursActifs', function (data) { me.utilisateurs = data.utilisateurs })
          me.nouvelUtilisateur = ''
        })
      }
    },
    mounted: function () {
      var me = this
      U.serverCall('server/categories', function (data) { me.categories = data.categories })
      U.serverCall('server/types', function (data) { me.loadTypes(data.types) })
      U.serverCall('server/utilisateursActifs', function (data) { me.utilisateurs = data.utilisateurs })
    }
  }
</script>

<style scoped lang="scss">
</style>
