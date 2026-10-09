import {config} from '@/lib/content';
export default function robots(){const base=config.siteUrl;return {rules:{userAgent:'*',allow:'/'},...(base?{sitemap:base.replace(/\/$/,'')+'/sitemap.xml'}:{})};}
