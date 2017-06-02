/*jslint browser: true, devel: true, node: true, sloppy: true, regexp: true */
/*global $, Vue, VueRouter, donnees, CKEDITOR, Bloodhound */


var utilisateur = {
        informationsRecuperees : false,
        loggedIn : false,
        num_utilisateur : 0,
        nom : ""
    },
    serverPrefix = "http://ged/",
    router,
    serverCall = function (url, p1, p2) {
        //$.post(serverPrefix + url, data, callback, "json");
        p1 = p1 || {};
        p2 = p2 || function () {};
        
        var data = $.isFunction(p1) ? {} : p1,
            callback = $.isFunction(p1) ? p1 : p2;
        $.ajax({
            type : "POST",
            url : serverPrefix + url,
            data : data,
            success : callback,
            dataType : "json",
            crossDomain: true,
            xhrFields: { withCredentials: true }
        });
    },
    substringMatcher = function (strs) {
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
    compLogin = {
        template: '#page-login-template',
        data : function () { return {
            login : "",
            password : "",
            loginEnCours : false,
            loginValide : true
        }; },
        methods: {
            onSubmit : function () {
                var me = this;
                
                if (!me.loginEnCours) {
                    me.loginEnCours = true;
                    serverCall(
                        'server/auth.php',
                        { login : me.login, password : me.password },
                        function (data) {
                            console.log(data);
                            if (data.loginValide) {
                                utilisateur.loggedIn = true;
                                utilisateur.nom = data.nom;
                                utilisateur.num_utilisateur = data.num_utilisateur;
                                router.push('/');
                            } else {
                                me.loginValide = false;
                            }
                            me.loginEnCours = false;
                        }
                    );
                }
                
            }
        }
        
    },
    compRecherche = {
        template: '#page-recherche-template',
        methods: {
            lanceRecherche : function (texte) {
                console.log(texte);
                serverCall('server/recherche.php', { query : texte }, function (data) {
                    console.log(data);
                });
            }
        }
    },
    compTags = {
        template: '#page-tags-template',
        data : function () { return {
            tags: donnees.tags
        }; }
    },
    compConfiguration = {
        template: '#page-configuration-template',
        data : function () { return {
            categories : [],
            types : [],
            nouvelleCategorie : "",
            nouveauType : "",
            nouvelUtilisateur : "",
            utilisateurs : []
        }; },
        methods: {
            majUtilisateur : function (utilisateur, e) {
                e.preventDefault();
                console.log("ici");
                utilisateur.niveau += 1;
                utilisateur.niveau %= 3;
            },
            loadTypes : function (data) {
                var i;
                for (i = 0; i < data.length; i += 1) {
                    data[i].categories = data[i].categories.split(',');
                    if (data[i].categories.length === 1 && data[i].categories[0] === '') {
                        data[i].categories = [];
                    }
                }
                this.types = data;
            },
            submitCategorie : function () {
                var me = this;
                serverCall("server/ajoutCategorie.php", { nom : this.nouvelleCategorie }, function () {
                    me.nouvelleCategorie = "";
                    serverCall("server/listeCategories.php", function (data) { me.categories = data; });
                });
            },
            submitType : function () {
                var me = this;
                serverCall("server/ajoutType.php", { nom : this.nouveauType }, function () {
                    me.nouveauType = "";
                    serverCall("server/listeTypes.php", function (data) { me.loadTypes(data); });
                });
            },
            submitCategorieType  : function (type, e) {
                e.preventDefault();
                var me = this;
                serverCall('server/ajoutCategorieType.php', {num_tagType : type.num_tag, num_categorie : type.nouvelleCategorie}, function () {
                    serverCall("server/listeTypes.php", function (data) {me.loadTypes(data); });
                });
                //console.log(type);
            },
            submitUtilisateur : function () {
                console.log(this.nouvelUtilisateur);
                console.log("submitUtilisateur");
                var me = this;
                serverCall('server/ajoutUtilisateur.php', {num_utilisateur : this.nouvelUtilisateur}, function () {
                    serverCall("server/listeUtilisateursActifs.php", function (data) {me.utilisateurs = data; });
                    me.nouvelUtilisateur = "";
                });
            }
        },
        mounted: function () {
            var me = this;
            serverCall("server/listeCategories.php", function (data) { me.categories = data; });
            serverCall("server/listeTypes.php", function (data) {me.loadTypes(data); });
            serverCall("server/listeUtilisateursActifs.php", function (data) {me.utilisateurs = data; });
        }
    },
    compArborescence = {
        template : '#page-arborescence-template'
    },
    compAjout = {
        template : '#page-ajout-template',
        data : function () {
            return {
                isWiki : true,
                inWiki : '',
                nomChemin1 : 'Catégorie',
                choixChemin1 : [{id : 1, texte : 'Procédure'}, {id : 2, texte : 'Devis'}],
                chemin1 : '',
                nomChemin2 : 'Année',
                choixChemin2 : [{id : 1, texte : '2016'}, {id : 2, texte : '2017'}, {id : 3, texte : '2018'}, {id : 4, texte : '2019'}],
                chemin2 : '',
                nomChemin3 : 'Prestataire',
                choixChemin3 : [{id : 1, texte : 'Global Infos'}, {id : 2, texte : 'Inmac'}, {id : 3, texte : 'Bechtle'}],
                chemin3 : ''
            };
        }
    },
    routes = [
        { path: '/login', component: compLogin },
        { path: '/recherche', component: compRecherche },
        { path: '/tags', component: compTags },
        { path: '/arborescence', component: compArborescence },
        { path: '/ajout', component: compAjout },
        { path: '/configuration', component: compConfiguration },
        { path: '*', redirect: '/recherche' }
    ];

router = new VueRouter({
    routes : routes,
    linkActiveClass : 'uk-active'

});

router.beforeEach(function (to, from, next) {
    if (!utilisateur.loggedIn && to.path !== '/login') {
        next("/login");
    } else if (utilisateur.loggedIn && to.path === '/login') {
        next("/");
    } else {
        next();
    }
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
        var me = this,
            rechercheAc = new Bloodhound({
                datumTokenizer: Bloodhound.tokenizers.whitespace,
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                remote: {
                    url: 'http://ged/server/acRecherche.php?prefix=%QUERY',
                    wildcard: '%QUERY',
                    transform : function (reponse) { return reponse.terms; }
                }
            });
        $(this.$el).typeahead(
            {
                hint: true,
                highlight: true,
                minLength: 1
            },
            {
                name: 'recherche',
                source: rechercheAc
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

Vue.component('in-utilisateur', {
    template : '<select multiple v-bind:value="value"></select>',
    props : ['value', 'inactifs'],
    mounted : function () {
        var me = this,
            source = typeof this.inactifs === "undefined" ? "http://ged/server/listeUtilisateurs.php" : "http://ged/server/listeUtilisateurs.php?inactifs=true";
        
        $(this.$el).tokenize2({tokensAllowCustom: false, dataSource: source, searchFromStart : false, debounce : 200, tokensMaxItems : 1});
        $(this.$el).on('tokenize:tokens:add', function (e, value) { me.$emit('input', value); });
    },
    watch : {
        value : function (value) {
            if (value === '') { $(this.$el).tokenize2().trigger('tokenize:clear'); }
        }
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
            thumbnails: {
                onItemRemove: function (itemEl, listEl, parentEl, newInputEl, inputEl) {
                    itemEl.remove();
                }
            },
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

Vue.component('in-wiki', {
    template : '<textarea v-bind:value="value"></textarea>',
    props: ['value'],
    mounted : function () {
        console.log("ici");
        var me = this;
        
        this.id = "editor-" + Math.floor(1000 * Math.random());
        $(this.$el).attr('id', this.id);
        this.instance = CKEDITOR.replace(this.id);
        
        this.instance.on('change', function () {
            var html = me.instance.getData();
            if (html !== me.value) {
                me.$emit('input', html);
            }
        });
        //$(this.$el).ckeditor();
    }
});

$(function () {
    
    //$.get(serverPrefix + "server/isConnected.php", function (data) { console.log("data"); });
    var viewmodel;

    serverCall("server/isConnected.php", function (data) {
        if (data.connecte) {
            utilisateur.informationsRecuperees = true;
            utilisateur.loggedIn = true;
            utilisateur.nom = data.nom;
            utilisateur.num_utilisateur = data.num_utilisateur;
            //console.log(router);
        }
        console.log(data);
        viewmodel = new Vue({
            data : {
                utilisateur : utilisateur
            },
            router : router,
            el: '#gedInstance',
            methods : {
                onDisconnect : function () {
                    serverCall("server/disconnect.php");
                    utilisateur.loggedIn = false;
                    router.push("/login");
                    console.log("ici");
                }
            }
        });
    });
});
