let rounds=[], sel=null, filt="All";

async function fetchRounds(){
  try{
    console.log("Fetching rounds from SharePoint via Graph...");
    const newRounds = await getListItems(CONFIG.SEATS_LIST);
    console.log("Rounds loaded:", newRounds.length, "items");
    if(newRounds.length > 0) console.log("Sample round:", newRounds[0]);
    rounds = newRounds;
    if(sel) sel = rounds.find(r=>String(r.ID)===String(sel.ID)) || null;
    renderRounds();
  }catch(e){
    console.warn("Live fetch failed, using demo data", e);
    loadDemo();
  }
}

function loadDemo(){
  rounds=[
    {ID:1, CourseName:"C205 – Candy Estimating (MEP)",                          RoundNumber:"Round 1",RoundDate:"2026-04-19",RoundTime:"09:00 AM – 05:00 PM",TotalSeats:13,SeatsRegistered:4, IsOpen:true, CourseRoundLabel:"Batch I  | C205 Candy Estimating (MEP)                           | Apr 19 – Apr 20 | 09:00 AM – 05:00 PM"},
    {ID:2, CourseName:"C205 – Candy Estimating (MEP)",                          RoundNumber:"Round 2",RoundDate:"2026-04-21",RoundTime:"09:00 AM – 05:00 PM",TotalSeats:13,SeatsRegistered:13,IsOpen:false,CourseRoundLabel:"Batch I  | C205 Candy Estimating (MEP)                           | Apr 21 – Apr 22 | 09:00 AM – 05:00 PM"},
    {ID:3, CourseName:"C305 – QTO 4 Workshop",                                  RoundNumber:"Round 1",RoundDate:"2026-04-23",RoundTime:"09:00 AM – 05:00 PM",TotalSeats:12,SeatsRegistered:4, IsOpen:true, CourseRoundLabel:"Batch I  | C305 QTO 4 Workshop                                    | Apr 23          | 09:00 AM – 05:00 PM"},
    {ID:4, CourseName:"C201 – Candy Estimating (Civil & Arch)",                 RoundNumber:"Round 1",RoundDate:"2026-04-26",RoundTime:"09:00 AM – 05:00 PM",TotalSeats:13,SeatsRegistered:3, IsOpen:true, CourseRoundLabel:"Batch I  | C201 Candy Estimating (Civil & Arch)                   | Apr 26 – Apr 27 | 09:00 AM – 05:00 PM"},
    {ID:5, CourseName:"C201 – Candy Estimating (Civil & Arch)",                 RoundNumber:"Round 2",RoundDate:"2026-04-28",RoundTime:"09:00 AM – 05:00 PM",TotalSeats:13,SeatsRegistered:0, IsOpen:true, CourseRoundLabel:"Batch I  | C201 Candy Estimating (Civil & Arch)                   | Apr 28 – Apr 29 | 09:00 AM – 05:00 PM"},
    {ID:6, CourseName:"TTT – Train the Trainer",                                RoundNumber:"Round 1",RoundDate:"2026-04-30",RoundTime:"09:00 AM – 05:00 PM",TotalSeats:5, SeatsRegistered:5, IsOpen:false,CourseRoundLabel:"Batch I  | TTT Train the Trainer                                   | Apr 30          | 09:00 AM – 05:00 PM"},
    {ID:7, CourseName:"C403 – Advanced Estimating (Bespoke)",                   RoundNumber:"Round 1",RoundDate:"2026-05-03",RoundTime:"09:00 AM – 05:00 PM",TotalSeats:18,SeatsRegistered:9, IsOpen:true, CourseRoundLabel:"Batch I  | C403 Advanced Estimating (Bespoke)                      | May 3 – May 4   | 09:00 AM – 05:00 PM"},
    {ID:8, CourseName:"C203 – Post Tender Valuations & Budget Control (Civil & Arch)",RoundNumber:"Round 1",RoundDate:"2026-05-05",RoundTime:"09:00 AM – 05:00 PM",TotalSeats:12,SeatsRegistered:1, IsOpen:true, CourseRoundLabel:"Batch I  | C203 Post Tender Valuations & Budget Control (Civil & Arch) | May 5        | 09:00 AM – 05:00 PM"},
    {ID:9, CourseName:"C201 – Candy Estimating (Civil & Arch)",                 RoundNumber:"Round 1",RoundDate:"2026-04-19",RoundTime:"09:00 AM – 05:00 PM",TotalSeats:13,SeatsRegistered:6, IsOpen:true, CourseRoundLabel:"Batch II | C201 Candy Estimating (Civil & Arch)                   | Apr 19 – Apr 20 | 09:00 AM – 05:00 PM"},
    {ID:10,CourseName:"C201 – Candy Estimating (Civil & Arch)",                 RoundNumber:"Round 2",RoundDate:"2026-04-21",RoundTime:"09:00 AM – 05:00 PM",TotalSeats:12,SeatsRegistered:12,IsOpen:false,CourseRoundLabel:"Batch II | C201 Candy Estimating (Civil & Arch)                   | Apr 21 – Apr 22 | 09:00 AM – 05:00 PM"},
    {ID:11,CourseName:"C203 – Post Tender Valuations & Budget Control (Civil & Arch)",RoundNumber:"Round 1",RoundDate:"2026-04-23",RoundTime:"09:00 AM – 05:00 PM",TotalSeats:12,SeatsRegistered:12,IsOpen:false,CourseRoundLabel:"Batch II | C203 Post Tender Valuations & Budget Control (Civil & Arch) | Apr 23       | 09:00 AM – 05:00 PM"},
    {ID:12,CourseName:"C205 – Candy Estimating (MEP)",                          RoundNumber:"Round 1",RoundDate:"2026-04-26",RoundTime:"09:00 AM – 05:00 PM",TotalSeats:12,SeatsRegistered:2, IsOpen:true, CourseRoundLabel:"Batch II | C205 Candy Estimating (MEP)                           | Apr 26 – Apr 27 | 09:00 AM – 05:00 PM"},
    {ID:13,CourseName:"C205 – Candy Estimating (MEP)",                          RoundNumber:"Round 2",RoundDate:"2026-04-28",RoundTime:"09:00 AM – 05:00 PM",TotalSeats:13,SeatsRegistered:6, IsOpen:true, CourseRoundLabel:"Batch II | C205 Candy Estimating (MEP)                           | Apr 28 – Apr 29 | 09:00 AM – 05:00 PM"},
    {ID:14,CourseName:"C206 – Post Tender Valuations & Budget Control (MEP)",   RoundNumber:"Round 1",RoundDate:"2026-04-30",RoundTime:"09:00 AM – 05:00 PM",TotalSeats:12,SeatsRegistered:2, IsOpen:true, CourseRoundLabel:"Batch II | C206 Post Tender Valuations & Budget Control (MEP)     | Apr 30          | 09:00 AM – 05:00 PM"},
    {ID:15,CourseName:"C205 – Candy Estimating (MEP)",                          RoundNumber:"Round 3",RoundDate:"2026-05-03",RoundTime:"09:00 AM – 05:00 PM",TotalSeats:13,SeatsRegistered:13,IsOpen:false,CourseRoundLabel:"Batch II | C205 Candy Estimating (MEP)                           | May 3 – May 4   | 09:00 AM – 05:00 PM"},
    {ID:16,CourseName:"C206 – Post Tender Valuations & Budget Control (MEP)",   RoundNumber:"Round 2",RoundDate:"2026-05-05",RoundTime:"09:00 AM – 05:00 PM",TotalSeats:12,SeatsRegistered:8, IsOpen:true, CourseRoundLabel:"Batch II | C206 Post Tender Valuations & Budget Control (MEP)     | May 5           | 09:00 AM – 05:00 PM"},
    {ID:17,CourseName:"General Q&A",                                            RoundNumber:"Round 1",RoundDate:"2026-05-06",RoundTime:"09:00 AM – 05:00 PM",TotalSeats:26,SeatsRegistered:14,IsOpen:true, CourseRoundLabel:"All      | General Q&A                                              | May 6           | 09:00 AM – 05:00 PM"},
  ];
  renderRounds();
}

