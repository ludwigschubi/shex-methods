export type SolidProfileShape = {
  type: string;
  name: string;
  hasEmail: {
    value: string;
  };
};

export enum SolidProfileContext {
  "type" = "rdf:type",
  "name" = "foaf:name",
  "hasEmail" = "vcard:hasEmail",
  "value" = "vcard:value",
}

export const solidProfileShex = `
PREFIX srs: <https://shaperepo.com/schemas/solidProfile#>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX schem: <http://schema.org/>
PREFIX vcard: <http://www.w3.org/2006/vcard/ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

srs:SolidProfileShape EXTRA a {
  a [ schem:Person ]
    // rdfs:comment  "Defines the node as a Person" ;
  a [ foaf:Person ]
    // rdfs:comment  "Defines the node as a Person" ;
  vcard:hasEmail @srs:EmailShape *
    // rdfs:comment  "The person's email." ;
  foaf:name xsd:string ?
    // rdfs:comment  "An alternate way to define a person's name" ;
}

srs:EmailShape EXTRA a {
  a [
    vcard:Dom
    vcard:Home
    vcard:ISDN
    vcard:Internet
    vcard:Intl
    vcard:Label
    vcard:Parcel
    vcard:Postal
    vcard:Pref
    vcard:Work
    vcard:X400
  ] ?
    // rdfs:comment  "The type of email." ;
  vcard:value IRI
    // rdfs:comment  "The value of an email as a mailto link (Example <mailto:jane@example.com>)" ;
}
`;