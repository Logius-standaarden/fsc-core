%%%
title = "FSC - core"
abbrev = "FSC - core"
ipr = "trust200902"
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
initials = "R."
surname = "Koster"
fullname = "Ronald Koster"
organization = "VNG"
  [author.address]
   email = "ronald.koster@vng.nl"

[[author]]
initials = "H."
surname = "van Maanen"
fullname = "Henk van Maanen"
organization = "AceWorks"
  [author.address]
   email = "henk.van.maanen@aceworks.nl"

[[author]]
initials = "N."
surname = "Dequeker"
fullname = "Niels Dequeker"
organization = "VNG"
  [author.address]
   email = "niels.dequeker@vng.nl"

%%%

.# Abstract

TODO

{mainmatter}

# Introduction

This section gives an introduction to this RFC.
Section 2 describes the architecture of a system that follows the FSC specification.
Section 3 describes the interfaces and behavior of FSC components in detail.

## Purpose

The Federated Service Connectivity (FSC) specifications describe a way to implement technically interoperable API gateway functionality, covering federated authentication, secure connecting and transaction logging in a large-scale, dynamic API landscape. The standard includes the exchange of information and requests about the management of connections and authorizations, in order to make it possible to automate those activities.

The Core part of the FSC specification achieves inter-organizational, technical interoperability:

- to discover Services
- to route requests to Services in other contexts (e.g. from within organization A to organization B)
- to request and managing connection rights needed to connect to said Services

Functionality required to achieve technical interoperability is provided by APIs as specified in this RFC. This allows for automation of most management tasks, greatly reducing the administrative load and enabling upscaling of inter-organizational usage of services.

## Overall Operation of FSC Core

Peers in a Group announce their HTTP APIs to the Group by registering them as a Service in the Directory. A Group uses one Directory that defines the scope of the Group. Peers use the Directory to discover which Services and Peers are available in the Group.
Outways of a consuming Peer connect to the Inway of a Service providing Peer.
Contracts define Peers registration to the Group, Service Registration to the Group and connections between Peers.

Inways are reverse proxies that route incoming connections from Outways to Services.
Outways are forward proxies that discover all available Services in the Group and route outgoing connections to Inways.
Contract Managers negotiate Contracts between Peers.
The Directory lists routing information for the Services in the Group.
The Directory provides information about the Peers in a Group.

To connect to a Service, the Peer needs a Contract with a Connection Grant that specifies the connection. The FSC Core specification describes how Contracts are created, accepted, rejected and revoked. Once a right to connect is granted through a Contract, a connection from HTTP Client to HTTP Service will be authorized everytime an HTTP request to the HTTPS service is made.

FSC Core specifies the basics for setting up and managing connections in a Group. It is **RECOMMENDED** to use FSC Core with the following extensions, each specified in a dedicated RFC:

- [FSC Delegation](delegation/README.md), to delegate the right to connect to a service
- [FSC Policies](policies/README.md), to use more advanced policies as conditions in Contracts
- [FSC Logging](logging/README.md), to standardize and link transaction logs
- [FSC Control](control/README.md), to get in control from a management, security and audit perspective

### Use cases

A typical use case is a cooperation of many organizations that use APIs to exchange data or provide business services to each-other.

Organizations can participate in more than one FSC Groups at the same time, for example when using different environments for production and test deployments, or when participating in different ecosystems, for example health industry and government industry. An organization can offer the same API in multiple Groups. When doing so, the organization will be a Peer in every Group, and define the API as a service in the Directory of each group using a different Inway for each Group.

## Requirements Language

The keywords "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [BCP 14](https://www.rfc-editor.org/info/bcp14) [RFC2119](https://www.rfc-editor.org/rfc/rfc2119) [RFC8174](https://www.rfc-editor.org/rfc/rfc8174) when, and only when, they appear in all capitals, as shown here.

## Terminology

This specification lists terms and abbreviations as used in this document.

*Peer:*    
  
Actor that both provides and consumes services. This is an abstraction of e.g. an organization, a department or a security context.

*Group:*   
  
System of Peers using Inways, Outways and Contract Managers that confirm to the FSC specification to make use of each other's services.

*Directory:*      
  
A Directory holds information about the services in the FSC Group to make them discoverable.

*Inway:*  
  
Reverse proxy that handles incoming connections to one or more Services.

