<template>
  <div>
    <div class="col-md-6 pr-5">
      <h1>Vos documents favoris</h1><br>
      <div class="col-md-6">
        <docCard v-for="(doc, index) in favoris" :doc="doc" :key="doc.num_doc" v-if="index % 2 == 0" small="true" pinnable="true"></docCard>
      </div>
      <div class="col-md-6">
        <docCard v-for="(doc, index) in favoris" :doc="doc" :key="doc.num_doc" v-if="index % 2 == 1" small="true" pinnable="true"></docCard>
      </div>
    </div>
    <div class="col-md-6 pl-5">
      <h1>Les documents récents</h1><br>
      <div class="col-md-6">
        <docCard v-for="(doc, index) in recents" :doc="doc" :key="doc.num_doc" v-if="index % 2 == 0" small="true"></docCard>
      </div>
      <div class="col-md-6">
        <docCard v-for="(doc, index) in recents" :doc="doc" :key="doc.num_doc" v-if="index % 2 == 1" small="true"></docCard>
      </div>
    </div>
  </div>
</template>

<script>
  import docCard from '@/components/docCard'
  export default {
    components: { docCard },
    data: function () {
      return {
        favoris: [],
        recents: []
      }
    },
    mounted: function () {
      var me = this
      U.serverCall('server/favoris/' + this.$root.utilisateur.login, function (data) { me.favoris = data.docs })
      U.serverCall('server/recents', function (data) { me.recents = data.docs })
    }
  }
</script>

<style scoped lang="scss">
</style>
