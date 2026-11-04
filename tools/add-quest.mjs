import { readFile } from 'node:fs/promises';import { resolve } from 'node:path';import { addQuest } from './add-quest-lib.mjs';
const file=process.argv[2];if(!file){console.error('Usage: node tools/add-quest.mjs quest.json');process.exit(2)}
const quest=JSON.parse(await readFile(resolve(file),'utf8'));const item=await addQuest(quest);console.log(`Added ${item.id}: ${item.title}`);
