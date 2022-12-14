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
- [FSC Delegation](delegation/README.md), to delegate the right to connect to a service
- [FSC Policies](policies/README.md), to use more advanced policies as conditions in Contracts
- [FSC Logging](logging/README.md), to standardize and link transaction logs
- [FSC Control](control/README.md), to get in control from a management, security and audit perspective


### Use cases

A typical use case is a cooperation of many organizations that use APIs to exchange data or provide business services to eachother.

Organizations can participate in more than one FSC Groups at the same time, for example when using different environments for production and test deployments, or when participating in different ecosystems, for example health industry and government industry. An organization can offer the same API in multiple Groups. When doing so, the organization will be a Peer in every Group, and define the API as a service in the Directory of each group using a different Inway for each Group.

## Requirements Language

The keywords "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [BCP 14](https://www.rfc-editor.org/info/bcp14) [RFC2119](https://www.rfc-editor.org/rfc/rfc2119) [RFC8174](https://www.rfc-editor.org/rfc/rfc8174) when, and only when, they appear in all capitals, as shown here.

## Terminology

This specification lists terms and abbreviations as used in this document.

Peer
: Actor that both provides and requests services. This is an abstraction of e.g. an organization, a department or a security context.

Group
: System of Peers using Inways, Outways and Contract Managers that confirm to the FSC specification to make use of each other's services.

Directory
: A Directory holds information about all services in the FSC Group to make them discoverable.

Inway
: Reverse proxy that handles incoming connections to one or more services and confirms to the FSC Core specification.

Outway
: Forward proxy that handles outgoing connections to Inways and confirms to the FSC Core specification.

Contract
: Document containing the Grants between Peers, defining which interactions between Peers are possible.

Contract Manager
: The Contract Manager manages Contracts and configures Inways and Outways based on information from a Directory and Contracts.

Grant
: Defines the interactions between Peers. In FSC Core two Grants are described. 

1. The Connection Grant which specifies the right of a Peer to connect to a Service provided by a Peer.
2. The Publication Grant which specifies the right of a Peer to publish a Service in the Group.

Service
: An HTTP API offered to the Group.

Trust Anchor
: The Trust Anchor is an authoritative entity for which trust is assumed and not derived. In the case of FSC, which uses an X.509 architecture, it is the root certificate from which the whole chain of trust is derived.

# Architecture

This chapter describes the basic architecture of FSC systems.

## Request flow

!---
![Request Flow](diagrams/core/seq-request-flow.svg "Request Flow")
![Request Flow](diagrams/core/seq-request-flow.ascii-art "Request Flow")
!---

## Service discovery

Every Group is defined by one Directory that contains routing information for all services in the Group.
Inways register services in the Directory.
Outways discover services by requesting a list from the Directory.

!---
![Service discovery](diagrams/core/seq-service-discovery.svg "Service discovery")
![Service discovery](diagrams/core/seq-service-discovery.ascii-art "Service discovery")
!---

## mTLS connections and Trust Anchor {#trustanchor}

