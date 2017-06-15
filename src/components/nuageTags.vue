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

    .w1 { color: $CB02; font-size: 100%;  }
    .w2 { color: #99ccee; font-size: 150%;  }
    .w3 { color: #a0ddff; font-size: 200%;  }
    .w4 { color: #90c5f0; font-size: 250%;  }
    .w5 { color: #90a0dd; font-size: 300%;  }
    .w6 { color: #90c5f0; font-size: 350%;  }
    .w7 { color: #3399dd; font-size: 400%;  }
    .w8 { color: #00ccff; font-size: 450%;  }
    .w9 { color: $CB16; font-size: 500%;  }
    .w10 { color: $CB18; font-size: 550%;  }
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
