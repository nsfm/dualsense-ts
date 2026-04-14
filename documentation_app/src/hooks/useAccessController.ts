import { useState, useEffect, useRef, useCallback } from "react";
import {
  DualsenseAccess,
  AccessWebHIDProvider,
  AccessHID,
} from "dualsense-ts";

const hasWebHID =
  typeof navigator !== "undefined" && "hid" in navigator;

/**
 * Manages a standalone DualsenseAccess instance for the documentation app.
 * Returns the controller, a connect callback, and connection state.
 */
export function useAccessController() {
  const providerRef = useRef<AccessWebHIDProvider | null>(null);
  const hidRef = useRef<AccessHID | null>(null);
  const controllerRef = useRef<DualsenseAccess | null>(null);
  const [connected, setConnected] = useState(false);
  const [, setTick] = useState(0);

  // Initialize once
  if (!controllerRef.current && hasWebHID) {
    const provider = new AccessWebHIDProvider();
    const hid = new AccessHID(provider);
    const access = new DualsenseAccess({ hid });
    providerRef.current = provider;
    hidRef.current = hid;
    controllerRef.current = access;
  }

  useEffect(() => {
    const access = controllerRef.current;
    if (!access) return;

    const onConnection = () => {
      setConnected(access.connection.state);
    };
    const onChange = () => setTick((t) => t + 1);

    access.connection.on("change", onConnection);
    access.on("change", onChange);

    return () => {
      access.connection.removeListener("change", onConnection);
      access.removeListener("change", onChange);
    };
  }, []);

  const requestConnect = useCallback(() => {
    if (providerRef.current) {
      providerRef.current.getRequest()();
    }
  }, []);

  return {
    access: controllerRef.current,
    connected,
    requestConnect,
    supported: hasWebHID,
  };
}
