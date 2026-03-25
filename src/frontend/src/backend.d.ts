import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface Bet {
    id: bigint;
    userId: Principal;
    selectedOutcome: MatchResult;
    betStatus: BetStatus;
    stake: bigint;
    matchId: bigint;
    timestamp: Time;
}
export interface WithdrawalRequest {
    id: bigint;
    status: WithdrawalStatus;
    userId: Principal;
    timestamp: Time;
    phoneNumber: string;
    amount: bigint;
}
export interface PlatformStats {
    totalMatches: bigint;
    totalBets: bigint;
    totalWithdrawn: bigint;
    totalUsers: bigint;
}
export interface UserProfile {
    id: Principal;
    balance: bigint;
    displayName: string;
    registrationDate: Time;
}
export interface Match {
    id: bigint;
    status: MatchStatus;
    result: MatchResult;
    homeTeam: string;
    createdBy: Principal;
    sport: Sport;
    awayTeam: string;
    matchDate: Time;
}
export enum BetStatus {
    won = "won",
    pending = "pending",
    lost = "lost"
}
export enum MatchResult {
    pending = "pending",
    draw = "draw",
    homeWin = "homeWin",
    awayWin = "awayWin"
}
export enum MatchStatus {
    upcoming = "upcoming",
    settled = "settled",
    live = "live"
}
export enum Sport {
    basketball = "basketball",
    football = "football",
    rugby = "rugby"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum WithdrawalStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export interface backendInterface {
    approveWithdrawal(withdrawalId: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createMatch(homeTeam: string, awayTeam: string, sport: Sport, matchDate: Time): Promise<bigint>;
    deposit(amount: bigint): Promise<void>;
    getAllBets(): Promise<Array<Bet>>;
    getAllUsers(): Promise<Array<UserProfile>>;
    getAllWithdrawals(): Promise<Array<WithdrawalRequest>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMatches(): Promise<Array<Match>>;
    getPlatformStats(): Promise<PlatformStats>;
    getUserBets(): Promise<Array<Bet>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserWithdrawals(): Promise<Array<WithdrawalRequest>>;
    isCallerAdmin(): Promise<boolean>;
    placeBet(matchId: bigint, outcome: MatchResult, stake: bigint): Promise<bigint>;
    rejectWithdrawal(withdrawalId: bigint): Promise<void>;
    requestWithdrawal(amount: bigint, phoneNumber: string): Promise<bigint>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    settleMatch(matchId: bigint, result: MatchResult): Promise<void>;
}
