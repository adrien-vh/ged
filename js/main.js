/*jslint browser: true, devel: true, node: true, sloppy: true, regexp: true */
/*global $, Vue */

var substringMatcher = function (strs) {
    return function findMatches(q, cb) {
        var matches, substrRegex;

        // an array that will be populated with substring matches
        matches = [];

        // regex used to determine if a string contains the substring `q`
        substrRegex = new RegExp(q, 'i');

        // iterate through the pool of strings and for any string that
        // contains the substring `q`, add it to the `matches` array
        $.each(strs, function (i, str) {
            if (substrRegex.test(str)) {
                matches.push(str);
            }
        });

        cb(matches);
    };
},
    states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
          'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii',
          'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
          'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
          'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
          'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
          'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
          'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
          'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
             ],
    compRecherche = {
        template: '#page-recherche-template',
        methods: {
            lanceRecherche : function (texte) {
                console.log(texte);
            }
        }
    },
    compTags = {
        template: '#page-tags-template',
        data : function () { return {
            tags: [
                {text: "Lorem", weight: 13},
                {text: "Ipsum", weight: 10.5},
                {text: "Dolor", weight: 9.4},
                {text: "Sit", weight: 8},
                {text: "Amet", weight: 6.2},
                {text: "Consectetur", weight: 5},
                {text: "Adipiscing", weight: 5},
                {text: "Elit", weight: 5},
                {text: "Nam et", weight: 5},
                {text: "Leo", weight: 4},
                {text: "Sapien", weight: 4},
                {text: "Pellentesque", weight: 3},
                {text: "habitant", weight: 3},
                {text: "morbi", weight: 3},
                {text: "tristisque", weight: 3},
                {text: "senectus", weight: 3},
                {text: "et netus", weight: 3},
                {text: "et malesuada", weight: 3},
                {text: "fames", weight: 2},
                {text: "ac turpis", weight: 2},
                {text: "egestas", weight: 2},
                {text: "Aenean", weight: 2},
                {text: "vestibulum", weight: 2},
                {text: "elit", weight: 2},
                {text: "sit amet", weight: 2},
                {text: "metus", weight: 2},
                {text: "adipiscing", weight: 2},
                {text: "ut ultrices", weight: 2},
                {text: "justo", weight: 1},
                {text: "dictum", weight: 1},
                {text: "Ut et leo", weight: 1},
                {text: "metus", weight: 1},
                {text: "at molestie", weight: 1},
                {text: "purus", weight: 1},
                {text: "Curabitur", weight: 1},
                {text: "diam", weight: 1},
                {text: "dui", weight: 1},
                {text: "ullamcorper", weight: 1},
                {text: "id vuluptate ut", weight: 1},
                {text: "mattis", weight: 1},
                {text: "et nulla", weight: 1},
                {text: "Sed", weight: 1}
            ]
        }}
    },
    compArborescence = {
        template : '#page-arborescence-template'
    }
    routes = [
      { path: '/recherche', component: compRecherche },
      { path: '/tags', component: compTags },
      { path: '/arborescence', component: compArborescence }
    ],
    router = new VueRouter({
        routes : routes,
        linkActiveClass : 'uk-active'
    });

Vue.component('nuage-tags', {
    props: ['tags'],
    template: '<div id="coucou" style="width: 100%; height: 250px;"></div>',
    watch : {
        tags : function () {
            console.log("coucou");
        }
    },
    mounted : function () {
        console.log($(this.$el).find('div'));
        console.log(this.tags);
        $(this.$el).jQCloud(this.tags);
    }
});

Vue.component('in-recherche', {
    template : '<input type="text" class="autocomplete">',
    mounted : function () {
        var me = this;
        $(this.$el).typeahead(
            {
                hint: true,
                highlight: true,
                minLength: 1
            },
            {
                name: 'states',
                source: substringMatcher(states)
            }
        ).on('typeahead:select', function (event, suggession) {
            me.$emit('change', suggession);
        }).on('keyup', function (e) {
            if (e.originalEvent.keyCode === 13) {
                me.$emit('change', $(this).val());
            }
        });
    }
});

$(function () {
    var viewmodel = new Vue({
        router : router,
        el: '#gedInstance'
    });
});
