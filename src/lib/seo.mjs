export function absoluteUrl(origin,path) {
  if(!origin)return undefined;
  return new URL(path,origin+'/').href;
}
export function jsonLd(value){return JSON.stringify(value).replaceAll('<','\\u003c')}
export function sectionId(label,index){return 'section-'+(index+1)+'-'+label.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
export function breadcrumbSchema(origin,crumbs){
 if(!origin)return null;
 return {'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:crumbs.map(([name,path],i)=>({'@type':'ListItem',position:i+1,name,item:absoluteUrl(origin,path)}))};
}
export function articleSchema(story,{origin,brand,publisher,image,category,sources=[]}){
 if(!origin)return null;
 const url=absoluteUrl(origin,'/guides/'+story.slug);
 return {'@context':'https://schema.org','@type':'Article','@id':url+'#article',url,mainEntityOfPage:{'@type':'WebPage','@id':url},headline:story.title,description:story.dek,inLanguage:'en',articleSection:category,author:{'@type':'Organization',name:brand,url:absoluteUrl(origin,'/about')},publisher:{'@type':'Organization',name:publisher||brand,url:origin},...(image?{image:[absoluteUrl(origin,image)]}:{}),...(story.dateModified?{dateModified:story.dateModified}:{}),...(sources.length?{citation:sources}:{})};
}
export function collectionSchema(origin,name,path,items){
 if(!origin)return null;
 return {'@context':'https://schema.org','@type':'CollectionPage',name,url:absoluteUrl(origin,path),inLanguage:'en',mainEntity:{'@type':'ItemList',itemListElement:items.map(([title,href],i)=>({'@type':'ListItem',position:i+1,name:title,url:absoluteUrl(origin,href)}))}};
}
export function siteSchema(origin,brand,publisher){
 if(!origin)return null;
 return {'@context':'https://schema.org','@graph':[{'@type':'WebSite','@id':origin+'/#website',url:origin+'/',name:brand,inLanguage:'en',publisher:{'@id':origin+'/#publisher'}},{'@type':'Organization','@id':origin+'/#publisher',name:publisher||brand,url:origin+'/',logo:absoluteUrl(origin,'/icon.svg')}]};
}
