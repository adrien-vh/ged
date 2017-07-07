<template>
  <div class="col-md-6">
    <docCard v-for="doc in docs" :doc="doc" :key="doc.num_doc"></docCard>
    <div v-show="docs.length == 0">Vous n'avez verouillé aucun document.</div>
  </div>
</template>

<script>
  import docCard from '@/components/docCard'
  
  export default {
    components: { docCard },
    data: function () {
      return {
        docs: []
      }
    },
    mounted: function () {
      var me = this
      U.serverCall('server/locks/' + this.$root.utilisateur.login, function (data) { me.docs = data.docs })
    }
  }
</script>

<style scoped lang="scss">
</style>
