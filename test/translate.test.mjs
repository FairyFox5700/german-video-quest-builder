import test from 'node:test';
import assert from 'node:assert/strict';
import { cleanSelection, findLocalTranslation, pickApiTranslation, translateSelection } from '../site/translate.js';

const vocabulary=[{term:'die Gelassenheit',meaning:'composure; calmness'},{term:'unter Druck stehen',meaning:'to be under pressure'}];

test('cleanSelection trims and collapses whitespace',()=>assert.equal(cleanSelection('  unter\n Druck   stehen '),'unter Druck stehen'));
test('cleanSelection rejects empty or overly long selections',()=>{assert.throws(()=>cleanSelection('   '),/Select/);assert.throws(()=>cleanSelection('x'.repeat(201)),/200/)});
test('findLocalTranslation matches glossary terms case-insensitively',()=>assert.equal(findLocalTranslation('DIE GELASSENHEIT',vocabulary),'composure; calmness'));
test('findLocalTranslation also matches a noun selected without its article',()=>assert.equal(findLocalTranslation('Gelassenheit',vocabulary),'composure; calmness'));
test('pickApiTranslation prefers neural machine translation over a poor memory match',()=>{const payload={responseData:{translatedText:'My be under pressure.'},matches:[{translation:'are under pressure',model:'neural'}]};assert.equal(pickApiTranslation(payload),'are under pressure')});
test('translateSelection uses the local glossary without a network request',async()=>{let called=false;const result=await translateSelection('unter Druck stehen',vocabulary,async()=>{called=true});assert.deepEqual(result,{translation:'to be under pressure',source:'glossary'});assert.equal(called,false)});
test('translateSelection calls German to English API for unknown phrases',async()=>{let url='';const result=await translateSelection('ruhig bleiben',vocabulary,async u=>{url=u;return {ok:true,json:async()=>({responseData:{translatedText:'stay calm'},matches:[]})}});assert.match(url,/langpair=de%7Cen/);assert.match(url,/ruhig%20bleiben/);assert.deepEqual(result,{translation:'stay calm',source:'automatic'})});
