import test from 'node:test';
import assert from 'node:assert/strict';
import { getQuestBatch } from '../site/library.js';

const quests=[
  {id:'old',title:'Old',generatedAt:'2026-01-01T00:00:00Z'},
  {id:'current',title:'Current',generatedAt:'2026-03-01T00:00:00Z'},
  {id:'new',title:'New',generatedAt:'2026-04-01T00:00:00Z'},
  {id:'middle',title:'Middle',generatedAt:'2026-02-01T00:00:00Z'}
];

test('getQuestBatch excludes the current quest and returns newest first',()=>{const result=getQuestBatch(quests,'current',0,2);assert.deepEqual(result.items.map(x=>x.id),['new','middle']);assert.equal(result.hasMore,true)});
test('getQuestBatch loads the next page without duplicates',()=>{const result=getQuestBatch(quests,'current',2,2);assert.deepEqual(result.items.map(x=>x.id),['old']);assert.equal(result.hasMore,false)});
test('getQuestBatch handles an empty library',()=>assert.deepEqual(getQuestBatch([{id:'current'}],'current',0,3),{items:[],hasMore:false,nextOffset:0}));