*Outway:*  
  
Forward proxy that handles outgoing connections to Inways.

*Contract:*  
  
Document between Peers defining which interactions between Peers are possible.

*Contract Manager:*  
  
The Contract Manager manages Contracts and configures Inways and Outways based on information from a Directory and Contracts.

*Grant:*  
  
Defines an interaction between Peers. In FSC Core three Grants are described.  

1. The Peer Registration Grant which specifies the right of a Peer to participate as a Peer in the Group.
2. The Publication Grant which specifies the right of a Peer to publish a Service in the Group.
3. The Connection Grant which specifies the right of a Peer to connect to a Service provided by a Peer.

*Service:*      
  
An HTTP API offered to the Group.

*Trust Anchor:*      
  
The Trust Anchor is an authoritative entity for which trust is assumed and not derived. In the case of FSC, which uses an X.509 architecture, it is the root certificate from which the whole chain of trust is derived.

# Architecture

This chapter describes the basic architecture of FSC systems.

## Request flow

Clients make requests to Outways, the Outway proxies the request to the Inway and Inway proxies the request to the Service (API).

!---
![Request Flow](diagrams/seq-request-flow.svg "Request Flow")
![Request Flow](diagrams/seq-request-flow.ascii-art "Request Flow")
!---

## Service discovery

Every Group is defined by one Directory that contains routing information for the Services in the Group.
Contract Managers register Services by offering Contracts with a Service Publication Grant to the Directory.
Outways discover Services by requesting a list from the Directory.

!---
![Service discovery](diagrams/seq-service-discovery.svg "Service discovery")
![Service discovery](diagrams/seq-service-discovery.ascii-art "Service discovery")
!---

## mTLS connections and Trust Anchor {#trustanchor}

Connections between Contract Managers, Inways, Outways and connections with the Directory use Mutual Transport Layer Security (mTLS) with X.509 certificates. Components in the Group are configured to accept the same (Sub-) Certificate Authority (CA) as Trust Anchor. The Trust Anchor is a Trusted Third Party that ensures the identity of all Peers by issuing `Subject.organization` and `Subject.serialnumber` [@!RFC5280, section 4.1.2.6] in each certificate.

!---
![mTLS Connections](diagrams/seq-mtls-connections.svg "mTLS Connections")
![mTLS Connections](diagrams/seq-mtls-connections.ascii-art "mTLS Connections")
!---

## Contract Management

