import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { validateQuest } from './validate-quest.mjs';
export async function addQuest(quest,root=process.cwd()){
 const errors=validateQuest(quest);if(errors.length)throw new Error(errors.join('\n'));
 const dir=join(root,'data','quests');await mkdir(dir,{recursive:true});
 await writeFile(join(dir,`${quest.id}.json`),JSON.stringify(quest,null,2)+'\n');
 let catalog={schemaVersion:'1.0',quests:[]};try{catalog=JSON.parse(await readFile(join(root,'data','catalog.json'),'utf8'))}catch{}
 const item={id:quest.id,title:quest.article.title,level:quest.level,sourceTitle:quest.source.title,sourceUrl:quest.source.url,generatedAt:quest.generation.generatedAt};
 catalog.quests=[...(catalog.quests||[]).filter(x=>x.id!==quest.id),item].sort((a,b)=>a.title.localeCompare(b.title,'de'));
 await writeFile(join(root,'data','catalog.json'),JSON.stringify(catalog,null,2)+'\n');
 return item;
}
