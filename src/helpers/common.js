
// RFC5322 (optimized RFC822 version)
const emailRegex = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)])$/
const urlRegex = /^(?:(?:https?):\/\/)?(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i

export function priceFormatter(price) {
  // parseFloat(parseFloat(0.14567890123456789).toExponential(4)) // TODO rework. IF 1000 > number > 0.000001. If > 1k toFixed(2)
  // console.log(price)
  if (price < 0.00001) {
    return parseFloat(price).toFixed(8)
  } else if (price >= 0.00001 && price < 1)
    return parseFloat(price).toFixed(5)
  else
    return parseFloat(price).toFixed(3)
}

// export function symbolItemByInfo(symbolInfo) {
//   return {
//     symbol: symbolInfo.name,
//     full_name: symbolInfo.full_name,
//     exchange: symbolInfo.exchange,
//     exchange_id: symbolInfo.exchange_id,
//     pair_addr: symbolInfo.full_name.split(':')[2],
//     pair_id: symbolInfo.pair_id,
//     type: symbolInfo.type,
//     description: symbolInfo.description,
//     needInvert: symbolInfo.needInvert
//   }
// }

const exponentToNumber = function(exp) {
  const data = String(exp).split(/[eE]/);
  if (data.length === 1) return data[0];

  let z = '',
    sign = exp < 0 ? '-' : '',
    str = data[0].replace('.', ''),
    mag = Number(data[1]) + 1;

  if (mag < 0) {
    z = sign + '0.';
    while (mag++) z += '0';
    return z + str.replace(/^\-/, '');
  }
  mag -= str.length;
  while (mag--) z += '0';
  return str + z;
}

function getQueryParams(param = null) {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  return param ? params[param] : params
}

function debounce(fn, delay) {
  let timeoutID = null
  return function () {
    clearTimeout(timeoutID)
    const args = arguments
    const that = this
    timeoutID = setTimeout(function () {
      fn.apply(that, args)
    }, delay)
  }
}

export { exponentToNumber, getQueryParams, debounce, emailRegex, urlRegex }