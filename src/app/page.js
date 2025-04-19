
'use client';
import { useRouter } from 'next/navigation';


export default function Home() {
  const router = useRouter();
  return (
   
   
   
      <main style={{ textAlign:'center', marginTop:100 }}>
        <button onClick={() => router.push('/chat')}>Start Chat</button>
      </main>
   
    
  )
}
