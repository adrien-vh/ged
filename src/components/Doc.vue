<template>
  <div id="affichageDoc" class="col-md-12">
    <div class="col-md-6" v-show="editionMetas">
      <inMetaDoc v-model="metas" ref="formMeta"></inMetaDoc>
      <button type="button" class="btn btn-primary btn-sm" @click="majMetas"><i class="fa fa-floppy-o fa-lg" aria-hidden="true"></i> Enregistrer</button>
      <button type="button" class="btn btn-default btn-sm" @click="editionMetas = false"><i class="fa fa-times fa-lg" aria-hidden="true"></i> Annuler</button>
    </div>
    <div class="col-md-6" v-show="!editionMetas">
      <div class="pb-5 metas">
        

        <div class="doc-metas">
          <span class="extension" :class="extension">{{ extension }}</span>
          <span class="titre">{{ infos.titre }}</span>
          <div class="infos-auteur">Modifié par {{ infos.auteur }} le {{ $root.formatDate(infos.date) }}</div>
        </div>
        
      </div>
      <!-- Doc {{ $route.params.num_doc }} -->
    </div>
    <div class="col-md-3" v-show="!editionMetas">
      <table class="table table-condensed table-infos">
        <tr>
          <td>Type :</td>
          <td>{{ infos.type }}</td>
        </tr>
        <tr v-for="categorie in categories">
          <td >{{ categorie.nom }} :</td>
          <td>{{ categorie.mot }}</td>
        </tr>
        <tr v-show="tags.length > 0">
          <td>Tags :</td>
          <td>{{ tags.join(', ') }}</td>
        </tr>
      </table>
    </div>
    <div class="col-md-12 texteCentre" v-show="!editionMetas">
      <div class="btn-group btn-group-sm" role="group" aria-label="...">
        <button type="button" class="btn btn-default" @click="download" v-if="infos.isWiki == '0'">
          <i class="fa fa-download fa-lg" aria-hidden="true"></i> Télécharger
        </button>
          
        <button type="button" class="btn btn-primary" 
                @click="editerMetas"
                v-if="$root.utilisateur.niveau > 0 && !infos.lockedBy">
          <i class="fa fa-pencil fa-lg" aria-hidden="true"></i> Modifier les métadonnées
        </button>
        <button type="button" class="btn btn-primary"
                @click="editerWebdav"
                v-if="infos.isWiki == '0' && editable && $root.utilisateur.niveau > 0 && !infos.lockedBy"
                v-show="!editionEnCours">
          <i class="fa fa-pencil fa-lg" aria-hidden="true"></i> Modifier le fichier original
        </button>
        <button type="button" class="btn btn-default" disabled="disabled"
                v-if="infos.isWiki == '0' && editable && $root.utilisateur.niveau > 0 && infos.lockedBy"
                v-show="!editionEnCours">
          <i class="fa fa-lock fa-lg" aria-hidden="true"></i> Verrouillé par {{ infos.lockedByNom }}
        </button>
        <button type="button" class="btn btn-primary" 
                @click="validerWebdav"
                v-if="infos.isWiki == '0' && editable && $root.utilisateur.niveau > 0 && ((!infos.lockedBy) || (infos.lockedBy == $root.utilisateur.login))"
                v-show="editionEnCours">
          <i class="fa fa-check fa-lg" aria-hidden="true"></i> Valider les modifications
        </button>
        <button type="button" class="btn btn-primary"
                @click="annulerWebdav"
                v-if="infos.isWiki == '0' && editable && $root.utilisateur.niveau > 0 && ((!infos.lockedBy) || (infos.lockedBy == $root.utilisateur.login))"
                v-show="editionEnCours">
          <i class="fa fa-times fa-lg" aria-hidden="true"></i> Annuler les modifications
        </button>
        <button type="button" class="btn btn-danger"
                @click="confirmeSuppression = true"
                v-show="!confirmeSuppression"
                v-if="$root.utilisateur.niveau > 0 && !infos.lockedBy">
          <i class="fa fa-times fa-lg" aria-hidden="true"></i> Supprimer le document
        </button>
        <button type="button" class="btn btn-danger"
                @click="supprimeDoc"
                v-if="confirmeSuppression">
          <i class="fa fa-question-circle fa-lg" aria-hidden="true"></i> Confirmer la suppression ?
        </button>
      </div>
      <div class="texteRouge mt-5" v-show="editionEnCours">
        <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>
        Vous avez verouillé ce document, personne ne pourra le modifier tant que vous n'aurez pas annulé ou validé vos modifications !
      </div>
    </div>
    <div class="col-md-12 mt-5" v-show="infos.isWiki == '1'" v-if="$root.utilisateur.niveau > 0">
      <div class="in-ck mb-5">
        <inCk inline="true" ref="inWiki" @save="majContenu"></inCk>
      </div>
      <button type="button" class="btn btn-primary btn-sm" @click="majContenu"><i class="fa fa-floppy-o fa-lg" aria-hidden="true"></i> Enregistrer</button>
    </div>
    <div class="col-md-12 mt-5 contenu" v-html="infos.contenu" v-if="$root.utilisateur.niveau == 0 && infos.isWiki == '1'">
    </div>
    <div class="col-md-12 mt-5 texteCentre" v-if="pdfEnGeneration">
      Génération du pdf en cours...<br><br>
      <i class="fa fa-cog fa-spin fa-3x fa-fw"></i>      
    </div>
    <div class="col-md-12 mt-5" v-if="infos.isWiki == '0' && pdfDispo">
      <iframe :src="urlPdf" style="width: 100%;height: 800px;border: 1px solid #000;" id="pdfView"></iframe>
    </div>
  </div>
