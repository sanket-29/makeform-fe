import React from "react";

export interface OwnerConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  to: string;
  cc?: string;
  subject: string;
  message: string;
  onSendServer?: (emailData: { to: string; cc?: string; subject: string; message: string }) => void;
}

const OwnerConfirmationModal: React.FC<OwnerConfirmationModalProps> = ({
  open,
  onClose,
  to,
  cc = "",
  subject,
  message,
  onSendServer,
}) => {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "auto", background: "rgba(0,0,0,0.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 4, width: 750, maxWidth: "98vw", padding: 0, border: "1px solid #f2f2f2", position: "relative", maxHeight: "94vh", overflowY: "auto", display: "flex", flexDirection: "column" }}>
        <div style={{ fontWeight: 500, fontSize: 20, padding: "14px 0 0 10px", color: "#249ca6", letterSpacing: 0.5 }}>SEND EMAIL</div>
        <div style={{ padding: "0 18px 0 18px" }}>
          <div style={{ borderTop: "1px solid #eee", borderLeft: "1px solid #eee", borderRight: "1px solid #eee", borderBottom: "none", background: "#fafbfc", marginBottom: 0 }} />
          <div style={{ padding: "14px 0 0 0" }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 0 }}>
              <div style={{ width: 110, fontWeight: 600, color: "#111", fontSize: 14 }}>TO</div>
              <input style={{ flex: 1, padding: "8px 8px", border: "1px solid #e5e5e5", borderRadius: 3, background: "#fff", color: "#222", fontWeight: 400, fontSize: 15, outline: "none", boxShadow: "none" }} value={to} readOnly onFocus={(e: React.FocusEvent<HTMLInputElement>) => { e.currentTarget.style.borderColor = '#e5e5e5'; e.currentTarget.style.outline = 'none'; e.currentTarget.style.boxShadow = 'none'; }} onBlur={(e: React.FocusEvent<HTMLInputElement>) => { e.currentTarget.style.borderColor = '#e5e5e5'; e.currentTarget.style.boxShadow = 'none'; }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 0 }}>
              <div style={{ width: 110, fontWeight: 600, color: "#111", fontSize: 14 }}>CC</div>
              <input style={{ flex: 1, padding: "8px 8px", border: "1px solid #e5e5e5", borderRadius: 3, background: "#fff", color: "#222", fontWeight: 400, fontSize: 15, outline: "none", boxShadow: "none" }} value={cc} readOnly onFocus={(e: React.FocusEvent<HTMLInputElement>) => { e.currentTarget.style.borderColor = '#e5e5e5'; e.currentTarget.style.outline = 'none'; e.currentTarget.style.boxShadow = 'none'; }} onBlur={(e: React.FocusEvent<HTMLInputElement>) => { e.currentTarget.style.borderColor = '#e5e5e5'; e.currentTarget.style.boxShadow = 'none'; }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 0 }}>
              <div style={{ width: 110, fontWeight: 600, color: "#111", fontSize: 14 }}>SUBJECT</div>
              <input style={{ flex: 1, padding: "8px 8px", border: "1px solid #e5e5e5", borderRadius: 3, background: "#fff", color: "#222", fontWeight: 400, fontSize: 15, outline: "none", boxShadow: "none" }} value={subject} readOnly onFocus={(e: React.FocusEvent<HTMLInputElement>) => { e.currentTarget.style.borderColor = '#e5e5e5'; e.currentTarget.style.outline = 'none'; e.currentTarget.style.boxShadow = 'none'; }} onBlur={(e: React.FocusEvent<HTMLInputElement>) => { e.currentTarget.style.borderColor = '#e5e5e5'; e.currentTarget.style.boxShadow = 'none'; }} />
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 0 }}>
              <div style={{ width: 110, fontWeight: 600, color: "#111", fontSize: 14, paddingTop: 6 }}>MESSAGE</div>
              {message && /<(table|div|p|br)/i.test(message) ? (
                <div
                  style={{
                    flex: 1,
                    padding: "8px 8px",
                    border: "1px solid #e5e5e5",
                    borderRadius: 3,
                    background: "#fff",
                    color: "#222",
                    fontWeight: 400,
                    fontSize: 15,
                    fontFamily: "inherit",
                    boxSizing: "border-box",
                    marginTop: 0,
                    width: "100%",
                    outline: "none",
                    boxShadow: "none",
                    overflow: "hidden",
                    minHeight: "74vh",
                    whiteSpace: "normal"
                  }}
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{ __html: `<style>p{margin:0 0 25px 0;}</style>${message}` }}
                />
              ) : (
                <textarea style={{ flex: 1, padding: "8px 8px", border: "1px solid #e5e5e5", borderRadius: 3, background: "#fff", color: "#222", fontWeight: 400, fontSize: 15, fontFamily: "inherit", resize: "none", whiteSpace: "pre-wrap", wordBreak: "break-word", overflow: "hidden", boxSizing: "border-box", marginTop: 0, display: "flex", minHeight: 600, width: "100%", outline: "none", boxShadow: "none" }} readOnly value={message} rows={Math.max(3, message.split('\n').length + 1)} onFocus={(e: React.FocusEvent<HTMLTextAreaElement>) => { e.currentTarget.style.borderColor = '#e5e5e5'; e.currentTarget.style.outline = 'none'; e.currentTarget.style.boxShadow = 'none'; }} onBlur={(e: React.FocusEvent<HTMLTextAreaElement>) => { e.currentTarget.style.borderColor = '#e5e5e5'; e.currentTarget.style.boxShadow = 'none'; }} />
              )}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, padding: "24px 18px 18px 18px" }}>
          <button style={{ background: "#22b8cf", color: "#fff", border: 0, borderRadius: 3, padding: "10px 28px", fontWeight: 600, cursor: "pointer", fontSize: 16 }} onClick={() => onSendServer?.({ to, cc, subject, message })}>SEND</button>
          <button style={{ background: "#eee", color: "#222", border: 0, borderRadius: 3, padding: "10px 28px", fontWeight: 600, cursor: "pointer", fontSize: 16 }} onClick={onClose}>CLOSE</button>
        </div>
      </div>
    </div>
  );
};

export default OwnerConfirmationModal;
