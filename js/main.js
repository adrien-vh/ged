/*jslint browser: true, devel: true, node: true, sloppy: true, regexp: true */
/*global $, Vue, VueRouter, donnees*/


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
            tags: donnees.tags
        }; }
    },
    compArborescence = {
        template : '#page-arborescence-template'
    },
    compAjout = {
        template : '#page-ajout-template'
    },
    routes = [
        { path: '/recherche', component: compRecherche },
        { path: '/tags', component: compTags },
        { path: '/arborescence', component: compArborescence },
        { path: '/ajout', component: compAjout },
        { path: '*', redirect: '/recherche' }
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
                source: substringMatcher(donnees.states)
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

Vue.component('in-tags', {
    template : '<select multiple></select>',
    mounted : function () {
        $(this.$el).tokenize2({tokensAllowCustom: true, dataSource: 'http://gopala.fr/donnees.php', searchFromStart : false});
    }
});

Vue.component('in-fichier', {
    template : '<form action="http://www.gopala.fr/upload.php" method="post" enctype="multipart/form-data"><input type="file" name="files"></form>',
    mounted : function () {
        var me = this;
        
        $(this.$el).find('input').fileuploader({
            changeInput: '<div class="fileuploader-input">' +
                              '<div class="fileuploader-input-inner">' +
                                  '<img src="images/upload.png"><br>' +
                                  'Déposer le fichier ici ou cliquer pour parcourir' +
                              '</div>' +
                          '</div>',
            theme: 'dragdrop',
            limit: 1,
            upload: {
                url: 'http://www.gopala.fr/upload.php',
                data: null,
                type: 'POST',
                enctype: 'multipart/form-data',
                start: true,
                synchron: true,
                beforeSend: null,
                onSuccess: function (result, item) {
                    var data = JSON.parse(result), warning;

                    // if success
                    if (data.isSuccess && data.files[0]) {
                        item.name = data.files[0].name;
                    }

                    // if warnings
                    if (data.hasWarnings) {
                        console.log(data.warnings);

                        item.html.removeClass('upload-successful').addClass('upload-failed');
                        // go out from success function by calling onError function
                        // in this case we have a animation there
                        // you can also response in PHP with 404
                        return this.onError ? this.onError(item) : null;
                    }

                    item.html.find('.column-actions').append('<a class="fileuploader-action fileuploader-action-remove fileuploader-action-success" title="Remove"><i></i></a>');
                    setTimeout(function () {
                        item.html.find('.progress-bar2').fadeOut(400);
                    }, 400);
                },
                onError: function (item) {
                    var progressBar = item.html.find('.progress-bar2');

                    if (progressBar.length > 0) {
                        progressBar.find('span').html("0%");
                        progressBar.find('.fileuploader-progressbar .bar').width("0%");
                        item.html.find('.progress-bar2').fadeOut(400);
                    }

                    if (item.upload.status !== 'cancelled' && item.html.find('.fileuploader-action-retry').length === 0) {
                        item.html.find('.column-actions').prepend(
                            '<a class="fileuploader-action fileuploader-action-retry" title="Retry"><i></i></a>'
                        );
                    }
                },
                onProgress: function (data, item) {
                    var progressBar = item.html.find('.progress-bar2');

                    if (progressBar.length > 0) {
                        progressBar.show();
                        progressBar.find('span').html(data.percentage + "%");
                        progressBar.find('.fileuploader-progressbar .bar').width(data.percentage + "%");
                    }
                },
                onComplete: null
            },
            onRemove: function (item) {
                $(me.$el).find('.fileuploader-input').show();
                $.post('http://www.gopala.fr/remove.php', {
                    file: item.name
                });
            },
            beforeSelect: function (files, listEl, parentEl, newInputEl, inputEl) {
                console.log(newInputEl);
                $(newInputEl).hide();
                return true;
            },
            captions: {
                removeConfirmation: 'Êtes-vous sûr de vouloir supprimer ce fichier ?'
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
