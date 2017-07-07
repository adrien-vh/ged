<template>
  <div class="col-md-6">
    <nuageTags :tags="tags" @tagclick="openTag" v-show="tags.length > 0"></nuageTags>
    <div>
      <span v-for="tag in tagsChoisis" class="tag">
        {{ tag.mot }}
        <i class="fa fa-times" aria-hidden="true" @click="supprimeTag(tag.num_tag)"></i>
      </span>
    </div>
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

      this.tagsChoisis = []
      if (this.numTags && this.numTags.length !== 0) {
        U.serverCall('server/detailsTags/' + this.numTags, function (data) { me.tagsChoisis = data.tags })
      }
    },
    supprimeTag: function (numTag) {
      var tags = []
      for (var i = 0; i < this.tagsChoisis.length; i += 1) {
        if (this.tagsChoisis[i].num_tag !== numTag) {
          tags.push(this.tagsChoisis[i].num_tag)
        }
      }
      this.$router.push('/tags/' + tags.join('_'))
    }
  },
  mounted: function () {
    this.chargeInfos()
  },
  data: function () {
    return {
      tags: [],
      docs: [],
      tagsChoisis: []
    }
  }
}
</script>

<style scoped lang="scss">
  @import "../styles/copic";
  .tag {
    display: inline-block;
    padding: 0 8px;
    border-radius: 8px;
    background-color: $CB00;
    border: 1px solid $CB02;
    color: $CB18;
    font-weight: bold;
    font-size: 12px;
    margin: 0 4px 35px 0;
    
    i {
      cursor: pointer;
    }
  }
</style>