const COURSE_LEVEL = {
  "C205": { level:"Beginner", color:"#1C7C4A", bg:"#D4EDDA", who:"MEP Tendering Engineers" },
  "C201": { level:"Beginner", color:"#1C7C4A", bg:"#D4EDDA", who:"Civil & Arch Tendering Engineers" },
  "C203": { level:"Advanced", color:"#E8732A", bg:"#FDE8D4", who:"Civil & Arch Tendering Engineers" },
  "C206": { level:"Advanced", color:"#E8732A", bg:"#FDE8D4", who:"MEP Tendering Engineers" },
  "C305": { level:"Advanced", color:"#E8732A", bg:"#FDE8D4", who:"All Tendering Engineers" },
  "C403": { level:"Advanced", color:"#E8732A", bg:"#FDE8D4", who:"All Tendering Engineers" },
  "TTT":  { level:"Advanced", color:"#E8732A", bg:"#FDE8D4", who:"Super Users (Nomination only)" },
};

function getLevelByKeyword(r){
  const text = ((r.CourseName||"")+" "+(r.CourseRoundLabel||"")).toLowerCase();
  if(text.includes("advanced") || text.includes("qto") || text.includes("c305") ||
     text.includes("c403") || text.includes("post tender") || text.includes("budget control") ||
     text.includes("train the trainer") || text.includes("ttt") || text.includes("c203") || text.includes("c206"))
    return { level:"Advanced", color:"#E8732A", bg:"#FDE8D4", who:"All Tendering Engineers" };
  if(text.includes("estimating") || text.includes("c201") || text.includes("c205"))
    return { level:"Beginner", color:"#1C7C4A", bg:"#D4EDDA", who:"Tendering Engineers" };
  return null;
}

