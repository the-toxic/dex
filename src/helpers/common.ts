
// RFC5322 (optimized RFC822 version)
const emailRegex = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)])$/
const urlRegex = /^(?:(?:https?):\/\/)?(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i


// export function shortNumber(num) {
//   num = num.toString().replace(/[^0-9.]/g, '');
//   if (num < 1000) return num;
//
//   let si = [
//     {v: 1E3, s: "k"},
//     {v: 1E6, s: "M"},
//     {v: 1E9, s: "B"},
//     // {v: 1E12, s: "T"}, {v: 1E15, s: "P"}, {v: 1E18, s: "E"}
//   ];
//   let index;
//   for (index = si.length - 1; index > 0; index--) {
//     if (num >= si[index].v) break;
//   }
//   return (num / si[index].v).toFixed(2).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") + si[index].s;
// }

// const exponentToNumber = function(exp) {
//   const data = String(exp).split(/[eE]/);
//   if (data.length === 1) return data[0];
//
//   let z = '',
//     sign = exp < 0 ? '-' : '',
//     str = data[0].replace('.', ''),
//     mag = Number(data[1]) + 1;
//
//   if (mag < 0) {
//     z = sign + '0.';
//     while (mag++) z += '0';
//     return z + str.replace(/^-/, '');
//   }
//   mag -= str.length;
//   while (mag--) z += '0';
//   return str + z;
// }

function getQueryParams(param = null) {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  return param ? params[param] : params
}

function getCookie(name: string) {
  let matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}
function setCookie(name: string, value: string, options: Record<string, any> = {}) {
  options = { path: '/', ...options };

  if ('expires' in options && options.expires instanceof Date) {
    options.expires = options.expires.toUTCString();
  }

  let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

  for (let optionKey in options) {
    updatedCookie += "; " + optionKey;
    let optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += "=" + optionValue;
    }
  }
  document.cookie = updatedCookie;
}
function deleteCookie(name: string) {
  setCookie(name, "", {'max-age': -1})
}

function debounce(fn: any, delay: number) {
  let timeoutID: number | undefined = undefined
  return function () {
    clearTimeout(timeoutID)
    const args = arguments
    //@ts-ignore
    const that = this
    //@ts-ignore
    timeoutID = setTimeout(function () {
      fn.apply(that, args)
    }, delay)
  }
}

export { getQueryParams, debounce, emailRegex, urlRegex, setCookie, getCookie, deleteCookie }
