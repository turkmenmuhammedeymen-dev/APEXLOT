import {WebSocketServer} from "ws";
import {createServer} from "node:http";
const port=Number(process.env.PORT||8080);
const httpServer=createServer((_req,res)=>{res.writeHead(200,{"content-type":"application/json"});res.end(JSON.stringify({service:"APEXLOT realtime gateway",status:"online"}));});
const wss=new WebSocketServer({noServer:true,maxPayload:16384});
httpServer.on("upgrade",(request,socket)=>{const url=new URL(request.url||"/","http://localhost");const ticket=url.searchParams.get("ticket");if(!ticket||!process.env.APEXLOT_TICKET_SECRET){socket.write("HTTP/1.1 401 Unauthorized\\r\\n\\r\\n");socket.destroy();return;}socket.write("HTTP/1.1 503 Service Unavailable\\r\\n\\r\\n");socket.destroy();});
wss.on("connection",ws=>ws.on("message",raw=>{if(raw.length>8192)return ws.close(1009,"message-too-large");ws.send(JSON.stringify({type:"server.notice",payload:"Realtime gameplay is not enabled yet."}));}));
httpServer.listen(port,()=>console.log("APEXLOT realtime gateway listening on :"+port));