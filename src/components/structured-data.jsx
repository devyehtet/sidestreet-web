import {jsonLd} from '@/lib/seo.mjs';
export default function StructuredData({value}){return value?<script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd(value)}}/>:null}
