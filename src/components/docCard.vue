<template>
  <a class="doc" :href="'#/doc/' + doc.num_doc">
    <div class="ext" :class="ext(doc.chemin)">{{ ext(doc.chemin) }}</div>
    <div class="sur-titre"><b>{{ doc.type }}</b> - {{ doc.tags }}</div>
    <div class="titre">{{ doc.titre }}</div>
    <div class="sous-titre">par <b>{{ doc.auteur }}</b> le {{ $root.formatDate(doc.date) }}</div>
    <div v-if="doc.contenu" v-html="doc.contenu" class="contenu-doc"></div>
  </a>
</template>

<script>
  export default {
    props: ['doc'],
    methods: {
      ext: function (chemin) {
        var ext = chemin.substr(chemin.lastIndexOf('.') + 1)
        return ext === 'html' ? 'wiki' : ext
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../styles/copic";
    
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
      &.docx { background-color: $CB18; color: $CW00; }
    }
    
    .titre {
      color: $CB97;
      font-size: 18px;
    }
    
    .sous-titre {
      color: $CW7;
      font-size: 12px;
    }
    
    .contenu-doc {
      font-size: 11px;
      margin-top: 10px;
    }
  }
</style>
