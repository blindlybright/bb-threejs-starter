require('es6-promise').polyfill();

// nb: webpack related definitions for typescript' import, silently used
import './dto/webpack/index.d';


import(/* webpackChunkName: "app-styles" */ '../scss/style.scss')
    .then(() => import('./app'))
    .catch((e) => console.error(e));
