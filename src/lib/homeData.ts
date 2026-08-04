import type { Category, Collection, Place, UserProfile } from '@/types/travel';
export const user: UserProfile = { firstName: 'Jeroen', avatar: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=300' };
export const heroImage = 'https://images.unsplash.com/photo-1464278533981-50106e6176b1?w=1400';
export const featured = { name: 'Amalfi Coast', country: 'Italy', description: 'A breathtaking stretch of coastline where dramatic cliffs meet the sea.', image: 'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=1400' };
export const categories: Category[] = [{id:'all',label:'All',icon:'compass'},{id:'nature',label:'Nature',icon:'mountain'},{id:'adventure',label:'Adventure',icon:'walk'},{id:'cities',label:'Cities',icon:'city'},{id:'beaches',label:'Beaches',icon:'sun'},{id:'more',label:'More',icon:'more'}];
export const places: Place[] = [
  {id:'1',name:'Plitvice Lakes',country:'Croatia',rating:4.9,category:'nature',image:'https://images.unsplash.com/photo-1555990538-c48ac0b6fbd4?w=700'},
  {id:'2',name:'Lake Braies',country:'Italy',rating:4.8,category:'adventure',image:'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=700'},
  {id:'3',name:'Santorini',country:'Greece',rating:4.9,category:'cities',image:'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=700'},
  {id:'4',name:'Kelingking Beach',country:'Indonesia',rating:4.8,category:'beaches',image:'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=700'}];
export const collections: Collection[] = [
  {id:'1',title:'Epic Adventures',count:24,image:'https://images.unsplash.com/photo-1528181304800-259b08848526?w=900'},
  {id:'2',title:'Nature Escapes',count:18,image:'https://images.unsplash.com/photo-1473445361085-b9a07f55608b?w=900'}];
