import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Stats {
    volunteersByStatus: {
        deployed: bigint;
        available: bigint;
        unavailable: bigint;
    };
    incidentsBySeverity: {
        low: bigint;
        high: bigint;
        critical: bigint;
        medium: bigint;
    };
}
export interface Incident {
    id: bigint;
    status: Status;
    latitude: number;
    description: string;
    longitude: number;
    village: string;
    severity: Severity;
    incidentType: string;
}
export interface Volunteer {
    id: bigint;
    status: VolunteerStatus;
    name: string;
    village: string;
    phone: string;
    skills: string;
}
export interface Alert {
    id: bigint;
    alertType: string;
    messageTamil: string;
    targetLat: number;
    targetLng: number;
    messageEnglish: string;
    radiusKm: number;
}
export interface UserProfile {
    name: string;
    village: string;
    phone: string;
}
export enum Severity {
    low = "low",
    high = "high",
    critical = "critical",
    medium = "medium"
}
export enum Status {
    resolved = "resolved",
    active = "active",
    reported = "reported"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum VolunteerStatus {
    deployed = "deployed",
    available = "available",
    unavailable = "unavailable"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createAlert(messageEnglish: string, messageTamil: string, radiusKm: number, targetLat: number, targetLng: number, alertType: string): Promise<bigint>;
    createIncident(incidentType: string, latitude: number, longitude: number, severity: Severity, description: string, village: string): Promise<bigint>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getStats(): Promise<Stats>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listAlerts(): Promise<Array<Alert>>;
    listIncidents(): Promise<Array<Incident>>;
    listVolunteers(): Promise<Array<Volunteer>>;
    registerVolunteer(name: string, phone: string, skills: string, village: string): Promise<bigint>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateIncidentStatus(incidentId: bigint, newStatus: Status): Promise<void>;
    updateVolunteerStatus(volunteerId: bigint, newStatus: VolunteerStatus): Promise<void>;
}
