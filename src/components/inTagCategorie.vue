<template>
  <select multiple v-bind:value="value"></select>
</template>

<script>
export default {
  props: ['value', 'num_categorie'],
  data: function () { return { majEnCours: false } },
  mounted: function () {
    var me = this
    var source = 'http://ged/server/tags/tokenize/' + me.num_categorie

    $(this.$el).tokenize2({tokensAllowCustom: true, dataSource: source, searchFromStart: false, debounce: 200, tokensMaxItems: 1})
    $(this.$el).on('tokenize:tokens:add', function (e, value) {
      if (!me.majEnCours) { me.$emit('input', $(me.$el).next().find('li.token span').html()) }
    })
    this.updateValue()
  },
  watch: {
    value: function (value) { this.updateValue() }
  },
  methods: {
    updateValue: function () {
      this.majEnCours = true
      if (this.value === '') {
        $(this.$el).trigger('tokenize:clear')
      } else {
        $(this.$el).trigger('tokenize:tokens:add', [this.value, this.value, true])
      }
      this.majEnCours = false
    }
  }
}
</script>

<style scoped lang="scss">
</style>