Connections between Inways and Outways and connections with the Directory use Mutual Transport Layer Security (mTLS) with X.509 certificates. Components in the Group are configured to accept the same (Sub-) Certificate Authority (CA) as Trust Anchor. The Trust Anchor is a Trusted Third Party that ensures the identity of all Peers by issuing `Subject.organization` and `Subject.serialnumber` [@!RFC5280, section 4.1.2.6](https://www.rfc-editor.org/rfc/rfc5280#section-4.1.2.6) in each certificate.

!---
![mTLS Connections](diagrams/core/seq-mtls-connections.svg "mTLS Connections")
![mTLS Connections](diagrams/core/seq-mtls-connections.ascii-art "mTLS Connections")
!---

## Contract Management

Connections between Peers are based on Grants. A Grant is the right to make a connection from an Outway to a service offered in the Group. Grants are encapsulated in Contracts and agreed upon by the involved Peers. To create a new contract, the Contract Manager uses a selection of desired connections as input. (Typically this input comes from a user interface interacting with the Contract Management functionality, see [Administrating a Peer](#administrating)). For each desired connection, a Grant is formulated that contains identifying information about both the Outway from the requesting Peer and the service of the Providing Peer. One Contract may contain multiple Grants. Grants typically match the connections mentioned in a legal agreement like a Data Processing Agreement (DPA). Valid Contracts are used to configure Inways and Outways and enable the possibility to automatically create on demand connections between Peers, as defined in the Grants.

!---
![Contract Management](diagrams/core/seq-contract-management.svg "Contract Management")
![Contract Management](diagrams/core/seq-contract-management.ascii-art "Contract Management")
!---
### Contract states

Any Peer can submit a Proposal to other Peers. This Proposal becomes a valid Contract when all Peers mentioned in the Contract accept its content. When 


A Contract becomes invalid when at least one Peer mentioned in de Contract revokes its content.

Accepting, rejecting and revoking is done by adding a signed statement.


Contracts are immutable. When the content of a Contract has to change, the contract is invalidated and replaced by a new one.



## Connecting to a service

## Providing a service


## Administrating a Peer {#administrating}

XX


# Specifications

## General 

### TLS configuration

Connections within an FSC Group are mTLS connections based on X.509 certificates as defined in [@RFC5280](https://www.rfc-editor.org/rfc/rfc5280).

The certificates must be provided by a Trust Anchor which **SHOULD** validate a Peers identity. Each Group has a single Trust Anchor. Every Peer in a Group **MUST** accept the same Trust Anchor.

The certificate guarantees the identity of a Peer.

FSC places specific requirements on the subject fields of the certificate. [@!RFC5280, section 4.2.1.6](https://www.rfc-editor.org/rfc/rfc5280#section-4.2.1.6) which are listed below

- SerialNumber: A unique identifier which serves as the Peers identity in the FSC Group. This value is used in combination with a Service name to route request to the correct Service.
- CommonName: This should correspond to the Fully Qualified Domain Name (FQDN) of an Inway or Outway.  For an Outway this FQDN does not have to be resolvable.
- Subject Alternative Name[@!RFC5280, section 4.2.1.6](https://www.rfc-editor.org/rfc/rfc5280#section-4.2.1.6): This should contain to the Fully Qualified Domain Names (FQDN) of an Inway or Outway. For an Outway this FQDN does not have to be resolvable.

## Outway

### Behavior

#### Authentication

The Outway **MUST** use mTLS when connecting to the Directory or Inways. The X.509 certificate **MUST** be signed by the chosen Certificate Authority (CA) of the network.

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

The Inway **MUST** use mTLS when connecting to the Directory. The X.509 certificate **MUST** be signed by the chosen Certificate Authority (CA) that acts as Trust Anchor of the network.

The Inway **MUST** only accept connections using mTLS. The X.509 certificates **MUST** be signed by the chosen Certificate Authority (CA) that acts as Trust Anchor of the network.

#### Authorization

The Inway **MUST** validate that an active access grant exists for the public key of the mTLS connection making the request. If no access grant exists the Inway **MUST** deny the request.

#### Health check

The Inway **MUST** be able to receive health checks from the Directory. The Directory will make a periodic health checks to known Inways by sending an HTTP request for each service the Inway is offering to the FSC network.

Upon receiving the health check the Inway **MUST** validate that it is offering the service to the FSC network.

#### Registration

The Inway **MUST** register itself and the services it is offering to the Directory.

The Inway **MUST** register the services it is offering to the Directory with a regular time interval. It is **RECOMMENDED** to do this every 30 seconds, to have a balance between the risk of flooding the Director and timely insight in available services in the Group.

#### Routing

The Inway **MUST** be able to route HTTP requests to the correct service. A service on the FSC network can be identified by the unique combination of a serial-number and a service-name. An Inway receives the service-name through the path component [@RFC3986, section 3.3](https://www.rfc-editor.org/rfc/rfc3986#section-3.3) of an HTTP request.
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

##### Error response

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

#### Health check

The Inway **MUST** implement a health endpoint. This endpoint is called by the Directory to determine if a service is being offered by the Inway.

```
openapi: 3.0.0
paths:
  /.fsc/health/{service_name}:
    get:
      summary: Returns if the service is available and reachable,
        responses:
          200:
            description: healh status object,
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    healthy:
                      type: bool
                      description: true if the service is healthy
```

## Contract Manager

The Contract Manager functionality in FSC Core is:

- Receiving contract proposals
- Receiving contract signatures (accept, reject, revoke)
- Validating contract proposals
- Validating contract signatures
- Providing the X.509 certificates containing the public key of the keypair of which the private key was used by the Peer to create signatures
- Providing contracts involving a specific Peer

It is **RECOMMENDED** to implement the Contract Manager functionality separate from the Inway functionality, in order to be able to have multiple Inways that are configured by one Contract Manager.

### Behavior

#### Authentication

The Contract Manager **MUST** accept only mTLS connections from other external Contract Managers. The X.509 certificate **MUST** be signed by the Thrust Anchor of the Group.

#### Creating Contract Proposals

The Contract Manager is responsible for propagating the Contract Proposal to the Peers involved in the contract.

#### Signing Contracts

The Contract Manager **MUST** validate the signature.

The Contract Manager **MUST** generate an error response if a signature is invalid.

When a Peer signs a Contract, the Contract Manager **MUST** propagate the signature to each of the Peers included in the contract.

A Contract is deemed valid when each of the involved peers has digitally signed the contract.

#### Rejecting Contracts

The Contract Manager **MUST** validate the signature of the rejection.

The Contract Manager **MUST** generate an error response if a signature is invalid.

When a Peer rejects a Contract, the Contract Manager **MUST** propagate the rejection to each of the Peers included in the contract.

The Contract Manager **MUST** treat a Contract as rejected when the Contract has not been signed by the Peer owning the Contract Manager and the contract period has expired.

#### Revoking Contracts

The Contract Manager **MUST** validate the signature of the revocation.

The Contract Manager **MUST** generate an error response if a signature is invalid.

When a Peer revokes a Contract, the Contract Manager **MUST** propagate the revocation to each of the Peers included in the contract.

#### Signature verification

A signature **SHOULD** only be accepted if the Peer is present in the Contract Proposal as:

- `GrantConnection.Client.Peer`
- `GrantConnection.Service.Peer`
- `GrantPublication.Directory.Peer`
- `GrantPublication.Service.Peer`

The subject serial number of the Peer offering the signature **MUST** match the subject serial number of the X.509 certificate containing the public key used to create the signature.

#### Contract verification

When receiving a Contract the Peer **MUST** validate that the hash of the contract proposal matches the contract proposal hash in each Peer signature.

#### Providing X.509 certificates

The Contract Manager **MUST** be able to provide the X.509 certificates containing the public key of the keypair of which the private key was used by the Peer to create signatures.

#### Providing contracts

The Contract Manager **MUST** be able to provide contracts the Contract Manager has available for specific Peer. A Contract **SHOULD** only be provided to a Peer if the Peer is present in one of the Grants of the Contract.

### Interfaces {#contract_manager_interface}

The Contract Manager functionality **MUST** implement an gRPC service, as specified on [grpc.io](https://grpc.io/docs/), with the name `ContractManagerService`. This service **MUST** offer four Remote Procedure Calls (rpc):
- `SubmitProposal`, used to offer a contract proposal to be signed by the receiver
- `SignContract`, used to sign a contract
- `RejectContract`, used to reject a contract
- `RevokeContract`, used to revoke a contract
- `ListContracts`, lists contracts of a specific grant type
- `ListCertificates`, lists certificates matching the public key fingerprints in the request

Rpc's **MUST** use Protocol Buffers of the version 3 Language Specification to exchange messages, as specified on [developers.google.com](https://developers.google.com/protocol-buffers/docs/reference/proto3-spec). The messages are specified below.

#### Contract

The interface Contract is used in rpc's of the gRPC service `ContractManagerService`

The signatures field of the Contract message **MUST** contain a map of Peer subject serial numbers and signatures

```
message Hash {
    string hash = 1;
    HashAlgorithm algorithm = 2;
}

enum HashAlgorithm {
    HASH_ALGORITHM_UNSPECIFIED = 0;
    HASH_ALGORITHM_SHA3_512 = 1;
}

message Contract {
    Proposal proposal = 1;
    map<string,string> signatures_approved = 2;
    map<string, string> signatures_rejected = 3;
    map<string, string> signatures_revoked = 4;
}

message Proposal {
   Hash hash = 1;
   string group_id = 2;
   Period period = 3;
   repeated Grant grants = 4; 
}

enum GrantType {
  GRANT_TYPE_UNSPECIFIED = 0;
  GRANT_TYPE_CONNECTION = 1;
  GRANT_TYPE_PUBLICATION = 2;
}

message Grant {
    GrantType type = 1;
    oneof data {
        GrantConnection connection = 2;
        GrantPublication publication = 3;
    }
}

message GrantConnection{
    Client client = 1;
    Service service = 2;
}

message GrantPublication {
    Directory directory = 1;
    ServicePublication service = 2;
}

message Client {
    Peer peer = 1;
}

message Directory {
    Peer peer = 1;
}

message ServicePublication {
    Peer peer = 1;
    string name = 2;
    repeated string inway_addresses = 3;
}

message Peer {
    string subject_serial_number = 1;
}

message Service {
    Peer peer = 1;
    string name = 2;
}

message Delegator {
    Peer peer = 1;
}

message Delegatee {
    Peer peer = 1;
    repeated string public_key_fingerprints = 2;
}

message Directory {
    Peer peer = 1;
}

message Period {
    google.protobuf.Timestamp start = 1;
    google.protobuf.Timestamp end = 2;
}
```

#### rpc SubmitProposal

The Remote Procedure Call `SubmitProposal` **MUST** be implemented with the following interface and messages:

```
rpc SubmitProposal(SubmitProposalRequest) returns (SubmitProposalResponse);

message SubmitProposalRequest {
  Contract contract = 1;
}

message SubmitProposalResponse {}
```

#### rpc SignContract

The Remote Procedure Call `SignContract` **MUST** be implemented with the following interface and messages:

```
rpc SignContract(SignContractRequest) returns (SignContractResponse);

message SignContractRequest {
    Contract contract = 1;
}

message SignContractResponse{}
```

#### rpc RejectContract

The Remote Procedure Call `RejectContract` **MUST** be implemented with the following interface and messages:

```
rpc RejectContract(RejectContractRequest) returns (RejectContractResponse);

message RejectContractRequest {
    Contract contract = 1;
}

message RejectContractResponse{}
```

#### rpc RevokeContract

The Remote Procedure Call `RevokeContract` **MUST** be implemented with the following interface and messages:

```
rpc RevokeContract(RevokeContractRequest) returns (RevokeContractResponse);

message RevokeContract {
    Contract contract = 1;
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
    map<string,string> certificates = 1;
}
```

#### Signatures

A signature **MUST** follow the JSON Web Signature(JWS) format specified in [@!RFC7515](https://www.rfc-editor.org/rfc/rfc7515.html)

The JWS **MUST** specify the X.509 certificate containing the public key used to create the digital signature using the `x5t#S256`[@!RFC7515, section 4.1.8](https://www.rfc-editor.org/rfc/rfc7515.html#section-4.1.8) field of the `JOSE Header`[@!RFC7515, section 4](https://www.rfc-editor.org/rfc/rfc7515.html#section-4).

The JWS **MUST** use the JWS Compact Serialization described in [@!RFC7515, section 7.1](https://www.rfc-editor.org/rfc/rfc7515.html#section-7.1)

The JWS Payload as defined in [@!RFC7515, section 2](https://www.rfc-editor.org/rfc/rfc7515.html#section-2), **MUST** contain a hash of the `Proposal` gRPC message, the algorithm used to generate the hash and the type signature.

The JWS **MUST** be created using one of the digital signature algorithms described in [@!RFC7518, section 3,1](https://www.rfc-editor.org/rfc/rfc7518.html#section-3.1)

JWS Payload example:
```JSON
{
  "proposalHash": "--------",
  "type": "accept"
}
```

#### The proposal hash

A Peer should ensure that a contract signature is intended for the contract proposal.
Validation is done by comparing the hash of the received proposal with the hash in the signature.

The `proposalHash` of the signature payload contains the signature hash. The algorithm to create a `proposalHash` is described below. The resulting hash can be used to verify if two proposals are equal.

1. Create a byte array called `proposalBytes`.
2. Convert `Proposal.Hash.Algorithm` to bytes and append the bytes to `proposalBytes`.
3. Convert `Proposal.GroupId` to bytes and append the bytes to `proposalBytes`.
4. Convert the values of the fields `Proposal.Period.start` and `Proposal.Period.End` to an int64 representing the seconds of UTC time since Unix epoch 1970-01-01T00:00:00Z. And append the bytes of the int64 values to `proposalBytes`.
5. Create an array of bytes arrays called `grantByteArrays` 
6. For each Grant in `Proposal.Grants`
   1. Create a byte array named `grantBytes`
   2. Convert the value of each field of the Grant to bytes and append the bytes to the `grantBytes` in the same order as the fields are defined in the proto definition. If the value is a list; Create a byte array called `fieldBytes`, append the bytes of each item of the list to `fieldBytes`, sort `fieldBytes` in ascending order and append `fieldBytes` to `grantBytes`.
   3. Append `grantBytes` to `grantByteArrays`
7. Sort the byte arrays in `grantByteArrays` in ascending order
8. Append the bytes of `grantByteArrays` to `proposalBytes`.
9. Hash the `proposalBytes` using the hash algorithm described in `Proposal.Hash.Algorithm`
10. Encode the bytes of the hash as base64.

##### Data types {#data_types}

- `int32`: use `Little-endian` as endianness when converting to a byte array
- `int64`: use `Little-endian` as endianness when converting to a byte array
- `string`: use `utf-8` encoding when converting to a byte array
- `GrantType`: should be represented as an int32

##### Payload fields

- `proposalHash`, hash of the contract proposal
- `type`, type of signature. Types are defined in the `Signature type` section of this RFC

###### Signature type

- `accept`, peer has accepted the contract
- `reject`, peer has rejected the contract
- `revoke`, peer has revoked the contract

#### Error handling

The gRPC service **MUST** implement error handling according to the interface described in

```
enum ErrorReason {
    ERROR_REASON_UNSPECIFIED = 0;

    // Peer is not part of the contract
    ERROR_REASON_PEER_NOT_PART_OF_CONTRACT = 1;

    // Signature proposal does not match the hash of the proposal
    ERROR_REASON_SIGNATURE_PROPOSAL_HASH_MISMATCH = 2;

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

## Directory

### Behavior

#### Authentication

The clients **MUST** use mTLS when connecting to the Directory. The X.509 certificate **MUST** be signed by the chosen Certificate Authority (CA) that acts as the Trust Anchor of the Group.

#### Service registration

Service registration is accomplished by offering a Contract proposal to the Directory which contains one or more `PublicationGrants` with each `PublicationGrant` containing a single Service. Once the Directory and the Peer offering the Service have both signed the Contract, the Service is published in the Directory.

The Directory **MUST** be able to sign Contracts with Grants of the type `PublicationGrant`.

The Directory **MUST** validate that a `PublicationGrant` is valid by applying the following rules:

- The subject serial number of the X.509 certificate used by the Directory Peer must match the value of the field `PublicationGrant.Directory.SubjectSerialNumber`
- A Service name is provided in the field  `PublicationGrant.ServicePublication.Name`
- At least one Inway address is provided in the field   `PublicationGrant.ServicePublication.InwayAddresses`
- A signature is present with the subject serial number of the Peer defined the field `PublicationGrant.Directory.SubjectSerialNumber`
- A signature is present with the subject serial number of the Peer defined the field `PublicationGrant.ServicePublication.Peer.SubjectSerialNumber`

#### Service listing

The Directory **MUST** list a service when the Contract containing the `PublicationGrants` for the Service has been signed by the Peers involved with the Contract.

The Directory **MUST** list the Services that are available in the Group. This Service list us used by Outways in the Group to route HTTP Requests to the correct Service.

The Directory **MUST** provide the URI of the Inway that is offering a Service.

#### Peer listing

The Directory **MUST** offer a list of the Peers in the Group. The listing should also include the Contract Managers of each Peer. This information is used to negotiate Contracts between Peers

#### Health checking

The Directory **MUST** validate if a mTLS connection can be setup to the URI of an Inway. If the Directory is able to set up a connection, the Inway **MUST** be given the state `UP`, if not the state of the Inway **MUST** be `DOWN`. This state can be **SHOULD** be used by Outways to determine if a call can be routed to a Service.

The Directory **MUST** validate if a mTLS connection can be setup to the URI of a Contact Manager. If the Directory is able to set up a connection, the Contract Manager **MUST** be given the state `UP`, if not the state of the Contact Manager **MUST** be `DOWN`.

The Directory **MUST** remove Services when the state of all the Inways offering the Service has been `DOWN` for a certain period. The **RECOMMENDED** period is 48 hours.

The Directory **MUST** remove Contract Managers when the state of the Contract Manager has been `DOWN` for a certain period. The **RECOMMENDED** period is 48 hours.

### Interfaces

#### Directory Service

The Directory functionality **MUST** implement an gRPC service, as specified on [grpc.io](https://grpc.io/docs/), with the name `ContractManagerService`. This service **MUST** implement the interface of the [Contract Manager](#contract_manager_interface).

In addition to the Contract Manager interface the Directory functionality **MUST** implement an gRPC service with the name `Directory`. This service **MUST** offer four Remote Procedure Calls (rpc):
- `RegisterContractManager`, registers a Contract Manager
- `ListPeers`, lists the Peers of a Group
- `ListServicePublications`, lists the services known by the Director
- `GetGroupInfo`, returns the version of the FSC standard used by the Group

Rpc's **MUST** use Protocol Buffers of the version 3 Language Specification to exchange messages, as specified on [developers.google.com](https://developers.google.com/protocol-buffers/docs/reference/proto3-spec). The messages are specified below.

##### rpc RegisterContractManager

The Remote Procedure Call `RegisterContractManager` **MUST** be implemented with the following interface and messages:
```
rpc RegisterContractManager(RegisterContractManagerRequest) returns (RegisterContractManagerResponse);

message RegisterContractManagerRequest {
    ContractManager contract_manager = 1;
}

message RegisterContractManagerResponse {}

message ContractManager {
    string address = 1;
}
```

##### rpc ListServices

The Remote Procedure Call `ListServices` **MUST** be implemented with the following interface and messages:
```
rpc ListServicePublications(ListServicePublicationsRequest) returns (ListServicePublicationsResponse);


message ListServicesRequest {}

message ListServicePublicationsResponse {
  message ServicePublication {
    Organization organization = 1;
    string name = 2;
    repeated Inway inways = 3;
  }

  repeated ServicePublication services = 1;
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
  repeated ContractManager contract_managers = 2;
}

message ContractManager {
  enum State {
    STATE_UNSPECIFIED = 0;
    STATE_UP = 1;
    STATE_DOWN = 2;
  }
  string address = 1;
  State state = 2;
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
