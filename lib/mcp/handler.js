import { createMcpHandler } from "@modelcontextprotocol/server";
import { createAutonomiaMcpServer } from "./server.js";

export const autonomiaMcpHandler = createMcpHandler(() => createAutonomiaMcpServer());
