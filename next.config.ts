import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 
  
   
   
      async headers() {
        return [
          {
            source: "/api/chat",
            headers: [
              {
                key: "Content-Type",
                value: "application/json",
              },
            ],
          },
        ];
      }
    };
  
  

  

export default nextConfig;
