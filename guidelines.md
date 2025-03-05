# Guidelines

There are no hard restrictions on the creation of FSC Groups.
However, an FSC Group establishes the boundaries for its Peers within this Group. Also, the characteristics of a Group are not easily changed.
Creating a Group should be a well considered decision.

This non-normative section offers some guidelines that may aid with the decision process in determining whether it is beneficial to create a Group.

The Group defines the overall scope of collaboration between Peers. It defines technical requirements for communication, like network ports, as well as establishing a `network of trust` for Peers to collaborate within.
Collaboration between Peers in a Group is facilitated, not mandated. Because of this it is important to consider making the Group as broad as possible, so many Peers can become part of the Group.
In principle, fewer (but larger) Groups stimulate broader collaboration, as opposed to a more dispersed Group landscape.

It is expected that the number of Groups will be limited. But there could be a need for a new Group if more strict isolation is needed: 
* for example if FSC is also used within the boundaries of an internal network
* a very specific trust anchor already is used for a specific domain

Creating a new Group *may* be appropriate if:
* there is a need to isolate traffic on a network level between a set of Peers
* requiring a specific trust anchor 

Creating a new Group *may* not be the right approach if:
* collaboration is temporary in nature
* the appropriate trust anchor is already used in an existing Group
* it is not known beforehand with which Peers there must be a collaboration in the future, or this may vary over time
* there is a need to collaborate with a lot of Peers
