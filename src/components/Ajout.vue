<template>
  <div>
    <div class="col-md-6">
      <inMetaDoc v-model="metas" ref="formMeta"></inMetaDoc>
      <form>
        <div class="btn-group mb-5" role="group">
          <button type="button" class="btn btn-default" v-bind:class="{ 'active': !isWiki }" v-on:click="isWiki = false">Fichier</button>
          <button type="button" class="btn btn-default" v-bind:class="{ 'active': isWiki }" v-on:click="isWiki = true">Wiki</button>
        </div>
        <div v-show="!isWiki">
          <div>
            <inFichier v-model="inFichier" :valide="fichierValide" @input="chargePdf"></inFichier>
          </div>
        </div>
        <div v-show="isWiki">
          <div>
            <inCk ref="inWiki" @save="sauve"></inCk>
          </div>
        </div>
        <button type="button" class="btn btn-primary btn-lg center-block mt-5" v-on:click="sauve"><i class="fa fa-floppy-o" aria-hidden="true"></i> Enregistrer</button>
      </form>
    </div>
    <div class="col-md-6">
      <div class="col-md-12 mt-5 texteCentre" v-show="pdfValide && urlPdf == ''">
        Génération du pdf en cours...<br><br>
        <i class="fa fa-cog fa-spin fa-3x fa-fw"></i>      
      </div>
      <div class="col-md-12 mt-5" v-show="pdfValide && urlPdf != ''">
        <iframe :src="'http://ged/' + urlPdf" style="width: 100%;height: 800px;border: 1px solid #000;" id="pdfView"></iframe>
      </div>
    </div>
  </div>
</template>

<script>

import inTags from '@/components/inTags'
import inFichier from '@/components/inFichier'
import inTagCategorie from '@/components/inTagCategorie'
import inMetaDoc from '@/components/inMetaDoc'
import inCk from '@/components/inCk'

export default {
  components: { inTags, inFichier, inCk, inTagCategorie, inMetaDoc },
  methods: {
    chargePdf: function () {
      console.log(this.inFichier.fileName)
      var me = this
      if (this.inFichier.fileName.trim() === '') {
        this.urlPdf = ''
        this.pdfValide = false
        if (this.intervalCheckPdf) {
          clearInterval(this.intervalCheckPdf)
        }
      } else {
        U.serverCall('server/pdfuf', {fichier: this.inFichier.fileName}, function (data) {
          if (data.valide) {
            me.pdfValide = true
            if (data.url.trim() === '') {
              me.intervalCheckPdf = setInterval(function () {
                U.serverCall('server/pdfuf', {fichier: me.inFichier.fileName}, function (data) {
                  console.log(data)
                  if (data.url.trim() !== '') {
                    clearInterval(me.intervalCheckPdf)
                    me.urlPdf = data.url
                  }
                })
              }, 1000)
            } else {
              me.urlPdf = data.url
            }
          } else {
            me.pdfValide = false
          }
        })
      }
    },
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
      var me = this
      if (this.valideForm()) {
        var infos = {}
        var i
        infos.num_tagType = this.metas.type
        infos.categories = []
        for (i = 0; i < this.metas.categories.length; i += 1) {
          infos.categories[i] = {}
          infos.categories[i].num_categorie = this.metas.categories[i].num_categorie
          infos.categories[i].valeurChoisie = this.metas.categories[i].valeurChoisie
        }
        infos.titre = this.metas.titre
        infos.tags = this.metas.tags
        infos.isWiki = this.isWiki
        if (this.isWiki) {
          infos.inWiki = this.$refs.inWiki.getContent()
        } else {
          infos.inFichier = this.inFichier
        }

        U.serverCall('server/ajout', infos, function (data) {
          me.$router.push('/doc/' + data.num_doc)
        })
      }
    }
  },
  data: function () {
    return {
      isWiki: false,
      inWiki: '',
      inFichier: {},
      fichierValide: true,
      urlPdf: '',
      pdfValide: false,
      intervalCheckPdf: undefined,
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
