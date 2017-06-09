<template>
  <div class="nuage" style="width: 100%; height: 250px;"></div>
</template>

<script>
require('../vendor/jquery/jquery.min.js')
require('../vendor/jqcloud/jqcloud.min.js')

export default {
  props: ['tags'],
  watch: {
    tags: function () { }
  },
  mounted: function () {
    $(this.$el).jQCloud(this.tags)
  }
}
</script>

<style lang="scss">
  $jqcloud-font: 10px "Helvetica", "Arial", sans-serif;

  $jqcloud-link-hover-color: #00ccff;

  .jqcloud {
    font: $jqcloud-font;
    line-height: normal;
    overflow: hidden;
    position: relative;

    .w1 { color: #aab5f0; font-size: 100%;  }
    .w2 { color: #99ccee; font-size: 150%;  }
    .w3 { color: #a0ddff; font-size: 200%;  }
    .w4 { color: #90c5f0; font-size: 250%;  }
    .w5 { color: #90a0dd; font-size: 300%;  }
    .w6 { color: #90c5f0; font-size: 350%;  }
    .w7 { color: #3399dd; font-size: 400%;  }
    .w8 { color: #00ccff; font-size: 450%;  }
    .w9 { color: #00ccff; font-size: 500%;  }
    .w10 { color: #00ccff; font-size: 550%;  }
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
