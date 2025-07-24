import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const GroupEmail = () => {
  const [groups, setGroups] = useState([]); // [{name: string, emails: []}]
  const [groupName, setGroupName] = useState("");
  const [groupEmails, setGroupEmails] = useState([]);
  const [groupEmailInput, setGroupEmailInput] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const navigate = useNavigate();

  const addGroupEmail = () => {
    if (groupEmailInput && !groupEmails.includes(groupEmailInput)) {
      setGroupEmails([...groupEmails, groupEmailInput]);
      setGroupEmailInput("");
    }
  };
  const removeGroupEmail = (email) => {
    setGroupEmails(groupEmails.filter((e) => e !== email));
  };
  const createGroup = () => {
    if (groupName && groupEmails.length > 0) {
      setGroups([...groups, { name: groupName, emails: groupEmails }]);
      setGroupName("");
      setGroupEmails([]);
    }
  };

  return (
    <div className="min-w-screen min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 py-10 px-2">
      <div className="w-full max-w-xl bg-white/30 border-4 border-transparent bg-clip-padding backdrop-blur-2xl rounded-3xl shadow-2xl p-8 flex flex-col items-center animate-fade-in relative">
        <button onClick={() => navigate("/dashboard")} className="self-start mb-4 text-pink-600 hover:underline font-semibold">&larr; Back to Dashboard</button>
        <div className="flex flex-col items-center mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-blue-400 flex items-center justify-center shadow-lg mb-2 animate-fade-in">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m13-3.13a4 4 0 10-8 0 4 4 0 008 0zm-8 0a4 4 0 10-8 0 4 4 0 008 0z" /></svg>
          </div>
          <h2 className="text-3xl font-extrabold text-pink-700 mb-1 tracking-tight drop-shadow">Send in a Group</h2>
          <p className="text-pink-900/80 text-center text-sm">Create groups and send emails to all group members in one click (all in CC).</p>
        </div>
        <div className="mb-4 w-full bg-white/60 border-2 border-dashed border-pink-300 rounded-2xl p-4 shadow-inner">
          <h4 className="font-semibold mb-2 text-pink-700">Create a Group</h4>
          <input
            type="text"
            placeholder="Group Name"
            value={groupName}
            onChange={e => setGroupName(e.target.value)}
            className="w-full px-4 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 mb-2 bg-white/80 shadow-sm"
          />
          <div className="flex gap-2 mb-2">
            <input
              type="email"
              placeholder="Add group member email"
              value={groupEmailInput}
              onChange={e => setGroupEmailInput(e.target.value)}
              className="flex-1 px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/80 shadow-sm"
            />
            <button type="button" onClick={addGroupEmail} className="px-3 py-2 bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-full shadow-lg hover:scale-110 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-pink-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            {groupEmails.map(email => (
              <span key={email} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center gap-1 text-sm shadow hover:bg-blue-200 transition-all">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 12H8m8 0a4 4 0 11-8 0 8 8 0 1116 0 8 8 0 01-16 0z" /></svg>
                {email}
                <button type="button" onClick={() => removeGroupEmail(email)} className="ml-1 text-blue-500 hover:text-blue-700 focus:outline-none">&times;</button>
              </span>
            ))}
          </div>
          <button type="button" onClick={createGroup} className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 to-pink-500 text-white font-bold shadow-lg hover:scale-105 hover:from-pink-500 hover:to-blue-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-400 mb-2">Create Group</button>
        </div>
        <div className="mb-4 w-full">
          <h4 className="font-semibold mb-2 text-pink-700">Your Groups</h4>
          <div className="flex flex-wrap gap-2 mb-2">
            {groups.length === 0 && <span className="text-gray-400">No groups yet.</span>}
            {groups.map((g, idx) => (
              <button key={g.name + idx} type="button" onClick={() => setSelectedGroup(g)} className={`px-4 py-1 rounded-full font-semibold border ${selectedGroup && selectedGroup.name === g.name ? 'bg-pink-500 text-white border-pink-500' : 'bg-white text-pink-700 border-pink-300'} shadow hover:scale-105 transition flex items-center gap-2`}>
                <svg className="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m13-3.13a4 4 0 10-8 0 4 4 0 008 0zm-8 0a4 4 0 10-8 0 4 4 0 008 0z" /></svg>
                {g.name}
              </button>
            ))}
          </div>
        </div>
        {selectedGroup && (
          <form className="space-y-4 mt-2 w-full">
            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/80 shadow-sm"
            />
            <textarea
              placeholder="Email Body"
              value={body}
              onChange={e => setBody(e.target.value)}
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[100px] bg-white/80 shadow-sm"
            />
            <div className="text-xs text-gray-500 mb-2">All group members will be in CC: <span className="font-semibold text-blue-700">{selectedGroup.emails.join(", ")}</span></div>
            <button type="button" className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 to-pink-500 text-white font-bold shadow-lg hover:scale-105 hover:from-pink-500 hover:to-blue-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-lg">Send to Group (Frontend Only)</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default GroupEmail; 