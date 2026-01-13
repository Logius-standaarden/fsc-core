# FSC Test Suite 

Dit hoofdstuk beschrijft de rol en functionaliteit van de FSC Test Suite, die ontwikkeld is om de conformiteit en interoperabiliteit van de implementaties van FSC-componenten te waarborgen.

## Algemeen Nut van de Test Suite
Het primaire doel van de FSC Test Suite is het garanderen van technische interoperabiliteit en veilige connecties voor alle mogelijke implementaties van deze standaard.

Het algemene nut van deze test-suite is tweeledig:
1. Compliance en Betrouwbaarheid: De tests waarborgen dat de implementaties van Manager, Inway en Outway componenten voldoen aan de normatieve eisen gesteld in de FSC-Core specificatie. Door het het toepassen van de FSC-standaard wordt interoperabiliteit tussen diensten mogelijk gemaakt. Dit is cruciaal, aangezien FSC de fundamentele kaders definieert voor de samenwerking tussen organisaties (Peers).
1. Beveiliging: FSC legt sterke nadruk op beveiliging, waarbij Peers vertrouwen op een Public Key Infrastructure (PKI) schema, alle verbindingen gebruikmaken van mTLS (Mutual Transport Layer Security) en bijbehorende autorisaties zijn vastgelegd in digitale contracten. De Test Suite valideert of alle beveiligingsmechanismen, zoals Contract-ondertekening en token-binding, correct zijn geïmplementeerd, wat leidt tot sterke vertrouwelijkheid en integriteit.

In de bredere context van overheidsstandaarden, zoals Digikoppeling, zijn dergelijke voorzieningen bekend als Compliance Voorzieningen (CV). Deze voorzieningen worden gebruikt door organisaties om te controleren of hun adapter of programmatuur voldoet aan de koppelvlakstandaarden.

## Componenten en Werking van de Test Suite
De FSC Test Suite bevat specifieke testdocumenten voor de belangrijkste architectuurcomponenten: Manager, Inway, Outway en voor de Integratie tussen deze componenten.


### Geteste Componenten en Functies
De testen richten zich op de naleving van de specificaties zoals beschreven in FSC-Core voor elk van de volgende rollen:

| Component | Rol in FSC-Core | Geteste Kernfunctionaliteit |
| --- | --- | --- |
| **Manager** | Beheert Contracten, ondekking van Peers en Services, en verstrekt toegangstokens. | Valideert Contracten en handtekeningen volgens de regels. Controleert of de Grant Hash in de token-aanvraag overeenkomt met een geldige Grant in een Contract. Zorgt voor de correcte Peer listing en Service listing. |
| **Inway**   | Reverse proxy; handelt inkomende connecties af. | Authenticatie (accepteert alleen mTLS-connecties van Outways met een certificaat van de gekozen Trust Anchor van de Groep). Autorisatie (valideert het Access Token, inclusief de binding aan het X.509 certificaat en de Group ID). Zorgt voor de juiste routering naar de Service. |
| **Outway**  | Forward proxy; handelt uitgaande connecties af. | Authenticatie (gebruikt mTLS om met Inways te verbinden). Zorgt voor de juiste routering naar het Inway-adres gespecificeerd in het aud veld van het Access Token. Verantwoordelijk voor het verkrijgen van Access Tokens middels de Client Credentials flow.
| **Integratie** | Alles samen | Test de gehele keten, van het opstellen en ondertekenen van Contracten tot het succesvol consumeren van een Service door de Outway via de Inway.


### Werking van de Testen
De FSC Test Suite beschrijft compliance-tests die uitgevoerd kunnen worden om een implementatie te toetsen op de verplichte bepalingen (aangeduid met MUST) in de FSC-specificatie.

De tests valideren specifieke technische eisen, zoals:
- **Contract Validatie**: Managers moeten een Contract afwijzen als het niet voldoet aan regels zoals het unieke karakter van de UUID in het veld `contract.iv`.
- **Hash Algoritmen**: Het correct genereren van de **Content Hash **en de **Grant Hash** volgens de gespecificeerde stappen en Base64 URL-codering. Hierbij wordt gebruikgemaakt van de **JSON Canonicalization Scheme (JCS)**. De Manager moet de hash-algoritmen (`HASH_ALGORITHM_SHA3_512` is de gespecificeerde _int32_-waarde 1) correct omzetten en verwerken.
- **Token Validatie**: De Inway moet controleren of het Access Token het correcte certificate thumbprint bevat (`cnf.x5t#S256`) om aan te tonen dat de Outway die het token gebruikt ook de bevoegde partij is (Proof of Possession, certificaatgebonden token).
- **Foutafhandeling**: Componenten moeten, in geval van fouten binnen de scope van FSC, de HTTP header `Fsc-Error-Code` retourneren met een specifieke foutcode en een JSON-object in de response body. Inways moeten bijvoorbeeld foutcodes retourneren zoals `ERROR_CODE_ACCESS_TOKEN_MISSING` of `ERROR_CODE_SERVICE_NOT_FOUND`.

Door de implementatie van de FSC-componenten systematisch aan deze tests te onderwerpen, wordt gewaarborgd dat de architectuurprincipes van FSC, zoals _Veiligheid_, _Vertrouwelijkheid_ en _Interoperabiliteit_, in de praktijk worden gerealiseerd.







Er is [een compliance tester]((https://gitlab.com/commonground/fsc/compliance-tester) gemaakt die een gedeelte van de  test suite een automatisch uitvoert. De compliance tester kan als hulpmiddel worden gebruikt om te verifiëren of een implementatie FSC correct heeft geïmplementeerd.  
