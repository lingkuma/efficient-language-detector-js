const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

const sources = [
  'src/avgScore.js',
  'src/languageData.js',
  'src/regexPatterns.js',
  'src/dictionary.js',
  'src/isoLanguages.js',
  'src/LanguageResult.js',
  'src/saveLanguageSubset.dev.js',
  'src/languageDetector.js',
  'src/ngrams/extrasmall.js',
];

function readSource(file) {
  return fs.readFileSync(path.join(root, file), 'utf8')
    .replace(/^\s*import[^\r\n]*(?:\r?\n|$)/gm, '')
    .replace(/\bexport\s+const\s+/g, 'const ')
    .replace(/\bexport\s+function\s+/g, 'function ')
    .replace(/\bexport\s+class\s+/g, 'class ')
    .replace(/^\s*export\s+\{\s*eld\s*\};\s*$/gm, '');
}

const body = sources.map((file) => `// Source: ${file}\n${readSource(file).trim()}`).join('\n\n');

const output = `/*
Efficient Language Detector extrasmall standalone browser build.
Generated from src/entries/static.extrasmall.js and its dependencies.

Copyright 2023-2025 Nito T.M.
License: Apache-2.0
*/
(function (global) {
  'use strict';

${body.split('\n').map((line) => `  ${line}`).join('\n')}

  setNgrams(ngramsData);

  global.eld = eld;
})(typeof globalThis !== 'undefined' ? globalThis : typeof self !== 'undefined' ? self : window);
`;

const outFile = path.join(root, 'standalone', 'eld.extrasmall.global.js');
fs.mkdirSync(path.dirname(outFile), {recursive: true});
fs.writeFileSync(outFile, output, 'utf8');
console.log(`Wrote ${path.relative(root, outFile)} (${output.length} bytes)`);