function getCourseCode(r){
  const fullText = ((r.CourseName||"") + " " + (r.CourseRoundLabel||"")).toUpperCase();
  if(fullText.includes("TTT") || fullText.includes("TRAIN THE TRAINER")) return "TTT";
  const m = fullText.match(/\b(C\d{3})\b/);
  if(m) return m[1];
  return "";
}

function getLevelInfo(r){
  const code = getCourseCode(r);
  if(code && COURSE_LEVEL[code]) return COURSE_LEVEL[code];
  return getLevelByKeyword(r);
}

const full=r=>{
  const isOpen = r.IsOpen===true || r.IsOpen==="Yes" || r.IsOpen===1;
  return !isOpen || r.SeatsRegistered >= r.TotalSeats;
};
const left=r=>Math.max(0,r.TotalSeats-r.SeatsRegistered);
const pct=r=>r.TotalSeats>0?Math.min(100,Math.round(r.SeatsRegistered/r.TotalSeats*100)):0;

function bClass(r){if(full(r))return"badge b-full";if(left(r)<=3)return"badge b-low";return"badge b-open"}
function bTxt(r){if(full(r))return"Full";if(left(r)<=3)return left(r)+" seat"+(left(r)===1?"":"s")+" left";return left(r)+" / "+r.TotalSeats+" available"}
function fClass(r){if(full(r))return"sf-full";if(left(r)<=3)return"sf-low";return"sf-open"}
function rcClass(r){
  let c="rcard";
  if(full(r))c+=" rcard-full";
  else if(left(r)<=3)c+=" rcard-low";
  if(sel&&String(sel.ID)===String(r.ID))c+=" rcard-sel";
  return c;
}

function shortName(r){
  const parts=r.CourseRoundLabel.split("|").map(s=>s.trim());
  if(parts.length>=2){
    return parts[1];
  }
  return r.CourseName.length>35?r.CourseName.substring(0,33)+"…":r.CourseName;
}

function getFilters(){
  const s=new Set(); const l=["All","🟢 Beginner","🔶 Advanced"];
  rounds.forEach(r=>{
    const k=shortName(r);
    if(!s.has(k)){s.add(k);l.push(k);}
  });
  return l;
}

