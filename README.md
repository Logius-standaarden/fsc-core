

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

This document is an early concept and has not received any review yet. Evwerything can change at any moment. Comments are welcome.
Copyright (c) 2022 VNG and the persons identified as the document authors. All rights reserved.

# 1. Introduction

The core part of the NLX standard describes how to automate the creation and management of connections between HTTP clients and HTTP services. (to do: scope, use case, landscape).

Chapter 2 describes the architecture of systems that follow the NLX standard.
Chapter 3 describes the features and behavior of involved components in detail.

NLX core MAY be extended by using one or more of the following extensions, each described in a dedicated RFC:
- [NLX Authorization](authorization/README.md)
- [NLX Logging](logging/README.md)
- [NLX Delegation](delegation/README.md)

## 1.1. Requirements Language

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [BCP 14](https://www.rfc-editor.org/info/bcp14) [RFC2119](https://www.rfc-editor.org/rfc/rfc2119) [RFC8174](https://www.rfc-editor.org/rfc/rfc8174) when, and only when, they appear in all capitals, as shown here.

## 1.2. Terminology

This section lists terms and abbreviations that are used in this document.

### 1.2.1. Terminology Used in This Document

Directory
: An NLX directory holds information about all services in the NLX system so they can be discovered. 

Inway
: API Gateway as defined in [RFC X] that handles incoming connections to one or more services and confirms to the NLX Core standard.

Outway
: API Gateway as defined in [RFC X] that handles outgoing connections to Inways and confirms to the NLX Core standard.

HTTP Service
: HTTP services as defined in [RFC X] that are provided via an Inway

NLX System
: System of components that confirm to the NLX standard and 

### 1.2.2. Abbreviations

API
: Application Programming Interface, as described in RFC X

HTTP
: Hyper Text Transfer Protocol, as described in RFC X

NLX
: Not an abbreviation, just a name


# 2. Architecture

The purpose of NLX Core is to standardise setting up and managing connections to HTTP services. Involved inways and outways are managed via a Management API and make use of a directory that enables service discovery. 

This chapter describes the basic architecture of NLX systems 





## 2.1. Request flow

```
           org A             |             org B
HTTP client -> NLX outway -> | -> NLX inway -> HTTP service
```


## 2.2. Service discovery
```
  org A   |   central org  |    org B
NLX inway -> NLX directory -> NLX outway
```

## 2.3. Gateway management

Gateways 

```
NLX management API -> NLX inways
                   -> NLX outways
```

## 2.4. Using a service



## 2.5. Providing a service





# 3. Chapter

# X. References

# Acknowledgements