Contracts are negotiated between Contract Managers of Peers. The Directory contains the Contract Manager address of each Peer.
Connections between Peers are based Contracts with Connection Grants. To create a new contract, the Contract Manager uses a selection of desired connections as input. (Typically this input comes from a user interface interacting with the Contract Management functionality, see [Registering a Peer](#registering)). For each desired connection, a Connection Grant is formulated that contains identifying information about both the Outway from the requesting Peer and the Service of the Providing Peer. One Contract may contain multiple Grants. Grants typically match the connections mentioned in a legal agreement like a Data Processing Agreement (DPA). Valid Contracts are used to configure Inways and Outways and enable the possibility to automatically create on demand connections between Peers, as defined in the Grants.

!---
![Contract Management](diagrams/seq-contract-management.svg "Contract Management")
![Contract Management](diagrams/seq-contract-management.ascii-art "Contract Management")
!---

### Contract states

Any Peer can submit a Contract to other Peers. This Contract becomes a valid when the Peers mentioned in the Contract accept it's content by placing an accept signature. 

A Contract becomes invalid when at least one Peer mentioned in de Contract revokes its content.

Accepting, rejecting and revoking is done by adding a digital signature.

Contracts are immutable. When the content of a Contract has to change, the contract is invalidated and replaced by a new one.

## Registering a Peer {#registering}

A Peer needs to register with the Directory of the Group before a Peer is able to provide or consume Services available in the Group. 
This registration is required to validate that the Peer meets the requirements set by the Group. In case of FSC Core only an x.509 Certificate signed by the Trust Anchor is required but extensions on Core might, for example, require the Peer to sign a "Terms of Service" document before allowing a Peer to participate in a Group.

To register, the Peer needs to create a Contract with a Peer Registration Grant. The Peer Registration Grant contains information about the Peer, the address of the Contract Manager of the Peer and the Directory that should accept the registration.

Once the Contract between Peer and Directory is signed by both parties, the Peer is considered a Peer of the Group.

!---
![Registering a Peer](diagrams/seq-registering-a-peer.svg "Registering a Peer")
![Registering a Peer](diagrams/seq-registering-a-peer.ascii-art "Registering a Peer")
!---

## Providing a Service

To provide a Service a Peer needs to create a Contract with a Publication Grant. The Publication Grant contains information about the Service, the address of the Inway offering the service and the Directory that should list the Service. 

Once the Contract between Peer and Directory is signed by both parties, the Service will be listed in the Directory. 

!---
![Providing a Service](diagrams/seq-providing-a-service.svg "Providing a Service")
![Providing a Service](diagrams/seq-providing-a-service.ascii-art "Providing a Service")
!---

## Connecting to a Service

A Peer can connect to a Service by setting up a connection between the Outway of the Peer to the Inway that is providing the Service. This connection can only be established if the Peer consuming the Service has a Contract containing a Connection Grant with the Peer providing the Service.
The Connection Grant contains information about the Service and the public key of the Outway that is allowed access to the Service.

Once the Contract between providing Peer and consuming Peer is signed by both parties, the connection between Inway and Outway can be established.

!---
![Connecting to a Service](diagrams/seq-connecting-to-a-service.svg "Connecting to a Service")
![Connecting to a Service](diagrams/seq-connecting-to-a-service.ascii-art "Connecting to a Service")
!---

# Specifications

## General 

### TLS configuration

Connections between components of an FSC Group are mTLS connections based on X.509 certificates as defined in [@RFC5280].

The certificates must be provided by a Trust Anchor which **SHOULD** validate a Peers identity. 

Each Group has a single Trust Anchor.

Every Peer in a Group **MUST** accept the same Trust Anchor.

The certificate guarantees the identity of a Peer.

FSC places specific requirements on the subject fields of a certificate. [@!RFC5280, section 4.2.1.6] which are listed below

- SerialNumber: A unique identifier which serves as the Peers identity in the FSC Group. This value is used in combination with a Service name to route request to the correct Service.
- CommonName: This should correspond to the Fully Qualified Domain Name (FQDN) of an Contract Manager, Inway or Outway.  For an Outway this FQDN does not have to be resolvable.
- Subject Alternative Name [@!RFC5280, section 4.2.1.6]: This should contain to the Fully Qualified Domain Names (FQDN) of an Contract Manager, Inway or Outway. For an Outway this FQDN does not have to be resolvable.

### gRPC error handling

According to gRPC specification a gRPC service must return a structured error response using the `Status` interface. In case of a specific FSC error code the `Status` message is enriched with an `ErrorInfo` message containing the FSC specific error code.

The FSC specific error code **MUST** be set as the value of the `reason` field of the `ErrorInfo` interface.

The `ErrorInfo` interface **MUST** be used as the value of the `details` field of the `Status` interface.

- The `Status` interface:  <https://github.com/googleapis/googleapis/blob/master/google/rpc/status.proto>
- The `ErrorInfo` interface: <https://github.com/googleapis/googleapis/blob/master/google/rpc/error_details.proto>

## Contract

Described below are the fields of a Contract.

```
ID(string): UUID of the Contract
GroupID(string): The URI of the Directory
HashAlgorithm(string): hash algorithm that needs to be used to generate the hash of the Contract. This hash is used to validate if two contracts are equal and verify that a signature is intended for the Contract
Validity: contains two dates describing the period in which the Contract can be used.
    NotBefore(unix timestamp): a contract is not valid before this date.
    NotAfter(unix timestamp): a contract is not valid after this date.
Signatures: signatures of the Peers listed in the contract. Contracts have three types of signatures: accepted, rejected and revoked.
    Accept(map<string,string>): a map of accept signatures. The key is the serial number of the Peer, the value is the JWT.
    Reject(map<string,string>): a map of reject signatures. The key is the serial number of the Peer, the value is the JWT.
    Revoke(map<string,string>): a map of revoke signatures. The key is the serial number of the Peer, the value is the JWT.
Grants(list of grants): a list of grants 
```

### Grants

Each Grant contains a `Type` field and a `Data` field. Described below are the `Data` fields per Grant `Type`.

**Connection Grant**

``` 
Outway: information about the Outway of the Peer that is allowed to connect
    PeerSerialNumber(string): serial number of the Peer that is allowed to connect
    PublicKeyFingerprints(list of strings): a list of public key fingerprints that are allowed to connect
Service: service to which a connection is allowed
    PeerSerialNumber(string): serial number of the Peer offering the Service
    Name(string): the name of the Service
```

**Publication Grant**

```
Directory: information about the Directory to which the Service will be published
    PeerSerialNumber(string): serial number of the Peer hosting the Directory
Service: information about the Service 
    PeerSerialNumber(string): serial number of the Peer offering the Service
    Name(string): name of the Service
    InwayAddress(string): address of the Inway that is offering the Service.
```

**Peer Registration Grant**

```
- Directory: information about the Directory to which the Peer wants to register
    PeerSerialNumber(string): the serial number of the Peer hosting the Directory
- Peer: information about the Peer registering to the Directory
    SerialNumber(string): serial number of the Peer
    Name(string): name of the Peer
    ContractManagerAddress(string): address of the Contract Manager 
```

## Directory

### Behavior

#### Authentication

Outways and Contract Managers connecting to the Directory **MUST** use mTLS with an X.509 certificate that is signed by the chosen Certificate Authority (CA) that acts as the Trust Anchor of the Group.

#### Peer registration

Peer registration is accomplished by offering a Contract to the Directory which contains a `PeerRegistrationGrant`.

The Directory **MUST** be able to sign Contracts with Grants of the type `PeerRegistrationGrant`.

A `PeerRegistrationGrant` is valid when:

- The subject serial number of the X.509 certificate used by the Directory matches the value of the field `PeerRegistrationGrant.Directory.PeerSerialNumber`
- The subject serial number of the X.509 certificate used by the Contract Manager offering the Contract to Directory matches the value of the field `PeerRegistrationGrant.Peer.SerialNumber`
- A Contract Manager address is provided in the field `PeerRegistrationGrant.Peer.ContractManagerAddress`. The value should be a valid URL as specified in [@RFC1738]

The Contract containing the `PeerRegistrationGrant` is valid when:

- A signature is present with the serial number of the Peer defined the field `PeerRegistrationGrant.Directory.PeerSerialNumber`
- A signature is present with the serial number of the Peer defined the field `PeerRegistrationGrant.Peer.SerialNumber`
- The Directory URI matches the GroupID defined in the field `Contract.GroupID`
- The current date is between `Contract.Validity.NotBefore` and `Contract.Validity.NotAfter`

#### Service registration

Service registration is accomplished by offering a Contract to the Directory which contains one or more `PublicationGrants` with each `PublicationGrant` containing a single Service. Once the Directory and the Peer offering the Service have both signed the Contract, the Service is published in the Directory.

The Directory **MUST** be able to sign Contracts with Grants of the type `PublicationGrant`.

The Directory **MUST** only accept `PublicationGrants` of Peers which have a valid Contract with a `PeerRegistrationGrant` containing both the Peer and the Directory.

A `PublicationGrant` is valid when:

- The subject serial number of the X.509 certificate used by the Directory Peer matches the value of the field `PublicationGrant.Directory.PeerSerialNumber`
- A Service name is provided in the field  `PublicationGrant.ServicePublication.Name`
- An Inway address is provided in the field `PublicationGrant.ServicePublication.InwayAddress`. The value should be a valid URL as specified in [@RFC1738]

The Contract containing the `PublicationGrant` is valid when:

- A signature is present with the subject serial number of the Peer defined the field `PublicationGrant.Directory.PeerSerialNumber`
- A signature is present with the subject serial number of the Peer defined the field `PublicationGrant.Service.PeerSerialNumber`
- The Directory URI matches the GroupID defined in the field `Contract.GroupID`
- The current date is between `Contract.Validity.NotBefore` and `Contract.Validity.NotAfter`

#### Service listing

The Directory **MUST** list a Service when a valid Contract containing a Publication Grant for the Service exists.

The Directory **MUST** provide the URL of the Inway that is providing a Service.

#### Peer listing

The Directory **MUST** offer a list of the Peers in the Group. The listing should include the Contract Managers of each Peer. This information is used to negotiate Contracts between Peers.

The Directory **MUST** only return a Peer when a valid Contract containing a `PeerRegistrationGrant` exists.

### Interfaces

#### Directory Service

The Directory functionality **MUST** implement an gRPC service, as specified on [grpc.io](https://grpc.io/docs/), with the name `ContractManagerService`. This service **MUST** implement the interface of the [Contract Manager](#contract_manager_interface).

In addition to the Contract Manager interface the Directory functionality **MUST** implement an gRPC service with the name `Directory`. This service **MUST** offer three Remote Procedure Calls (rpc):
- `ListPeers`, lists the Peers known by the Directory
- `ListServices`, lists the Services known by the Directory
- `GetGroupInfo`, returns the version of the FSC standard used by the Group

Rpc's **MUST** use Protocol Buffers of the version 3 Language Specification to exchange messages, as specified on [developers.google.com](https://developers.google.com/protocol-buffers/docs/reference/proto3-spec). The messages are specified below.

##### rpc ListServices

The Remote Procedure Call `ListServices` **MUST** be implemented with the following interface and messages:

```
rpc ListServices(ListServicesRequest) returns (ListServicesResponse);

message ListServicesRequest {}

message ListServicesResponse {
  message Service {
    Organization organization = 1;
    string name = 2;
    Inway inway = 3;
  }

  repeated Service services = 1;
}

message Organization {
  string serial_number = 1;
  string name = 2;
}

message Inway {
  string address = 1;
}
```

##### rpc ListPeers

The Remote Procedure Call `ListPeers` **MUST** be implemented with the following interface and messages:

```
rpc ListPeers(ListPeersRequest) returns (ListPeersResponse);

message ListPeersRequest {
  repeated string peer_serial_numbers = 1;
}

message ListPeersResponse {
  repeated Peer peers = 1;
}

message Peer {
  string serial_number = 1;
  string name = 2;
  ContractManager contract_manager = 3;
}

message ContractManager {
  string address = 1;
}
```

##### rpc GetGroupInfo

The Remote Procedure Call `GetGroupInfo` **MUST** be implemented with the following interface and messages:

```
rpc GetGroupInfo(GetGroupInfoRequest) returns (GetGroupInfoResponse);

message GetGroupInfoRequest {}

message GetGroupInfoResponse {
  string fsc_version = 1;
  repeated Extension extensions = 2;
}

message Extension {
  string name = 1;
  string version = 2;
}
```

## Contract Manager

The Contract Manager functionality in FSC Core is:

- Receiving Contracts
- Receiving Contract signatures (accept, reject, revoke)
- Validating Contracts
- Validating Contract signatures
- Providing the X.509 certificates containing the public key of the keypair of which the private key was used by the Peer to create signatures
- Providing Contracts involving a specific Peer

It is **RECOMMENDED** to implement the Contract Manager functionality separate from the Inway functionality, in order to be able to have multiple Inways that are configured by one Contract Manager.

### Behavior

#### Authentication

The Contract Manager **MUST** accept only mTLS connections from other external Contract Managers with an X.509 certificate that is signed by the Thrust Anchor of the Group.

#### Creating Contracts

The Contract Manager is responsible for propagating the Contract to the Peers involved in the Contract.

#### Signing Contracts

The Contract Manager **MUST** validate the signature.

The Contract Manager **MUST** generate an error response if a signature is invalid.

When a Peer signs a Contract, the Contract Manager of the Peer **MUST** propagate the signature to each of the Peers included in the contract.

#### Rejecting Contracts

The Contract Manager **MUST** validate the signature of the rejection.

The Contract Manager **MUST** generate an error response if a signature is invalid.

When a Peer rejects a Contract, the Contract Manager **MUST** propagate the rejection to each of the Peers included in the contract.

#### Revoking Contracts

The Contract Manager **MUST** validate the signature of the revocation.

The Contract Manager **MUST** generate an error response if a signature is invalid.

When a Peer revokes a Contract, the Contract Manager of the Peer **MUST** propagate the revocation to each of the Peers included in the contract.

#### Signature verification

A signature **SHOULD** only be accepted if the Peer is present in the Contract content as:

- `GrantConnection.Outway.PeerSerialNumber`
- `GrantConnection.Service.PeerSerialNumber`
- `GrantPublication.Directory.PeerSerialNumber`
- `GrantPublication.Service.PeerSerialNumber`
- `GrantPeerRegistration.Directory.PeerSerialNumber`
- `GrantPeerRegistration.Peer.SerialNumber`

The serial number of the Peer offering the signature **MUST** match the subject serial number of the X.509 certificate containing the public key used to create the signature.

#### Contract verification

When receiving a contract the Peer **MUST** validate that the hash of the contract matches the hashes in the Peer signatures.

#### Providing X.509 certificates

The Contract Manager **MUST** be able to provide the X.509 certificates containing the public key of the keypair of which the private key was used by the Peer to create signatures.

#### Providing contracts

The Contract Manager **MUST** be able to provide contracts the Contract Manager has available for specific Peer. A Contract **SHOULD** only be provided to a Peer if the Peer is present in one of the Grants of the Contract.

### Interfaces {#contract_manager_interface}

The Contract Manager functionality **MUST** implement an gRPC service, as specified on [grpc.io](https://grpc.io/docs/), with the name `ContractManagerService`. This service **MUST** offer four Remote Procedure Calls (rpc):
- `SubmitContract`, used to offer a contract to be signed by the receiver
- `AcceptContract`, used to accept a contract
- `RejectContract`, used to reject a contract
- `RevokeContract`, used to revoke a contract
- `ListContracts`, lists contracts of a specific grant type
- `ListCertificates`, lists certificates matching the public key fingerprints in the request

Rpc's **MUST** use Protocol Buffers of the version 3 Language Specification to exchange messages, as specified on [developers.google.com](https://developers.google.com/protocol-buffers/docs/reference/proto3-spec). The messages are specified below.

#### Contract

The interface Contract is used in rpc's of the gRPC service `ContractManagerService`

The signatures field of the Contract message **MUST** contain a map of Peer subject serial numbers and signatures

```
enum HashAlgorithm {
    HASH_ALGORITHM_UNSPECIFIED = 0;
    HASH_ALGORITHM_SHA3_512 = 1;
}

message Contract {
    ContractContent content = 1;
    Signatures signatures = 2;
}

message ContractContent {
  string id = 1;
  string group_id = 2;
  Validity validity = 3;
  repeated Grant grants = 4;
  string hash_algorithm = 5;
}

message Validity {
    uint64 not_before = 1;
    uint64 not_after = 2;
}

message Signatures {
    map<string, string> accept = 1;
    map<string, string> reject = 2;
    map<string, string> revoke = 3;
}

enum GrantType {
  GRANT_TYPE_UNSPECIFIED = 0;
  GRANT_TYPE_PEER_REGISTRATION = 1;
  GRANT_TYPE_PUBLICATION = 2;
  GRANT_TYPE_CONNECTION = 3;
}

message Grant {
    GrantType type = 1;
    oneof data {
        GrantPeerRegistration registration = 2;
        GrantPublication publication = 3;
        GrantConnection connection = 4;
    }
}

message GrantPeerRegistration {
    message Directory {
        string peer_serial_number = 1;
    }
    
    message Peer {
        string serial_number = 1;
        string name = 2;
        string contract_manager_address = 3;
    }
    
    Directory directory = 1;
    Peer peer = 2;
}

message GrantPublication {
    message Service {
        string peer_serial_number = 1;
        string name = 2;
        string inway_address = 3;
    }
    
    message Directory {
        string peer_serial_number = 1;
    }
    
    Directory directory = 1;
    Service service = 2;
}

message GrantConnection{
    message Service {
        string peer_serial_number = 1;
        string name = 2;
    }
       
    message Outway {
        peer_serial_number = 1;
    }
    
    Outway outway = 1;
    Service service = 2;
}
```

#### rpc SubmitContract

The Remote Procedure Call `SubmitContract` **MUST** be implemented with the following interface and messages:

```
rpc SubmitContract(SubmitContractRequest) returns (SubmitContractResponse);

message SubmitContractRequest {
  ContractContent contract_content = 1;
  string signature = 2;
  bytes certificate_chain = 3;
}

message SubmitContractResponse {}
```

#### rpc AcceptContract

The Remote Procedure Call `AcceptContract` **MUST** be implemented with the following interface and messages:

```
rpc AcceptContract(AcceptContractRequest) returns (AcceptContractResponse);

message AcceptContractRequest {
    ContractContent contract_content = 1;
    string signature = 2;
    bytes certificate_chain = 3;
}
message AcceptContractResponse{}
```

#### rpc RejectContract

The Remote Procedure Call `RejectContract` **MUST** be implemented with the following interface and messages:

```
rpc RejectContract(RejectContractRequest) returns (RejectContractResponse);

message RejectContractRequest {
    ContractContent contract_content = 1;
    string signature = 2;
    bytes certificate_chain = 3;
}


message RejectContractResponse{}
```

#### rpc RevokeContract

The Remote Procedure Call `RevokeContract` **MUST** be implemented with the following interface and messages:

```
rpc RevokeContract(RevokeContractRequest) returns (RevokeContractResponse);

message RevokeContractRequest {
    ContractContent contract_content = 1;
    string signature = 2;
    bytes certificate_chain = 3;
}

message RevokeContractResponse{}
```

#### rpc ListContracts

The Remote Procedure Call `ListContracts` **MUST** only return contracts involving the Peer calling the rpc when the GrantType is `GRANT_TYPE_CONNECTION`, `GRANT_TYPE_DELEGATION`.

The Remote Procedure Call `ListContracts` **MUST** be implemented with the following interface and messages:

```
rpc ListContracts(ListContractsRequest) returns (ListContractsResponse);

message ListContractsRequest{
    GrantType grant_type = 1;
}

message ListContractsResponse {
    repeated Contract contracts = 1;
}
```

#### rpc ListCertificates

The Remote Procedure Call `ListCertificates` **MUST** be implemented with the following interface and messages:

```
rpc ListCertificates(ListCertificatesRequest) returns (ListCertificatesResponse);

message ListCertificatesRequest{
    repeated string public_key_fingerprints = 1;
}

message ListCertificatesResponse {
    map<string, bytes> certificates = 1;
}
```

#### Error codes

The gRPC service **MUST** implement the following error codes:

```
enum ErrorReason {
    ERROR_REASON_UNSPECIFIED = 0;

    // Peer is not part of the contract
    ERROR_REASON_PEER_NOT_PART_OF_CONTRACT = 1;

    // Signature contentHash does not match the hash of the contract content
    ERROR_REASON_SIGNATURE_CONTRACT_CONTENT_HASH_MISMATCH = 2;

    // Peer certificate could not be verified
    ERROR_REASON_PEER_CERTIFICATE_VERIFICATION_FAILED = 3;

    // Subject Serial Number of the signature does not match the Subject Serial Number of the certificate with the public key used to verify the signature
    ERROR_REASON_CERTIFICATE_SUBJECT_SERIAL_NUMBER_SIGNATURE_MISMATCH = 4;

    // Peer certificate could not be retrieved from the peer
    ERROR_REASON_PEER_CERTIFICATE_UNAVAILABLE = 5;

    // Signature could not be verified
    ERROR_REASON_SIGNATURE_VERIFICATION_FAILED = 6;
}
```

### Signatures  {#signatures}

A signature **MUST** follow the JSON Web Signature(JWS) format specified in [@!RFC7515]

The JWS **MUST** specify the X.509 certificate containing the public key used to create the digital signature using the `x5t#S256`[@!RFC7515, section 4.1.8] field of the `JOSE Header`[@!RFC7515, section 4].

The JWS **MUST** use the JWS Compact Serialization described in [@!RFC7515, section 7.1]

The JWS Payload as defined in [@!RFC7515, section 2], **MUST** contain a hash of the `Contract.Content` as described in the section [Content Hash](#content_hash) and the signature type.

The JWS **MUST** be created using one of the digital signature algorithms described in [@!RFC7518, section 3,1]

JWS Payload example:
```JSON
{
  "contractContentHash": "--------",
  "type": "accept"
}
```

#### Payload fields

- `contractContentHash`, hash of the content of the contract.
- `type`, type of signature.

##### Signature types

- `accept`, peer has accepted the contract
- `reject`, peer has rejected the contract
- `revoke`, peer has revoked the contract

#### The content hash {content_hash}

A Peer should ensure that a contract signature is intended for the contract.
Validation is done by comparing the hash of the received contract with the hash in the signature.

The `contentHash` of the signature payload contains the signature hash. The algorithm to create a `contentHash` is described below. The resulting hash can be used to verify if two Contracts are equal.

1. Create a byte array called `contentBytes`.
2. Convert `Contract.Content.HashAlgorithm` to bytes and append the bytes to `contentBytes`.
3. Convert `Contract.Content.Id` to bytes and append the bytes to `contentBytes`.
4. Convert `Contract.Content.GroupId` to bytes and append the bytes to `contentBytes`.
5. Convert `Contract.Content.Validity.NotBefore` to bytes and append the bytes to `contentBytes`.
6. Convert `Contract.Content.Validity.NotAfter` to bytes and append the bytes to `contentBytes`.
7. Create an array of bytes arrays called `grantByteArrays`
8. For each Grant in `Contract.Content.Grants`
    1. Create a byte array named `grantBytes`
    2. Convert the value of each field of the Grant to bytes and append the bytes to the `grantBytes` in the same order as the fields are defined in the proto definition. If the value is a list; Create a byte array called `fieldBytes`, append the bytes of each item of the list to `fieldBytes`, sort `fieldBytes` in ascending order and append `fieldBytes` to `grantBytes`.
    3. Append `grantBytes` to `grantByteArrays`
9. Sort the byte arrays in `grantByteArrays` in ascending order
10. Append the bytes of `grantByteArrays` to `contentBytes`.
11. Hash the `contentBytes` using the hash algorithm described in `Contract.Content.Algorithm`
12. Encode the bytes of the hash as base64.

##### Data types {#data_types}

- `int32`: use `Little-endian` as endianness when converting to a byte array
- `int64`: use `Little-endian` as endianness when converting to a byte array
- `string`: use `utf-8` encoding when converting to a byte array
- `GrantType`: should be represented as an int32

## Outway

### Behavior

#### Authentication

The Outway **MUST** use mTLS when connecting to the Directory or Inways with an X.509 certificate signed by the chosen Certificate Authority (CA) of the network.

#### Routing

The Outway **MUST** be able to route HTTP requests to the correct service on the FSC network. A service on the FSC network can be identified by the unique combination of a serial-number and a service-name. An Outway receives the serial-number and service-name through the path component as described in  [@!RFC3986, section 3.3] of an HTTP request.
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
      description: A FSC network error has occurred
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

### Behavior

#### Authentication

The Inway **MUST** only accept connections from Outways using mTLS with an X.509 certificates signed by the chosen Certificate Authority (CA) that acts as Trust Anchor of the network.

#### Authorization

The Inway **MUST** validate that an active access grant exists for the public key of the mTLS connection making the request. If no access grant exists the Inway **MUST** deny the request.

#### Routing

The Inway **MUST** be able to route HTTP requests to the correct service. A Service on the FSC network can be identified by the unique combination of a serial-number and a service-name. An Inway receives the service-name through the path component [@RFC3986, section 3.3] of an HTTP request.
The first segment of the path **MUST** contain the service-name.

The Inway **MUST** delete the service-name from the path of the HTTP Request before forwarding the request to the service.
e.g `/service-name/get/data` -> `/get/data`

### Interfaces

#### Proxy Endpoint

The Inway **MUST** implement an HTTP endpoint which proxies received requests to the correct Service.

```
openapi: 3.0.0
paths:
  /{service_name}: 
    description: receives requests of all HTTP Methods and proxies the received requests to the service specified in the path of the HTTP request.
    responses:
      default:
        description: must return the HTTP Response of the service.
      540:
        description: An FSC network error has occured 
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
                  description: The component causing the error. In this case 'inway'
                location:
                  type: string
                  description: The location of the error.
                code:
                  type: string
                  description: A unique code describing the error.
```

#### Error response

If the service called generates an error, the Inway **MUST** return the error response of the API to the client without altering the response.

If an error occurs within the scope of the FSC network, the Inway **MUST** return the HTTP status code 540 with an error response defined in the section Proxy Endpoint.

The code field of the error response **MUST** contain one of the following codes:

- `ACCESS_DENIED`: No access grant exists for the public key used by the client making the request.
- `EMPTY_PATH`: the path of the HTTP request does not contain a service-name
- `INVALID_CERTIFICATE`: The X.509 certificates does not meet the requirements of FSC.
- `MISSING_PEER_CERTIFICATE`: the Inway is unable to extract the X.509 certificate from the connection.
- `SERVER_ERROR`: General error code
- `SERVICE_DOES_NOT_EXIST`: the service is unknown to the Inway
- `SERVICE_UNREACHABLE`: the Inway knows the service but is unable to proxy the request to the service

# References

# Acknowledgements

{backmatter}
