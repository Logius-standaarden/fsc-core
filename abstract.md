This Federated Service Connectivity (FSC) standard describes how different parties (within FSC know as Peers) should interact when exchanging data in a uniform, secure and automated manner.
The goal of FSC is to achieve technically interoperable API gateway functionality, covering federated authentication and secure connections in a large-scale dynamic API landscape.

The core of FSC is to manage (service) connections between FSC Peers via mutually agreed and signed contracts. These contracts are the technical prerequisite for connecting to services. 
Contracts are negotiated, and signed in a decentralized federated manner. 

In addition to service connectivity, FSC provides a scheme for service discovery using a centralized directory. Peers providing services can voluntarily publish (some of) their services into this directory.
Peers consuming services can find the required location information for initiating contract negotiation for a particular service in this directory.

Security is at the foreground in FSC. Peers collaborating via FSC need to collaborate with each other in a FSC Group. The FSC Group is used for establishing trust between peers using a Public Key Infrastructure (PKI) scheme.
Technically FSC leverages PKI based on x.509 architecture to establish trust between Peers. Participating Peers agree on a Root CA acting as Trust Anchor. All connections between Peers leverage mTLS and contracts are cryptographically signed.
This combination ensures strong confidentiality and integrity.
