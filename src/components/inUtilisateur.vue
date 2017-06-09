<template>
  <select multiple v-bind:value="value"></select>
</template>

<script>
  export default {
    props: ['value', 'inactifs'],
    mounted: function () {
      var me = this
      var source = typeof this.inactifs === 'undefined' ? 'http://ged/server/listeUtilisateurs.php' : 'http://ged/server/listeUtilisateurs.php?inactifs=true'

      $(this.$el).tokenize2({tokensAllowCustom: false, dataSource: source, searchFromStart: false, debounce: 200, tokensMaxItems: 1})
      $(this.$el).on('tokenize:tokens:add', function (e, value) { me.$emit('input', value) })
    },
    watch: {
      value: function (value) {
        if (value === '') { $(this.$el).tokenize2().trigger('tokenize:clear') }
      }
    }
  }
</script>

<style scoped lang="scss">
</style>
