import DeviceInfo from "react-native-device-info";
import NetInfo from "@react-native-community/netinfo";

export interface ConcurrencyConfig { workers: number; reason: string; }

export class ConcurrencyController {
  /**
   * Dynamically calculates optimal concurrent hardware workers by weighing 
   * hardware performance (RAM) against environmental constraints (network & power).
   */
  static async getOptimal(): Promise<ConcurrencyConfig> {
    try {
      const [mem, charging, net] = await Promise.all([
        DeviceInfo.getTotalMemory(),
        DeviceInfo.isBatteryCharging(),
        NetInfo.fetch(),
      ]);

      const ram = mem / (1024 ** 3); // Convert Bytes to GB
      const isWifi = net.type === "wifi";
      const gen = net.details && 'cellularGeneration' in net.details ? net.details.cellularGeneration : null;

      console.log({ ram, isWifi, charging, cellularGeneration: gen });

      // --- Tier 1: Premium WiFi Execution Profiles ---
      if (ram > 6 && isWifi && charging) return { workers: 5, reason: "high_ram_wifi_charging" };
      if (ram > 6 && isWifi) return { workers: 4, reason: "high_ram_wifi" };

      // --- Tier 2: Cellular Network Profiles ---
      if (net.type === "cellular") {
        if (gen === "5g") return { workers: ram >= 6 ? 4 : 3, reason: "5g" };
        if (gen === "4g") return { workers: 3, reason: "4g" };
        if (gen === "3g" || gen === "2g") return { workers: 1, reason: "slow_cellular" };
        return { workers: 2, reason: "unknown_cellular" };
      }

      // --- Tier 3: Hardware Fallback (Non-cellular, non-WiFi, or unmetered links) ---
      if (ram > 6) return { workers: 4, reason: "high_ram" };
      if (ram >= 3) return { workers: 3, reason: "mid_ram" };
      return { workers: 2, reason: "low_ram" };

    } catch (e) {
      // Soft-fail with a balanced configuration profile if hardware telemetry fails
      console.warn("[ConcurrencyController] Error determining optimal telemetry:", e);
      return { workers: 3, reason: "fallback" };
    }
  }
}