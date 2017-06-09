<template>
  <div>
    <form>
      <div class="row">
        <div class="form-group col-md-3" v-bind:class="{ 'has-error': !typeValide }">
          <label>Type</label>
          <select class="form-control" v-model="type" @change="chargeCategories">
            <option value="">Choisir un type</option>
            <option v-for="leType in types" :value="leType.num_tag">{{ leType.mot }}</option>
          </select>
        </div>
        <div v-for="categorie in categories" class="form-group col-md-3" v-bind:class="{ 'has-error': !categorie.estValide }">
          <label>{{ categorie.nom }}</label>
          <inTagCategorie :num_categorie="categorie.num_categorie" v-model="categorie.valeurChoisie"></inTagCategorie>
        </div>
      </div>
      <div class="form-group" v-bind:class="{ 'has-error': !titreValide }" >
        <label>Titre</label>
        <input type="text" class="form-control" placeholder="Titre..." v-model="titre" >
      </div>
      <div class="form-group">
        <label>Tags</label>
        <inTags v-model="tags"></inTags>
      </div>
      <div class="btn-group mb-5" role="group">
        <button type="button" class="btn btn-default" v-bind:class="{ 'active': !isWiki }" v-on:click="isWiki = false">Fichier</button>
        <button type="button" class="btn btn-default" v-bind:class="{ 'active': isWiki }" v-on:click="isWiki = true">Wiki</button>
      </div>
      <div v-show="!isWiki">
        <div>
          <inFichier v-model="inFichier" :valide="fichierValide"></inFichier>
        </div>
      </div>
      <div v-show="isWiki">
        <div>
          <ckeditor v-model="inWiki"></ckeditor>
        </div>
      </div>
      <button type="button" class="btn btn-primary btn-lg center-block mt-5" v-on:click="sauve"><i class="fa fa-floppy-o" aria-hidden="true"></i> Enregistrer</button>
    </form>
  </div>
</template>

<script>

import inTags from '@/components/inTags'
import inFichier from '@/components/inFichier'
import inTagCategorie from '@/components/inTagCategorie'
import Ckeditor from 'vue-ckeditor2'

export default {
  components: { inTags, inFichier, Ckeditor, inTagCategorie },
  methods: {
    chargeCategories: function () {
      var me = this
      U.serverCall('server/listeCategoriesType.php?num_tagType=' + me.type, function (data) {
        me.categories = $.map(data, function (cat) { return $.extend({valeurChoisie: '', estValide: true}, cat) })
      })
    },
    valideForm: function () {
      var i
      var categoriesValides = true

      this.titreValide = (this.titre.length > 3)
      this.typeValide = (this.type !== '')

      for (i = 0; i < this.categories.length; i += 1) {
        this.categories[i].estValide = this.categories[i].valeurChoisie !== ''
        categoriesValides = categoriesValides && this.categories[i].estValide
      }

      if (!this.isWiki) {
        if (typeof this.inFichier.file !== 'undefined') {
          this.fichierValide = this.inFichier.file !== ''
        } else {
          this.fichierValide = false
        }
      } else {
        this.fichierValide = true
      }

      return this.titreValide && this.typeValide && categoriesValides && this.fichierValide
    },
    sauve: function () {
      if (this.valideForm()) {
        var infos = {}
        var i
        infos.num_tagType = this.type
        infos.categories = []
        for (i = 0; i < this.categories.length; i += 1) {
          infos.categories[i] = {}
          infos.categories[i].num_categorie = this.categories[i].num_categorie
          infos.categories[i].valeurChoisie = this.categories[i].valeurChoisie
        }
        infos.titre = this.titre
        infos.tags = this.tags
        infos.isWiki = this.isWiki
        if (this.isWiki) {
          infos.inWiki = this.inWiki
        } else {
          infos.inFichier = this.inFichier
        }

        U.serverCall('server/ajout.php', infos)
      }
    }
  },
  data: function () {
    return {
      isWiki: false,
      inWiki: '',
      inFichier: {},
      types: [],
      type: '',
      categories: [],
      titre: '',
      tags: '',
      titreValide: true,
      typeValide: true,
      fichierValide: true
    }
  },
  mounted: function () {
    var me = this
    U.serverCall('server/listeTags.php?num_categorie=0', function (data) { me.types = data })
  }
}
</script>

<style scoped lang="scss">
</style>
