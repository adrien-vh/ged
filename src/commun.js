C = {
  serverPrefix: 'http://ged/',
  utilisateur: {
    informationsRecuperees: false,
    loggedIn: false,
    num_utilisateur: 0,
    nom: ''
  }
}

U = {
  serverCall: function (url, p1, p2) {
    p1 = p1 || {}
    p2 = p2 || function () {}

    var data = $.isFunction(p1) ? {} : p1
    var callback = $.isFunction(p1) ? p1 : p2
    $.ajax({
      type: 'POST',
      url: C.serverPrefix + url,
      data: data,
      success: callback,
      dataType: 'json',
      crossDomain: true,
      xhrFields: { withCredentials: true }
    })
  }
}
