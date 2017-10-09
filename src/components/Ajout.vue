<template>
  <div>
    <div class="col-md-6">
      <inMetaDoc v-model="metas" ref="formMeta"></inMetaDoc>
      <form>
        <div class="btn-group mb-5" role="group">
          <button 
                  type="button" 
                  class="btn btn-default" 
                  v-bind:class="{ 'active': !isWiki && !isFromMail }" 
                  v-on:click="isWiki = false; isFromMail = false">
            Fichier
          </button>
          <button 
                  type="button" 
                  class="btn btn-default" 
                  v-bind:class="{ 'active': !isWiki && isFromMail }" 
                  v-on:click="isWiki = false; isFromMail = true">
            Mails
          </button>
          <button type="button" class="btn btn-default" v-bind:class="{ 'active': isWiki }" v-on:click="isWiki = true">Wiki</button>
        </div>
        <div v-show="!isWiki && !isFromMail">
          <div>
            <inFichier v-model="inFichier" :valide="fichierValide" @input="chargePdf(inFichier.fileName)"></inFichier>
          </div>
        </div>
        <div v-show="!isWiki && isFromMail">
          <!--<table class="table table-hover">
            <tbody>
              <tr v-for="fichierMail in fichiersMails">
                <td>
                  <span class="mr-2">
                    <a href="#" @click.prevent="supprimeFichierMail(fichierMail)"><i class="fa fa-trash-o fa-lg texteRouge" aria-hidden="true"></i></a>
                  </span>
                  <a href="#" @click.prevent="chargeFichierMail(fichierMail)">{{ fichierMail.nomFichier }}</a>
                </td>
              </tr>
            </tbody>
          </table>-->
          <table class="table table-hover">
            <tbody>
              <tr v-for="mail in mails">
                <td @click.prevent="chargeMail(mail)" class="pointer" :class="{fondBlanc: mail.uid == uidCourant}">
                  <!--<span class="mr-2">
                    <a href="#" @click.prevent="supprimeFichierMail(fichierMail)"><i class="fa fa-trash-o fa-lg texteRouge" aria-hidden="true"></i></a>
                  </span>-->
                  <!--<a href="#" @click.prevent="chargeFichierMail(fichierMail)">{{ fichierMail.nomFichier }}</a>-->
                   <i class="fa fa-paperclip" aria-hidden="true"></i> {{ mail.attachments.length }} <i class="fa fa-envelope-o" aria-hidden="true"></i>  {{ mail.sujet }}
                </td>
              </tr>
            </tbody>
          </table>
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
      <div class="col-md-12 mt-5" v-show="!isWiki && isFromMail">
        <vueMail :uid="uidCourant"></vueMail>
        <!--<span v-for="attachment in mailCourant.attachments" class="mr-3"><i class="fa fa-file-o" aria-hidden="true"></i> {{ attachment }} </span>
        <div class="fondBlanc p-5 mt-3" v-html="mailCourant.contenu"></div>-->
      </div>
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
import vueMail from '@/components/vueMail'

export default {
  components: { inTags, inFichier, inCk, inTagCategorie, inMetaDoc, vueMail },
  methods: {
    chargeFichiersMails: function () {
      var me = this
      U.serverCall('server/fichiersMails', function (data) {
        me.fichiersMails = data.fichiersMails
      })
    },
    chargeMails: function () {
      var me = this
      U.serverCall('server/mails', function (data) {
        me.mails = data.mails
      })
    },
    chargeMail: function (mail) {
      this.htmlMail = mail.contenu
      this.uidCourant = mail.uid
      this.metas.titre = mail.sujet
    },
    supprimeFichierMail: function (fichier) {
      var me = this
      U.serverCall('server/supprimeFichierMail/' + fichier.nomFichier, function () { me.chargeFichiersMails() })
    },
    chargeFichierMail: function (fichier) {
      this.fichierMailChoisi = fichier.nomFichier
      this.chargePdf(fichier.nomFichier)
    },
    chargePdf: function (fichier) {
      console.log(fichier)
      var me = this
      if (fichier.trim() === '') {
        this.urlPdf = ''
        this.pdfValide = false
        if (this.intervalCheckPdf) {
          clearInterval(this.intervalCheckPdf)
        }
      } else {
        U.serverCall('server/pdfuf', {fichier: fichier}, function (data) {
          if (data.valide) {
            me.pdfValide = true
            if (data.url.trim() === '') {
              me.intervalCheckPdf = setInterval(function () {
                U.serverCall('server/pdfuf', {fichier: fichier}, function (data) {
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
        if (this.isFromMail) {
          this.fichierValide = this.uidCourant !== 0
        } else {
          if (typeof this.inFichier.file !== 'undefined') {
            this.fichierValide = this.inFichier.file !== ''
          } else {
            this.fichierValide = false
          }
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
        infos.isFromMail = this.isFromMail
        if (this.isWiki) {
          infos.inWiki = this.$refs.inWiki.getContent()
        } else if (this.isFromMail) {
          infos.uid = this.uidCourant
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
      isFromMail: false,
      inWiki: '',
      inFichier: {},
      fichierValide: true,
      fichiersMails: [],
      mails: [],
      fichierMailChoisi: '',
      urlPdf: '',
      pdfValide: false,
      intervalCheckPdf: undefined,
      uidCourant: 0,
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
  mounted: function () {
    this.chargeFichiersMails()
    this.chargeMails()
  }
}
</script>

<style scoped lang="scss">
</style>
