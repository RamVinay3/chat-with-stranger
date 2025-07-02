
'use client';
import { useSocketStore } from '@/sockets/socketStore';
import { useRouter } from 'next/navigation';
import { saveToMapping } from '@/sockets/socketActions';

export default function Home() {
  const router = useRouter();
  const {socket}=useSocketStore((state)=>state);
  

  const handleStartChat=()=>{
    if(!socket){
      return;
    }
    const username=sessionStorage.getItem('username');
    saveToMapping({socket,username});
    router.push('/discover');
  }
  
  return (
   
   
   
      <main style={{ textAlign:'center', marginTop:100 }}>
        <button onClick={handleStartChat}>Start Chat</button>
      </main>
   
    
  )
}
