export function getQuestBatch(quests,currentId,offset=0,limit=3){
  const available=[...(quests||[])]
    .filter(q=>q?.id&&q.id!==currentId)
    .sort((a,b)=>Date.parse(b.generatedAt||0)-Date.parse(a.generatedAt||0));
  const items=available.slice(offset,offset+limit);
  const nextOffset=offset+items.length;
  return {items,hasMore:nextOffset<available.length,nextOffset};
}
