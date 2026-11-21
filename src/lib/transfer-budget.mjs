const count=(value,min,max)=>{const s=String(value??'').trim();return /^\d+$/.test(s)&&Number(s)>=min&&Number(s)<=max?Number(s):null;};
const money=value=>{const s=String(value??'').trim();if(!s)return null;return /^\d+(?:\.\d{1,2})?$/.test(s)&&Number(s)<=1000000?Math.round(Number(s)*100):NaN;};

// Keep unknown costs unknown. All arithmetic is in minor units of one currency.
export function transferBudget(config,input={}) {
 const errors=[];
 const option=config.options.find(o=>o.id===input.optionId)||(!input.optionId?config.options[0]:null);
 const adults=count(input.adults??'2',1,99);
 const children=config.childLabel?count(input.children??'0',0,99):0;
 const rides=count(input.rides??'1',1,config.multipleRides?20:1);
 const connection=money(input.connection);
 const alternative=money(input.alternative);
 const mode=input.mode??'standard';
 if(!option)errors.push('Choose a listed fare option.');
 if(adults===null)errors.push('Enter a whole number of travellers from 1 to 99.');
 if(children===null)errors.push('Enter a whole number of children from 0 to 99.');
 if(rides===null)errors.push(config.multipleRides?'Enter 1 to 20 rides per traveller.':'This worksheet compares one-way journeys only.');
 if(Number.isNaN(connection)||Number.isNaN(alternative))errors.push('Enter non-negative costs with at most two decimal places, or leave them blank.');
 if(!['standard','group'].includes(mode))errors.push('Choose a listed ticket basis.');
 if(mode==='group'&&(!option?.groupFares?.[adults]||children>0))errors.push('This group offer requires 2, 3 or 4 adult travellers together; choose individual fares for another party.');
 if(errors.length)return {errors,fareSubtotal:null,completeTotal:null,alternative:null,difference:null};
 const standardMinor=(Math.round(option.adultFare*100)*adults+Math.round((option.childFare||0)*100)*children)*rides;
 const selectedMinor=mode==='group'?Math.round(option.groupFares[adults]*100)*rides:standardMinor;
 const completeMinor=connection===null?null:selectedMinor+connection;
 return {errors:[],standardSubtotal:standardMinor/100,fareSubtotal:selectedMinor/100,completeTotal:completeMinor===null?null:completeMinor/100,alternative:alternative===null?null:alternative/100,difference:completeMinor===null||alternative===null?null:(alternative-completeMinor)/100};
}
