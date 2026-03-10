import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Severity, Status, VolunteerStatus } from "../backend.d";
import { useActor } from "./useActor";

export function useStats() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getStats();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30000,
  });
}

export function useIncidents() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["incidents"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listIncidents();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 15000,
  });
}

export function useAlerts() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["alerts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAlerts();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 20000,
  });
}

export function useVolunteers() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["volunteers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listVolunteers();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 20000,
  });
}

export function useCreateIncident() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      incidentType: string;
      latitude: number;
      longitude: number;
      severity: Severity;
      description: string;
      village: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createIncident(
        data.incidentType,
        data.latitude,
        data.longitude,
        data.severity,
        data.description,
        data.village,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["incidents"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useUpdateIncidentStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { incidentId: bigint; newStatus: Status }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateIncidentStatus(data.incidentId, data.newStatus);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["incidents"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useCreateAlert() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      messageEnglish: string;
      messageTamil: string;
      radiusKm: number;
      targetLat: number;
      targetLng: number;
      alertType: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createAlert(
        data.messageEnglish,
        data.messageTamil,
        data.radiusKm,
        data.targetLat,
        data.targetLng,
        data.alertType,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["alerts"] });
    },
  });
}

export function useRegisterVolunteer() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      phone: string;
      skills: string;
      village: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.registerVolunteer(
        data.name,
        data.phone,
        data.skills,
        data.village,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["volunteers"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useUpdateVolunteerStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      volunteerId: bigint;
      newStatus: VolunteerStatus;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateVolunteerStatus(data.volunteerId, data.newStatus);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["volunteers"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}
