<template>
  <div id="affichageDoc" class="row">
    <div class="col-md-6">
      <div v-show="editionMetas">
        <inMetaDoc v-model="metas" ref="formMeta"></inMetaDoc>
        <button type="button" class="btn btn-primary btn-sm" @click="majMetas"><i class="fa fa-floppy-o fa-lg" aria-hidden="true"></i> Enregistrer</button>
        <button type="button" class="btn btn-default btn-sm" v-on:click="editionMetas = false"><i class="fa fa-times fa-lg" aria-hidden="true"></i> Annuler</button>
      </div>
      <div v-show="!editionMetas" class="pb-5 metas">
        <b>{{ infos.type }}</b>
        <span v-for="categorie in categories">
          - 
          <em class="texteGris">{{ categorie.nom }} : </em>
          {{ categorie.mot }}
        </span>
        <em class="texteGris">Tags : </em>
        <span v-for="tag in tags">{{tag}}, </span>

        <h1>{{ infos.titre }}</h1>
        <div class="mb-2">{{ infos.auteur }} le {{ $root.formatDate(infos.date) }}</div>
        <button type="button" class="btn btn-link" v-on:click="editerMetas">
          <i class="fa fa-pencil" aria-hidden="true"></i> Modifier les métadonnées
        </button>
        <button type="button" class="btn btn-link" v-on:click="editerWebdav" v-if="infos.isWiki == '0'">
          <i class="fa fa-pencil" aria-hidden="true"></i> Modifier le fichier original
        </button>
      </div>
      <!-- Doc {{ $route.params.num_doc }} -->
    </div>
    <div class="col-md-12 mt-5" v-if="infos.isWiki == '1'">
      <div class="in-ck mb-5">
        <ckeditor v-model="infos.contenu" types="inline"></ckeditor>
      </div>
      <button type="button" class="btn btn-primary btn-sm" @click="majContenu"><i class="fa fa-floppy-o fa-lg" aria-hidden="true"></i> Enregistrer</button>
    </div>
    <div class="col-md-6 mt-5" v-if="infos.isWiki == '0'">
      <iframe :src="urlPdf" style="width: 100%;height: 800px;border: 1px solid #000;" id="pdfView"></iframe>
    </div>
  </div>
</template>

<script>
  import Ckeditor from 'vue-ckeditor2'
  import inMetaDoc from '@/components/inMetaDoc'
  
  export default {
    components: { Ckeditor, inMetaDoc },
    props: ['num_doc'],
    watch: {
      num_doc: function () {
        this.charge()
      }
    },
    data: function () {
      return {
        editionMetas: false,
        infos: {},
        tags: [],
        categories: [],
        urlPdf: '',
        metas: {
          typeValide: true,
          categories: [],
          titreValide: true,
          titre: '',
          tags: [],
          type: ''
        }
      }
    },
    methods: {
      editerMetas: function () {
        this.metas.titreValide = true
        this.metas.typeValide = true
        this.metas.titre = this.infos.titre
        this.metas.tags = this.tags
        this.metas.type = this.infos.num_tagType
        this.metas.categories = $.map(this.categories, function (cat) {
          return {
            nom: cat.nom, valeurChoisie: cat.mot, num_categorie: cat.num_categorie, estValide: true
          }
        })
        this.editionMetas = true
      },
      charge: function () {
        var me = this
        this.editionMetas = false
        this.urlPdf = 'http://ged/server/pdf.php?num_doc=' + this.num_doc
        U.serverCall('server/infosDoc/' + this.num_doc, function (data) {
          me.infos = data.infos
          me.categories = data.categories
          me.tags = data.tags
        })
      },
      majContenu: function () {
        var me = this
        U.serverCall('server/majContenu/' + this.num_doc, { contenu: this.infos.contenu }, function () {
          me.charge()
        })
      },
      majMetas: function () {
        if (this.$refs.formMeta.valide()) {
          var me = this
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

          U.serverCall('server/majMetas/' + this.num_doc, infos, function () {
            me.charge()
          })
        }
      },
      editerWebdav: function () {
        U.serverCall('server/lienWebdav/' + this.num_doc, function (data) {
         // me.charge()
          window.open(data.url, '_self')
        })
      }
    },
    mounted: function () {
      this.charge()
    }
  }
</script>

<style scoped lang="scss">
  .metas {
   
  }
  .in-ck {
    /* border-top: 1px solid #555;*/
    background-color: #fff;
  }
</style>