function renderRounds(){
  const sorted=[...rounds].sort((a,b)=>{
    const da=new Date(a.RoundDate||"9999");
    const db=new Date(b.RoundDate||"9999");
    return da-db;
  });

  const op=sorted.filter(r=>!full(r)).length;
  const fl=sorted.filter(r=>full(r)).length;
  document.getElementById("stat-row").innerHTML=`
    <div class="stat-row">
      <div class="stat-pill"><div><div class="stat-pill-num">${sorted.length}</div><div class="stat-pill-lbl">Total rounds</div></div></div>
      <div class="stat-sep"></div>
      <div class="stat-pill"><div><div class="stat-pill-num" style="color:var(--green)">${op}</div><div class="stat-pill-lbl">Open</div></div></div>
      <div class="stat-sep"></div>
      <div class="stat-pill"><div><div class="stat-pill-num" style="color:var(--red)">${fl}</div><div class="stat-pill-lbl">Full</div></div></div>
    </div>`;

  document.getElementById("filters").innerHTML=getFilters().map((f,i)=>{
    const label=f.length>35?f.substring(0,33)+"…":f;
    const isLevel=f==="🟢 Beginner"||f==="🔶 Advanced";
    const on=filt===f?" on":"";
    const style=isLevel&&!on?' style="border-style:dashed"':'';
    return`<button class="chip${on}"${style} data-fidx="${i}">${label}</button>`;
  }).join("");

  const filterKeys=getFilters();
  document.getElementById("filters").querySelectorAll("button").forEach((btn,i)=>{
    btn.addEventListener("click",()=>setF(filterKeys[i]));
  });

  let list;
  if(filt==="All") list=sorted;
  else if(filt==="🟢 Beginner") list=sorted.filter(r=>{const l=getLevelInfo(r);return l&&l.level==="Beginner";});
  else if(filt==="🔶 Advanced") list=sorted.filter(r=>{const l=getLevelInfo(r);return l&&l.level==="Advanced";});
  else list=sorted.filter(r=>shortName(r)===filt);

  const parts=r=>r.CourseRoundLabel.split("|").map(s=>s.trim());

  document.getElementById("rounds-wrap").innerHTML=`<div class="rounds-grid">${list.map(r=>{
    const p=parts(r);
    const isFull=full(r);
    const rid=String(r.ID);
    const lvl=getLevelInfo(r);
    const levelBadge=lvl?`<span class="level-badge" style="background:${lvl.bg};color:${lvl.color}">${lvl.level}</span>`:'';
    const whoLine=lvl?`<span class="rcard-who">👥 ${lvl.who}</span>`:'';
    return`<div class="${rcClass(r)}" onclick="${isFull?"":"selR('"+rid+"')"}">
      <div class="rcard-top">
        <div>
          <div class="rcard-batch">${p[0]||""}</div>
          <div class="rcard-name">${p[1]||r.CourseName}</div>
          <div class="rcard-meta">
            <span class="rcard-meta-item">📅 ${p[2]||r.RoundDate}</span>
            <span class="rcard-meta-item">🕐 ${r.RoundTime}</span>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;flex-shrink:0">
          <span class="${bClass(r)}">${bTxt(r)}</span>
          ${levelBadge}
        </div>
      </div>
      <div class="sbar"><div class="sfill ${fClass(r)}" style="width:${pct(r)}%"></div></div>
      ${lvl||isFull?`<div class="rcard-bottom">
        ${whoLine}
        ${isFull?'<span class="full-note">✕ Round full</span>':''}
      </div>`:''}
    </div>`;
  }).join("")}</div>`;
}

function setF(f){filt=f;renderRounds()}
function toggleGuide(){
  const grid=document.getElementById("guide-grid");
  const btn=document.querySelector(".guide-toggle");
  const panel=document.getElementById("guide-panel");
  if(grid.style.display==="none"){
    grid.style.display="grid";
    btn.textContent="Hide guide";
    panel.style.paddingBottom="14px";
  }else{
    grid.style.display="none";
    btn.textContent="Show course guide";
    panel.style.paddingBottom="0";
  }
}
function selR(id){
  sel=rounds.find(r=>String(r.ID)===String(id))||null;
  renderRounds();
  document.getElementById("a2").innerHTML="";
}

