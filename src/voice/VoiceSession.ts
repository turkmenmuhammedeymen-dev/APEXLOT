export class VoiceSession {
 private peer?:RTCPeerConnection;
 async createPeer(configuration:RTCConfiguration={}):Promise<RTCPeerConnection>{this.peer?.close();this.peer=new RTCPeerConnection(configuration);return this.peer;}
 async requestMicrophone():Promise<MediaStream>{if(!navigator.mediaDevices?.getUserMedia)throw new Error("Microphone is unavailable");return navigator.mediaDevices.getUserMedia({audio:true,video:false});}
 close():void{this.peer?.getSenders().forEach(sender=>sender.track?.stop());this.peer?.close();this.peer=undefined;}
}