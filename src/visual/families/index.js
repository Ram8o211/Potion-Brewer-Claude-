// The family morphology modules, by family name (visual/taxonomy.js).
// Each has its own construction grammar; see the comment at the top of each.
import * as flower from './flower.js';
import * as herb from './herb.js';
import * as root from './root.js';
import * as fungus from './fungus.js';
import * as moss from './moss.js';
import * as fruit from './fruit.js';
import * as reed from './reed.js';
import * as bark from './bark.js';
import * as crystal from './crystal.js';
import * as mineral from './mineral.js';
import * as shell from './shell.js';

/** @type {Record<string, {params:Function, size:Function, plant:Function, icon:Function, piece:Function}>} */
export const FAMILIES = { flower, herb, root, fungus, moss, fruit, reed, bark, crystal, mineral, shell };
