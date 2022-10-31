

|  |  |
| :--- | :--- |
| Team NLX  | E. Hotting |
| Request for Comments: X | VNG |
|  | X |
|  | X |
|  | November 2022 |


#        <center>NLX Core</center>

# Abstract
Abstract

# Status of This Memo
Information about the current status of this document, any errata,and how to provide feedback on it may be obtained at XX.

# Copyright Notice

This document is an early concept and has not received any review yet. Everything can change at any moment. Comments are welcome.
Copyright (c) 2022 VNG and the persons identified as the document authors. All rights reserved.

# 1. Introduction

The core part of the FSC standard describes how to automate the creation and management of connections between HTTP clients and HTTP services. (to do: scope, use case, landscape). 

Chapter 2 describes the architecture of systems that follow the FSC standard.
Chapter 3 describes the interfaces and behavior of FSC functionality in detail.

It is RECOMMENDED to use FSC core with the following extensions, each described in a dedicated RFC:
- [FSC Authorization](authorization/README.md)
- [FSC Logging](logging/README.md)
- [FSC Delegation](delegation/README.md)
- [FSC Control](control/README.md)

## 1.1. Requirements Language

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [BCP 14](https://www.rfc-editor.org/info/bcp14) [RFC2119](https://www.rfc-editor.org/rfc/rfc2119) [RFC8174](https://www.rfc-editor.org/rfc/rfc8174) when, and only when, they appear in all capitals, as shown here.

## 1.2. Terminology

This section lists terms and abbreviations that are used in this document.

### 1.2.1. Terminology Used in This Document

Directory
: An FSC directory holds information about all services in the FSC system so they can be discovered. 

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


### 1.2.2. Abbreviations

API
: Application Programming Interface, as described in RFC X

FSC
: Federated Service Connectivity, the name of this draft standard

HTTP
: Hyper Text Transfer Protocol, as specified in [RFC 2068](https://www.rfc-editor.org/rfc/rfc2068)


# 2. Architecture

The purpose of FSC Core is to standardise setting up and managing connections to HTTP services. Involved inways and outways are managed via a Manager and make use of a directory that enables service discovery. 

This chapter describes the basic architecture of FSC systems.

## 2.1. Request flow

```
          context A          |            context B
HTTP client -> FSC Outway -> | -> FSC Inway -> HTTP service
```


## 2.2. Service discovery
```
context A   |    central     | context B
FSC Inway  -> FSC Directory -> FSC Outway
```

## 2.3. Management

All inways and outways in a local environment are managed by a local FSC Manager. This manager XX.

```
          context A          |            context B
        FSC Manager       -> | -> FSC Inway   -> FSC Manager

FSC Manager -> FSC Inways    |    FSC Inways  <- FSC Manager
            -> FSC Outways   |    FSC Outways <-
```

## 2.4. Connecting to a service

## 2.5. Providing a service





# 3. Specifications for functionality  XX

## 3.1. Outway functionality
### 3.1.1. Interfaces
### 3.1.2. Behavior

## 3.2. Inway functionality
### 3.2.1. Interfaces
### 3.2.2. Behavior

## 3.3. Manager functionality

Manager functionality in FSC Core is (XX list functionality)

It is RECOMMENDED to implement the Manager functionality seperate from the Inway functionality, in order to be able to have many local Inways that are configured by one local Manager.

### 3.1.1. Interfaces

### 3.1.2. Behavior


## 3.4. Directory functionality

### 3.4.1. Interfaces
### 3.4.2. Behavior



# X. References

# Acknowledgements

