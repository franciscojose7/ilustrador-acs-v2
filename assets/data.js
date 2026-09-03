/* Datos publicados ACS — único archivo a editar cuando cambia una tabla.
   Sin lógica: sólo números. */
var ACS = (function(){
"use strict";

/* ── Admin charge ──────────────────────────────────────────────────── */
var TERMS = [3,4,5,6,7,8,9,10];                                  // años
var AC0   = {3:2.33,4:2.00,5:1.80,6:1.53,7:1.34,8:1.20,9:1.09,10:1.00}; // % anual, sacrificio 0%
var AC100 = {3:0.67,4:0.50,5:0.40,6:0.34,7:0.30,8:0.26,9:0.23,10:0.21}; // % anual, sacrificio 100%

var SACS = [0,10,20,30,40,50,60,70,80,90,100];                   // % de sacrificio
var MATRIX = {
    0:[2.33,2.00,1.80,1.53,1.34,1.20,1.09,1.00],
   10:[2.16,1.85,1.66,1.41,1.24,1.11,1.00,0.92],
   20:[2.00,1.70,1.52,1.29,1.13,1.01,0.92,0.84],
   30:[1.83,1.55,1.38,1.17,1.03,0.92,0.83,0.76],
   40:[1.67,1.40,1.24,1.06,0.92,0.82,0.75,0.68],
   50:[1.50,1.25,1.10,0.94,0.82,0.73,0.66,0.60],
   60:[1.33,1.10,0.96,0.82,0.71,0.63,0.58,0.53],
   70:[1.17,0.95,0.82,0.70,0.61,0.54,0.49,0.45],
   80:[1.00,0.80,0.68,0.58,0.50,0.45,0.40,0.37],
   90:[0.83,0.65,0.54,0.46,0.40,0.36,0.32,0.29],
  100:[0.67,0.50,0.40,0.34,0.30,0.26,0.23,0.21]
};

/* ── Escala de comisión de la estructura (fija) ─────────────────────
   pct = % de la estructura que le corresponde al nivel
   acs = comisión upfront máxima (sacrificio 0%), en % de la prima,
         para los términos de COM_TERMS. Entre esos términos se interpola. */
var COM_TERMS = [3,5,8,10];
var LEVELS = [
  {n:15, pct:85,   acs:[5.00,7.00,7.50,7.90]},
  {n:14, pct:82.5, acs:[4.75,6.75,7.25,7.65]},
  {n:13, pct:80,   acs:[4.50,6.50,7.00,7.40]},
  {n:12, pct:77.5, acs:[4.25,6.25,6.75,7.15]},
  {n:11, pct:75,   acs:[4.00,6.00,6.50,6.90]},
  {n:10, pct:70,   acs:[3.50,5.50,6.00,6.40]},
  {n: 9, pct:65,   acs:[3.00,5.00,5.50,5.90]},
  {n: 8, pct:60,   acs:[2.75,4.75,5.25,5.65]},
  {n: 7, pct:55,   acs:[2.50,4.50,5.00,5.40]},
  {n: 6, pct:50,   acs:[2.25,4.25,4.75,5.15]},
  {n: 5, pct:45,   acs:[2.00,4.00,4.50,4.90]},
  {n: 4, pct:40,   acs:[1.75,3.75,4.25,4.65]},
  {n: 3, pct:35,   acs:[1.50,3.50,4.00,4.40]}
];
var DEFAULT_LEVEL = 9;

/* ── Prima admitida ────────────────────────────────────────────────── */
var PRIMA_MIN = 75000, PRIMA_MAX = 100000000;

return {TERMS:TERMS, AC0:AC0, AC100:AC100, SACS:SACS, MATRIX:MATRIX,
        COM_TERMS:COM_TERMS, LEVELS:LEVELS, DEFAULT_LEVEL:DEFAULT_LEVEL,
        PRIMA_MIN:PRIMA_MIN, PRIMA_MAX:PRIMA_MAX};
})();
