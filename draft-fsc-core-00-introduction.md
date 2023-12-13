# Introduction

This section gives an introduction to this RFC.
Section 2 describes the architecture of a system that follows the FSC specification.
Section 3 describes the interfaces and behavior of FSC components in detail.

## Purpose

The Federated Service Connectivity (FSC) specifications describe a way to implement technically interoperable API gateway functionality, covering federated authentication and secure connecting in a large-scale dynamic API landscape. 

The Core part of the FSC specification achieves inter-organizational, technical interoperability:

- to discover Services.
- to route requests to Services in other contexts (e.g. from within organization A to organization B).
- to request and manage authorizations needed to connect to said Services.

Functionality required to achieve technical interoperability is provided by APIs as specified in this RFC. This allows for automation of most management tasks, greatly reducing the administrative load and enabling up-scaling of inter-organizational usage of services.

## Terminology

This specification lists terms and abbreviations as used in this document.

*Peer:*

Actor that provides and/or consumes Services. This is an abstraction of e.g. an organization, a department or a security context.

*Group:*

System of Peers using Inways, Outways and Managers that confirm to the FSC specification to make use of each other's Services.

*Inway:*

Reverse proxy that handles incoming connections to one or more Services.

*Outway:*

Forward proxy that handles outgoing connections to Inways.

*Contract:*

Agreement between Peers defining what interactions between Peers are possible.

*Grant:*

Defines an interaction between Peers. Grants are part of a Contract. In FSC Core three Grants are described.

1. The PeerRegistrationGrant which specifies the authorization of a Peer to participate as a Peer in the Group.
2. The ServicePublicationGrant which specifies the authorization of a Peer to publish a Service in the Group.
3. The ServiceConnectionGrant which specifies the authorization of a Peer to connect to a Service provided by a Peer.

*Manager:*

The Manager is an API which manages Contracts and acts as an authorization server which provides access tokens.

*Directory:*

A Manager which acts as a Service and Peer discovery point of the Group.

*Service:*

An HTTP API offered to the Group.

*Trust Anchor:*

The Trust Anchor (TA) is an authoritative entity for which trust is assumed and not derived. In the case of FSC, which uses an X.509 architecture, it is the root certificate from which the whole chain of trust is derived.

## Overall Operation of FSC Core

Peers in a Group announce their HTTP APIs to the Group by publishing them as a Service to the Directory. A Group uses a single Directory that defines the scope of the Group. Peers use the Directory to discover what Services and Peers are available in the Group.
Inways of a Peer expose Services to the Group. 
Outways of a Peer connect to the Inway of a Peer providing a Service.
Contracts define the registration of a Peer to the Group, Service publication to the Group and connections between Peers.

Outways are forward proxies that route outgoing connections to Inways.  
Inways are reverse proxies that route incoming connections from Outways to Services.  
Managers negotiate Contracts between Peers.  
Managers provide access tokens which contain the authorization to connect a Service. 
Outways include the access tokens in requests to Inways
The address of an Inway offering a Service is contained in the access token. 
Inways authorize connection attempts by validating access tokens.
Services in the Group can be discovered through the Directory.  
The Manager's address of a Peer can be discovered through the Directory.  

To connect to a Service, the Peer needs a Contract with a ServiceConnectionGrant that specifies the connection. The FSC Core specification describes how Contracts are created, accepted, rejected and revoked. Once an authorization to connect is granted through a Contract, a connection from HTTP Client to HTTP Service will be authorized everytime an HTTP request to the Service is made.

FSC Core specifies the basics for setting up and managing connections in a Group. It is **RECOMMENDED** to use FSC Core with the following extensions, each specified in a dedicated RFC:

- [FSC Delegation](../delegation/draft-fsc-delegation-00.html), to delegate the right to connect to a service.
- [FSC Logging](../logging/draft-fsc-logging-00.html), keep a log of requests to Services.

### Use cases

A typical use case is a cooperation of many organizations that use APIs to exchange data or provide other business services to each other.

Organizations can participate in multiple Groups at the same time. 
Reasons for participating in multiple Groups could be the use of different environments for production and test deployments or when participating in different ecosystems like health industry and government industry.

An organization can offer the same API in multiple Groups. When doing so, the organization will be a Peer in every Group, and define the API as a Service in the Directory of each Group using a different Inway for each Group.
