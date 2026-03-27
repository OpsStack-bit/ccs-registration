const CONFIG = {
  CLIENT_ID:   "4a1b7c53-7a66-4323-b681-7217c10c0259",
  TENANT_ID:   "964b8fc4-bc9d-4799-b802-70ae47b0f00f",
  SITE_PATH:   "/sites/CourseRegistrationSystem",
  SEATS_LIST:  "CourseRoundSeats",
  SCOPES: ["User.Read", "Sites.ReadWrite.All"],
};

const msalConfig = {
  auth: {
    clientId:    CONFIG.CLIENT_ID,
    authority:   `https://login.microsoftonline.com/${CONFIG.TENANT_ID}`,
    redirectUri: window.location.origin + window.location.pathname,
  },
  cache: { cacheLocation: "sessionStorage", storeAuthStateInCookie: false },
};

const msalInstance = new msal.PublicClientApplication(msalConfig);
let currentAccount = null;
let spSiteId = null;

async function initAuth() {
  await msalInstance.initialize();
  try {
    const resp = await msalInstance.handleRedirectPromise();
    if (resp) currentAccount = resp.account;
  } catch(e) {
    console.error("Redirect error:", e);
    sessionStorage.clear();
    showLoginScreen();
    return;
  }
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length > 0) {
    currentAccount = accounts[0];
    onSignedIn();
  } else {
    showLoginScreen();
  }
}

function showLoginScreen() {
  document.getElementById("auth-screen").style.display = "flex";
  document.getElementById("app-screen").style.display  = "none";
}

function onSignedIn() {
  document.getElementById("auth-screen").style.display = "none";
  document.getElementById("app-screen").style.display  = "flex";
  if (currentAccount) {
    const nameEl  = document.getElementById("f-name");
    const emailEl = document.getElementById("f-email");
    if (nameEl  && !nameEl.value)  nameEl.value  = currentAccount.name     || "";
    if (emailEl && !emailEl.value) emailEl.value = currentAccount.username || "";
    document.getElementById("user-name").textContent  = currentAccount.name     || "";
    document.getElementById("user-email").textContent = currentAccount.username || "";
  }
  goTo(1);
}

async function signIn() {
  try {
    await msalInstance.loginRedirect({ scopes: CONFIG.SCOPES });
  } catch(e) { console.error("Login error:", e); }
}

async function signOut() {
  await msalInstance.logoutRedirect({ account: currentAccount });
}

async function getToken() {
  try {
    const resp = await msalInstance.acquireTokenSilent({
      scopes: CONFIG.SCOPES, account: currentAccount,
    });
    return resp.accessToken;
  } catch(e) {
    const resp2 = await msalInstance.acquireTokenPopup({
      scopes: CONFIG.SCOPES, account: currentAccount,
    });
    return resp2.accessToken;
  }
}

async function graphGet(url) {
  const token = await getToken();
  const res = await fetch("https://graph.microsoft.com/v1.0" + url, {
    headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" }
  });
  if (!res.ok) throw new Error("Graph GET failed: " + res.status + " " + url);
  return res.json();
}

async function graphPatch(url, body) {
  const token = await getToken();
  const res = await fetch("https://graph.microsoft.com/v1.0" + url, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type":  "application/json"
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const txt = await res.text().catch(()=>"");
    throw new Error("Graph PATCH failed: " + res.status + " " + txt);
  }
  return res.status === 204 ? {} : res.json();
}

async function getSiteId() {
  if (spSiteId) return spSiteId;
  const data = await graphGet("/sites/orascomconstructionegypt.sharepoint.com:" + CONFIG.SITE_PATH);
  spSiteId = data.id;
  return spSiteId;
}

async function getListItems(listName) {
  const siteId = await getSiteId();
  const url = `/sites/${siteId}/lists/${listName}/items?expand=fields&$top=100`;
  const data = await graphGet(url);
  return data.value.map(i => {
    const f = i.fields;
    return {
      ID:               i.id,
      CourseName:       f.CourseName       || f.Title || "",
      RoundNumber:      f.RoundNumber      || "",
      RoundDate:        f.RoundDate        || "",
      RoundTime:        f.RoundTime        || "",
      TotalSeats:       parseInt(f.TotalSeats)      || 12,
      SeatsRegistered:  parseInt(f.SeatsRegistered) || 0,
      IsOpen:           f.IsOpen           !== false,
      CourseRoundLabel: f.CourseRoundLabel || f.Title || "",
      SuperUserName:    f.SuperUserName    || "",
      SuperUserEmail:   f.SuperUserEmail   || "",
    };
  }).sort((a,b) => a.RoundDate > b.RoundDate ? 1 : -1);
}

async function updateListItem(listName, itemId, fields) {
  const siteId = await getSiteId();
  return graphPatch(`/sites/${siteId}/lists/${listName}/items/${itemId}/fields`, fields);
}