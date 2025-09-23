import { loadRespecWithConfiguration } from "https://logius-standaarden.github.io/publicatie/respec/organisation-config.mjs";

loadRespecWithConfiguration({
    useLogo: true,
    useLabel: true,
    license: "cc-by",
    specStatus: "WV",
    specType: "ST",
    pubDomain: "fsc",
    shortName: "core",
    publishDate: "2025-09-08",
    publishVersion: "1.1.1",
    previousPublishVersion: "1.1.0",

    editors:
        [
            {
                name: "VNG Realisatie",
                company: "VNG",
                companyURL: "https://vng.nl/rubrieken/onderwerpen/standaarden",
            },
            {
                name: "Logius",
                company: "Logius",
                companyURL: "https://github.com/Logius-standaarden",
            }
        ],
    authors:
        [
            {
                name: "Eelco Hotting",
                company: "Hotting IT",
                extras: [
                    {
                        name: "Email",
                        href: "mailto:rfc@hotting.it",
                    }
                ]
            },
            {
                name: "Ronald Koster",
                company: "PhillyShell",
                extras: [
                    {
                        name: "Email",
                        href: "mailto:rfc@phillyshell.nl",
                    }
                ]
            },
            {
                name: "Henk van Maanen",
                company: "AceWorks",
                extras: [
                    {
                        name: "Email",
                        href: "mailto:henk.van.maanen@aceworks.nl",
                    }
                ]
            },
            {
                name: "Niels Dequeker",
                company: "ND Software",
                extras: [
                    {
                        name: "Email",
                        href: "mailto:niels@nd-software.be",
                    }
                ]
            },
            {
                name: "Edward van Gelderen",
                company: "vanG IT",
                extras: [
                    {
                        name: "Email",
                        href: "mailto:e.van.gelderen@vang.nl",
                    }
                ]
            },
            {
                name: "Pim Gaemers",
                company: "Apily",
                extras: [
                    {
                        name: "Email",
                        href: "mailto:pim.gaemers@apily.dev",
                    }
                ]
            },
        ],
    github: "https://github.com/Logius-standaarden/fsc-core",
});

