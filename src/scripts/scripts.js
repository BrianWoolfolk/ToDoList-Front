// #region ##################################################################################### SHORTCUTS
// ---------------------------------------------------------------------- RANDOM RANGE

import { useState } from "react";

/**
 * Create some random number between the specified ranges.
 *
 * @param _min Range's start (inclusive), `default: 0`.
 * @param _max Range's end (inclusive), `default: 10`.
 * @param _decimal Whether to output a `int` number or a `float` number, `default: false`.
 * @returns A random `number`.
 */
export function randomRange(_min = 0, _max = 10, _decimal = false) {
  const _diff = _max - _min;

  if (!_decimal) return Math.round(_min + _diff * Math.random());
  return _min + _diff * Math.random();
}

// ---------------------------------------------------------------------- BOUNDARIES
/**
 * Returns a valid number between some specific limits (inclusive) without letting it to overflow.
 *
 * @param {number} _value Value to check.
 * @param {number?} _min Inferior limit, pass `undefined` for limitless.
 * @param {number?} _max Superior limit, pass `undefined` for limitless.
 * @param {boolean?} _wrap Jump the value to the other limit in case of overflow, `default: false`.
 * @returns A `number` between those limits.
 */
export function boundaries(_value, _min, _max, _wrap = false) {
  _min = _min ?? _value;
  _max = _max ?? _value;

  if (!_wrap) {
    if (_value < _min) return _min;
    if (_value > _max) return _max;
    return _value;
  }

  if (_value < _min) return _max;
  if (_value > _max) return _min;
  return _value;
}

// ---------------------------------------------------------------------- STALL
/**
 * Funcion para simular un tiempo de espera, se utiliza con `async/await`.
 *
 * @param stallTime Tiempo de espera en milisegundos, `default = 3000ms (3s)`.
 * @returns {Promise<boolean>}
 * @example console.log("Tiempo inicial");
 * await stall(); // Espera 3s
 * console.log("Despues de 3s");
 */
export async function stall(stallTime = 3000) {
  return new Promise((r) => setTimeout(() => r(true), stallTime));
}

// ---------------------------------------------------------------------- RANDOM DATE
/**
 * Genera una fecha aleatoria entre dos li­mites inclusivos.
 *
 * @param {string | Date} start Fecha de inicio, en ISOstring o `Date`, `default: "2000-01-01"`.
 * @param {string | Date} end Fecha final, en ISOstring o `Date`, `default: new Date()`.
 * @returns {Date} Una fecha generada aleatoriamente dentro del rango determinado.
 */
export function randomDate(start = new Date("2000-01-01"), end = new Date()) {
  start = new Date(intoInputDate(start));
  end = new Date(intoInputDate(end));

  const mul = 1000 * 3600 * 24;
  const ss = start.getTime() / mul;
  const ee = end.getTime() / mul;
  const rr = randomRange(ss, ee);

  const dd = new Date(rr * mul);
  return new Date(dd.getUTCFullYear(), dd.getUTCMonth(), dd.getUTCDate());
}

// ---------------------------------------------------------------------- FIT STRING
/**
 * Ajusta un `string` a un tamanyo determinado, ya sea abreviando alguna parte si se excede,
 * o agregando caracteres hasta que se complete dicho tamanyo.
 * @param {string} str Cadena de texto con la cual trabajar.
 * @param {number} max Maximo de tamanyo para ajustar, default `16`.
 * @param {-1 | 0 | 1} pos Alineacion de hacia donde ajustar o expandir (**izquierda**, **derecha** o al **medio**), default `0`.
 * @param {boolean?} grow Representa si deberia de expandirse en caso de ser necesario, default `false`.
 * @param {string} shortChar Representa el caracter con el cual abreviar, default `"..."`.
 * @param {string} fillChar Representa el caracter con el cual rellenar, default `" "`.
 * @returns La cadena de texto correctamente ajustada, donde `str.length === max` (si se marca `grow`).
 */
export function fitString(
  str,
  max = 16,
  pos = 0,
  grow,
  shortChar = "...",
  fillChar = " "
) {
  let result = str;
  if (str.length > max) {
    const diff = max - shortChar.length;
    if (pos === "right" || pos === "end" || pos === 1) {
      result = str.substring(0, diff) + shortChar;
    } else if (pos === "left" || pos === "start" || pos === -1) {
      result = shortChar + str.substring(str.length - diff);
    } else {
      result =
        str.substring(0, diff / 2) +
        shortChar +
        str.substring(str.length - diff / 2);
    }
  } else if (grow) {
    if (pos === "right" || pos === "end" || pos === 1) {
      result = str.padEnd(max, fillChar);
    } else if (pos === "left" || pos === "start" || pos === -1) {
      result = str.padStart(max, fillChar);
    } else {
      result =
        str.substring(0, str.length / 2).padStart(max / 2, fillChar) +
        str.substring(str.length / 2).padEnd(max / 2, fillChar);
    }
  }

  return result;
}

// ---------------------------------------------------------------------- METRICS TIME
/**
 * Takes any number of seconds and converts it into days, hours, minutes.
 *
 * If no seconds are given, it shows 'N/A', or 'less than a minute' if needed.
 * @param {number} seconds Total seconds to parse
 * @returns {string} A string indicating the time left
 */
