<template>
  <div class="nuage" style="width: 100%; height: 250px;"></div>
</template>

<script>
require('../vendor/jquery/jquery.min.js')
require('../vendor/jqcloud/jqcloud.min.js')

export default {
  props: ['tags'],
  watch: {
    tags: function () {
      this.setTags(this.tags)
    }
  },
  methods: {
    setTags: function (tags) {
      var tagsNuage = []
      var me = this

      for (var i = 0; i < tags.length; i++) {
        tagsNuage.push(tags[i])
      }
      $(this.$el).html('')
      $(this.$el).jQCloud(tagsNuage, {
        afterCloudRender: function () {
          $(this).find('span span').click(function (e) {
            me.$emit('tagclick', $(this).attr('data-numtag'))
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
  @import "../styles/copic";
  $jqcloud-font: 10px "Helvetica", "Arial", sans-serif;

  $jqcloud-link-hover-color: #00ccff;

  .jqcloud {
    font: $jqcloud-font;
    line-height: normal;
    overflow: hidden;
    position: relative;
    
    span {
      cursor: pointer;
    }

    .w1 { color: $CB02; font-size: 100%;  .cat-0 { color:$CRV13;  }}
    .w2 { color: $CB02; font-size: 150%;  .cat-0 { color:$CRV13;  }}
    .w3 { color: $CB04; font-size: 200%;  .cat-0 { color:$CRV13;  }}
    .w4 { color: $CB04; font-size: 250%;  .cat-0 { color:$CRV13;  }}
    .w5 { color: $CB14; font-size: 300%;  .cat-0 { color:$CRV14;  }}
    .w6 { color: $CB14; font-size: 350%;  .cat-0 { color:$CRV14;  }}
    .w7 { color: $CB16; font-size: 400%;  .cat-0 { color:$CR14;  }}
    .w8 { color: $CB16; font-size: 450%;  .cat-0 { color:$CR14;  }}
    .w9 { color: $CB18; font-size: 500%;  .cat-0 { color:$CR17;  }}
    .w10 { color: $CB18; font-size: 550%; .cat-0 { color:$CR17;  } }
  }

  .jqcloud-word {
    margin: 0;
    padding: 0;

    a {
      color: inherit;
      font-size: inherit;
      text-decoration: none;

      &:hover {
        color: $jqcloud-link-hover-color;
      }
    }
  }

</style>
