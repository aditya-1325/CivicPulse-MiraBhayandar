export const LOCATIONS = ['Golden Nest Colony','Maxus Mall','Bhayandar Station','Pleasant Park','Shanti Nagar','Navghar Road','Mira Road Station','Kashimira Circle'];
export const ISSUE_TYPES = ['Pothole','Water Leak','Street Light Out','Garbage Dump','Drainage Block','Road Damage','Illegal Parking','Noise Complaint'];
export const CATEGORIES = ['All Issues','Health','Infrastructure','Sanitation','Water Supply'];

export const MAP_PINS = [
  { id:1, x:420, y:120, label:'Golden Nest', status:'open', issue:'Pothole on main road', location:'Golden Nest Colony', date:'28 Apr 2026' },
  { id:2, x:480, y:210, label:'Bhayandar Stn', status:'open', issue:'Water leak near station', location:'Bhayandar Station', date:'27 Apr 2026' },
  { id:3, x:510, y:280, label:'Maxus Mall', status:'progress', issue:'Street light malfunction', location:'Maxus Mall Area', date:'25 Apr 2026' },
  { id:4, x:450, y:350, label:'Pleasant Park', status:'resolved', issue:'Garbage cleared', location:'Pleasant Park', date:'22 Apr 2026' },
  { id:5, x:520, y:410, label:'Shanti Nagar', status:'open', issue:'Drainage overflow', location:'Shanti Nagar', date:'29 Apr 2026' },
  { id:6, x:470, y:470, label:'Navghar', status:'progress', issue:'Road resurfacing needed', location:'Navghar Road', date:'26 Apr 2026' },
  { id:7, x:500, y:530, label:'Mira Road Stn', status:'open', issue:'Illegal parking zone', location:'Mira Road Station', date:'29 Apr 2026' },
  { id:8, x:540, y:590, label:'Kashimira', status:'resolved', issue:'Noise resolved', location:'Kashimira Circle', date:'20 Apr 2026' },
  { id:9, x:300, y:200, label:'Uttan', status:'progress', issue:'Water supply disruption', location:'Uttan Village', date:'24 Apr 2026' },
  { id:10, x:560, y:340, label:'RTO Office', status:'open', issue:'Pothole cluster', location:'RTO Office Road', date:'28 Apr 2026' },
  { id:11, x:490, y:160, label:'Thakur Complex', status:'resolved', issue:'Sanitation improved', location:'Thakur Complex', date:'18 Apr 2026' },
  { id:12, x:380, y:270, label:'', status:'open', issue:'Broken sidewalk', location:'Bhayandar West', date:'29 Apr 2026' },
  { id:13, x:530, y:450, label:'', status:'progress', issue:'Pipe repair ongoing', location:'Shanti Nagar South', date:'27 Apr 2026' },
  { id:14, x:460, y:550, label:'', status:'open', issue:'Street light out', location:'Mira Road East', date:'30 Apr 2026' },
  { id:15, x:440, y:430, label:'', status:'resolved', issue:'Garbage cleared', location:'Navghar Market', date:'21 Apr 2026' },
];

export const STEPPER_STAGES = [
  { label:'Submitted', date:'Jun 12, 10:23 AM' },
  { label:'Acknowledged', date:'Jun 12, 2:15 PM' },
  { label:'Staff Assigned', date:'Jun 13, 9:00 AM' },
  { label:'Work In Progress', date:null },
  { label:'Resolved', date:null },
];

export const ACTIVITY_ACTIONS = [
  { action:'New complaint registered', icon:'plus', status:'open' },
  { action:'Complaint resolved', icon:'check', status:'resolved' },
  { action:'Staff assigned to issue', icon:'user', status:'progress' },
  { action:'Status updated', icon:'clock', status:'progress' },
  { action:'Inspection completed', icon:'search', status:'resolved' },
  { action:'Priority escalated', icon:'alert', status:'open' },
];

export const CHAT_MESSAGES = [
  { from:'ai', text:"Hello! I'm CivicAI. What issue are you facing? (Pothole / Water / Waste / Streetlight / Other)" },
  { from:'user', text:"Large pothole near Golden Nest entry gate, very dangerous" },
  { from:'ai', text:"Got it! Location: Golden Nest Colony, Ward 7. Severity: HIGH. Routing to Public Works dept. Your ID will be #MB-2891. Confirm submission?" },
];
