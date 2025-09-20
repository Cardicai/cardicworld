export type Message = { id:string; role:'user'|'mentor'; type:'text'|'image'|'audio'; content:string; createdAt:number; meta?:Record<string,unknown> }
export type Topic = { id:string; title:string; createdAt:number; lastAt:number }
