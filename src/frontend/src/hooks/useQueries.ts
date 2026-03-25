import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type Bet,
  type Match,
  type MatchResult,
  type PlatformStats,
  type Sport,
  type UserProfile,
  UserRole,
  type WithdrawalRequest,
} from "../backend";
import { useActor } from "./useActor";

export function useMatches() {
  const { actor, isFetching } = useActor();
  return useQuery<Match[]>({
    queryKey: ["matches"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMatches();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUserRole() {
  const { actor, isFetching } = useActor();
  return useQuery<UserRole>({
    queryKey: ["userRole"],
    queryFn: async () => {
      if (!actor) return UserRole.guest;
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUserBets() {
  const { actor, isFetching } = useActor();
  return useQuery<Bet[]>({
    queryKey: ["userBets"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserBets();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUserWithdrawals() {
  const { actor, isFetching } = useActor();
  return useQuery<WithdrawalRequest[]>({
    queryKey: ["userWithdrawals"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserWithdrawals();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllBets() {
  const { actor, isFetching } = useActor();
  return useQuery<Bet[]>({
    queryKey: ["allBets"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBets();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllWithdrawals() {
  const { actor, isFetching } = useActor();
  return useQuery<WithdrawalRequest[]>({
    queryKey: ["allWithdrawals"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllWithdrawals();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllUsers() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile[]>({
    queryKey: ["allUsers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUsers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePlatformStats() {
  const { actor, isFetching } = useActor();
  return useQuery<PlatformStats | null>({
    queryKey: ["platformStats"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getPlatformStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Not connected");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

export function usePlaceBet() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      matchId,
      outcome,
      stake,
    }: { matchId: bigint; outcome: MatchResult; stake: bigint }) => {
      if (!actor) throw new Error("Not connected");
      return actor.placeBet(matchId, outcome, stake);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["userBets"] });
      qc.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

export function useRequestWithdrawal() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      amount,
      phoneNumber,
    }: { amount: bigint; phoneNumber: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.requestWithdrawal(amount, phoneNumber);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["userWithdrawals"] });
      qc.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

export function useCreateMatch() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      homeTeam,
      awayTeam,
      sport,
      matchDate,
    }: {
      homeTeam: string;
      awayTeam: string;
      sport: Sport;
      matchDate: bigint;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createMatch(homeTeam, awayTeam, sport, matchDate);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["matches"] });
    },
  });
}

export function useSettleMatch() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      matchId,
      result,
    }: { matchId: bigint; result: MatchResult }) => {
      if (!actor) throw new Error("Not connected");
      return actor.settleMatch(matchId, result);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["matches"] });
      qc.invalidateQueries({ queryKey: ["allBets"] });
    },
  });
}

export function useApproveWithdrawal() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (withdrawalId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.approveWithdrawal(withdrawalId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allWithdrawals"] });
    },
  });
}

export function useRejectWithdrawal() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (withdrawalId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.rejectWithdrawal(withdrawalId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allWithdrawals"] });
    },
  });
}

export function useDeposit() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (amount: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deposit(amount);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

export function useAssignRole() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ user, role }: { user: Principal; role: UserRole }) => {
      if (!actor) throw new Error("Not connected");
      return actor.assignCallerUserRole(user, role);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allUsers"] });
    },
  });
}
