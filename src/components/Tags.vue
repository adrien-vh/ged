<template>
  <div>
    <nuageTags :tags="tags" @tagclick="openTag"></nuageTags>
    <docCard v-for="doc in docs" :doc="doc" :key="doc.num_doc"></docCard>
  </div>
</template>

<script>
import nuageTags from '@/components/nuageTags'
import docCard from '@/components/docCard'
export default {
  components: { nuageTags, docCard },
  props: ['numTags'],
  watch: {
    numTags: function () {
      this.chargeInfos()
    }
  },
  methods: {
    openTag: function (numTag) {
      var slashFinal = this.$router.currentRoute.path.substr(this.$router.currentRoute.path.length - 1) === '/'
      var tagsExistants = typeof this.numTags !== 'undefined' && this.numTags !== ''
      var routeActuelle = this.$router.currentRoute.path
      var nouvelleRoute = routeActuelle + (slashFinal || tagsExistants ? '' : '/') + (tagsExistants ? '_' : '') + numTag
      this.$router.push(nouvelleRoute)
    },
    chargeInfos: function () {
      var me = this
      var numTags = typeof this.numTags === 'undefined' ? '' : this.numTags
      U.serverCall('server/nuageTags/' + numTags, function (data) { me.tags = data.tags })
      U.serverCall('server/docs/' + numTags, function (data) { me.docs = data.docs })
    }
  },
  mounted: function () {
    this.chargeInfos()
  },
  data: function () {
    return {
      tags: [],
      docs: []
    }
  }
}
</script>

<style scoped lang="scss">
</style>
