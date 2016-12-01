var token = document.getElementById('token');
var url = document.getElementById('url');
var submitBtn = document.getElementById('submit');
token.oninput = function() {
  disabled = !token.checkValidity();
  submitBtn.disabled = disabled;
  url.disabled = disabled;
}

url.oninput = function() {
  submitBtn.disabled = !url.checkValidity();
}

document.getElementById('setwebhook').onsubmit = function() {
  var result = document.getElementById('result');
  result.style.display = 'block';
  result.innerHTML  = 'Please wait..';
  var hook = url.value;
  if (hook.substr(0, 7) == 'http://') {
    hook = 'https://'+(window.location.protocol != 'https:' ? 'setwebhook.ga' : window.location.host)+'/'+hook;
  } 
  var xhttp = new XMLHttpRequest();
  xhttp.onload = function() {
    if (xhttp.status == 404) {
      result.innerHTML = 'Invalid bot token';
    } else {
      var json = JSON.parse(this.responseText);
      result.innerHTML  = json.description;
    }
  };
  xhttp.open('GET', 'https://api.telegram.org/bot'+token.value+'/setWebhook?url='+hook, true);
  xhttp.send();
}