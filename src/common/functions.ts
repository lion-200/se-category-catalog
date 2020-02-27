export function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function queryParam(ary) {
  return Object.keys(ary).map(function (key) {
    if (Array.isArray(ary[key])) {
      const arrayParts = [];

      for (let i = 0; i < ary[key].length; i++) {
        arrayParts.push(encodeURIComponent(key + '[]') + '=' + encodeURIComponent(ary[key][i]));
      }

      return arrayParts.join('&');
    }
    return encodeURIComponent(key) + '=' + encodeURIComponent(ary[key]);
  }).join('&');
}

export function popupCenter(url, title, w, h) {
  /* istanbul ignore next */
  const dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : window.screenX;

  /* istanbul ignore next */
  const dualScreenTop = window.screenTop != undefined ? window.screenTop : window.screenY;

  /* istanbul ignore next */
  const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;

  /* istanbul ignore next */
  const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

  const systemZoom = width / window.screen.availWidth;
  const left = (width - w) / 2 / systemZoom + dualScreenLeft
  const top = (height - h) / 2 / systemZoom + dualScreenTop
  const newWindow = window.open(url, title, 'scrollbars=yes, width=' + w / systemZoom + ', height=' + h / systemZoom + ', top=' + top + ', left=' + left);

  if (newWindow?.focus) {
    newWindow.focus();
  }

  return newWindow;
}
