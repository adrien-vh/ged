<template>
  <a class="doc" :href="'#/doc/' + doc.num_doc" v-bind:class="{ small : small }">
    <div class="ext" :class="ext(doc.chemin)"><span v-if="!small">{{ ext(doc.chemin) }}</span></div>
    <div class="sur-titre"><b>{{ doc.type }}</b><span v-if="!small" v-show="doc.tags"> - {{ doc.tags }}</span></div>
    <div class="titre">{{ doc.titre }}</div>
    <div class="sous-titre"><span v-if="!small">par </span>{{ doc.auteur }}<span v-if="!small"> le {{ $root.formatDate(doc.date) }}</span></div>
    <div v-if="doc.contenu" v-html="doc.contenu" class="contenu-doc"></div>
    <div v-if="pinnable" class="pin" @click.prevent="pin" v-bind:class="{ texteGrisClair : doc.pin == '0' }">
      <i class="fa fa-thumb-tack" aria-hidden="true"></i>
    </div>
  </a>
</template>

<script>
  export default {
    props: ['doc', 'small', 'pinnable'],
    methods: {
      ext: function (chemin) {
        if (this.doc.isMail === '1') {
          return 'mail'
        }
        var ext = chemin.substr(chemin.lastIndexOf('.') + 1)
        return ext === 'html' ? 'wiki' : ext
      },
      pin: function () {
        console.log('pin')
        this.doc.pin = this.doc.pin === '0' ? '1' : '0'
        U.serverCall('server/pin/' + this.doc.num_doc + '/' + this.$root.utilisateur.login)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../styles/copic";
  
  
  a:hover, a:visited, a:link, a:active {
      text-decoration: none;
  }
  
  a.doc {
    display: block;
    box-shadow: 1px 1px 2px 1px #aaaaaa;
    background-color: #ffffff;
    cursor: pointer;
    margin-bottom: 15px;
    position: relative;
    padding: 10px 5px 10px 70px;
    color: $CW10;
    transition: all .2s ease-in-out;
    
    &.small {
      padding-left: 18px;
      .titre {
        font-size: 14px;
      }
      .ext {
        font-size: 12px;
        width: 10px;
      }
    }
    
    &:hover {
      box-shadow: 3px 3px 5px 1px #aaaaaa;
      text-decoration: none;
    }
    
    .ext {
      position: absolute;
      top: 0;
      left: 0;
      width: 60px;
      height: 100%;
      text-align: center;
      padding-top: 20px;
      font-weight: bold;
      &.wiki { background-color: $CW1; color: $CW9; }
      &.pdf { background-color: $CR17; color: $CW00; }
      &.docx, &.doc { background-color: $CB18; color: $CW00; }
      &.xlsx, &.xls { background-color: $CG14; color: $CW00; }
      &.pptx, &.ppt { background-color: $CYR09; color: $CW00; }
      &.mail { background-color: $CY06; color: $CW9; }
    }
    
    .titre {
      color: $CB97;
      font-size: 18px;
    }
    
    .sur-titre {
      color: $CW7;
    }
    
    .sous-titre {
      color: $CW7;
      font-size: 12px;
    }
    
    .contenu-doc {
      font-size: 11px;
      margin-top: 10px;
    }
    
    .pin {
      position: absolute;
      right: 5px;
      top: 5px;
    }
  }
</style>
