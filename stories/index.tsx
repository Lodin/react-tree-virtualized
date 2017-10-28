// tslint:disable:insecure-random

// import {action} from '@storybook/addon-actions';
// import {linkTo} from '@storybook/addon-links';
import {storiesOf} from '@storybook/react';
import * as React from 'react';
import * as uuid from 'uuid/v4';
import Tree, {Node} from '../src';

const randomWords = [
  'abstrusity',
  'advertisable',
  'bellwood',
  'benzole',
  'boreum',
  'brenda',
  'cassiopeian',
  'chansonnier',
  'cleric',
  'conclusional',
  'conventicle',
  'copalm',
  'cornopion',
  'crossbar',
  'disputative',
  'djilas',
  'ebracteate',
  'ephemerally',
  'epidemical',
  'evasive',
  'eyeglasses',
  'farragut',
  'fenny',
  'ferryman',
  'fluently',
  'foreigner',
  'genseng',
  'glaiket',
  'haunch',
  'histogeny',
  'illocution',
  'imprescriptible',
  'inapproachable',
  'incisory',
  'intrusiveness',
  'isoceraunic',
  'japygid',
  'juiciest',
  'jump',
  'kananga',
  'leavening',
  'legerdemain',
  'licence',
  'licia',
  'luanda',
  'malaga',
  'mathewson',
  'nonhumus',
  'nonsailor',
  'nummary',
  'nyregyhza',
  'opis',
  'orphrey',
  'paganising',
  'pebbling',
  'penchi',
  'photopia',
  'pinocle',
  'principally',
  'prosector.',
  'radiosensitive',
  'redbrick',
  'reexposure',
  'revived',
  'subexternal',
  'sukarnapura',
  'supersphenoid',
  'tabularizing',
  'territorialism',
  'tester',
  'thalassography',
  'tuberculise',
  'uncranked',
  'undersawyer',
  'unimpartible',
  'unsubdivided',
  'untwining',
  'unwaived',
  'webfoot',
  'wedeling',
  'wellingborough',
  'whiffet',
  'whipstall',
  'wot',
  'yonkersite',
  'zonary',
];

const random = (max: number) => Math.round(Math.random() * 1000) % max;

function createRandomizedItem(key: string, depth: number): any {
  const item: any = {};
  item.children = [];
  item.name = `${randomWords[random(randomWords.length)]}-${uuid()}`;
  item.id = `${key}/${item.name}`;

  const numChildren = depth < 3 ? Math.floor(Math.random() * 5) : 0;
  for (let i = 0; i < numChildren; i += 1) {
    item.children.push(createRandomizedItem(item.id, depth + 1));
  }

  return item;
}

function createRandomizedData(): any {
  const data = [];

  for (let i = 0; i < 10000; i += 1) {
    data.push(createRandomizedItem('/', 0));
  }

  return data;
}

const randomData = {
  children: createRandomizedData(),
  id: '/',
  name: 'root',
};

interface TreeNode {
  deepLevel: number;
  node: any;
}

function * nodeGetter(): IterableIterator<Node> {
  const stack: TreeNode[] = [];

  stack.push({
    deepLevel: 0,
    node: randomData,
  });

  while (stack.length !== 0) {
    const {node, deepLevel} = stack.pop() as TreeNode;

    const isOpen = yield {
      childrenCount: node.children.length,
      data: node.name,
      deepLevel,
      id: node.id,
      isLeaf: node.children.length === 0,
      isOpened: false,
    };

    if (node.children.length !== 0 && isOpen) {
      for (let i = 0, len = node.children.length; i < len; i += 1) {
        stack.push({
          deepLevel: deepLevel + 1,
          node: node.children[i],
        });
      }
    }
  }
}

storiesOf('Tree', module)
  .add('Default', () => (
    <Tree
      nodeGetter={nodeGetter}
      height={500}
      rowHeight={25}
      rowCount={1}
      width={500}
    />
  ));
