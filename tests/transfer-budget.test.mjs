import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {transferBudget} from '../src/lib/transfer-budget.mjs';
const data=JSON.parse(fs.readFileSync(new URL('../src/content/content.json',import.meta.url),'utf8'));
const budget=slug=>data.stories.find(s=>s.slug===slug).transferBudget;
test('an unknown last leg never becomes a zero-cost complete journey',()=>{
 const cfg=budget('phuket-airport-to-beach-transfer');
 const unknown=transferBudget(cfg,{adults:'4',alternative:'350'});
 assert.equal(unknown.fareSubtotal,400);assert.equal(unknown.completeTotal,null);assert.equal(unknown.difference,null);
 const complete=transferBudget(cfg,{adults:'4',connection:'0',alternative:'350'});
 assert.equal(complete.completeTotal,400);assert.equal(complete.difference,-50);
});
test('Airport Express group offers are explicit, station-specific and not applied to five adults',()=>{
 const cfg=budget('hong-kong-airport-express-city-transfer');
 assert.equal(transferBudget(cfg,{adults:'4',optionId:'hong-kong',mode:'standard'}).fareSubtotal,480);
 const group=transferBudget(cfg,{adults:'4',optionId:'hong-kong',mode:'group',connection:'60',alternative:'390'});
 assert.equal(group.fareSubtotal,280);assert.equal(group.completeTotal,340);assert.equal(group.difference,50);
 assert.equal(transferBudget(cfg,{adults:'4',optionId:'kowloon',mode:'group'}).fareSubtotal,250);
 assert.equal(transferBudget(cfg,{adults:'3',optionId:'tsing-yi',mode:'group'}).fareSubtotal,140);
 assert.ok(transferBudget(cfg,{adults:'5',mode:'group'}).errors.length);
});
test('family age bands and repeated GoKL rides use the right fare basis',()=>{
 const klia=transferBudget(budget('kuala-lumpur-klia-airport-to-city'),{adults:'2',children:'2',connection:'18.35',alternative:'170.35'});
 assert.equal(klia.fareSubtotal,160);assert.equal(klia.completeTotal,178.35);assert.equal(klia.difference,-8);
 const gokl=transferBudget(budget('kuala-lumpur-gokl-bus-foreign-visitors'),{adults:'2',rides:'2',connection:'0'});
 assert.equal(gokl.fareSubtotal,4);assert.equal(gokl.completeTotal,4);
});
test('invalid, fractional and negative entries do not leave a plausible stale total',()=>{
 const cfg=budget('phuket-airport-to-beach-transfer');
 for(const input of [{adults:''},{adults:'0'},{adults:'1.5'},{adults:'100'},{optionId:'missing'},{connection:'-1'},{alternative:'Infinity'},{connection:'1.001'},{connection:'1e3'},{mode:'unknown'},{rides:'2'}]){
  const result=transferBudget(cfg,input);assert.ok(result.errors.length,JSON.stringify(input));assert.equal(result.completeTotal,null);
 }
});
