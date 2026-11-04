const levels=new Set(['A2','B1','B2','C1']);
const pos=new Set(['noun','verb','adjective','adverb','phrase','other']);
const text=(v)=>typeof v==='string'&&v.trim().length>0;
const unique=(xs)=>new Set(xs).size===xs.length;
export function validateQuest(q){
 const e=[];
 if(!q||typeof q!=='object') return ['quest must be an object'];
 if(q.schemaVersion!=='1.0')e.push('schemaVersion must be 1.0');
 if(!text(q.id))e.push('id is required');
 if(q.language!=='de')e.push('language must be de');
 if(!levels.has(q.level))e.push('level must be A2, B1, B2, or C1');
 if(!q.source||q.source.type!=='youtube'||!/^https:\/\/(www\.)?(youtube\.com|youtu\.be)\//.test(q.source.url||''))e.push('source must contain a YouTube URL');
 if(!/^[A-Za-z0-9_-]{11}$/.test(q.source?.videoId||''))e.push('source.videoId must be 11 characters');
 if(!text(q.source?.title)||!text(q.source?.accessedAt))e.push('source title and accessedAt are required');
 if(!text(q.article?.title)||!Array.isArray(q.article?.paragraphs)||q.article.paragraphs.length<3||q.article.paragraphs.some(x=>!text(x)))e.push('article needs a title and at least 3 paragraphs');
 if(!Array.isArray(q.quiz)||q.quiz.length<4)e.push('quiz needs at least 4 questions');
 else q.quiz.forEach((x,i)=>{if(!text(x.id)||!text(x.prompt)||!Array.isArray(x.options)||x.options.length<2||x.options.length>4)e.push(`quiz[${i}] is incomplete`);else if(!x.options.some(o=>o.id===x.correctOptionId))e.push(`quiz[${i}].correctOptionId does not resolve`);if(!Number.isInteger(x.xp)||x.xp<0)e.push(`quiz[${i}].xp must be non-negative`)});
 if(!Array.isArray(q.sentencePuzzles)||q.sentencePuzzles.length<2)e.push('sentencePuzzles needs at least 2 puzzles');
 else q.sentencePuzzles.forEach((x,i)=>{const ids=Array.isArray(x.tokens)?x.tokens.map(t=>t.id):[];const sol=x.solutionTokenIds||[];if(!text(x.id)||ids.length<2)e.push(`sentencePuzzles[${i}] is incomplete`);if(ids.length!==sol.length||!unique(ids)||!unique(sol)||[...ids].sort().join('|')!==[...sol].sort().join('|'))e.push(`sentencePuzzles[${i}] solution must be an exact permutation`)});
 if(!Array.isArray(q.vocabulary)||q.vocabulary.length<8)e.push('vocabulary needs at least 8 items');
 else q.vocabulary.forEach((x,i)=>{if(!text(x.id)||!text(x.term)||!text(x.meaning)||!text(x.exampleDe)||!pos.has(x.partOfSpeech))e.push(`vocabulary[${i}] is incomplete`)});
 if(!Number.isInteger(q.gamification?.initialHearts)||q.gamification.initialHearts<1)e.push('initialHearts must be positive');
 const ids=[...(q.quiz||[]).map(x=>x.id),...(q.sentencePuzzles||[]).map(x=>x.id),...(q.vocabulary||[]).map(x=>x.id)];if(!unique(ids))e.push('duplicate activity IDs are not allowed');
 if(!text(q.generation?.generatedAt)||!text(q.generation?.model)||!text(q.generation?.promptVersion))e.push('generation metadata is required');
 return e;
}
