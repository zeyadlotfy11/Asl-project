// Simple connection test utility
import { HttpAgent } from "@dfinity/agent";

export class ConnectionTest {
  static async testLocalConnection(): Promise<boolean> {
    try {
      const isDevelopment =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1";
      const host = isDevelopment ? "http://127.0.0.1:4943" : "https://icp0.io";

      console.log(`Testing connection to: ${host}`);
      console.log(
        `Environment: ${isDevelopment ? "Development" : "Production"}`
      );
      console.log(`Current hostname: ${window.location.hostname}`);

      const agent = new HttpAgent({ host });

      if (isDevelopment) {
        console.log("Fetching root key for development...");
        await agent.fetchRootKey();
        console.log("Root key fetched successfully");
      }

      // Test status endpoint
      const status = await agent.status();
      console.log("Agent status:", status);

      return true;
    } catch (error) {
      console.error("Connection test failed:", error);
      return false;
    }
  }

  static async testCanisterConnection(): Promise<boolean> {
    try {
      const { BackendService } = await import(
        "../services/IntegratedBackendService"
      );
      const greeting = await BackendService.greet("Test User");
      console.log("Canister test result:", greeting);
      return true;
    } catch (error) {
      console.error("Canister test failed:", error);
      return false;
    }
  }
}
