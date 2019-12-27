document.addEventListener('DOMContentLoaded', function() {
  var editor = document.getElementById('editor');
  var status = document.getElementById('status');
  var actions = document.getElementById('actions');
  var savedScript = localStorage.getItem('scripts');
  var code = document.getElementById('code');
  var saveBtn = document.getElementById('saveBtn');
  var runBtn = document.getElementById('runBtn');
  var editBtn = document.getElementById('editBtn');
  var clearBtn = document.getElementById('clearBtn');
  var cancelBtn = document.getElementById('cancelBtn');

  var textStart = '&#10033; Click "Run my script" to activate your script on the current tab.';
  var textEdit = '&#10033; Paste your JavaScript code you would like to run into the box above and click save.';
  var textRunning = '&#10095; Running code...';
  var textEmpty = '&#x26A0; Can\'t run anything if you don\'t give me anything.';
  var textSaved = '&#10004; Code saved.';
  var textSuccess = '&#10004; All done! Enjoy.';
  var textErr = '&#x26A0; It\'s dead Jim...<br><br>';

  status.innerHTML = textStart;

  if (savedScript) {
    code.value = savedScript;
  } else {
    editor.classList.add('active');
    actions.classList.remove('active');
    status.innerHTML = textEdit;
    status.className = '';
  }

  editBtn.addEventListener('click', function () {
    editor.classList.add('active');
    actions.classList.remove('active');
    status.innerHTML = textEdit;
    status.className = '';
  });

  saveBtn.addEventListener('click', function () {
    localStorage.setItem('scripts', code.value);
    editor.classList.remove('active');
    actions.classList.add('active');
    status.innerHTML = textSaved;
    status.className = 'success';
    setTimeout(() => {
      status.innerHTML = textStart;
      status.className = '';
    }, 1000);
  });

  cancelBtn.addEventListener('click', function () {
    editor.classList.remove('active');
    actions.classList.add('active');
    status.innerHTML = textStart;
    status.className = '';
    var originalScript = localStorage.getItem('scripts');
    code.value = originalScript;
  });

  clearBtn.addEventListener('click', function () {
    var c = confirm("Are you sure you want to clear your code? You won't be able to get it back after you click save!");
    if (c === true) {
      code.value = null;
    }
  });

  runBtn.addEventListener('click', function () {
    status.innerHTML = textRunning;
    status.className = 'info';


    if (!code.value || code.value.length <= 0) {
      status.innerHTML = textEmpty;
      status.className = 'err';
      return;
    }

    var commentedCode = "console.log('%c[START - Run My Script ] ###########################################', 'color: orange; font-weight: bold');" + code.value + "console.log('%c[END - Run My Script ] #############################################', 'color: orange; font-weight: bold');";

    setTimeout(() => {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.executeScript(tabs[0].id, {
          code: commentedCode
        }, function(response) {
          status.innerHTML = textSuccess;
          status.className = 'success';

          if (chrome.runtime.lastError) {
            status.innerHTML = textErr + chrome.runtime.lastError.message;
            status.className = 'err';
          }
        });
      });
    }, 600);

  });
});
