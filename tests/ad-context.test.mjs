import {test} from 'node:test';
import assert from 'node:assert/strict';
import {adPageContext,contextualAdUrl} from '../src/lib/ad-context.mjs';
test('current-page Food, Travel and Hotels tags survive; other or arbitrary tags cannot assign a visitor interest',()=>{
 for(const category of ['food','travel','hotels'])assert.equal(adPageContext(category),category);
 for(const category of [undefined,'news','music','things','Food','restaurant','<script>'])assert.equal(adPageContext(category),'general');
});
test('a page context and a consented cohort can coexist without placing page URLs or history into an ad request',()=>{
 const url=new URL(contextualAdUrl('https://ads.example','pl_test','food','a+b/=token'));
 assert.equal(url.searchParams.get('context'),'food');assert.equal(url.searchParams.get('audience'),'a+b/=token');assert.equal([...url.searchParams].length,2);
 const general=new URL(contextualAdUrl('https://ads.example','pl_test','https://private.example/path'));
 assert.equal(general.search,'');
});
