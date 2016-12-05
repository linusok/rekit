'use strict';

const path = require('path');
const _ = require('lodash');
const helpers = require('../../lib/helpers');
const vio = require('../../lib/vio');
const rekit = require('../../lib/rekit');
const refactor = require('../../lib/refactor');
const constant = require('../../lib/constant');
const entry = require('../../lib/entry');
const template = require('../../lib/template');
const action = require('../../lib/action');
const test = require('../../lib/test');

const prjRoot = helpers.getProjectRoot();
const pluginRoot = path.join(prjRoot, 'tools/plugins/redux-saga');

function add(feature, name) {
  name = _.camelCase(name);

  // Saga action is similar with async action except the template.
  action.addAsync(feature, name, {
    templateFile: path.join(pluginRoot, 'templates', 'async_action_saga.js'),
  });

  // Add saga
  const actionTypes = helpers.getAsyncActionTypes(feature, name);
  template.create(helpers.mapFile(feature, `redux/sagas/${name}.js`), {
    templateFile: path.join(pluginRoot, 'templates', 'saga.js'),
    context: {
      feature,
      actionTypes,
      action: name,
    },
  });

  // Add saga ref to rootSaga

  // Add saga test
}


function remove(feature, name) {
  name = _.camelCase(name);

  // Saga action is similar with async action except the template.
  action.removeAsync(feature, name);

  // Remove saga
  vio.del(helpers.mapFile(feature, `redux/sagas/${_.camelCase(name)}.js`));

  // Remove from rootSaga

}

function move(feature, name) {

}

module.exports = {
  add,
  remove,
  move,
};
