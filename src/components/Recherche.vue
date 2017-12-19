<template>
  <div class="col-md-6">
    <inRecherche v-on:lanceRecherche="allerARecherche" :valeur="requeteUrl"></inRecherche>
    <br>
    <div class="aucun-resultat" v-show="docs.length == 0 && docsTag.length == 0 && docsTitre.length == 0 && requeteUrl != ''">
      <i class="fa fa-frown-o fa-5x" aria-hidden="true"></i><br>
      Aucun résultat trouvé...
    </div>
    <a href="#" @click.prevent="allerARecherche(requeteUrl + ' ' + tag.mot)" v-for="tag in tags" class="tag">{{ tag.mot }} ({{ tag.total }})</a>
    <h3 v-show="docsTag.length > 0">Tags</h3>
    <docCard v-for="doc in docsTag" :doc="doc" :key="doc.num_doc"></docCard>
    <h3 v-show="docsTitre.length > 0">Titre</h3>
    <docCard v-for="doc in docsTitre" :doc="doc" :key="doc.num_doc"></docCard>
    <h3 v-show="docs.length > 0">Full-text</h3>
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
        docs: [],
        docsTag: [],
        docsTitre: [],
        tags: []
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
            me.docsTag = data.resultatsTags
            me.docsTitre = data.resultatsTitre
            me.tags = data.tags
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
  
  h3 {
    color: #555;
    margin-bottom: 25px;
    font-size: 16px;
  }
  .tag {
    display: inline-block;
    margin: 0 5px;
    text-decoration: underline;
    font-size: .8em;
  }
</style>
