import { UtilConstant } from "./UtilConstants";
export async function apiRequest({ endpoint, method = 'GET', body, headers = {}, cookies }) {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      credentials: 'include', // ensures cookies are sent in browser
    };
  
    if (body) {
      options.body = JSON.stringify(body);
    }
  
    // If running on server (cookies passed manually)
    if (typeof window === 'undefined' && cookies) {
      options.headers.Cookie = cookies;
    }
    const url=UtilConstant.HOST+endpoint;
    console.log(url,"I am url");
    const res = await fetch(url, options);
    const data = await res.json();
    
    if (res.hasError) {
      throw new Error(data?.message || 'API Error');
    }
  
    return data;
  }
  