chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
  console.log('%c[START - Run My Script ] ###########################################', 'color: orange; font-weight: bold');
  eval(request.script);
  console.log('%c[END - Run My Script ] #############################################', 'color: orange; font-weight: bold');
  sendResponse(true);
  return true;
});
