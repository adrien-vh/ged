<template>
  <div>
    <div class="row">
      <div class="form-group col-md-3" v-bind:class="{ 'has-error': !value.typeValide }">
        <label>Type</label>
        <select class="form-control" v-model="value.type" @change="chargeCategories">
          <option value="">Choisir un type</option>
          <option v-for="leType in types" :value="leType.num_tag">{{ leType.mot }}</option>
        </select>
      </div>
      <div v-for="categorie in value.categories" class="form-group col-md-3" v-bind:class="{ 'has-error': !categorie.estValide }">
        <label>{{ categorie.nom }}</label>
        <inTagCategorie :num_categorie="categorie.num_categorie" v-model="categorie.valeurChoisie"></inTagCategorie>
      </div>
    </div>
    <div class="form-group" v-bind:class="{ 'has-error': !value.titreValide }" >
      <label>Titre</label>
      <input type="text" class="form-control" placeholder="Titre..." v-model="value.titre" >
    </div>
    <div class="form-group">
      <label>Tags</label>
      <inTags v-model="value.tags"></inTags>
    </div>
  </div>
</template>

<script>
  import inTagCategorie from '@/components/inTagCategorie'
  import inTags from '@/components/inTags'
  
  export default {
    components: { inTagCategorie, inTags },
    props: ['value'],
    data: function () {
      return {
        types: []
      }
    },
    mounted: function () {
      var me = this
      U.serverCall('server/tags/0', function (data) { me.types = data.tags })
    },
    methods: {
      chargeCategories: function () {
        var me = this
        U.serverCall('server/categoriesType/' + me.value.type, function (data) {
          me.value.categories = $.map(data.categories, function (cat) { return $.extend({valeurChoisie: '', estValide: true}, cat) })
        })
      },
      valide: function () {
        var categoriesValides = true

        this.value.titreValide = (this.value.titre.length > 3)
        this.value.typeValide = (this.value.type !== '')

        for (var i = 0; i < this.value.categories.length; i += 1) {
          this.value.categories[i].estValide = this.value.categories[i].valeurChoisie !== ''
          categoriesValides = categoriesValides && this.value.categories[i].estValide
        }

        return this.value.titreValide && this.value.typeValide && categoriesValides
      }
    }
  }
</script>

<style scoped lang="scss">
</style>
