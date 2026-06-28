import DeviceInfo from "react-native-device-info";
import NetInfo from "@react-native-community/netinfo";

export interface ConcurrencyConfig { workers: number; reason: string; }

export class ConcurrencyController {
  /**
   * Determines optimal multipart upload concurrency based on
   * device capabilities, network quality, and power conditions.
   */
  static async getOptimal(): Promise<ConcurrencyConfig> {
    try {
      const [totalMemory, isCharging, batteryLevel, net] = await Promise.all([
        DeviceInfo.getTotalMemory(),
        DeviceInfo.isBatteryCharging(),
        DeviceInfo.getBatteryLevel(),
        NetInfo.fetch(),
      ]);

      if (!net.isConnected) return { workers: 0, reason: "offline" };

      const ramGB = totalMemory / (1024 ** 3);
      const isWifi = net.type === "wifi";
      const gen = net.type === "cellular" && net.details && "cellularGeneration" in net.details ? net.details.cellularGeneration : null;
      const isMetered = net.details && "isConnectionExpensive" in net.details ? net.details.isConnectionExpensive : false;

      console.log("[ConcurrencyController]", { ramGB: ramGB.toFixed(1), isWifi, isCharging, batteryLevel, cellularGeneration: gen, isMetered });

      if (!isCharging && batteryLevel < 0.2) return { workers: 1, reason: "low_battery" };
      if (isMetered) return { workers: 1, reason: "metered_network" };

      if (isWifi) {
        return ramGB >= 6 && isCharging ? { workers: 4, reason: "wifi_charging_high_ram" } : { workers: 3, reason: "wifi" };
      }

      if (net.type === "cellular") {
        if (gen === "5g") return { workers: 3, reason: "5g" };
        if (gen === "4g") return { workers: 2, reason: "4g" };
        if (gen === "3g" || gen === "2g") return { workers: 1, reason: "slow_cellular" };
        return { workers: 2, reason: "unknown_cellular" };
      }

      return ramGB >= 6 ? { workers: 3, reason: "high_ram_fallback" } : { workers: 2, reason: "fallback" };
    } catch (error) {
      console.warn("[ConcurrencyController] Failed to determine concurrency:", error);
      return { workers: 2, reason: "error_fallback" };
    }
  }

}