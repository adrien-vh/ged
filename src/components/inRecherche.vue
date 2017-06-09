<template>
  <div class="input-group" id="inRecherche">
    <input type="text" class="form-control" placeholder="Rechercher...">
    <span class="input-group-btn">
      <button class="btn btn-default" type="button">
        <i class="fa fa-search" aria-hidden="true"></i>
      </button>
    </span>
  </div>
</template>

<script>
export default {
  mounted: function () {
    var me = this
    var rechercheAc = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.whitespace,
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      remote: {
        url: 'http://ged/server/acRecherche.php?prefix=%QUERY',
        wildcard: '%QUERY',
        transform: function (reponse) { return reponse.terms }
      }
    })
    $(this.$el).find('input').typeahead({
      hint: true,
      highlight: true,
      minLength: 1
    }, {
      name: 'recherche',
      source: rechercheAc
    }).on('typeahead:select', function (event, suggession) {
      me.$emit('change', suggession)
    }).on('keyup', function (e) {
      if (e.originalEvent.keyCode === 13) {
        me.$emit('change', $(this).val())
      }
    })
  }
}
</script>

<style scoped lang="scss">
</style>
