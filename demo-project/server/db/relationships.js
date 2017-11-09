/**
 * Created by colinhan on 15/11/2016.
 */

// @flow
import Sequelize from 'sequelize';

type modelClass = (()=>Sequelize.Model | string);
type relation = 'hasOne' | 'hasMany' | 'belongsTo';
type relationship = {
  src: modelClass,
  target: modelClass,
  options: {}
};

const relationships: {[relation]: Array<relationship>} = {};
const defaultOptions: {[relation]: {}} = {
  hasOne: { onUpdate: 'cascade', onDelete: 'cascade' },
  hasMany: { onUpdate: 'cascade', onDelete: 'cascade' },
};

function applyToImpl(funcName: relation, { src, target, options }: relationship) {
  const func = Sequelize.Model.prototype[funcName];
  if (typeof func !== 'function') {
    throw new Error(`Function '${funcName}' is not found.`);
  }

  let srcModel: modelClass;
  if (typeof (src) === 'string') {
    srcModel = this[src];
  } else {
    srcModel = src;
  }

  let targetModel: modelClass;
  if (typeof (target) === 'string') {
    targetModel = this[target];
  } else {
    targetModel = target;
  }

  if (!(src instanceof Sequelize.Model) ||
      !(target instanceof Sequelize.Model)) {
    console.log(src, target);
    throw new Error('Relationship should be define between Sequelize.Model.');
  }

  func.call(srcModel, targetModel, options);
}

function appendImpl(funcName: relation, src: modelClass, target: modelClass, options?: {}) {
  const d = defaultOptions[funcName];
  let r = relationships[funcName];
  if (!r) {
    relationships[funcName] = r = [];
  }
  r.push({
    src,
    target,
    options: Object.assign({}, d, options)
  });
}

module.exports = {
  hasMany: appendImpl.bind(null, 'hasMany'),
  hasOne: appendImpl.bind(null, 'hasOne'),
  belongsTo: appendImpl.bind(null, 'belongsTo'),
  applyTo(models: {}) {
    ['hasOne', 'hasMany', 'belongsTo'].forEach((funcName: relation) => {
      const r = relationships[funcName];
      if (r) {
        r.forEach(applyToImpl.bind(models, funcName));
      }
    });
  }
};
