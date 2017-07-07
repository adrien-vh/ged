<template>
  <div>
    <div v-if="!inline" contenteditable="true" :id="id"></div>
    <textarea  v-if="inline" :id="id"></textarea>
  </div>
</template>

<script>
  export default {
    props: ['inline'],
    data: function () {
      return {
        id: 'in' + Math.floor(10000 * Math.random()),
        editor: null
      }
    },
    mounted: function () {
      if (this.inline) {
        this.editor = CKEDITOR.inline(this.id)
      } else {
        this.editor = CKEDITOR.replace(this.id)
      }
      var isCtrl = false
      var me = this
  
      me.editor.on('contentDom', function (evt) {
        me.editor.document.on('keyup', function (event) {
          if (event.data.$.keyCode === 17) isCtrl = false
        })

        me.editor.document.on('keydown', function (event) {
          if (event.data.$.keyCode === 17) isCtrl = true
          if (event.data.$.keyCode === 83 && isCtrl === true) {
            try {
              event.data.$.preventDefault()
              me.$emit('save')
            } catch (err) {}
            return false
          }
        })
      }, me.editor.element.$)
    },
    methods: {
      getContent: function () {
        return this.editor.getData()
      },
      setContent: function (content) {
        return this.editor.setData(content)
      }
    }
  }
</script>

<style scoped lang="scss">
</style>
