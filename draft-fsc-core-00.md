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

%%%

.# Abstract

TODO

.# Status of This Memo
Information about the current status of this document, any errata,and how to provide feedback on it may be obtained at XX.

.# Copyright Notice

This document is an early concept and has not received any review yet. Evwerything can change at any moment. Comments are welcome.
Copyright (c) 2022 VNG and the persons identified as the document authors. All rights reserved.

{mainmatter}

# Introduction

The Core part of the FSC standard describes the creation and management of connections between HTTP clients and HTTP services. (to do: scope, use case, landscape). 

Section 2 describes the architecture of systems that follow the FSC standard.
Section 3 describes the interfaces and behavior of FSC functionality in detail.

It is RECOMMENDED to use FSC core with the following extensions, each described in a dedicated RFC:
- [FSC Authorization](authorization/README.md)
- [FSC Logging](logging/README.md)
- [FSC Delegation](delegation/README.md)
- [FSC Control](control/README.md)

## Requirements Language

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [BCP 14](https://www.rfc-editor.org/info/bcp14) [RFC2119](https://www.rfc-editor.org/rfc/rfc2119) [RFC8174](https://www.rfc-editor.org/rfc/rfc8174) when, and only when, they appear in all capitals, as shown here.

## Terminology

This section lists terms and abbreviations that are used in this document.

### Terminology Used in This Document

Access request
: XX

Directory
: An FSC directory holds information about all services in the FSC system so they can be discovered. 

Grant
: XX

Inway
: API Gateway, technically a reverse proxy, that handles incoming connections to one or more services and confirms to the FSC Core standard.

Outway
: HTTP Proxy as defined in [RFC X] that handles outgoing connections to Inways and confirms to the FSC Core standard.

HTTP Service
: HTTP services as defined in [RFC X] that are provided via an Inway

Manager
: The FSC Manager configures all inways and outways based on access requests and grants

NLX System
: System of inways and outways that confirm to the FSC standard

Protocol Buffers
: XX

### Abbreviations

API
: Application Programming Interface, as described in RFC X

gRPC
: XX

FSC
: Federated Service Connectivity, the name of this draft standard

HTTP
: Hyper Text Transfer Protocol, as specified in [RFC 2068](https://www.rfc-editor.org/rfc/rfc2068)


# Architecture

The purpose of FSC Core is to standardise setting up and managing connections to HTTP services. Involved inways and outways are managed via a Manager and make use of a directory that enables service discovery. 

This chapter describes the basic architecture of FSC systems.

FSC is typically used when the need to connect spans multiple organizations; when clients in organization A need to connect to organization B. Use within a single organization can be beneficial as well, especially when already using FSC to connect with other organization. In this RFC the word `context` is used as general concept instead of `organization` or `department` or `security context`.


## Request flow

```
          context A          |            context B
HTTP client -> FSC Outway -> | -> FSC Inway -> HTTP service
```


## TLS Certificates

All connections within an FSC system are mTLS connections based on x.509 certificates as defined in [RFC 3280](https://www.rfc-editor.org/rfc/rfc3280). Two types of certificates are acknowdleged:
- internal certificates, typically provided and managed by the internal PKI of an organization. 
- external certificates, provided by an organization that is trusted to issue certificates with the correct organization identities. Every participant in an FSC system MUST accept the same Root Certificate as trusted to base the identification and authentication of organisations on.


## Service discovery
```
context A   |    central     | context B
FSC Inway  -> FSC Directory -> FSC Outway
```

## Management

All inways and outways in a local environment are managed by a local FSC Manager. This manager XX.

```
          context A          |            context B
        FSC Manager       -> | -> FSC Inway   -> FSC Manager

FSC Manager -> FSC Inways    |    FSC Inways  <- FSC Manager
            -> FSC Outways   |    FSC Outways <-
```

## Connecting to a service

## Providing a service





# Specifications for functionality  XX

## Outway functionality
### Interfaces
### Behavior

## Inway functionality
### Interfaces
### Behavior

## Manager functionality

Manager functionality in FSC Core is (XX list functionality)

It is RECOMMENDED to implement the Manager functionality seperate from the Inway functionality, in order to be able to have many local Inways that are configured by one local Manager.

### Interfaces

#### AccessRequestService
The Manager functionality **MUST** implement an gRPC service, as specified on [grpc.io](https://grpc.io/docs/), with the name `AccessRequestService`. This service **MUST** implement three Remote Procedure Calls (rpc):
- `RequestAccess`, used to request access
- `GetAccessRequestState`, used to request information about an Access Request
- `GetAccessGrant`, used to fetch an AccessGrant

All rpc's **MUST** use Protocol Buffers to exchange messages as specified on [developers.google.com](https://developers.google.com/protocol-buffers/). The messages are specified below. 



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

### Behavior

The gRPC service **MUST** enforce the use of mTLS connections.
The gRPC service **SHALL** only accept TLS certificates that are valid and issued under the Root Certificate that defines the scope of the FSC System. Which Root Certificate to accept is based on an agreement between the organizations that cooporate in the FSC System.

XX Manager Behavior

## Directory functionality
### Interfaces
### Behavior

# References

# Acknowledgements

{backmatter}