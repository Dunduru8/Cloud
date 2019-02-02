function getShopParams() {
    var params =  window.location.search.replace("?", "").split("&");
    
    var objectParams = {};
    for(var i = 0; i < params.length; i++) {
      var value = params[i].split("=");
      objectParams[value[0]] = value[1];
    }
  
    return objectParams;
  }

