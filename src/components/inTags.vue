<template>
  <select multiple></select>
</template>

<script>
  export default {
    props: ['value'],
    data: { function () { return { majEnCours: false } } },
    watch: {
      value: function () {
        this.majEnCours = true
        $(this.$el).trigger('tokenize:clear')
        for (var i = 0; i < this.value.length; i += 1) {
          $(this.$el).trigger('tokenize:tokens:add', [this.value[i], this.value[i], true])
        }
        this.majEnCours = false
      }
    },
    mounted: function () {
      var me = this
      $(this.$el).tokenize2({tokensAllowCustom: true, dataSource: 'http://ged/server/tags/tokenize', searchFromStart: false})
      // $(this.$el).trigger('tokenize:tokens:add', ['token value', 'token display text', true])
      $(this.$el).on('tokenize:tokens:add', function (e, value) {
        if (!me.majEnCours) {
          var retour = []
          $(me.$el).next().find('li.token').each(function () {
            retour.push($(this).find('span').html())
          })
          me.$emit('input', retour)
        }
      })
    }
  }
</script>

<style scoped lang="scss">
</style>
