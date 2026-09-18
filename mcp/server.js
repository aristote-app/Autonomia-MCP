import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { searchBoamp } from "../lib/collectors/boamp.js";
import { searchTed } from "../lib/collectors/ted.js";
import { listFreelanceMentionSearches, getFreelanceMentionResults } from "../lib/collectors/freelancemention.js";
import { refreshPublicMarket } from "../lib/market/refresh.js";

const server = new McpServer({ name: "autonomia-market-intelligence", version: "0.1.0" });

server.tool("search_public_tenders","Search live public procurement notices from BOAMP and TED.",{
  query:z.string().min(2),limit:z.number().int().min(1).max(100).default(20)
},async({query,limit})=>{
  const [boamp,ted]=await Promise.allSettled([searchBoamp({query,limit}),searchTed({query,limit})]);
  return {content:[{type:"text",text:JSON.stringify({
    query,
    boamp:boamp.status==="fulfilled"?boamp.value:{error:String(boamp.reason)},
    ted:ted.status==="fulfilled"?ted.value:{error:String(ted.reason)}
  },null,2)}]};
});

server.tool("refresh_market","Refresh public market sources now for a specific query.",{
  query:z.string().min(2).default("intelligence artificielle"),
  limit:z.number().int().min(1).max(100).default(20)
},async({query,limit})=>({content:[{type:"text",text:JSON.stringify(await refreshPublicMarket({query,limit}),null,2)}]}));

server.tool("list_freelance_searches","List configured FreelanceMention searches. Requires FREELANCEMENTION_API_KEY.",{},async()=>({
  content:[{type:"text",text:JSON.stringify(await listFreelanceMentionSearches(),null,2)}]
}));

server.tool("get_freelance_results","Get FreelanceMention results for one configured search.",{
  searchId:z.string().min(1),limit:z.number().int().min(1).max(100).default(50),
  offset:z.number().int().min(0).default(0),since:z.string().optional()
},async({searchId,limit,offset,since})=>({
  content:[{type:"text",text:JSON.stringify(await getFreelanceMentionResults({searchId,limit,offset,since}),null,2)}]
}));

server.tool("explain_data","Explain source evidence available for a live market query.",{
  query:z.string().min(2),limit:z.number().int().min(1).max(20).default(5)
},async({query,limit})=>{
  const result=await refreshPublicMarket({query,limit});
  return {content:[{type:"text",text:JSON.stringify({query,refreshedAt:result.refreshedAt,evidence:result.sources},null,2)}]};
});

await server.connect(new StdioServerTransport());
