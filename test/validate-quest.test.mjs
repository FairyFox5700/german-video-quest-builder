import test from 'node:test';
import assert from 'node:assert/strict';
import { validateQuest } from '../tools/validate-quest.mjs';

const valid = {
  schemaVersion:'1.0', id:'demo-b2', language:'de', level:'B2',
  source:{type:'youtube',url:'https://youtu.be/zyWx9KNz2oI',videoId:'zyWx9KNz2oI',title:'Demo',accessedAt:'2026-11-04T00:00:00Z'},
  article:{title:'Titel',paragraphs:['Absatz eins.','Absatz zwei.','Absatz drei.']},
  quiz:Array.from({length:4},(_,i)=>({id:`q${i}`,prompt:'Frage?',options:[{id:'a',text:'A'},{id:'b',text:'B'}],correctOptionId:'a',feedbackCorrect:'Richtig',feedbackIncorrect:'Noch einmal',xp:10})),
  sentencePuzzles:[1,2].map(i=>({id:`p${i}`,instruction:'Ordne.',tokens:[{id:'a',text:'Je mehr'},{id:'b',text:'desto besser.'}],solutionTokenIds:['a','b'],explanation:'je … desto',xp:15})),
  vocabulary:Array.from({length:8},(_,i)=>({id:`v${i}`,term:`Wort ${i}`,meaning:'meaning',partOfSpeech:'noun',exampleDe:'Ein Beispielsatz.'})),
  gamification:{initialHearts:3,completionBonusXp:20},generation:{generatedAt:'2026-11-04T00:00:00Z',model:'Hermes Agent',promptVersion:'1'}
};

test('accepts a complete valid quest',()=>assert.deepEqual(validateQuest(valid),[]));
test('rejects unsupported level',()=>{const q=structuredClone(valid);q.level='C2';assert.match(validateQuest(q).join('\n'),/level/)});
test('rejects quiz answer that does not resolve',()=>{const q=structuredClone(valid);q.quiz[0].correctOptionId='missing';assert.match(validateQuest(q).join('\n'),/correctOptionId/)});
test('rejects puzzle solution that is not an exact permutation',()=>{const q=structuredClone(valid);q.sentencePuzzles[0].solutionTokenIds=['a','a'];assert.match(validateQuest(q).join('\n'),/permutation/)});
test('rejects duplicate IDs',()=>{const q=structuredClone(valid);q.quiz[1].id='q0';assert.match(validateQuest(q).join('\n'),/duplicate/)});
