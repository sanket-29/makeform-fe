"use client";

import {
  Mail,
  Paperclip,
  Link2,
  Pencil,
  Eye,
  Trash2,
  MessageCircle,
  NotebookPen,
  CheckCircle,
  ListChecks,
  DollarSign,
  FileCheck,
  SearchIcon,
} from "lucide-react";
import ToolIcon from "./tools-icon";
import ActionButtons from "./right-action-buttons";
import { useState, useEffect } from "react"; // ✅ added
import SignOffs from "../screens/signoff";
import Checklist from "../screens/checklist";
import PayFee from "../screens/payfee";
import IssuePermit from "../screens/issue-permit";
import Inspection from "../screens/inspection";
import CertificateOfOccupancy from "../screens/certificateofoccupancy";
import EditApplication from "../screens/edit-application";
import Notes from "../screens/notes";
import Attachments from "../screens/attachments";
import SendEmail from "../screens/send-email";
import Chat from "../screens/chat";
import ChangeStatus from "../screens/change-status";
// import TransactionStepper from "./transaction-stepper";
import TransactionStepper from "./transaction-stepper";
import LinkUser from "../screens/linkuser";

interface ApplicationForm {
  _id: string;
  status?: string;
  [key: string]: unknown;
}

export default function RightPanel({ activeId, forms, onFormsUpdate }: { activeId: string; forms?: ApplicationForm[]; onFormsUpdate?: () => void }) {
  const [activeAction, setActiveAction] = useState<string>("");
  const [activeTool, setActiveTool] = useState<string>("");

   const [isUserLinked, setIsUserLinked] = useState(false);
   
   const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  // Get current form's status
  const currentForm = forms?.find((f: ApplicationForm) => f._id === activeId);
  const currentStatus = currentForm?.status;

  // Handle status update in parent
  const handleStatusUpdated = () => {
    onFormsUpdate?.();
  };
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);


  // 🔥 FETCH PROGRESS FROM BACKEND
  useEffect(() => {
    if (!activeId) return;

    const fetchProgress = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/transactions/${activeId}`
        );

        const data = await res.json();

        if (data.success) {
          const completed = new Set<string>();

          Object.entries(data.progress).forEach(([key, value]) => {
            if (value) {
              completed.add(key);
            }
          });

          setCompletedSteps(completed);
        }
      } catch (error) {
        console.error("Error fetching progress:", error);
      }
    };

    fetchProgress();
  }, [activeId]);

  useEffect(() => {
    if (!activeId) return;

    const fetchLinkedUser = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/link-user/${activeId}`
        );
        const data = await res.json();

        setIsUserLinked(!!data.userId);
      } catch (err) {
        console.error("Link user fetch error", err);
      }
    };

    fetchLinkedUser();
  }, [activeId]);

  //delete application function
  const handleDelete = async () => {
    if (!activeId) return;

    try {
      setIsDeleting(true);

      const res = await fetch(
        `http://localhost:5000/api/form/delete/${activeId}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (data.success) {
        alert("Application deleted successfully");

        setShowDeleteModal(false);

        // 🔥 Quick refresh (can optimize later)
        window.location.reload();
      } else {
        alert(data.message || "Delete failed");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setIsDeleting(false);
    }
  };



  // 🔥 STEP DEFINITIONS (must match backend keys)
  const steps = [
    {
      id: "signoffs",
      label: "Sign Off",
      completed: completedSteps.has("signoffs"),
      icon: <CheckCircle className="text-blue-400" size={20} />,
    },
    {
      id: "checklist",
      label: "Checklist",
      completed: completedSteps.has("checklist"),
      icon: <ListChecks className="text-yellow-400" size={20} />,
    },
    {
      id: "payfee",
      label: "Pay Fee",
      completed: completedSteps.has("payfee"),
      icon: <DollarSign className="text-green-400" size={20} />,
    },
    {
      id: "permit",
      label: "Issue Permit",
      completed: completedSteps.has("permit"),
      icon: <FileCheck className="text-purple-400" size={20} />,
    },
    {
      id: "inspection",
      label: "Inspection",
      completed: completedSteps.has("inspection"),
      icon: <SearchIcon className="text-cyan-400" size={20} />,
    },
  ];

  return (
    <div className="w-1/2 h-full min-h-0 bg-zinc-950 border border-white/10 rounded-xl p-6 flex flex-col overflow-hidden">
      {!activeId ? (
        <div className="text-gray-400">
          Select an application to manage
        </div>
      ) : (
        <>
          {/* 🔥 Stepper */}
          {/* <div className="flex-shrink-0">
            <TransactionStepper steps={steps} />
          </div> */}

          {/* 🔥 Toolbar */}
          <div className="flex-shrink-0">
            <div className="flex flex-wrap items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2 w-full">

              {/* <ToolIcon label="Print Envelope" icon={<Mail size={16} />} /> */}

              <ToolIcon
                label="Attachments"
                icon={<Paperclip size={16} />}
                active={activeTool === "attachments"}
                onClick={() => {
                  setActiveAction("attachments");
                  setActiveTool("attachments");
                }}
              />

              <ToolIcon
                label="Chat"
                icon={<MessageCircle size={16} />}
                active={activeTool === "chat"}
                onClick={() => {
                  setActiveAction("chat");
                  setActiveTool("chat");
                }}
              />

             <ToolIcon
                label="Link User"
                icon={<Link2 size={16} />}
                active={activeTool === "linkuser" || isUserLinked}
                onClick={() => {
                  setActiveTool("linkuser");
                  setActiveAction("linkuser");
                }}
              />

              <ToolIcon
                label="Edit application"
                icon={<Pencil size={16} />}
                active={activeTool === "edit"}
                onClick={() => {
                  setActiveTool("edit");
                  setActiveAction("edit");
                }}
              />

              <ToolIcon label="View application" icon={<Eye size={16} />} />

              <ToolIcon
                label="Notes"
                icon={<NotebookPen size={16} />}
                active={activeTool === "notes"}
                onClick={() => {
                  setActiveTool("notes");
                  setActiveAction("notes");
                }}
              />


              <ToolIcon
                label="Send Email"
                icon={<Mail size={16} />}
                active={activeTool === "send-email"}
                onClick={() => {
                  setActiveAction("send-email");
                  setActiveTool("send-email");
                }}
              />

              <ToolIcon
                label="Delete application"
                icon={<Trash2 size={16} />}
                danger
                onClick={() => setShowDeleteModal(true)}
              />

               <button
                onClick={() => {
                  setActiveTool("change-status");
                  setActiveAction("change-status");
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors text-sm font-medium whitespace-nowrap ${
                  activeTool === "change-status"
                    ? "bg-blue-500/30 border-blue-500/50 text-blue-400"
                    : "bg-gray-500/10 hover:bg-gray-100/30 border-gray-500/20 text-gray-400 hover:text-gray-300"
                }`}
              >
                Change Status
              </button>

            </div>
          </div>

          {/* 🔥 Action Buttons */}
          <div className="flex-shrink-0 mt-4">
            <ActionButtons
              activeAction={activeAction}
              completedSteps={completedSteps}
              onActionChange={(action) => {
                setActiveAction(action);
                setActiveTool("");
              }}
            />
          </div>

          {/* 🔥 Content */}
          <div className="flex-1 mt-4 border-t border-white/10 pt-4 overflow-y-auto custom-scrollbar">

            {activeAction === "signoffs" && (
              <SignOffs applicationId={activeId} />
            )}

            {activeAction === "checklist" && (
              <Checklist applicationId={activeId} />
            )}

            {activeAction === "payfee" && (
              <PayFee applicationId={activeId} />
            )}

            {activeAction === "permit" && <IssuePermit />}

            {activeAction === "inspection" && (
              <Inspection applicationId={activeId} />
            )}

            {activeAction === "change-status" && (
              <ChangeStatus applicationId={activeId} currentStatus={currentStatus} onStatusUpdated={handleStatusUpdated} />
            )}

            {activeAction === "certificate" && (
              <CertificateOfOccupancy />
            )}

            {activeAction === "edit" && <EditApplication />}

            {activeAction === "notes" && (
              <Notes applicationId={activeId} /> 
            )}

            {activeAction === "attachments" && <Attachments applicationId={activeId}/>}

            {activeAction === "send-email" && <SendEmail applicationId={activeId} />}

            {activeAction === "chat" && (
              <Chat applicationId={activeId} role="staff" />
            )}

              {activeAction === "linkuser" && (
              <LinkUser applicationId={activeId} />
            )}
            
          </div>
        </>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-zinc-900 p-6 rounded-xl border border-white/10 w-[350px]">
            
            <h2 className="text-lg font-semibold text-white mb-2">
              Delete Application
            </h2>

            <p className="text-gray-400 text-sm mb-6">
              Are you sure you want to delete this application?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm bg-white/10 hover:bg-white/20 rounded-md"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={isDeleting}
                 className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 rounded-md text-white"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}