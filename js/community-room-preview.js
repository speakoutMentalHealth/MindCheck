/* Standalone, deliberately offline-only preview. Never import auth, Firestore or personal MindCheck history. */
(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const roomDefinitions = [
    {id:"start-here",title:"Welcome & announcements",description:"Introductions, community guidance and official announcements.",examples:[
      ["How should I introduce myself to the community?","Share the skills you are learning, what brings you here and the kind of collaboration you would enjoy."],
      ["What makes a respectful online discussion?","Start with curiosity, avoid sharing private information and report content that may put others at risk."]
    ]},
    {id:"learn-build",title:"Learning & digital skills",description:"ICT, learning, digital projects and skill development.",examples:[
      ["What is one digital skill worth learning this month?","For this example discussion, imagine exchanging beginner-friendly resources on spreadsheets, coding and design."],
      ["How can we run a small offline learning workshop?","Discuss laptops, rechargeable projectors and community facilitators using hypothetical scenarios."]
    ]},
    {id:"opportunities-careers",title:"Careers & opportunities",description:"Professional development, educational resources and verified opportunities.",examples:[
      ["How do you evaluate a scholarship opportunity?","Look for official eligibility, application dates, fees and verification from the program provider."],
      ["Getting ready for a first professional interview","What would you include in your preparation plan, portfolio and questions for a hiring team?"]
    ]},
    {id:"networking-mentorship",title:"Networking & mentorship",description:"Adult professional introductions and meaningful mentorship.",examples:[
      ["How do you ask a potential mentor for guidance?","Introduce your learning goal, be specific about the advice you want and respect their available time."],
      ["Building professional connections beyond your city","Explore ways adults can collaborate through projects and structured online events."]
    ]},
    {id:"projects-volunteering",title:"Projects & volunteering",description:"Community outreach, teamwork and responsible project planning.",examples:[
      ["Planning an accessible community education event","What practical steps help when internet connectivity or equipment is limited?"],
      ["How should volunteer opportunities describe expectations?","Discuss role descriptions, safeguarding, transport arrangements and transparent responsibilities."]
    ]},
    {id:"private-groups",title:"Private group spaces",description:"Example restricted spaces; no real private names or member details are shown.",examples:[
      ["Example: agreeing on private group rules","In a real room only specifically approved adult members could view and contribute. This is a fictional illustration."],
      ["Example: setting expectations for a small working group","Discuss a hypothetical project scope without using identifiable participants or confidential information."]
    ]}
  ];
  let activeRoom = roomDefinitions[0].id;
  let activeTopic = null;
  let moderator = false;
  let sequence = 100;
  let reports = 0;
  const topics = [];
  for (const room of roomDefinitions) {
    room.examples.forEach((pair, i) => topics.push({
      id: room.id+"-"+String(i+1),
      roomId:room.id, title:pair[0], body:pair[1],status:"approved",kind:"topic",sample:true,
      replies:i===0?[{id:"sample-reply-"+room.id,body:"Example response: thank you for raising this topic. Keeping the discussion respectful makes it easier for everyone to participate.",status:"approved",sample:true}]:[]
    }));
  }
  function node(tag,cls,value){
    const el=document.createElement(tag);
    if(cls)el.className=cls;
    if(value!==undefined)el.textContent=String(value);
    return el;
  }
  function announce(value){$("notice").textContent=value;}
  function definition(){return roomDefinitions.find(room=>room.id===activeRoom);}
  function visibleTopics(){return topics.filter(t=>t.roomId===activeRoom&&t.status==="approved");}
  function renderRooms(){
    const host=$("roomList");host.replaceChildren();
    for(const room of roomDefinitions){
      const button=node("button","space",room.title);
      button.type="button";
      button.dataset.room=room.id;
      button.setAttribute("aria-current",String(room.id===activeRoom));
      button.addEventListener("click",()=>chooseRoom(room.id));
      host.append(button);
    }
  }
  function chooseRoom(id){
    if(!roomDefinitions.some(r=>r.id===id))return;
    activeRoom=id;activeTopic=null;
    $("roomTitle").textContent=definition().title;
    $("roomDesc").textContent=definition().description;
    $("thread").hidden=true;$("topicList").hidden=false;$("searchTopics").value="";
    try{const url=new URL(location.href);url.searchParams.set("room",id);history.replaceState(null,"",url.pathname+url.search);}catch(_){}
    announce("");
    renderRooms();renderTopics();renderQueue();
  }
  function renderTopics(){
    const host=$("topicList");host.replaceChildren();
    const term=$("searchTopics").value.trim().toLocaleLowerCase();
    const rows=visibleTopics().filter(t=>!term||(t.title+" "+t.body).toLocaleLowerCase().includes(term));
    if(!rows.length){host.append(node("p","no-results","No approved example discussions match your search."));return;}
    for(const t of rows){
      const b=node("button","topic");
      b.type="button";
      b.dataset.topic=t.id;
      b.append(node("span","topic-title",t.title));
      b.append(node("span","topic-body",t.body));
      b.append(node("span","topic-meta","EXAMPLE TOPIC · "+t.replies.filter(r=>r.status==="approved").length+" example replies"));
      b.addEventListener("click",()=>showThread(t.id));
      host.append(b);
    }
  }
  function currentTopic(){return topics.find(t=>t.id===activeTopic);}
  function showThread(id){
    const t=topics.find(t=>t.id===id&&t.roomId===activeRoom&&t.status==="approved");
    if(!t)return;
    activeTopic=id;
    $("threadTitle").textContent=t.title;
    $("threadBody").textContent=t.body;
    $("topicList").hidden=true;$("thread").hidden=false;
    $("replyForm").reset();
    renderReplies();
    $("thread").scrollIntoView({block:"nearest",behavior:"auto"});
  }
  function renderReplies(){
    const host=$("replyList");host.replaceChildren();
    const t=currentTopic();
    if(!t)return;
    const list=t.replies.filter(r=>r.status==="approved");
    if(!list.length){host.append(node("p","hint","No approved example replies yet."));return;}
    for(const reply of list){
      const el=node("article","reply");
      el.append(node("small",null,"Example community member"),node("p",null,reply.body));
      host.append(el);
    }
  }
  function renderQueue(){
    const host=$("queue");host.hidden=!moderator;host.replaceChildren();
    $("moderatorMode").setAttribute("aria-pressed",String(moderator));
    $("moderatorMode").textContent=moderator?"Hide demo moderation queue":"Show demo moderation queue";
    if(!moderator)return;
    const pending=topics.filter(t=>t.roomId===activeRoom).flatMap(t=>{
      const base=t.status==="pending"?[{target:t,title:t.title,type:"topic"}]:[];
      return base.concat(t.replies.filter(r=>r.status==="pending").map(r=>({target:r,title:r.body,type:"reply"})));
    });
    if(!pending.length){host.append(node("li",null,"No pending example content in this room."));return;}
    for(const entry of pending){
      const li=node("li");
      li.append(node("strong",null,entry.type==="topic"?"Example topic":"Example reply"));
      li.append(node("p",null,entry.title));
      for(const [label,status] of [["Approve","approved"],["Remove","removed"]]){
        const b=node("button","subtle",label);b.type="button";b.addEventListener("click",()=>{
          entry.target.status=status;
          announce(label+"d in the demo only. Nothing was saved.");
          renderTopics();renderReplies();renderQueue();
        });
        li.append(b);
      }
      host.append(li);
    }
  }
  $("searchTopics").addEventListener("input",renderTopics);
  $("backToTopics").addEventListener("click",()=>{
    activeTopic=null;$("thread").hidden=true;$("topicList").hidden=false;renderTopics();
  });
  $("createTopic").addEventListener("click",()=>{$("topicForm").reset();$("topicDialog").showModal();});
  $("cancelTopic").addEventListener("click",()=>$("topicDialog").close());
  $("topicForm").addEventListener("submit",event=>{
    event.preventDefault();
    if(!$("topicForm").reportValidity())return;
    const title=$("topicTitle").value.trim(),body=$("topicBody").value.trim();
    if(title.length<5||body.length<5)return;
    topics.unshift({id:"demo-"+(sequence++),roomId:activeRoom,title,body,status:"pending",kind:"topic",sample:false,replies:[]});
    $("topicDialog").close();$("topicForm").reset();
    announce("Example discussion submitted to the simulated moderator queue. It is not online or saved.");
    renderTopics();renderQueue();
  });
  $("replyForm").addEventListener("submit",event=>{
    event.preventDefault();
    if(!$("replyForm").reportValidity())return;
    const t=currentTopic();const body=$("replyBody").value.trim();
    if(!t||body.length<5)return;
    t.replies.push({id:"reply-"+(sequence++),body,status:"pending",sample:false});
    $("replyForm").reset();
    announce("Example reply submitted for simulated moderator review. Nothing was saved.");
    renderQueue();
  });
  $("moderatorMode").addEventListener("click",()=>{moderator=!moderator;renderQueue();});
  $("reportTopic").addEventListener("click",()=>{$("reportForm").reset();$("reportDialog").showModal();});
  $("cancelReport").addEventListener("click",()=>$("reportDialog").close());
  $("reportForm").addEventListener("submit",event=>{
    event.preventDefault();
    if(!$("reportForm").reportValidity())return;
    reports++;
    $("reportDialog").close();
    $("reportStatus").textContent=reports+" simulated reports submitted in this tab. No report was sent.";
    announce("Report recorded for the demonstration only. No real moderation ticket was created.");
  });
  const requested=new URLSearchParams(location.search).get("room");
  chooseRoom(roomDefinitions.some(r=>r.id===requested)?requested:roomDefinitions[0].id);
})();