export function metricsTime(seconds) {
  seconds = parseNumber(seconds);
  const minutes = Math.floor(seconds / 60);
  const hrs = Math.floor(minutes / 60);
  let str = "";

  if (hrs >= 60) str += `${Math.floor(hrs / 60)} day(s) `;
  if (minutes >= 60) str += `${hrs % 60}`.padStart(2, "0") + " hr(s) ";
  str += `${minutes % 60}`.padStart(2, "0") + " min(s)";

  if (!seconds) return "N/A";
  if (seconds < 60) return "less than a minute";
  return str;
}
// #endregion

// #region ##################################################################################### PARSERS
// ---------------------------------------------------------------------- PARSE ID
/**
 * Parses any given `string` to match an alphanumeric type ID, replacing any other char
 * with a hyphen `-` and removes punctuation marks from latin chars and such.
 *
 * @param {string} val `string` to transform.
 * @param {boolean} hyphen Whether or not to replace every white space with hyphens. `from this`, `to-this`, default: `false`.
 * @returns Transformed `string`.
 */
export function parseID(val, hyphen = false) {
  const a = val
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(REGEXPS._removeAccents, "");

  return hyphen ? a.replace(/[\s\W_]+/gim, "-") : a;
}

// ---------------------------------------------------------------------- PARSE NUMBER
/**
 * Extended version of `Number.parseInt` & `Number.parseFloat`, it accepts any kind of `string` and does
 * not returns `NaN`, in that case returns `0`.
 *
 * @param {string | number} str String to parse.
 * @param {boolean} decimal Whether to use `parseFloat` or `parseInt`, defaults to `false`.
 * @returns A number correctly parsed, or a default `0` if it catches a `NaN`.
 */
export function parseNumber(str, decimal = false) {
  if (typeof str === "number") return str;
  const neg = /^[^\d]*-.*\d/.test(str) ? -1 : 1;
  str = str.replace(/[^0-9.]+/gim, "");
  if (decimal) return Number.parseFloat(str || "0") * neg;
  else return Number.parseInt(str || "0") * neg;
}

// ---------------------------------------------------------------------- INTO INPUT DATE
/**
 * Pasamos de un formato `Date` o un ISO string normal, a algo que entienda el `input[type="date"]`.
 *
 * Cuando creamos un `Date` se crea en tiempo ISO, pero despues se "traduce" al tiempo local.
 * Un `input[type="date"]` **SIEMPRE** trabaja con ISO, lo que es un problema porque nosotros lo manipulamos
 * como si fuera el tiempo local.
 *
 * @param {string | Date} date Una fecha real la cual meter al input.
 */
export function intoInputDate(date) {
  const tt = new Date(date);
  const dd = tt.getDate().toString();
  const mm = (tt.getMonth() + 1).toString();
  const yy = tt.getFullYear().toString();

  const st =
    yy.padStart(4, "0") + "-" + mm.padStart(2, "0") + "-" + dd.padStart(2, "0");
  return st;
}

// ---------------------------------------------------------------------- FROM INPUT DATE
/**
 * Metodo opuesto al `intoInputDate`, siendo que este revierte los cambios.
 *
 * Cuando un `input[type="date"]` cambia de valor, te regresa un string como "yyyy-MM-dd"
 * segun la fecha que le colocaste, pero esa fecha esta en tiempo local (porque
 * tu mismo la seleccionaste pensando en tu tiempo local), entonces, si lo conviertes
 * de regreso a ISO, el tiempo local se va a alterar hacia delante o hacia atras.
 *
 * @param {string} date `string` directamente sacado como value del input.
 */
export function fromInputDate(date) {
  const yy = parseNumber(date.substring(0, 4));
  const mm = parseNumber(date.substring(5, 7)) - 1;
  const dd = parseNumber(date.substring(8, 10));

  const dt = new Date(yy, mm, dd);
  dt.setFullYear(yy);
  return dt;
}
// #endregion

// #region ##################################################################################### HOOKS
// ---------------------------------------------------------------------- USE REFRESH
/**
 * Hook para forzar "reloads" en algun componente.
 *
 * Para remontar un componente completo se usa `volkey` como `key`.
 * (Porque en react los componentes se re-ejecutan o re-montan cuando su llave cambia).
 *
 * @returns {[() => void, number]} Una funcion que cuando se ejecuta, se refresca el componente.
 */
export function useRefresh() {
  const [volkey, sv] = useState(0);
  return [() => sv((p) => p + 1), volkey];
}
// #endregion

// #region ##################################################################################### CONSTANTS
// ---------------------------------------------------------------------- REGEXPS
/**
 * Grupo de **Expresiones Regulares** muy utilizadas a lo largo de las funciones y del proyecto.
 *
 * Solo se incluyen aquellas expresiones que sean lo suficientemente complejas como para que valga
 * la pena guardarse por separado, mÃ­nimamente para ahorrar espacio.
 *
 * Se usan mayormente dentro de algunas funciones, pero pueden usarse individualmente en la app.
 */
export const REGEXPS = {
  /** Quita todos los acentos de las letras, se usa con ayuda de `parseID`. */
  _removeAccents: /[\u0300-\u036f]/g,
};
// #endregion
