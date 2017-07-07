<template>
  <li>
    <div
      :class="{bold: isFolder}"
      @click="toggle"
      v-if="!racine"
      >
        <i v-if="isFolder" class="fa" :class="{'fa-folder-open-o': open, 'fa-folder-o': !open}" aria-hidden="true"></i>
        <span class="categorie" v-if="model.categorie.length > 0">[{{model.categorie}}]</span>
        {{model.mot}} <span v-show="model.nbDocs > 1">({{model.nbDocs}})</span>
      <!--<span>[{{open ? '-' : '+'}}]</span>-->
    </div>
    <ul v-show="open || racine" v-if="isFolder">
      <feuille
        class="feuille"
        v-for="model in model.enfants"
        :chemin="chemin + (chemin == '' ? '' : '_') + model.num_tag"
        :key="model.num_tag"
        :model="model"
        @clique="childClicked">
      </feuille>
    </ul>
  </li>
</template>

<script>
  import feuille from '@/components/feuille'
  export default {
    name: 'feuille',
    components: { feuille },
    props: { model: Object, racine: undefined, chemin: '' },
    data: function () { return { open: false } },
    computed: {
      isFolder: function () {
        return this.model.enfants &&
          this.model.enfants.length
      }
    },
    methods: {
      chargeEnfants: function (feuille, racine) {
        var me = this
        racine = typeof racine !== 'undefined' ? racine : false
        if (feuille.enfants && feuille.enfants.length > 0) {
        } else {
          if (feuille.nbDocs > 1 || racine) {
            U.serverCall('server/arbre/' + feuille.chemin, function (data) {
              var i
              if (data.feuilles.length > 1) {
                feuille.enfants = data.feuilles
                if (racine) {
                  for (i = 0; i < feuille.enfants.length; i += 1) {
                    me.chargeEnfants(feuille.enfants[i])
                  }
                }
              }
            })
          }
        }
      },
      toggle: function () {
        var i
        if (this.isFolder) { this.open = !this.open }
        for (i = 0; i < this.model.enfants.length; i += 1) {
          this.chargeEnfants(this.model.enfants[i])
        }
        this.$emit('clique', this.model.chemin)
      },
      childClicked: function (chemin) {
        this.$emit('clique', chemin)
      }
    },
    mounted: function () {
      if (this.racine) { this.chargeEnfants(this.model, true) }
    }
  }
</script>

<style scoped lang="scss">
  .feuille {
    cursor: pointer;
    font-size: 12px;
  }
  .bold {
    font-weight: bold;
  }
  .categorie {
    color: #555;
    font-weight: normal;
    font-size: 10px;
  }
  ul {
    padding-left: 1em;
    line-height: 1.5em;
    list-style-type: none;
  }
</style>
