<template>
  <select multiple></select>
</template>

<script>
  export default {
    props: ['value'],
    mounted: function () {
      var me = this
      $(this.$el).tokenize2({tokensAllowCustom: true, dataSource: 'http://ged/server/listeTags.php?tokenize2=true', searchFromStart: false})
      $(this.$el).on('tokenize:tokens:add', function (e, value) {
        var retour = []
        $(me.$el).next().find('li.token').each(function () {
          retour.push($(this).find('span').html())
        })
        me.$emit('input', retour)
      })
    }
  }
</script>

<style scoped lang="scss">
</style>
