# Introduction

This section gives an introduction to FSC.
Section 2 describes the architecture of a system that follows the FSC specification.
Section 3 describes the interfaces and behavior of FSC components in detail.

## Purpose

The Federated Service Connectivity (FSC) specifications describe a way to implement technically interoperable API gateway functionality, covering federated authentication and secure connecting in a large-scale dynamic API landscape. 

The Core part of the FSC specification achieves inter-organizational, technical interoperability:

- to discover Services.
- to route requests to Services in other contexts (e.g. from within organization A to organization B).
- to request and manage authorizations needed to connect to said Services.
- to delegate the authorization to connect or publish Services on behalf of another organization

Functionality required to achieve technical interoperability is provided by APIs as specified in this RFC. This allows for automation of most management tasks, greatly reducing the administrative load and enabling up-scaling of inter-organizational usage of services.

## Terminology

This specification lists terms and abbreviations as used in this document.

*Peer:*

Actor that provides and/or consumes Services. This is an abstraction of e.g. an organization, a department or a security context.

*Group:*

System of Peers using Inways, Outways and Managers that confirm to the FSC specification to make use of each other's Services.
Governed by a set of rules and restrictions aligning on required parameters needed for the practical workings of an FSC Group.

*Inway:*

Reverse proxy that handles incoming connections to one or more Services.

*Outway:*

Forward proxy that handles outgoing connections to Inways.

*Contract:*

Agreement between Peers defining what interactions between Peers are possible.

*Delegator:*

A Peer who delegates a connection authorization to a Service or the authorization to publish a Service to another Peer.

*Delegatee:*

A Peer who acts on behalf of another Peer.

*Grant:*

Defines an interaction between Peers. Grants are part of a Contract. In FSC Core four Grants are described.

1. The ServicePublicationGrant which specifies the authorization of a Peer to publish a Service in the Group.
2. The ServiceConnectionGrant which specifies the authorization of a Peer to connect to a Service provided by a Peer.
3. The DelegatedServicePublicationGrant which specifies the authorization of one peer to publish a Service to the Group on behalf of another Peer.
4. The DelegatedServiceConnectionGrant which specifies the authorization of one Peer to connect to a Service on behalf of another Peer.

*Manager:*

The Manager is an API which manages Contracts and acts as an authorization server which provides access tokens.

*Directory:*

A Manager which acts as a Service and Peer discovery point of the Group.

*Service:*

An HTTP API offered to the Group.

*Trust Anchor:*

The Trust Anchor (TA) is an authoritative entity for which trust is assumed and not derived. In the case of FSC, which uses an X.509 architecture, it is the root certificate from which the whole chain of trust is derived.


*Trust Anchor List:*

A list of one or more Trust Anchors. In the case of FSC, which uses an X.509 architecture, it is a list of all root certificates that are used as Trust Anchor. In practice this would be a list of one or more [Certificate Authorities](https://en.wikipedia.org/wiki/Certificate_authority) (CA's).
Certificates issued by a CA that acts as a Trust Anchor are trusted within FSC Group.

*Profile:* 

A set of rules providing further restrictions and governance of the FSC Group. A Profile aligns on certain required parameters needed for the practical workings of an FSC Group. 

## Overall Operation of FSC Core

Peers in a Group announce their HTTP APIs to the Group by publishing them as a Service to a Directory. A Group can use multiple Directories which define the scope of the Group. Peers use the Directories to discover what Services and Peers are available in the Group.
Inways of a Peer expose Services to the Group. 
Outways of a Peer connect to the Inway of a Peer providing a Service.
Contracts define the Service publication to the Group and connections between Peers.
Peers can delegate the authorization to connect a Service to other Peers using specific Grants on a Contract.
Peers can delegate the authorization to publish a Service to other Peers using specific Grants on a Contracts.

Outways are forward proxies that route outgoing connections to Inways.  
Inways are reverse proxies that route incoming connections from Outways to Services.  
Managers negotiate Contracts between Peers.  
Managers provide access tokens which contain the authorization to connect a Service. 
Outways include the access tokens in requests to Inways
The address of an Inway offering a Service is contained in the access token. 
Inways authorize connection attempts by validating access tokens.
Services in the Group can be discovered through a Directory.  
The Manager's address of a Peer can be discovered through a Directory. 

To connect to a Service, the Peer needs a Contract with a ServiceConnectionGrant or DelegatedServiceConnectionGrant that specifies the connection. The FSC Core specification describes how Contracts are created, accepted, rejected and revoked. Once an authorization to connect is granted through a Contract, a connection from HTTP Client to HTTP Service will be authorized everytime an HTTP request to the Service is made.

### Extensions
FSC Core specifies the basics for setting up and managing connections in a Group.
Auxiliary functionality for either an FSC Peer or an entire FSC Group can be realized with `extensions`. An Extension performs a well scoped feature enhancing the overall working of FSC. 

It is RECOMMENDED to use FSC Core with the following extensions, each specified in a dedicated RFC:

- [FSC Logging](https://gitdocumentatie.logius.nl/publicatie/fsc/logging/), keep a log of requests to Services.

### Group rules & restrictions {#group_rules}
FSC Core provides the foundation for cooperation between organizations (Peers). However, in practice additional decisions have to be made to guarantee a functioning Group within a broader context.
For example, it may be needed for a Group to have additional restrictions or agreements within the Group. Certain Group rules and restrictions are required for the operation of the Group, others provide optional agreements to enhance collaboration.

The following decisions MUST be part of the Profile:
1. Select one or more [Trust Anchors](#trust_anchor) to include in the Trust Anchor list
2. Select a [Group ID](#group_id)
3. Select what determines the [Peer ID](#peer_id)
4. Select what determines the [Peer name](#peer_name)
5. Select at least one Peer who acts as the [Directory](#directory) of the Group

6. Decide what ports are used for management traffic
7. Determine requirements for allowed TLS versions and Cipher Suites 
8. Determine which network will be used

In addition to the mandatory decisions, a Group MAY also contain additional agreements or restrictions. These are not technically required for the operation of FSC Core, but can become mandatory within a Group. An example would be a set of additional rules in order to comply with local legislation.
Below are a few examples listed of these additional decisions for inspirational purposes:
1. Any extensions required by Peers within the Group
2. Agreements on data retention
3. The specifics of the retry mechanism used for Contract synchronization
4. Additional restrictions on Certificate revocation by mandating OCSP or CRL checks


### Use cases

A typical use case is a cooperation of many organizations that use APIs to exchange data or provide other business services to each other.

Organizations can participate in multiple Groups at the same time. 
Reasons for participating in multiple Groups could be the use of different environments for production and test deployments or when participating in different ecosystems like health industry and government industry.

An organization can offer the same API in multiple Groups. When doing so, the organization will be a Peer in every Group, and define the API as a Service in one of the Directories of each Group using a different Inway for each Group.
