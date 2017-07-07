<template>
  <div>
    <div class="col-md-2 arbre">
      <ul>
        <feuille :model="arbre" racine="racine" chemin="" @clique="chargeDocs"></feuille>
      </ul>
    </div>
    <div class="col-md-10 docs">
      <docCard v-for="doc in docs" :doc="doc" :key="doc.num_doc"></docCard>
    </div>
  </div>
</template>

<script>
import feuille from '@/components/feuille'
import docCard from '@/components/docCard'
export default {
  components: { feuille, docCard },
  data: function () {
    return {
      arbre: { mot: 'racine', enfants: [], chemin: '', nbDocs: 0 },
      docs: []
    }
  },
  methods: {
    chargeEnfants: function (feuille) {
      if (feuille.enfants && feuille.enfants.length > 0) {
      } else {
        U.serverCall('server/arbre/' + feuille.num_tag, function (data) { feuille.enfants = data.feuilles })
      }
    },
    chargeDocs: function (chemin) {
      var me = this
      U.serverCall('server/docs/' + chemin, function (data) { me.docs = data.docs })
    }
  }
}
</script>

<style scoped lang="scss">
  .arbre, .docs {
    overflow-y: auto;
    height: calc(100vh - 140px);
  }
  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }
</style>