const bcLabels=["","Personal details","Select round","Review & submit","Confirmed"];

function goTo(n){
  document.querySelectorAll(".panel").forEach(p=>p.classList.remove("active"));
  document.getElementById("p"+n).classList.add("active");
  document.getElementById("bc-current").textContent=bcLabels[n];
  document.getElementById("step-counter").textContent=n<4?"Step "+n+" of 4":"Complete";
  for(let i=1;i<=4;i++){
    const sr=document.getElementById("sr"+i);
    const sc=document.getElementById("sc"+i);
    sr.classList.remove("active","inactive","done");
    if(i<n){sr.classList.add("done");sc.textContent="✓";}
    else if(i===n){sr.classList.add("active");sc.textContent=i;}
    else{sr.classList.add("inactive");sc.textContent=i;}
  }
  document.querySelector(".right-body").scrollTop=0;
}

function alert_(id,msg,type="e"){
  document.getElementById(id).innerHTML=`<div class="al al-${type}"><span>✕</span><span>${msg}</span></div>`;
}
function clr(id){document.getElementById(id).innerHTML=""}

function go2(){
  const name=document.getElementById("f-name").value.trim();
  const email=document.getElementById("f-email").value.trim();
  const dept=document.getElementById("f-dept").value.trim();
  ["f-name","f-email","f-dept"].forEach(i=>document.getElementById(i).classList.remove("err"));
  if(!name){document.getElementById("f-name").classList.add("err");alert_("a1","Please enter your full name.");return}
  if(!email||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){document.getElementById("f-email").classList.add("err");alert_("a1","Please enter a valid email address.");return}
  if(!dept){document.getElementById("f-dept").classList.add("err");alert_("a1","Please enter your department.");return}
  clr("a1");goTo(2);fetchRounds();
}

function go3(){
  if(!sel){alert_("a2","Please select a round to continue.");return}
  if(full(sel)){alert_("a2","This round is now full. Please select another round.");return}
  clr("a2");
  const name=document.getElementById("f-name").value.trim();
  const email=document.getElementById("f-email").value.trim();
  const empid=document.getElementById("f-empid").value.trim();
  const dept=document.getElementById("f-dept").value.trim();
  document.getElementById("rv-details").innerHTML=`
    <div class="review-kv"><div class="review-kv-k">Full name</div><div class="review-kv-v">${name}</div></div>
    <div class="review-kv"><div class="review-kv-k">Email</div><div class="review-kv-v" style="font-size:12px">${email}</div></div>
    <div class="review-kv"><div class="review-kv-k">Employee ID</div><div class="review-kv-v">${empid||"—"}</div></div>
    <div class="review-kv"><div class="review-kv-k">Department</div><div class="review-kv-v">${dept}</div></div>`;
  const p=sel.CourseRoundLabel.split("|").map(s=>s.trim());
  document.getElementById("rv-round").innerHTML=`
    <div class="review-round">
      <div style="font-size:11px;font-weight:600;color:var(--mid);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px">${p[0]||""}</div>
      <div class="review-round-name">${p[1]||sel.CourseName}</div>
      <div class="review-round-meta">${p[2]||sel.RoundDate} &nbsp;·&nbsp; ${sel.RoundTime}</div>
      <div style="margin-top:10px"><span class="${bClass(sel)}">${bTxt(sel)}</span></div>
    </div>`;
  goTo(3);
}

