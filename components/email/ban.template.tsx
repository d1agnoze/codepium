import * as React from "react";

interface EmailTemplateProps {
  userName: string;
  duration: string;
  reason: string;
}

export const BanTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  userName,
  duration,
  reason,
}) => {
  const rootStyle: React.CSSProperties = {
    padding: "20px 10px",
    backgroundColor: "black",
    color: "white",
    borderRadius: "10px",
    textAlign: "center",
  };
  const footerStyle: React.CSSProperties = { marginTop: "30px" };
  return (
    <div style={rootStyle}>
      <h1>Hi there, {userName}!</h1>
      <p>We are sorry to inform you that your codepium has been banned</p>
      <p>Ban reason: {reason}</p>
      <p>Ban duration: {duration}</p>
      <br />
      <footer style={footerStyle}>
        <strong>Codepium Team</strong>
      </footer>
    </div>
  );
};
