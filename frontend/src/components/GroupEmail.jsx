import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { UserContext } from "../context/UserContext";

const GroupEmail = () => {
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [groupEmails, setGroupEmails] = useState([]);
  const [groupEmailInput, setGroupEmailInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [mode, setMode] = useState("cc");
  const [sendTo, setSendTo] = useState([]);
  const [sendCc, setSendCc] = useState([]);
  const [sendBcc, setSendBcc] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const navigate = useNavigate();
  const { user, token } = useContext(UserContext);

  // Fetch groups on component mount
  useEffect(() => {
    if (!user || !token) {
      navigate('/login');
      return;
    }
    
    fetchGroups();
  }, [user, token, navigate]);

  const fetchGroups = async () => {
    setLoadingGroups(true);
    try {
      const response = await axios.get("http://localhost:5000/api/groups", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setGroups(response.data.groups);
      }
    } catch (error) {
      console.error("Error fetching groups:", error);
      toast.error("Failed to load email groups");
    } finally {
      setLoadingGroups(false);
    }
  };

  const addGroupEmail = () => {
    if (groupEmailInput.trim() && !groupEmails.some(item => item.email === groupEmailInput.trim())) {
      setGroupEmails([...groupEmails, { 
        email: groupEmailInput.trim(), 
        name: nameInput.trim() || "" 
      }]);
      setGroupEmailInput("");
      setNameInput("");
    }
  };

  const removeGroupEmail = (email) => {
    setGroupEmails(groupEmails.filter((e) => e.email !== email));
  };

  const createGroup = async () => {
    if (groupName && groupEmails.length > 0) {
      setLoading(true);
      try {
        const response = await axios.post("http://localhost:5000/api/groups/create", 
          { name: groupName, emails: groupEmails },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (response.data.success) {
          toast.success(`Group "${groupName}" created successfully!`);
          setGroups([...groups, response.data.group]);
          setGroupName("");
          setGroupEmails([]);
        }
      } catch (error) {
        console.error("Error creating group:", error);
        toast.error(error.response?.data?.message || "Failed to create group");
      } finally {
        setLoading(false);
      }
    } else {
      toast.warning("Group name and at least one email are required");
    }
  };

  const handleSendEmail = async () => {
    if (!selectedGroup || !subject || !body) {
      toast.warning("Please select a group and fill in subject and body");
      return;
    }

    // Validate that at least one recipient type has members
    if (sendTo.length === 0 && sendCc.length === 0 && sendBcc.length === 0) {
      toast.warning("Please select at least one recipient type (To, CC, or BCC)");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/groups/send", 
        { 
          groupName: selectedGroup.name, 
          subject, 
          content: body,
          to: sendTo,
          cc: sendCc,
          bcc: sendBcc
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        toast.success(`Email sent to ${response.data.recipientCount} recipients in ${selectedGroup.name} group!`);
        setSubject("");
        setBody("");
      }
    } catch (error) {
      console.error("Error sending group email:", error);
      toast.error(error.response?.data?.message || "Failed to send group email");
    } finally {
      setLoading(false);
    }
  };

  // Update recipient selections when a group is selected or mode changes
  useEffect(() => {
    if (selectedGroup) {
      const recipients = selectedGroup.members.map(m => m.email);
      
      // Reset all recipient types
      setSendTo([]);
      setSendCc([]);
      setSendBcc([]);
      
      // Set recipients based on mode
      if (mode === "to") {
        setSendTo(recipients);
      } else if (mode === "cc") {
        setSendCc(recipients);
      } else if (mode === "bcc") {
        setSendBcc(recipients);
      }
    }
  }, [selectedGroup, mode]);

  // Helper to move recipients between categories
  const moveRecipients = (emails, fromList, setFromList, toList, setToList) => {
    if (!Array.isArray(emails)) emails = [emails];
    setFromList(fromList.filter(email => !emails.includes(email)));
    setToList([...new Set([...toList, ...emails])]);
  };

  // Helper to toggle individual recipient selection
  const toggleRecipient = (email, list, setList) => {
    if (list.includes(email)) {
      setList(list.filter(e => e !== email));
    } else {
      setList([...list, email]);
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
          <p className="text-pink-900/80 text-center text-sm">Create groups and send emails to all group members in one click.</p>
        </div>
        <div className="mb-4 w-full bg-white/60 border-2 border-dashed border-pink-300 rounded-2xl p-4 shadow-inner">
          <h4 className="font-semibold mb-2 text-pink-700">Create a Group</h4>
          <input
            type="text"
            placeholder="Group Name"
            value={groupName}
            onChange={e => setGroupName(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 mb-2 bg-white/80 shadow-sm"
          />
          <div className="flex flex-col gap-2 mb-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Contact Name (Optional)"
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                disabled={loading}
                className="flex-1 px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/80 shadow-sm"
              />
            </div>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email Address"
                value={groupEmailInput}
                onChange={e => setGroupEmailInput(e.target.value)}
                disabled={loading}
                className="flex-1 px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/80 shadow-sm"
              />
              <button 
                type="button" 
                onClick={addGroupEmail} 
                disabled={loading}
                className="px-3 py-2 bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-full shadow-lg hover:scale-110 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-pink-400 disabled:opacity-50">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-2 max-h-28 overflow-y-auto p-2 bg-white/50 rounded-lg">
            {groupEmails.length === 0 && <span className="text-gray-400 text-sm italic">Add emails to the group</span>}
            {groupEmails.map(item => (
              <span key={item.email} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center gap-1 text-sm shadow hover:bg-blue-200 transition-all">
                {item.name && <span className="font-medium">{item.name}:</span>}
                <span>{item.email}</span>
                <button 
                  type="button" 
                  onClick={() => removeGroupEmail(item.email)} 
                  disabled={loading}
                  className="ml-1 text-blue-500 hover:text-blue-700 focus:outline-none">&times;</button>
              </span>
            ))}
          </div>
          <button 
            type="button" 
            onClick={createGroup} 
            disabled={loading || !groupName || groupEmails.length === 0}
            className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 to-pink-500 text-white font-bold shadow-lg hover:scale-105 hover:from-pink-500 hover:to-blue-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-400 mb-2 disabled:opacity-50">
            {loading ? "Creating..." : "Create Group"}
          </button>
        </div>
        <div className="mb-4 w-full">
          <h4 className="font-semibold mb-2 text-pink-700">Your Groups</h4>
          <div className="flex flex-wrap gap-2 mb-2">
            {loadingGroups ? (
              <div className="text-center w-full py-2">
                <div className="animate-spin inline-block w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full"></div>
              </div>
            ) : groups.length === 0 ? (
              <span className="text-gray-400">No groups yet.</span>
            ) : (
              groups.map((g) => (
                <button 
                  key={g._id} 
                  type="button" 
                  onClick={() => setSelectedGroup(g)} 
                  disabled={loading}
                  className={`px-4 py-1 rounded-full font-semibold border ${
                    selectedGroup && selectedGroup._id === g._id 
                      ? 'bg-pink-500 text-white border-pink-500' 
                      : 'bg-white text-pink-700 border-pink-300'
                  } shadow hover:scale-105 transition flex items-center gap-2`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m13-3.13a4 4 0 10-8 0 4 4 0 008 0zm-8 0a4 4 0 10-8 0 4 4 0 008 0z" />
                  </svg>
                  {g.name} ({g.members.length})
                </button>
              ))
            )}
          </div>
        </div>
        {selectedGroup && (
          <form className="space-y-4 mt-2 w-full">
            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/80 shadow-sm"
            />
            <textarea
              placeholder="Email Body"
              value={body}
              onChange={e => setBody(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[100px] bg-white/80 shadow-sm"
            />
            
            {/* New Recipients Selection UI */}
            <div className="bg-white/80 p-4 rounded-lg shadow-sm border border-blue-200">
              <h4 className="font-semibold text-pink-700 mb-2">Recipients</h4>
              
              {/* Quick Selection Mode */}
              <div className="mb-4">
                <label className="text-sm font-medium text-pink-700 block mb-1">Quick Mode:</label>
                <div className="flex flex-wrap gap-2">
                  <button 
                    type="button"
                    onClick={() => setMode("to")}
                    className={`px-3 py-1 rounded-lg text-sm font-medium ${mode === "to" ? "bg-blue-500 text-white" : "bg-white text-blue-700 border border-blue-300"}`}
                  >
                    All to TO
                  </button>
                  <button 
                    type="button"
                    onClick={() => setMode("cc")}
                    className={`px-3 py-1 rounded-lg text-sm font-medium ${mode === "cc" ? "bg-blue-500 text-white" : "bg-white text-blue-700 border border-blue-300"}`}
                  >
                    All to CC
                  </button>
                  <button 
                    type="button"
                    onClick={() => setMode("bcc")}
                    className={`px-3 py-1 rounded-lg text-sm font-medium ${mode === "bcc" ? "bg-blue-500 text-white" : "bg-white text-blue-700 border border-blue-300"}`}
                  >
                    All to BCC
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      setSendTo([]);
                      setSendCc([]);
                      setSendBcc([]);
                      setMode("custom");
                    }}
                    className={`px-3 py-1 rounded-lg text-sm font-medium ${mode === "custom" ? "bg-blue-500 text-white" : "bg-white text-blue-700 border border-blue-300"}`}
                  >
                    Custom
                  </button>
                </div>
              </div>
              
              {/* Custom selection UI (visible when mode is 'custom') */}
              {mode === "custom" && (
                <div className="space-y-3">
                  {/* TO Recipients */}
                  <div>
                    <label className="text-sm font-medium text-blue-700 flex items-center gap-1">
                      <span>To:</span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full">{sendTo.length}</span>
                    </label>
                    <div className="flex flex-wrap gap-1 mt-1 p-2 bg-white/70 rounded border border-blue-100 min-h-[36px]">
                      {sendTo.length === 0 && <span className="text-gray-400 text-xs italic">No recipients</span>}
                      {selectedGroup.members
                        .filter(m => sendTo.includes(m.email))
                        .map(m => (
                          <span key={m.email} className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs flex items-center">
                            {m.name || m.email}
                            <button 
                              type="button" 
                              className="ml-1 text-blue-500 hover:text-blue-700"
                              onClick={() => toggleRecipient(m.email, sendTo, setSendTo)}
                            >×</button>
                          </span>
                        ))}
                    </div>
                  </div>
                  
                  {/* CC Recipients */}
                  <div>
                    <label className="text-sm font-medium text-green-700 flex items-center gap-1">
                      <span>Cc:</span>
                      <span className="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full">{sendCc.length}</span>
                    </label>
                    <div className="flex flex-wrap gap-1 mt-1 p-2 bg-white/70 rounded border border-green-100 min-h-[36px]">
                      {sendCc.length === 0 && <span className="text-gray-400 text-xs italic">No recipients</span>}
                      {selectedGroup.members
                        .filter(m => sendCc.includes(m.email))
                        .map(m => (
                          <span key={m.email} className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs flex items-center">
                            {m.name || m.email}
                            <button 
                              type="button" 
                              className="ml-1 text-green-500 hover:text-green-700"
                              onClick={() => toggleRecipient(m.email, sendCc, setSendCc)}
                            >×</button>
                          </span>
                        ))}
                    </div>
                  </div>
                  
                  {/* BCC Recipients */}
                  <div>
                    <label className="text-sm font-medium text-purple-700 flex items-center gap-1">
                      <span>Bcc:</span>
                      <span className="text-xs bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded-full">{sendBcc.length}</span>
                    </label>
                    <div className="flex flex-wrap gap-1 mt-1 p-2 bg-white/70 rounded border border-purple-100 min-h-[36px]">
                      {sendBcc.length === 0 && <span className="text-gray-400 text-xs italic">No recipients</span>}
                      {selectedGroup.members
                        .filter(m => sendBcc.includes(m.email))
                        .map(m => (
                          <span key={m.email} className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs flex items-center">
                            {m.name || m.email}
                            <button 
                              type="button" 
                              className="ml-1 text-purple-500 hover:text-purple-700"
                              onClick={() => toggleRecipient(m.email, sendBcc, setSendBcc)}
                            >×</button>
                          </span>
                        ))}
                    </div>
                  </div>
                  
                  {/* Available Recipients */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <span>Available Recipients:</span>
                      <span className="text-xs bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded-full">
                        {selectedGroup.members.filter(m => 
                          !sendTo.includes(m.email) && 
                          !sendCc.includes(m.email) && 
                          !sendBcc.includes(m.email)
                        ).length}
                      </span>
                    </label>
                    <div className="flex flex-wrap gap-1 mt-1 p-2 bg-white/70 rounded border border-gray-200 max-h-24 overflow-y-auto">
                      {selectedGroup.members
                        .filter(m => 
                          !sendTo.includes(m.email) && 
                          !sendCc.includes(m.email) && 
                          !sendBcc.includes(m.email)
                        )
                        .map(m => (
                          <div key={m.email} className="bg-gray-50 rounded px-2 py-0.5 text-xs flex items-center">
                            <span>{m.name || m.email}</span>
                            <div className="ml-1 flex gap-1">
                              <button 
                                type="button" 
                                title="Add to TO"
                                onClick={() => toggleRecipient(m.email, sendTo, setSendTo)}
                                className="text-xs text-blue-600 hover:text-blue-800"
                              >
                                To
                              </button>
                              <button 
                                type="button"
                                title="Add to CC"
                                onClick={() => toggleRecipient(m.email, sendCc, setSendCc)}
                                className="text-xs text-green-600 hover:text-green-800"
                              >
                                Cc
                              </button>
                              <button 
                                type="button"
                                title="Add to BCC"
                                onClick={() => toggleRecipient(m.email, sendBcc, setSendBcc)}
                                className="text-xs text-purple-600 hover:text-purple-800"
                              >
                                Bcc
                              </button>
                            </div>
                          </div>
                        ))}
                      {selectedGroup.members.filter(m => 
                        !sendTo.includes(m.email) && 
                        !sendCc.includes(m.email) && 
                        !sendBcc.includes(m.email)
                      ).length === 0 && (
                        <span className="text-gray-400 text-xs italic">All recipients have been assigned</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-3 text-sm">
                <p className="text-gray-600">
                  {mode === "to" && "All recipients will receive the email directly in the TO field (visible to all)."},
                  {mode === "cc" && "All recipients will receive the email in the CC field (visible to all)."},
                  {mode === "bcc" && "All recipients will receive the email in the BCC field (hidden from other recipients)."},
                  {mode === "custom" && "Recipients are distributed across TO, CC, and BCC fields as customized above."}
                </p>
              </div>
            </div>
            
            <button 
              type="button" 
              onClick={handleSendEmail} 
              disabled={loading || !subject || !body || (sendTo.length === 0 && sendCc.length === 0 && sendBcc.length === 0)}
              className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 to-pink-500 text-white font-bold shadow-lg hover:scale-105 hover:from-pink-500 hover:to-blue-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-lg disabled:opacity-50">
              {loading ? "Sending..." : `Send Email to ${(sendTo.length + sendCc.length + sendBcc.length)} Recipients`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default GroupEmail;