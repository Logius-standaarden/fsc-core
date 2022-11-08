%%%
title = "FSC - core"
abbrev = "FSC - core"
ipr = "none"
submissiontype = "independent"
area = "Internet"
workgroup = ""
keyword = ["Internet-Draft"]

[seriesInfo]
name = "Internet-Draft"
value = "draft-fsc-core-00"
stream = "independent"
status = "informational"
# date = 2022-11-01T00:00:00Z

[[author]]
initials = "E."
surname = "Hotting"
fullname = "Eelco Hotting"
organization = "Hotting IT"
  [author.address]
   email = "rfc@hotting.it"

[[author]]
initials = "E."
surname = "van Gelderen"
fullname = "Edward van Gelderen"
organization = "VNG"
  [author.address]
   email = "edward.vangelderen@vng.nl"

[[author]]
initials = "R."
surname = "Koster"
fullname = "Ronald Koster"
organization = "VNG"
  [author.address]
   email = "ronald.koster@vng.nl"

[[author]]
initials = "N."
surname = "Dequeker"
fullname = "Niels Dequeker"
organization = "VNG"
  [author.address]
   email = "niels.dequeker@vng.nl"

[[author]]
initials = "H."
surname = "van Maanen"
fullname = "Henk van Maanen"
organization = "AceWorks"
  [author.address]
   email = "henk.van.maanen@aceworks.nl"

[[author]]
initials = "G.J."
surname = "Riemer"
fullname = "Geert-Johan Riemer"
organization = "Utlimate Spellchek Serveces Riemer"
  [author.address]
   email = "fsc@geertjohan.net"

%%%

.# Abstract

TODO

.# Status of This Memo
Information about the current status of this document, any errata,and how to provide feedback on it may be obtained at XX.

.# Copyright Notice

This document is an early concept and has not received any review yet. Everything can change at any moment. Comments are welcome.
Copyright (c) 2022 VNG and the persons identified as the document authors. All rights reserved.

{mainmatter}

# Introduction

This section gives an introduction to this RFC.
Section 2 describes the architecture of a system that follows the FSC specification.
Section 3 describes the interfaces and behavior of FSC components in detail.

## Purpose

The Federated Service Connectivity (FSC) specifications describe a way to implement technically interoperable API gateway functionality, covering federated authentication, secure connecting and transaction logging in a large-scale, dynamic API landscape. The standard includes the exchange of information and requests about the management of connections and authorizations, in order to make it possible to automate those activities.

The Core part of the FSC specification achieves inter-organizational, technical interoperability:
- to discover services
- to route requests to services in other contexts (e.g. from within organization A to organization B)
- to request and managing connection rights needed to connect to said services

All functionality required to achieve technical interoperability is provided by APIs as specified in this RFC. This allows for automation of most management tasks, greatly reducing the administrative load and enabling upscaling of inter-organizational usage of services.


## Overall Operation of FSC Core

All Peers in a Group announce their HTTP services to the Group by registering them in the Directory. Every Group uses one Directory that defines the scope of the Group. All Peers use the list of services as provided by the Directory to discover which services are available in the Group. With this information, Peers can propose Peer to Peer Contracts. Contracts contain Grants that specify which Outways from Peers may connect to which services from Peers. Each Contract may contain multiple Grants, defining the rights to connect between Peers.

Inways are reverse proxies that announce services to the Directory and route incoming connections to those services.
Outways are forward proxies that discover all available services in the Group and route outgoing connections to services.
The Directory lists routing information for all services in the Group.

To connect to a service, the Peer needs a Grant that specifies the connection. The FSC Core specification describes how Grants are requested, granted and revoked. Once a right to connect is granted, a connection from HTTP Client to HTTP Service will be automatically created everytime an HTTP request to the HTTPS service is made.

FSC Core specifies the basics for setting up and managing connections in a Group. It is RECOMMENDED to use FSC Core with the following extensions, each specified in a dedicated RFC:
- [FSC Policies](policies/README.md), to use more advanced policies as conditions in Contracts
- [FSC Logging](logging/README.md), to standardize and link transaction logs
- [FSC Delegation](delegation/README.md), to delegate the right to connect to a service
- [FSC Control](control/README.md), to get in control from a management, security and audit perspective


### Use cases

A typical use case is a cooperation of many organizations that use APIs to exchange data or provide business services to eachother.

