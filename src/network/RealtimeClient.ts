export type RealtimeMessage={type:string;payload?:unknown};
export class RealtimeClient{
 private socket?:WebSocket;
 connect(url:string,ticket?:string):Promise<void>{if(!url.startsWith("ws://")&&!url.startsWith("wss://"))return Promise.reject(new Error("Invalid realtime URL"));const target=new URL(url);if(ticket)target.searchParams.set("ticket",ticket);return new Promise((resolve,reject)=>{const ws=new WebSocket(target);this.socket=ws;ws.addEventListener("open",()=>resolve(),{once:true});ws.addEventListener("error",()=>reject(new Error("Realtime connection failed")),{once:true});});}
 send(message:RealtimeMessage):void{if(!this.socket||this.socket.readyState!==WebSocket.OPEN)throw new Error("Realtime connection is not ready");this.socket.send(JSON.stringify(message));}
 close():void{this.socket?.close(1000,"client-close");this.socket=undefined;}
}