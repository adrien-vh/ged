<template>
  <div>
    <inRecherche v-on:change="lanceRecherche"></inRecherche>
  </div>
</template>

<script>
  import inRecherche from '@/components/inRecherche'
  
  export default {
    methods: {
      lanceRecherche: function (texte) {
        U.serverCall('server/recherche.php', { query: texte }, function (data) { })
      }
    },
    components: { inRecherche }
  }
</script>

<style scoped lang="scss">
</style>
