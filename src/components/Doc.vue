<template>
  <div id="affichageDoc">
    <b>{{ infos.type }}</b>
    <span v-for="categorie in categories">
      - 
      <em class="texteGris">{{ categorie.nom }} : </em>
      {{ categorie.mot }}
    </span>
    <em class="texteGris">Tags : </em>
    <span v-for="tag in tags">{{tag}}, </span>

    <h1>{{ infos.titre }}</h1>
    {{ infos.auteur }} le {{ $root.formatDate(infos.date) }}
    <!-- Doc {{ $route.params.num_doc }} -->
  </div>
</template>

<script>
  export default {
    data: function () {
      return {
        infos: {},
        tags: [],
        categories: []
      }
    },
    mounted: function () {
      var me = this
      U.serverCall('server/infosDoc.php', { num_doc: this.$route.params.num_doc }, function (data) {
        me.infos = data.infos
        me.categories = data.categories
        me.tags = data.tags
      })
    }
  }
</script>

<style scoped lang="scss">
</style>