async function submit(){
  if(!document.getElementById("terms").checked){alert_("a3","Please confirm the attendance terms before submitting.","w");return}
  clr("a3");
  const btn=document.getElementById("sbtn");
  btn.disabled=true;btn.innerHTML='<span class="spin"></span> Submitting...';
  const payload={
    fullName:document.getElementById("f-name").value.trim(),
    email:document.getElementById("f-email").value.trim(),
    employeeId:document.getElementById("f-empid").value.trim(),
    department:document.getElementById("f-dept").value.trim(),
    roundId:sel.ID,roundLabel:sel.CourseRoundLabel,
    courseName:sel.CourseName,roundDate:sel.RoundDate,
    roundTime:sel.RoundTime,submittedAt:new Date().toISOString()
  };
  try{
    const siteId = await getSiteId();
    const checkData = await graphGet(
      `/sites/${siteId}/lists/${CONFIG.SEATS_LIST}/items/${sel.ID}?expand=fields`
    );
    const f = checkData.fields || checkData;
    const latestSeats = parseInt(f.SeatsRegistered) || 0;
    const totalSeats  = parseInt(f.TotalSeats)      || 0;
    const isOpen      = f.IsOpen !== false && f.IsOpen !== "No";

    if(!isOpen || latestSeats >= totalSeats){
      alert_("a3","This round just became full. Please go back and select another round.","e");
      btn.disabled=false; btn.innerHTML="Submit registration";
      sel.SeatsRegistered=latestSeats; sel.IsOpen=false;
      renderRounds(); return;
    }

    const newCount = latestSeats + 1;
    const updateFields = { SeatsRegistered: newCount };
    if(newCount >= totalSeats) updateFields.IsOpen = false;

    await updateListItem(CONFIG.SEATS_LIST, sel.ID, updateFields);

    try{
      const token2 = await getToken();
      await fetch(`https://graph.microsoft.com/v1.0/sites/${siteId}/lists/CourseRegistrations/items`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token2}`,
          "Content-Type":  "application/json"
        },
        body: JSON.stringify({
          fields: {
            Title:       payload.fullName,
            Email:       payload.email,
            EmployeeID:  payload.employeeId,
            Department:  payload.department,
            RoundID:     payload.roundId,
            RoundLabel:  payload.roundLabel,
            CourseName:  payload.courseName,
            RoundDate:   payload.roundDate,
            RoundTime:   payload.roundTime,
            SubmittedAt: payload.submittedAt,
          }
        })
      });
      console.log("Registration logged to SharePoint — Flow C will trigger automatically");
    }catch(logErr){
      console.warn("Registration log warning:", logErr);
    }

    sel.SeatsRegistered = newCount;
    if(newCount >= totalSeats) sel.IsOpen = false;

    const p=sel.CourseRoundLabel.split("|").map(s=>s.trim());
    document.getElementById("s-sub").innerHTML=`Your seat is reserved. A confirmation email with your Microsoft Teams meeting link has been sent to <strong>${payload.email}</strong>.`;
    document.getElementById("s-detail").innerHTML=`
      <div class="conf-row"><span>Name</span><span>${payload.fullName}</span></div>
      <div class="conf-row"><span>Course</span><span>${p[1]||sel.CourseName}</span></div>
      <div class="conf-row"><span>Batch</span><span>${p[0]||"—"}</span></div>
      <div class="conf-row"><span>Dates</span><span>${p[2]||sel.RoundDate}</span></div>
      <div class="conf-row"><span>Time</span><span>${sel.RoundTime}</span></div>
      <div class="conf-row"><span>Location</span><span>Meeting Room #2306 — 23rd Floor, OC Academy IT Lab, Arcadia Mall</span></div>
      <div class="conf-row"><span>Teams link</span><span style="color:var(--blue)">Sent to your email</span></div>`;
    goTo(4);
    fetchRounds().catch(()=>{});

  }catch(e){
    console.error("Submission error:",e);
    alert_("a3","Submission failed. Please try again or contact the Training Administration Team.");
    btn.disabled=false;btn.innerHTML="Submit registration";
  }
}

function reset(){
  sel=null;filt="All";
  ["f-name","f-email","f-empid","f-dept"].forEach(id=>{
    const el=document.getElementById(id);
    if(id==="f-name"&&currentAccount?.name) el.value=currentAccount.name;
    else if(id==="f-email"&&currentAccount?.username) el.value=currentAccount.username;
    else el.value="";
    el.classList.remove("err");
  });
  document.getElementById("terms").checked=false;
  fetchRounds();
  goTo(1);
}

initAuth();