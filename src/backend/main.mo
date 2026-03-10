import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
    phone : Text;
    village : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  type Incident = {
    id : Nat;
    incidentType : Text;
    latitude : Float;
    longitude : Float;
    severity : Severity;
    description : Text;
    status : Status;
    village : Text;
  };

  type Severity = {
    #low;
    #medium;
    #high;
    #critical;
  };

  type Status = {
    #reported;
    #active;
    #resolved;
  };

  type Alert = {
    id : Nat;
    messageEnglish : Text;
    messageTamil : Text;
    radiusKm : Float;
    targetLat : Float;
    targetLng : Float;
    alertType : Text;
  };

  type Volunteer = {
    id : Nat;
    name : Text;
    phone : Text;
    skills : Text;
    status : VolunteerStatus;
    village : Text;
  };

  type VolunteerStatus = {
    #available;
    #deployed;
    #unavailable;
  };

  type Stats = {
    incidentsBySeverity : {
      low : Nat;
      medium : Nat;
      high : Nat;
      critical : Nat;
    };
    volunteersByStatus : {
      available : Nat;
      deployed : Nat;
      unavailable : Nat;
    };
  };

  let incidents = Map.empty<Nat, Incident>();
  let alerts = Map.empty<Nat, Alert>();
  let volunteers = Map.empty<Nat, Volunteer>();

  var nextIncidentId = 1;
  var nextAlertId = 1;
  var nextVolunteerId = 1;

  public shared ({ caller }) func createIncident(
    incidentType : Text,
    latitude : Float,
    longitude : Float,
    severity : Severity,
    description : Text,
    village : Text,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create incidents");
    };
    let incident : Incident = {
      id = nextIncidentId;
      incidentType;
      latitude;
      longitude;
      severity;
      description;
      status = #reported;
      village;
    };
    incidents.add(nextIncidentId, incident);
    nextIncidentId += 1;
    incident.id;
  };

  public query ({ caller }) func listIncidents() : async [Incident] {
    // Public access allowed for emergency awareness
    incidents.values().toArray();
  };

  public shared ({ caller }) func updateIncidentStatus(incidentId : Nat, newStatus : Status) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update incident status");
    };
    let incident = switch (incidents.get(incidentId)) {
      case (null) { Runtime.trap("Incident not found") };
      case (?incident) { incident };
    };
    let updatedIncident = { incident with status = newStatus };
    incidents.add(incidentId, updatedIncident);
  };

  public shared ({ caller }) func createAlert(
    messageEnglish : Text,
    messageTamil : Text,
    radiusKm : Float,
    targetLat : Float,
    targetLng : Float,
    alertType : Text,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create alerts");
    };
    let alert : Alert = {
      id = nextAlertId;
      messageEnglish;
      messageTamil;
      radiusKm;
      targetLat;
      targetLng;
      alertType;
    };
    alerts.add(nextAlertId, alert);
    nextAlertId += 1;
    alert.id;
  };

  public query ({ caller }) func listAlerts() : async [Alert] {
    // Public access allowed for emergency awareness
    alerts.values().toArray();
  };

  public shared ({ caller }) func registerVolunteer(
    name : Text,
    phone : Text,
    skills : Text,
    village : Text,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can register as volunteers");
    };
    let volunteer : Volunteer = {
      id = nextVolunteerId;
      name;
      phone;
      skills;
      status = #available;
      village;
    };
    volunteers.add(nextVolunteerId, volunteer);
    nextVolunteerId += 1;
    volunteer.id;
  };

  public query ({ caller }) func listVolunteers() : async [Volunteer] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view volunteer list");
    };
    volunteers.values().toArray();
  };

  public shared ({ caller }) func updateVolunteerStatus(volunteerId : Nat, newStatus : VolunteerStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update volunteer status");
    };
    let volunteer = switch (volunteers.get(volunteerId)) {
      case (null) { Runtime.trap("Volunteer not found") };
      case (?volunteer) { volunteer };
    };
    let updatedVolunteer = { volunteer with status = newStatus };
    volunteers.add(volunteerId, updatedVolunteer);
  };

  public query ({ caller }) func getStats() : async Stats {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view statistics");
    };

    var lowCount = 0;
    var mediumCount = 0;
    var highCount = 0;
    var criticalCount = 0;

    for (incident in incidents.values()) {
      switch (incident.severity) {
        case (#low) { lowCount += 1 };
        case (#medium) { mediumCount += 1 };
        case (#high) { highCount += 1 };
        case (#critical) { criticalCount += 1 };
      };
    };

    var availableCount = 0;
    var deployedCount = 0;
    var unavailableCount = 0;

    for (volunteer in volunteers.values()) {
      switch (volunteer.status) {
        case (#available) { availableCount += 1 };
        case (#deployed) { deployedCount += 1 };
        case (#unavailable) { unavailableCount += 1 };
      };
    };

    {
      incidentsBySeverity = {
        low = lowCount;
        medium = mediumCount;
        high = highCount;
        critical = criticalCount;
      };
      volunteersByStatus = {
        available = availableCount;
        deployed = deployedCount;
        unavailable = unavailableCount;
      };
    };
  };
};
