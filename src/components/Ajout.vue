<template>
  <div>
    <inMetaDoc v-model="metas" ref="formMeta"></inMetaDoc>
    <form>
      <div class="btn-group mb-5" role="group">
        <button type="button" class="btn btn-default" v-bind:class="{ 'active': !isWiki }" v-on:click="isWiki = false">Fichier</button>
        <button type="button" class="btn btn-default" v-bind:class="{ 'active': isWiki }" v-on:click="isWiki = true">Wiki</button>
      </div>
      <div v-show="!isWiki">
        <div>
          <inFichier v-model="inFichier" :valide="fichierValide"></inFichier>
        </div>
      </div>
      <div v-show="isWiki">
        <div>
          <ckeditor v-model="inWiki"></ckeditor>
        </div>
      </div>
      <button type="button" class="btn btn-primary btn-lg center-block mt-5" v-on:click="sauve"><i class="fa fa-floppy-o" aria-hidden="true"></i> Enregistrer</button>
    </form>
  </div>
</template>

<script>

import inTags from '@/components/inTags'
import inFichier from '@/components/inFichier'
import inTagCategorie from '@/components/inTagCategorie'
import inMetaDoc from '@/components/inMetaDoc'
import Ckeditor from 'vue-ckeditor2'

export default {
  components: { inTags, inFichier, Ckeditor, inTagCategorie, inMetaDoc },
  methods: {
    valideForm: function () {
      if (!this.isWiki) {
        if (typeof this.inFichier.file !== 'undefined') {
          this.fichierValide = this.inFichier.file !== ''
        } else {
          this.fichierValide = false
        }
      } else {
        this.fichierValide = true
      }

      return this.$refs.formMeta.valide() && this.fichierValide
    },
    sauve: function () {
      if (this.valideForm()) {
        var infos = {}
        var i
        infos.num_tagType = this.metas.type
        infos.categories = []
        for (i = 0; i < this.categories.length; i += 1) {
          infos.categories[i] = {}
          infos.categories[i].num_categorie = this.metas.categories[i].num_categorie
          infos.categories[i].valeurChoisie = this.metas.categories[i].valeurChoisie
        }
        infos.titre = this.metas.titre
        infos.tags = this.metas.tags
        infos.isWiki = this.isWiki
        if (this.isWiki) {
          infos.inWiki = this.inWiki
        } else {
          infos.inFichier = this.inFichier
        }

        U.serverCall('server/ajout', infos)
      }
    }
  },
  data: function () {
    return {
      isWiki: false,
      inWiki: '',
      inFichier: {},
      fichierValide: true,
      metas: {
        typeValide: true,
        categories: [],
        titreValide: true,
        titre: '',
        tags: [],
        type: ''
      }
    }
  }
}
</script>

<style scoped lang="scss">
</style>
