import Array "mo:core/Array";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Nat "mo:core/Nat";

actor {
  // Types
  type BetStatus = { #pending; #won; #lost };
  type MatchResult = { #homeWin; #draw; #awayWin; #pending };
  type WithdrawalStatus = { #pending; #approved; #rejected };
  type MatchStatus = { #upcoming; #live; #settled };
  type Sport = { #football; #basketball; #rugby };

  type UserProfile = {
    id : Principal;
    displayName : Text;
    balance : Nat;
    registrationDate : Time.Time;
  };

  type Match = {
    id : Nat;
    homeTeam : Text;
    awayTeam : Text;
    sport : Sport;
    matchDate : Time.Time;
    status : MatchStatus;
    result : MatchResult;
    createdBy : Principal;
  };

  type Bet = {
    id : Nat;
    matchId : Nat;
    userId : Principal;
    selectedOutcome : MatchResult;
    stake : Nat;
    betStatus : BetStatus;
    timestamp : Time.Time;
  };

  type WithdrawalRequest = {
    id : Nat;
    userId : Principal;
    amount : Nat;
    status : WithdrawalStatus;
    phoneNumber : Text;
    timestamp : Time.Time;
  };

  type PlatformStats = {
    totalUsers : Nat;
    totalBets : Nat;
    totalMatches : Nat;
    totalWithdrawn : Nat;
  };

  // Modules for comparisons
  module UserProfile {
    public func compare(p1 : UserProfile, p2 : UserProfile) : Order.Order {
      Int.compare(p1.registrationDate, p2.registrationDate);
    };
  };

  module Bet {
    public func compareByTimestamp(b1 : Bet, b2 : Bet) : Order.Order {
      Int.compare(b1.timestamp, b2.timestamp);
    };
  };

  module WithdrawalRequest {
    public func compare(w1 : WithdrawalRequest, w2 : WithdrawalRequest) : Order.Order {
      Int.compare(w1.timestamp, w2.timestamp);
    };
  };

  // State
  let profiles = Map.empty<Principal, UserProfile>();
  let matches = Map.empty<Nat, Match>();
  let bets = Map.empty<Nat, Bet>();
  let withdrawals = Map.empty<Nat, WithdrawalRequest>();

  var nextMatchId = 1;
  var nextBetId = 1;
  var nextWithdrawalId = 1;

  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Get user
  func getUserInternal(caller : Principal) : UserProfile {
    switch (profiles.get(caller)) {
      case (?profile) { profile };
      case (null) { Runtime.trap("You are not registered. Please sign up first.") };
    };
  };

  // Get user profile (public function)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    profiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    profiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };

    if (profile.displayName.size() == 0) {
      Runtime.trap("Display name cannot be empty.");
    };

    let updatedProfile = {
      profile with
      id = caller;
      displayName = profile.displayName;
    };

    profiles.add(caller, updatedProfile);
  };

  // Deposit to account
  public shared ({ caller }) func deposit(amount : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can deposit");
    };

    if (amount == 0) {
      Runtime.trap("Deposit must be greater than zero");
    };

    let user = getUserInternal(caller);

    let updatedUser = {
      user with
      balance = user.balance + amount;
    };

    profiles.add(caller, updatedUser);
  };

  // Create match (Admin only)
  public shared ({ caller }) func createMatch(homeTeam : Text, awayTeam : Text, sport : Sport, matchDate : Time.Time) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create matches");
    };
    if (homeTeam == awayTeam) {
      Runtime.trap("Home and away teams must be different");
    };

    let newMatch : Match = {
      id = nextMatchId;
      homeTeam;
      awayTeam;
      sport;
      matchDate;
      status = #upcoming;
      result = #pending;
      createdBy = caller;
    };

    matches.add(nextMatchId, newMatch);
    nextMatchId += 1;
    newMatch.id;
  };

  // Place bet
  public shared ({ caller }) func placeBet(matchId : Nat, outcome : MatchResult, stake : Nat) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place bets");
    };

    switch (matches.get(matchId)) {
      case (null) { Runtime.trap("Match does not exist") };
      case (?match) {
        if (match.status != #upcoming) {
          Runtime.trap("Cannot place bets on non-upcoming matches");
        };

        let user = getUserInternal(caller);
        if (stake > user.balance) {
          Runtime.trap("Insufficient balance to place bet");
        };

        if (stake == 0) {
          Runtime.trap("Bet amount must be greater than zero");
        };

        let newBet : Bet = {
          id = nextBetId;
          matchId;
          userId = caller;
          selectedOutcome = outcome;
          stake;
          betStatus = #pending;
          timestamp = Time.now();
        };

        let updatedUser = {
          user with
          balance = user.balance - stake;
        };

        bets.add(nextBetId, newBet);
        profiles.add(caller, updatedUser);

        nextBetId += 1;
        newBet.id;
      };
    };
  };

  // Settle match (Admin only)
  public shared ({ caller }) func settleMatch(matchId : Nat, result : MatchResult) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can settle matches");
    };

    switch (matches.get(matchId)) {
      case (null) { Runtime.trap("Match not found") };
      case (?match) {
        if (match.status == #settled) {
          Runtime.trap("Match already settled");
        };

        let updatedMatch = {
          match with
          result;
          status = #settled;
        };

        matches.add(matchId, updatedMatch);

        let matchBets = bets.values().toArray().filter(func(b) { b.matchId == matchId });

        for (bet in matchBets.values()) {
          let updatedStatus : BetStatus = if (bet.selectedOutcome == result) {
            #won;
          } else {
            #lost;
          };

          let updatedBet = { bet with betStatus = updatedStatus };
          bets.add(bet.id, updatedBet);

          if (updatedStatus == #won) {
            switch (profiles.get(bet.userId)) {
              case (?user) {
                let updatedUser = {
                  user with
                  balance = user.balance + (bet.stake * 2);
                };
                profiles.add(bet.userId, updatedUser);
              };
              case (null) {};
            };
          };
        };
      };
    };
  };

  // Request withdrawal
  public shared ({ caller }) func requestWithdrawal(amount : Nat, phoneNumber : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can request withdrawals");
    };

    let user = getUserInternal(caller);

    if (amount > user.balance) {
      Runtime.trap("Insufficient balance for withdrawal");
    };

    if (amount == 0) {
      Runtime.trap("Withdrawal amount must be greater than zero");
    };

    if (phoneNumber.size() < 10) {
      Runtime.trap("Invalid phone number");
    };

    let withdrawal : WithdrawalRequest = {
      id = nextWithdrawalId;
      userId = caller;
      amount;
      status = #pending;
      phoneNumber;
      timestamp = Time.now();
    };

    withdrawals.add(nextWithdrawalId, withdrawal);
    nextWithdrawalId += 1;
    withdrawal.id;
  };

  // Approve withdrawal (Admin only)
  public shared ({ caller }) func approveWithdrawal(withdrawalId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can approve withdrawals");
    };

    switch (withdrawals.get(withdrawalId)) {
      case (null) { Runtime.trap("Withdrawal not found") };
      case (?withdrawal) {
        if (withdrawal.status != #pending) {
          Runtime.trap("Withdrawal already processed");
        };

        switch (profiles.get(withdrawal.userId)) {
          case (?user) {
            if (withdrawal.amount > user.balance) {
              Runtime.trap("Insufficient user balance for withdrawal");
            };

            let updatedUser = {
              user with
              balance = user.balance - withdrawal.amount;
            };

            let updatedWithdrawal = {
              withdrawal with
              status = #approved;
            };

            profiles.add(withdrawal.userId, updatedUser);
            withdrawals.add(withdrawalId, updatedWithdrawal);
          };
          case (null) { Runtime.trap("User not found") };
        };
      };
    };
  };

  // Reject withdrawal (Admin only)
  public shared ({ caller }) func rejectWithdrawal(withdrawalId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can reject withdrawals");
    };

    switch (withdrawals.get(withdrawalId)) {
      case (null) { Runtime.trap("Withdrawal not found") };
      case (?withdrawal) {
        if (withdrawal.status != #pending) {
          Runtime.trap("Withdrawal already processed");
        };

        let updatedWithdrawal = {
          withdrawal with
          status = #rejected;
        };
        withdrawals.add(withdrawalId, updatedWithdrawal);
      };
    };
  };

  // Get all upcoming matches
  public query ({ caller }) func getMatches() : async [Match] {
    matches.values().toArray();
  };

  // Get all user bets
  public query ({ caller }) func getUserBets() : async [Bet] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their bets");
    };
    let user = getUserInternal(caller);
    bets.values().toArray().filter(func(b) { b.userId == user.id }).sort(Bet.compareByTimestamp);
  };

  // Get user withdrawals
  public query ({ caller }) func getUserWithdrawals() : async [WithdrawalRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their withdrawals");
    };
    let user = getUserInternal(caller);
    withdrawals.values().toArray().filter(func(w) { w.userId == user.id }).sort();
  };

  // Get platform stats (Admin only)
  public query ({ caller }) func getPlatformStats() : async PlatformStats {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view platform stats");
    };

    let totalUsers = profiles.size();
    let totalBets = bets.size();
    let totalMatches = matches.size();
    var totalWithdrawn = 0;

    for (withdrawal in withdrawals.values()) {
      if (withdrawal.status == #approved) {
        totalWithdrawn += withdrawal.amount;
      };
    };

    {
      totalUsers;
      totalBets;
      totalMatches;
      totalWithdrawn;
    };
  };

  // Get all users (Admin only)
  public query ({ caller }) func getAllUsers() : async [UserProfile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view user data");
    };
    profiles.values().toArray();
  };

  // Get all bets (Admin only)
  public query ({ caller }) func getAllBets() : async [Bet] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view bet data");
    };
    bets.values().toArray();
  };

  // Get all withdrawals (Admin only)
  public query ({ caller }) func getAllWithdrawals() : async [WithdrawalRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view withdrawals data");
    };
    withdrawals.values().toArray();
  };

};
