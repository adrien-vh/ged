<template>
  <div class="input-group" id="inRecherche">
    <input type="text" class="form-control typeahead" autofocus placeholder="Rechercher...">
    <span class="input-group-btn">
      <button class="btn btn-default" type="button" v-on:click="lanceRecherche">
        <i class="fa fa-search" aria-hidden="true"></i>
      </button>
    </span>
  </div>
</template>

<script>
export default {
  props: ['valeur'],
  watch: {
    valeur: function () {
      if (typeof this.valeur !== 'undefined' && this.valeur !== '') {
        $('.tt-input').typeahead('val', this.valeur)
      }
    }
  },
  data: function () {
    return {}
  },
  methods: {
    lanceRecherche: function () {
      this.$emit('lanceRecherche', $('.tt-input').typeahead('val'))
      $('.tt-input').typeahead('close')
    }
  },
  mounted: function () {
    var me = this
    var rechercheAc = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.whitespace,
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      remote: {
        url: 'http://ged/server/acRecherche/%QUERY',
        wildcard: '%QUERY',
        transform: function (reponse) { return reponse.resultats.terms }
      }
    })
    $('.typeahead').typeahead({
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
        me.lanceRecherche()
      }
    })

    if (typeof this.valeur !== 'undefined' && this.valeur !== '') {
      $('.tt-input').typeahead('val', this.valeur)
    }
  }
}
</script>

<style scoped lang="scss">
</style>
