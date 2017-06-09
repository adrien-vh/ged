<template>
  <select multiple v-bind:value="value"></select>
</template>

<script>
export default {
  props: ['value', 'num_categorie'],
  mounted: function () {
    var me = this
    var source = 'http://ged/server/listeTags.php?tokenize2=true&num_categorie=' + me.num_categorie

    $(this.$el).tokenize2({tokensAllowCustom: true, dataSource: source, searchFromStart: false, debounce: 200, tokensMaxItems: 1})
    $(this.$el).on('tokenize:tokens:add', function (e, value) { me.$emit('input', $(me.$el).next().find('li.token span').html()) })
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
