import { Principal } from "@dfinity/principal";
import { HttpAgent, Actor } from "@dfinity/agent";
import { idlFactory, canisterId } from "../../../declarations/asl_backend";
import type { ArtifactStatus } from "../../../declarations/asl_backend/asl_backend.did";

// Simple agent factory that creates fresh agents to avoid stale timestamps
const createFreshAgent = () => {
  // Check if we have a local development canister ID
  const hasLocalCanisterId =
    canisterId &&
    (canisterId.includes("77774") ||
      canisterId.includes("qaaaq") ||
      canisterId.includes("q7777"));

  // Determine the appropriate host for development
  const isDevelopment =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.port === "3000" ||
    window.location.port === "4943" ||
    window.location.hostname.includes("localhost") ||
    hasLocalCanisterId; // Force local if using local canister ID

  console.log("FreshAgent environment detection:", {
    hostname: window.location.hostname,
    port: window.location.port,
    href: window.location.href,
    canisterId,
    hasLocalCanisterId,
    isDevelopment,
  });

  const host = isDevelopment ? "http://127.0.0.1:4943" : "https://icp0.io";

  console.log("FreshAgent using host:", host);

  const agent = new HttpAgent({
    host,
  });

  // Fetch root key for local development
  if (isDevelopment) {
    console.log("FreshAgent: Fetching root key for development");
    agent.fetchRootKey().catch((err) => {
      console.warn("Unable to fetch root key:", err);
    });
  }

  return agent;
};

// Create fresh backend actor for critical operations
const createFreshBackendActor = () => {
  if (!canisterId) {
    throw new Error("No canister ID found for asl_backend");
  }

  const agent = createFreshAgent();
  return Actor.createActor(idlFactory, {
    agent,
    canisterId,
  });
};

// Patched update artifact status method with fresh agent
export const updateArtifactStatusWithFreshAgent = async (
  artifactId: bigint,
  status: ArtifactStatus
) => {
  try {
    console.log("updateArtifactStatusWithFreshAgent called with:", {
      artifactId,
      status,
    });

    const backend = createFreshBackendActor();
    console.log("Fresh backend actor created for status update");

    console.log("Calling update_artifact_status_public...");
    const result = await backend.update_artifact_status_public(
      artifactId,
      status
    );
    console.log("Status update result:", result);

    if (result && typeof result === "object" && "Ok" in result) {
      return result.Ok;
    }
    if (result && typeof result === "object" && "Err" in result) {
      throw new Error(String(result.Err));
    }
    return "success";
  } catch (error) {
    console.error("Failed to update artifact status with fresh agent:", error);
    throw error;
  }
};

// Patched vote method with fresh agent
export const voteOnArtifactWithFreshAgent = async (
  artifactId: bigint,
  support: boolean
) => {
  try {
    const backend = createFreshBackendActor();
    const result = await backend.vote_on_artifact_public(artifactId, support);

    if (result && typeof result === "object" && "Ok" in result) {
      return result.Ok;
    }
    if (result && typeof result === "object" && "Err" in result) {
      throw new Error(String(result.Err));
    }
    return "success";
  } catch (error) {
    console.error("Failed to vote on artifact with fresh agent:", error);
    throw error;
  }
};
