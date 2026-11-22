'use client';
import {useId,useState} from 'react';
import {transferBudget} from '@/lib/transfer-budget.mjs';

export default function TransferBudget({config,sources}) {
 const id=useId();
 const [optionId,setOptionId]=useState(config.options[0].id);
 const [adults,setAdults]=useState('2');
 const [children,setChildren]=useState('0');
 const [rides,setRides]=useState(config.multipleRides?'2':'1');
 const [mode,setMode]=useState('standard');
 const [connection,setConnection]=useState('');
 const [alternative,setAlternative]=useState('');
 const result=transferBudget(config,{optionId,adults,children,rides,mode,connection,alternative});
 const price=value=>new Intl.NumberFormat('en',{style:'currency',currency:config.currency,currencyDisplay:'code',minimumFractionDigits:0,maximumFractionDigits:2}).format(value);
 const hasGroup=config.options.some(o=>o.groupFares);
 const selectedOption=config.options.find(o=>o.id===optionId)||config.options[0];
 return <section id="transfer-budget" className="transfer-budget" aria-labelledby={id+'-heading'}>
  <span className="eyebrow">MAKE IT YOUR TRIP</span>
  <h2 id={id+'-heading'}>{config.title}</h2>
  <p id={id+'-scope'}>{config.description}</p>
  <noscript><p>Enable JavaScript to change this worksheet. The fare tables and worked examples in the guide remain available below.</p></noscript>
  <p className="transfer-budget-fare" id={id+'-fare-reference'}><strong>{mode==='group'?'Individual fare reference:':'Selected fare:'}</strong> {selectedOption.label}</p>
  <div className="transfer-budget-fields" aria-describedby={id+'-scope'}>
   <label htmlFor={id+'-option'}>Fare option<select id={id+'-option'} value={optionId} aria-describedby={id+'-fare-reference'} onChange={e=>setOptionId(e.target.value)}>{config.options.map(o=><option key={o.id} value={o.id}>{o.shortLabel||o.label}</option>)}</select></label>
   <label htmlFor={id+'-adults'}>{config.travellerLabel}<input id={id+'-adults'} type="number" inputMode="numeric" min="1" max="99" step="1" value={adults} onChange={e=>setAdults(e.target.value)}/></label>
   {config.childLabel&&<label htmlFor={id+'-children'}>{config.childLabel}<input id={id+'-children'} type="number" inputMode="numeric" min="0" max="99" step="1" value={children} onChange={e=>setChildren(e.target.value)}/></label>}
   {config.multipleRides&&<label htmlFor={id+'-rides'}>Rides per fare-paying traveller<input id={id+'-rides'} type="number" inputMode="numeric" min="1" max="20" step="1" value={rides} onChange={e=>setRides(e.target.value)}/></label>}
   {hasGroup&&<label htmlFor={id+'-basis'}>Ticket basis<select id={id+'-basis'} value={mode} onChange={e=>setMode(e.target.value)}><option value="standard">Individual adult singles</option><option value="group">Ride Together · 2–4 adults</option></select></label>}
   <label htmlFor={id+'-connection'}>Extra connections for the whole party ({config.currency})<input id={id+'-connection'} type="text" inputMode="decimal" placeholder="Not entered" value={connection} onChange={e=>setConnection(e.target.value)} aria-describedby={id+'-cost-help'}/></label>
   <label htmlFor={id+'-alternative'}>Alternative whole-party quote ({config.currency})<input id={id+'-alternative'} type="text" inputMode="decimal" placeholder="Optional" value={alternative} onChange={e=>setAlternative(e.target.value)} aria-describedby={id+'-cost-help'}/></label>
  </div>
  <p className="transfer-budget-help" id={id+'-cost-help'}>Use a quote for the same people, destinations and journeys. Include required tolls, waiting, luggage and other charges. Enter 0 for extra connections only when none is needed; a blank is an unknown cost.</p>
  <div className="transfer-budget-result" role="status" aria-live="polite" aria-atomic="true">
   {result.errors.length>0?<ul>{result.errors.map(error=><li key={error}>{error}</li>)}</ul>:<>
    <dl><div><dt>Listed fare subtotal</dt><dd>{price(result.fareSubtotal)}</dd></div><div><dt>Transfer total with your connections</dt><dd>{result.completeTotal===null?'Add the extra connections cost':price(result.completeTotal)}</dd></div></dl>
    {mode==='group'&&<p>Individual singles for the selected adults: {price(result.standardSubtotal)}. The selected group fare is conditional on the operator’s offer.</p>}
    {result.difference!==null?<p>{result.difference===0?'The two entered totals are equal.':<>Your alternative quote is {price(Math.abs(result.difference))} {result.difference>0?'higher':'lower'} than this transfer total.</>} Compare luggage, route and timing as well as price.</p>:<p>Add both connection costs and an alternative quote to compare complete totals.</p>}
   </>}
  </div>
  <p className="transfer-budget-help">{config.conditions}</p>
  <p className="transfer-budget-help">Published fare basis checked <time dateTime={config.checkedAt}>{config.checkedAt}</time>. This is fare arithmetic using your inputs; it is not live availability, a booking quote or a guarantee of the cheapest option.</p>
  <div className="section-sources">{sources.map(source=><a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer">{source.name} ↗</a>)}</div>
 </section>;
}
