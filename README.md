

|  |  |
| :--- | :--- |
| Team NLX  | E. Hotting |
| Request for Comments: X | VNG |
|  | X |
|  | X |
|  | November 2022 |


#        <center>NLX Core</center>

# Abstract


# Status of This Memo
Information about the current status of this document, any errata,and how to provide feedback on it may be obtained at XX.

# Copyright Notice

This document is an early concept and has not received any review yet. Evwerything can change at any moment. Comments are welcome.
Copyright (c) 2022 VNG and the persons identified as the document authors. All rights reserved.

# 1. Introduction

The core part of the NLX standard describes how to automate the creation and management of connections between API clients and providers when those exist in different security contexts. 

## 1.1. Requirements Language

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [BCP 14](https://www.rfc-editor.org/info/bcp14) [RFC2119](https://www.rfc-editor.org/rfc/rfc2119) [RFC8174](https://www.rfc-editor.org/rfc/rfc8174) when, and only when, they appear in all capitals, as shown here.

## 1.2. Terminology

This section lists terms and abbreviations that are used in this document.

### 1.2.1. Terminology Used in This Document

Directory
: An NLX directory holds information about all services in the NLX system so they can be discovered. 

### 1.2.2. Abbreviations

NLX:  Not an abbreviation, just a name


# 2. Architecture

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
```
NLX management API -> NLX inways
                   -> NLX outways
```





# 3. Chapter

# X. References

# Acknowledgements

