var token = document.getElementById('token');
var url = document.getElementById('url');
var submitBtn = document.getElementById('submit');

token.oninput = function() {
  if (token.value.length > 20) {
    submitBtn.disabled = false;
    url.disabled = false;
  } else {
    submitBtn.disabled = true;
    url.disabled = true;
  }
}

url.oninput = function() {
  submitBtn.disabled = false;
  var regex = /^https?:\/\/(\w+\.)?\w{3,}\.\w{2,}/i
  if (url.value.length > 0 && !regex.test(url.value)) {
    submitBtn.disabled = true;
  }
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