<template>
  <div class="col-md-6">
    <inRecherche v-on:lanceRecherche="allerARecherche" :valeur="requeteUrl"></inRecherche>
    <br>
    <div class="aucun-resultat" v-show="docs.length == 0 && requeteUrl != ''">
      <i class="fa fa-frown-o fa-5x" aria-hidden="true"></i><br>
      Aucun résultat trouvé...
    </div>
    <docCard v-for="doc in docs" :doc="doc" :key="doc.num_doc"></docCard>
  </div>
</template>

<script>
  import inRecherche from '@/components/inRecherche'
  import docCard from '@/components/docCard'
  
  export default {
    components: { inRecherche, docCard },
    props: ['requeteUrl'],
    data: function () {
      return {
        requete: '',
        docs: []
      }
    },
    methods: {
      allerARecherche: function (requete) {
        this.$router.push('/recherche/' + requete)
      },
      lanceRecherche: function (requete) {
        var me = this
        if (typeof requete !== 'undefined' && requete !== '') {
          U.serverCall('server/recherche/' + requete, function (data) {
            me.docs = data.docs
          })
        }
      }
    },
    watch: {
      requeteUrl: function () {
        this.lanceRecherche(this.requeteUrl)
      }
    },
    mounted: function () {
      this.lanceRecherche(this.requeteUrl)
    }
  }
</script>

<style scoped lang="scss">
  .aucun-resultat {
    text-align: center;
    font-size: 25px;
    color: #aaa;
  }
</style>
