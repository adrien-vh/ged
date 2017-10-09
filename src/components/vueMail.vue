<template>
  <div>
    <span v-for="attachment in mail.attachments" class="mr-3">
      <i class="fa fa-file-o" aria-hidden="true"></i>
      <a :href="'http://ged/server/attachment.php?uid=' + uid + '&fichier=' + attachment">
        {{ attachment }}
      </a>
    </span>
    <h4>{{ mail.sujet }}</h4>
    <div class="fondBlanc p-5 mt-3" v-html="mail.contenu"></div>
  </div>
</template>

<script>
export default {
  props: ['uid'],
  data: function () {
    return {
      mail: {
        contenu: '',
        sujet: '',
        attachments: []
      }
    }
  },
  methods: {
    chargeMail: function () {
      var me = this
      U.serverCall('server/infosmail/' + this.uid, function (data) {
        me.mail = data
      })
    }
  },
  watch: {
    uid: function (value) {
      console.log(value)
      this.chargeMail()
    }
  },
  mounted: function () {
    console.log('ici')
    this.chargeMail()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
