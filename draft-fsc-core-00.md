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
organization = "VNG"
  [author.address]
   email = "eelco.hotting@vng.nl"

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
Section 2 describes the architecture of systems that follow the FSC standard.
Section 3 describes the interfaces and behavior of FSC functionality in detail.

## Purpose

The Federated Service Connectivity (FSC) specification describes a way to implement technically interoperable API gateway functionality, covering federated authentication, secure connecting and transaction logging in a large-scale, dynamic API landscape. The standard includes the exchange of information and requests about the management of connections and authorizations, in order to make it possible to automate those activities.

The Core part of the Federated Service Connectivity (FSC) specification achieves inter-organizational, technical interoperability
- to discover services
- to route requests to services in other contexts (e.g. from within organization A to organization B)
- to request and managing connection rights needed to connect to said services

All functionality required to achieve technical interoperability is provided by APIs as specified in this RFC. This allows for automation of most management tasks, greatly reducing the administrative load and enabling upscaling of inter-organizational usage of services.


## Overall Operation of FSC Core

The FSC specification is used to create FSC Systems. One System consists of all (parts of) organizations that federate trust for the purpose of using each others services. The System consists of multiple decentral contexts and a central FSC Directory in which all services of the system are listed. Services are discovered by consulting this Directory. Every Directory lists all services in the scope of one System. The Directory contains routing information for every listed service, which is used to connect to the service.

A typical use case is a cooperation of many organizations that provide access to API's to each other.
Organizations can participate in multiple FSC Systems at once.

To connect to services, Connection Rights are required. The FSC specification describes how Connection Rights are requested, granted and revoked. Once a Connection Right is granted, a connection from HTTP Client to HTTP Service will be automatically created when an HTTP request to the HTTPS service is made.

It is RECOMMENDED to use FSC Core with the following extensions, each described in a dedicated RFC:
- [FSC Authorization](authorization/README.md), to delegate the authorization of connections to a Policy Decision Point
- [FSC Logging](logging/README.md), to standardize and link transaction logs
- [FSC Delegation](delegation/README.md), to delegate the right to connect
- [FSC Control](control/README.md), to get in control from a security and audit perspective


## Requirements Language

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [BCP 14](https://www.rfc-editor.org/info/bcp14) [RFC2119](https://www.rfc-editor.org/rfc/rfc2119) [RFC8174](https://www.rfc-editor.org/rfc/rfc8174) when, and only when, they appear in all capitals, as shown here.

## Terminology

This specification lists terms and abbreviations that are used in this document.

Access grant
: XX

Directory
: An FSC directory holds information about all services in the FSC system so they can be discovered.

Inway
: API Gateway, technically a reverse proxy, that handles incoming connections to one or more services and confirms to the FSC Core standard.

Outway
: HTTP Proxy as defined in [RFC 7230](https://www.rfc-editor.org/rfc/rfc7230#section-2.3) that handles outgoing connections to Inways and confirms to the FSC Core standard.

HTTP Service
: HTTP services as defined in [RFC X] that are provided via an Inway

Manager
: The FSC Manager configures all Inways and Outways based on access requests and grants

FSC System
: System of Inways, Outways and managers that confirm to the FSC standard

Protocol Buffers
: XX




# Architecture

The purpose of FSC Core is to standardize setting up and managing connections to HTTP services. Involved Inways and Outways are managed via a Manager and make use of a directory that enables service discovery.

This chapter describes the basic architecture of FSC systems.

FSC is typically used when the need to connect spans multiple organizations; when clients in organization A need to connect to organization B. Use within a single organization can be beneficial as well, eg. when following the principles of Zero Trust Networking. In this RFC the word `context` is used as general concept instead of `organization` or `department` or `security context`.


## Request flow


```
          context A          |            context B
HTTP client -> FSC Outway -> | -> FSC Inway -> HTTP service
```

## Service discovery

Every FSC System has an FSC Directory that defines the scope of said system.
All HTTP Services that are served via an Inway are announced to the FSC Directory.
All Outways will
```
context A   |    central     | context B
FSC Inway  -> FSC Directory -> FSC Outway
```



## TLS Certificates

All connections within an FSC system are mTLS connections based on x.509 certificates as defined in [RFC 3280](https://www.rfc-editor.org/rfc/rfc3280). Two types of certificates are acknowdleged:
- internal certificates, typically provided and managed by the internal PKI of an organization.
- external certificates, provided by an organization that is trusted to issue certificates with the correct organization identities. Every participant in an FSC system MUST accept the same Root Certificate as trusted to base the identification and authentication of organizations on.




## Management

All Inways and Outways in a local environment are managed by a local FSC Manager. This manager XX.

```
          context A          |            context B
        FSC Manager       -> | -> FSC Inway   -> FSC Manager

FSC Manager -> FSC Inways    |    FSC Inways  <- FSC Manager
            -> FSC Outways   |    FSC Outways <-
```

## Connecting to a service

## Providing a service





# Functional specifications

## Outway functionality

### Behavior

#### Authentication

The Outway **MUST** use mTLS when connecting to the Directory or Inways. The x509 certificate **MUST** be signed by the chosen Certificate Authority (CA) of the network.

#### Routing

The Outway **MUST** be able to route HTTP requests to the correct service on the FSC network. A service on the FSC network can be identified by the unique combination of a serial-number and a service-name. An Outway receives the serial-number and service-name through the path component [@RFC3986, section 3.3](https://www.rfc-editor.org/rfc/rfc3986#section-3.3) of an HTTP request.
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

## Inway functionality
### Interfaces
### Behavior

## Manager functionality

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


## Directory functionality

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
