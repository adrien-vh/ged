C = {
  serverPrefix: 'http://ged/',
  utilisateur: {
    informationsRecuperees: false,
    loggedIn: false,
    num_utilisateur: 0,
    nom: '',
    niveau: -1,
    login: '',
    nbLocks: 0
  },
  requetesEnCours: 0,
  pathDemande: ''
}

U = {
  serverCall: function (url, p1, p2) {
    p1 = p1 || {}
    p2 = p2 || function () {}

    var data = $.isFunction(p1) ? {} : p1
    var callback = $.isFunction(p1) ? p1 : p2

    C.requetesEnCours++
    $('#loading div').html(C.requetesEnCours)
    $('#loading').show()

    $.ajax({
      type: 'POST',
      url: C.serverPrefix + url,
      data: data,
      success: function (data) {
        C.requetesEnCours--
        $('#loading div').html(C.requetesEnCours)
        if (C.requetesEnCours === 0) {
          $('#loading').hide()
        }
        if (data.message) {
          $('#message span').html(data.message.texte)
          $('#message').removeClass('invisible').addClass('visible')
          setTimeout(function () {
            $('#message').removeClass('visible').addClass('invisible')
          }, 2000)
        }
        callback(data)
      },
      dataType: 'json',
      crossDomain: true,
      xhrFields: { withCredentials: true }
    })
  }
}