</template>

<script>
  import inCk from '@/components/inCk'
  import inMetaDoc from '@/components/inMetaDoc'
  
  export default {
    components: { inCk, inMetaDoc },
    props: ['num_doc'],
    watch: {
      num_doc: function () {
        this.charge()
        U.serverCall('server/sauveConsult/' + this.num_doc + '/' + this.$root.utilisateur.login)
      }
    },
    data: function () {
      return {
        editionMetas: false,
        infos: {},
        tags: [],
        categories: [],
        urlPdf: '',
        extension: '',
        metas: {
          typeValide: true,
          categories: [],
          titreValide: true,
          titre: '',
          tags: [],
          type: ''
        },
        pdfDispo: false,
        editable: false,
        editionEnCours: false,
        pdfEnGeneration: false,
        confirmeSuppression: false
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
        var intervalPdf
        this.editionMetas = false
        this.urlPdf = 'http://ged/server/pdf.php?num_doc=' + this.num_doc
        U.serverCall('server/infosDoc/' + this.num_doc, function (data) {
          me.infos = data.infos
          me.categories = data.categories
          me.tags = data.tags
          me.extension = data.extension !== 'html' ? data.extension : 'wiki'
          me.pdfDispo = data.pdfDispo
          me.editable = data.editable
          me.pdfEnGeneration = data.pdfEnGeneration
          me.editionEnCours = me.$root.utilisateur.login === data.infos.lockedBy
  
          console.log(me.$refs)
  
          if (me.infos.isWiki === '1') {
            me.$refs.inWiki.setContent(me.infos.contenu)
          }
  
          if (me.pdfEnGeneration) {
            intervalPdf = setInterval(function () {
              U.serverCall('server/pdfDispo/' + me.num_doc, function (data) {
                if (data.pdfDispo) {
                  setTimeout(function () {
                    me.pdfEnGeneration = false
                    me.pdfDispo = true
                  }, 5000)
                  clearInterval(intervalPdf)
                }
              })
            }, 1000)
          }
        })
      },
      majContenu: function () {
        var me = this
        U.serverCall('server/majContenu/' + this.num_doc, { contenu: me.$refs.inWiki.getContent() }, function () {
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
        this.editionEnCours = true
        this.infos.lockedBy = this.$root.utilisateur.login
        this.$root.utilisateur.nbLocks += 1
        U.serverCall('server/lienWebdav/' + this.num_doc + '/' + C.utilisateur.login, function (data) {
          window.open(data.url, '_self')
        })
      },
      validerWebdav: function () {
        var me = this
        this.editionEnCours = false
        this.$root.utilisateur.nbLocks -= 1
        U.serverCall('server/validerWebdav/' + this.num_doc, function (data) { me.charge() })
      },
      annulerWebdav: function () {
        var me = this
        this.editionEnCours = false
        this.$root.utilisateur.nbLocks -= 1
        U.serverCall('server/annulerWebdav/' + this.num_doc, function (data) { me.charge() })
      },
      download: function () {
        window.open('http://ged/server/doc.php?num_doc=' + this.num_doc)
      },
      supprimeDoc: function () {
        var me = this
        U.serverCall('server/supprimeDoc/' + this.num_doc, function () {
          me.$router.push('/recherche')
        })
      }
    },
    mounted: function () {
      U.serverCall('server/sauveConsult/' + this.num_doc + '/' + this.$root.utilisateur.login)
      this.charge()
    }
  }
</script>

<style scoped lang="scss">
  @import "../styles/copic";
  
  .table-infos {
    tr td:first-child {
      text-align: right;
      padding-right: 15px;
      width: 150px;
      font-style: italic;
    }
    tr td:last-child {
      
    }
  }
  
  .doc-metas {
    position: relative;
    padding-left: 60px;
    
    .extension {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: 50px;
      height: 50px;
      text-align: center;
      font-size: 18px;
      padding-top: 9px;
      &.wiki { background-color: $CW1; color: $CW9; }
      &.pdf { background-color: $CR17; color: $CW00; }
      &.docx { background-color: $CB18; color: $CW00; }
      &.xlsx { background-color: $CG14; color: $CW00; }
    }
    
    .infos-auteur {
      margin-left: 2px;
    }
    
    .titre {
      display: block;
      font-size: 28px;
      line-height: 25px;
      margin-bottom: 8px;
    }
    
  }
  
  
  .in-ck, .contenu {
    /* border-top: 1px solid #555;*/
    background-color: #fff;
    padding: 30px;
  }
</style>
