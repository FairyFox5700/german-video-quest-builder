import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { addQuest } from '../tools/add-quest-lib.mjs';

const quest={schemaVersion:'1.0',id:'abc12345678-b2',language:'de',level:'B2',source:{type:'youtube',url:'https://youtu.be/abc12345678',videoId:'abc12345678',title:'Test Video',accessedAt:'2026-11-04T00:00:00Z'},article:{title:'Testquest',paragraphs:['Eins.','Zwei.','Drei.']},quiz:Array.from({length:4},(_,i)=>({id:`q${i}`,prompt:'Frage?',options:[{id:'a',text:'A'},{id:'b',text:'B'}],correctOptionId:'a',feedbackCorrect:'Richtig',feedbackIncorrect:'Falsch',xp:10})),sentencePuzzles:[1,2].map(i=>({id:`p${i}`,instruction:'Ordne.',tokens:[{id:'a',text:'Je mehr'},{id:'b',text:'desto besser.'}],solutionTokenIds:['a','b'],explanation:'Muster',xp:15})),vocabulary:Array.from({length:8},(_,i)=>({id:`v${i}`,term:`Wort ${i}`,meaning:'meaning',partOfSpeech:'noun',exampleDe:'Beispiel.'})),gamification:{initialHearts:3,completionBonusXp:20},generation:{generatedAt:'2026-11-04T00:00:00Z',model:'Hermes Agent',promptVersion:'1'}};

test('addQuest writes quest and sorted catalog',async()=>{const root=await mkdtemp(join(tmpdir(),'quest-'));await addQuest(quest,root);const saved=JSON.parse(await readFile(join(root,'data','quests','abc12345678-b2.json'),'utf8'));const catalog=JSON.parse(await readFile(join(root,'data','catalog.json'),'utf8'));assert.equal(saved.id,quest.id);assert.equal(catalog.quests[0].id,quest.id);assert.equal(catalog.quests[0].title,'Testquest')});

test('addQuest refuses invalid data without writing',async()=>{const root=await mkdtemp(join(tmpdir(),'quest-'));const bad=structuredClone(quest);bad.quiz=[];await assert.rejects(()=>addQuest(bad,root),/quiz needs/)});