Organizations can participate in multiple FSC Groups at once. This likely happens when using different environments for production, test and more - each environment will require its own Group.

An organization can offer the same API in multiple Groups. When doing so, the organization will be a Peer in every Group, and define the API as a service in the Directory of each group using a different Inway for each Group.


## Requirements Language

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [BCP 14](https://www.rfc-editor.org/info/bcp14) [RFC2119](https://www.rfc-editor.org/rfc/rfc2119) [RFC8174](https://www.rfc-editor.org/rfc/rfc8174) when, and only when, they appear in all capitals, as shown here.

## Terminology

This specification lists terms and abbreviations as used in this document.

Peer
: Actor that both provides and requests services. This is an abstraction of e.g. an organization, a department or a security context.

Group
: System of Peers using Inways, Outways and Contract Managers that confirm to the FSC specification to make use of each other's services.

Directory
: A Directory holds information about all services in the FSC Group so they can be discovered.

Inway
: Reverse proxy that handles incoming connections to one or more services and confirms to the FSC Core specification.

Outway
: Forward proxy that handles outgoing connections to Inways and confirms to the FSC Core specification.

Contract
: Document containing the Grants between Peers, defining which interactions between Peers are possible.

Contract Manager
: The Contract Manager manages Contracts and configures all Inways and Outways based on information from an Directory and Contracts.

Grant
: XX

Trust Anchor
: The Trust Anchor is an XX.

# Architecture

This chapter describes the basic architecture of FSC systems.

## Request flow

@startuml
title: Basic request flow

box "Requesting Peer"
  participant "Client" as client
  participant "Outway" as outway
end box
box "Providing Peer"
  participant "Inway" as inway
  participant "Service" as service
end box
client -> outway ++
outway -> inway ++
inway -> service ++
service --> inway --
inway --> outway --
outway --> client --

skinparam sequenceBoxBorderColor #transparent
skinparam boxPadding 50
hide footbox
@enduml

## Service discovery

Every Group is defined by a Directory that contains routing information for all services in the Group.
Inways register services in the Directory.
Outways discover services by requesting a list from the Directory.

@startuml
title: Register and discover a service

box "Providing Peer"
  participant "Inway" as inway
end box
box "Group"
  participant "Directory" as directory
end box
box "Requesting Peer"
  participant "Outway" as outway
end box
inway -> directory ++ : register service
return
outway -> directory ++ : discover service
return

skinparam sequenceBoxBorderColor #transparent
skinparam boxPadding 50
hide footbox
@enduml

## mTLS connections and Trust Anchor {#trustanchor}

All connections between Inways and Outways and all connections with the Directory use Mutual Transport Layer Security (mTLS) with X.509 certificates. All components in the Group are configured to accept the same (Sub-) Certificate Authority (CA) as Trust Anchor. The Trust Anchor is a Trusted Third Party that ensures the identity of all Peers by issuing `Subject.organization` and `Subject.serialnumber` [@!RFC5280, section 4.1.2.6](https://www.rfc-editor.org/rfc/rfc5280#section-4.1.2.6) in each certificate.

@startuml
title mTLS connections with Trust Anchor X.509 certificates

frame "Group" {
  frame "Requesting Peer" {
    [Outway]
  }
  frame "Providing Peer" {
     [Inway]
  }
  [Directory]
}
[Outway] -[bold,#green]r-> [Inway]
[Outway] -[bold,#green]d-> [Directory]
[Inway] -[bold,#green]d-> [Directory]

skinparam boxPadding 50
skinparam linetype polyline
skinparam linetype ortho
@enduml

## Contract Management

Connections between Peers are based on Grants. A Grant is the right to make a connection from an Outway to a service offered in the Group. Grants are encapsulated in Contracts and agreed upon by the involved Peers. To create a new contract, the Contract Manager uses a selection of desired connections as input. (Typically this input comes from a user interface interacting with the Contract Management functionality, see [Administrating a Peer](#administrating)). For each desired connection, a Grant is formulated that contains identifying information about both the Outway from the requesting Peer and the service of the Providing Peer. One Contract may contain multiple Grants, typically those match the connections mentioned in a legal agreement like a Data Processing Agreement (DPA). A Contract becomes valid once all Peers mentioned in the Contract have agreed upon its content by cryptographically signing it. Valid Contracts are used to configure Inways and Outways and enable the possibility to automatically create on demand connections between Peers, as defined in the Grants.

Contracts are immutable. To change a contract, a new Contract is made that replaces the old one. Contracts can be invalidated which revokes the Grants in the Contract.

@startuml
title: Contract Management

box "Peer"
  participant "Contract Manager" as cm1
end box
box "Peer"
  participant "Contract Manager" as cm2
end box
cm1 -> cm2 ++ : Contract proposal (signed by initiating Peer)
return Valid Contract (signed by all Peers)

skinparam sequenceBoxBorderColor #transparent
skinparam boxPadding 50
hide footbox
@enduml

Inways and Outways of a Peer are in part configured by the Contract Manager. The Contract Manager stores Contracts involving the Peer and translates the content of the Contracts in configuration for the local Inway and Outway functionality.

@startuml
title: Local Peer configuration

box "Peer"
  participant "Contract Manager" as manager
  participant "Inway" as inway
  participant "Outway" as outway
end box
inway -> manager : request configuration
return
outway -> manager : request configuration
return

skinparam sequenceBoxBorderColor #transparent
skinparam boxPadding 50
hide footbox
@enduml

@startuml





## Connecting to a service

## Providing a service


## Administrating a Peer {#administrating}

XX


# Specifications

## General 

### TLS configuration

For most use cases it is **RECOMMENDED** to use a X.509 certificates that checks if a certificate is issued to the right Organization (Organization Validation) 

## Outway

### Behavior

#### Authentication

The Outway **MUST** use mTLS when connecting to the Directory or Inways. The x509 certificate **MUST** be signed by the chosen Certificate Authority (CA) of the network.

#### Routing

The Outway **MUST** be able to route HTTP requests to the correct service on the FSC network. A service on the FSC network can be identified by the unique combination of a serial-number and a service-name. An Outway receives the serial-number and service-name through the path component as described in  [@!RFC3986, section 3.3](https://www.rfc-editor.org/rfc/rfc3986#section-3.3) of an HTTP request.
The first segment of the path **MUST** contain the serial-number, the second segment of the path **MUST** contain the service-name.

The Outway **MUST** retrieve the available services from the Directory.

The Outway **MUST** delete the serial-number from the path of the HTTP Request before forwarding the request to the corresponding Inway.
e.g `/1234567890/service` -> `/service`

The Outway **MUST NOT** alter the path of the HTTP Request except for stripping the serial-number.

The Outway **SHALL** use the last available address of a service in case the Directory is unreachable.

Clients **MAY** use TLS when communicating with the Outway.

### Interfaces

#### HTTP endpoint

The Outway **MUST** implement a single HTTP endpoint which proxies the received request to the corresponding service on the FSC Network.

The HTTP endpoint `/{serial_number}/{service_name}` **MUST** be implemented.

##### Error response

If the service called generates an error, the Outway **MUST** return the error response of the API to the client without altering the response.

If an error occurs within the scope of the FSC network, the Outway **MUST** return the HTTP status code 540 with an error response defined in the section below.


```
  responses:
    '540':
      description: A FCS network error has occurred
      content:
        application/json:
          schema:
            type: object
            properties:
              message:
                type: string
                description: A message describing the error
              source:
                type: string
                description: The component causing the error. In this case 'outway'
              location:
                type: string
                description: The location of the error. In this case 'C1' which means it happened between the client and the Outway
              code:
                type: string
                description: A unique code describing the error.
```

###### Error codes

The code field of the error response **MUST** contain one of the following codes:

- `INVALID_URL`: The URL is invalid. e.g. the path of the HTTP request contains a serial-number but the service-name is missing.
- `UNSUPPORTED_METHOD`: Outway called with an unsupported method, the CONNECT method is not supported.
- `SERVER_ERROR`: General error code

## Inway
### Interfaces
### Behavior

## Contract Manager

Manager functionality in FSC Core is (XX list functionality)

It is RECOMMENDED to implement the Manager functionality separate from the Inway functionality, in order to be able to have many local Inways that are configured by one local Manager.

### Interfaces

#### AccessRequestService
The Manager functionality **MUST** implement an gRPC service, as specified on [grpc.io](https://grpc.io/docs/), with the name `AccessRequestService`. This service **MUST** offers three Remote Procedure Calls (rpc):
- `RequestAccess`, used to request access
- `GetAccessRequestState`, used to request information about an Access Request
- `GetAccessGrant`, used to fetch an AccessGrant

All rpc's **MUST** use Protocol Buffers of the version 3 Language Specification to exchange messages, as specified on [developers.google.com](https://developers.google.com/protocol-buffers/docs/reference/proto3-spec). The messages are specified below.

##### rpc RequestAccess

The Remote Procedure Call `RequestAccess` **MUST** be implemented with the following interface and messages:
```
rpc RequestAccess(RequestAccessRequest) returns (RequestAccessResponse);

message RequestAccessRequest {
  string service_name = 1;
  string public_key_pem = 2;
}

message RequestAccessResponse {
  uint64 reference_id = 1;
  AccessRequestState access_request_state = 2;
}

enum AccessRequestState {
  ACCESS_REQUEST_STATE_UNSPECIFIED = 0;
  ACCESS_REQUEST_STATE_FAILED = 1;
  reserved 2;
  ACCESS_REQUEST_STATE_RECEIVED = 3;
  ACCESS_REQUEST_STATE_APPROVED = 4;
  ACCESS_REQUEST_STATE_REJECTED = 5;
  ACCESS_REQUEST_STATE_REVOKED = 6;
}
```

##### rpc GetAccessRequestState

The Remote Procedure Call `GetAccessRequestState` **MUST** be implemented with the following interface and messages:
```
rpc GetAccessRequestState(GetAccessRequestStateRequest) returns (GetAccessRequestStateResponse);

message GetAccessRequestStateRequest {
  string service_name = 1;
  string public_key_fingerprint = 2;
}

message GetAccessRequestStateResponse {
  AccessRequestState state = 1;
}

enum AccessRequestState {
  ACCESS_REQUEST_STATE_UNSPECIFIED = 0;
  ACCESS_REQUEST_STATE_FAILED = 1;
  reserved 2; // Removed deprecated option 'CREATED'
  ACCESS_REQUEST_STATE_RECEIVED = 3;
  ACCESS_REQUEST_STATE_APPROVED = 4;
  ACCESS_REQUEST_STATE_REJECTED = 5;
  ACCESS_REQUEST_STATE_REVOKED = 6;
}
```

##### rpc GetAccessGrant

The Remote Procedure Call `GetAccessGrant` **MUST** be implemented with the following interface and messages:
```
rpc GetAccessGrant(GetAccessGrantRequest) returns (GetAccessGrantResponse);

message GetAccessGrantRequest {
  string service_name = 1;
  string public_key_fingerprint = 2;
}

message GetAccessGrantResponse {
  AccessGrant access_grant = 1;
}

message Organization {
  string serial_number = 1;
  string name = 2;
}

message AccessGrant {
  uint64 id = 1;
  Organization organization = 2;
  string service_name = 3;
  google.protobuf.Timestamp created_at = 4;
  google.protobuf.Timestamp revoked_at = 5;
  uint64 access_request_id = 6;
  string public_key_fingerprint = 7;
}
```

#### Error handling

(This part will most likely change, with only the relevant errors in each part of the FSC standard)

The gRPC service **MUST** implement error handling according to the interface described in

```
enum ErrorReason {
  // Do not use this default value.
  ERROR_REASON_UNSPECIFIED = 0;

  // The order that is being used is revoked
  ERROR_REASON_ORDER_REVOKED = 1;

  // The order could not be found
  ERROR_REASON_ORDER_NOT_FOUND = 2;

  // The order does not exist for your organization
  ERROR_REASON_ORDER_NOT_FOUND_FOR_ORG = 3;

  // The service is not found in the order
  ERROR_REASON_ORDER_DOES_NOT_CONTAIN_SERVICE = 4;

  // The order is expired
  ERROR_REASON_ORDER_EXPIRED = 5;

  // Something went wrong while trying to retrieve the claim
  ERROR_REASON_UNABLE_TO_RETRIEVE_CLAIM = 6;

  // Something went wrong while trying to sign the claim
  ERROR_REASON_UNABLE_TO_SIGN_CLAIM = 7;
}
```

### Behavior

The gRPC service **MUST** enforce the use of mTLS connections.
The gRPC service **SHALL** accept only TLS certificates that are valid and issued under the Root Certificate that defines the scope of the FSC System. Which Root Certificate to accept is based on an agreement between the organizations that cooperate in the FSC System.



## Directory

### Behavior

#### Authentication

The clients **MUST** use mTLS when connecting to the Directory. The X.509 certificate **MUST** be signed by the chosen Certificate Authority (CA) that acts as Trust Anchor of the Group.

#### Inway registration

The Directory **MUST** offer a registration point for Inways. An Inway will register itself and the services it is offering to the FSC Group.

The Directory **MUST** be able to provide the Inway addresses of a peer.

#### Service listing

The Directory **MUST** be able to offer a list of the services available in the FSC Group. This service list will be used by Outways in the FCS Group to route HTTP Requests to the correct service.

The Directory **MUST** be able to provide the URI of each Inway

The Directory **MUST** know which services each Inway is offering to the FSC Group.

The Directory **MUST** validate if a mTLS connection can be setup to the URI of an Inway. If the Directory is able to set up a connection the Inway **MUST** be given the state `UP`, if not the state of the Inway **MUST** be `DOWN`

### Interfaces

#### Directory Service

The Directory functionality **MUST** implement an gRPC service, as specified on [grpc.io](https://grpc.io/docs/), with the name `Directory`. This service **MUST** offer twelve Remote Procedure Calls (rpc):
- `RegisterInway`, registers an Inway and the services the Inway is offering to the FSC Group
- `ListServices`, lists the services available on the FSC Group
- `ListPeerInways`, lists the Inways of a peer
- `GetGroupInfo`, return the version of the FSC standard used by the FSC Group

All rpc's **MUST** use Protocol Buffers of the version 3 Language Specification to exchange messages, as specified on [developers.google.com](https://developers.google.com/protocol-buffers/docs/reference/proto3-spec). The messages are specified below.

##### rpc RegisterInway

The Remote Procedure Call `RegisterInway` **MUST** be implemented with the following interface and messages:
```
rpc RegisterInway(RegisterInwayRequest) returns (RegisterInwayResponse);

message RegisterInwayRequest {
  message RegisterService {
    string name = 1;
  }

  string inway_address = 1;
  string contract_manager_address = 2;
  repeated RegisterService services = 3;
  string inway_name = 4;
}

message RegisterInwayResponse {
  string error = 1;
}
```

##### rpc ListServices

The Remote Procedure Call `ListServices` **MUST** be implemented with the following interface and messages:
```
rpc ListServices(ListServicesRequest) returns (ListServicesResponse);


message ListServicesRequest {}

message ListServicesResponse {

  message Service {
    Organization organization = 1;
    string name = 2;
    repeated Inway inways = 3;
  }

  repeated Service services = 1;
}

message Organization {
  string serial_number = 1;
  string name = 2;
}

message Inway {
  enum State {
    STATE_UNSPECIFIED = 0;
    STATE_UP = 1;
    STATE_DOWN = 2;
  }
  string address = 1;
  State state = 2;
}
```

##### rpc ListPeerInways

The Remote Procedure Call `ListPeerInways` **MUST** be implemented with the following interface and messages:
```
rpc ListPeerInways(ListPeerInwaysRequest) returns (ListPeerInwaysResponse);

message ListPeerInwaysRequest {
  string peer_serial_number = 1;
}

message ListPeerInwaysResponse {
  repeated Inway inways = 1;
}

message Inway {
    string address
    string contract_manager_address
}
```

##### rpc GetGroupInfo

The Remote Procedure Call `GetGroupInfo` **MUST** be implemented with the following interface and messages:
```
rpc GetGroupInfo(GetGroupInfoRequest) returns (GetGroupInfoResponse);

message GetGroupInfoRequest {}

message GetGroupInfoResponse {
  string fsc_version = 1;
  repeated Extension extenstions = 2;
}

message Extension {
    string name = 1;
    string version = 2;
}
```
# gRPC error handling

According to gRPC specification a gRPC service will, in case of an error, return a response structured according to the `Status` interface. In case of an error that should generate a specific FSC error code the `status` message is enriched with an `ErrorInfo` message containing the FSC specific error code.
The FSC specific error code **MUST** be set as the value of the `reason` field of the `ErrorInfo` interface.
The `ErrorInfo` interface **MUST** be used as the value of the `details` field of the `Status` interface.


The `Status` interface:  <https://github.com/googleapis/googleapis/blob/master/google/rpc/status.proto>
The `ErrorInfo` interface: <https://github.com/googleapis/googleapis/blob/master/google/rpc/error_details.proto>

# References

# Acknowledgements

{backmatter}