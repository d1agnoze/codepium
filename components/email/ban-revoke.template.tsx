import * as React from "react";

interface EmailTemplateProps {
  userName: string;
}

export const BanRevoke: React.FC<Readonly<EmailTemplateProps>> = ({
  userName,
}) => {
  const rootStyle: React.CSSProperties = {
    padding: "20px 10px",
    backgroundColor: "black",
    color: "white",
    borderRadius: "10px",
  };
  const buttonStyle: React.CSSProperties = {
    padding: "10px",
    background: "#81ed33",
    color: "black",
    borderRadius: "5px",
    textDecoration: "none",
    display: "inline-block",
    fontWeight: "bold",
  };
  const footerStyle: React.CSSProperties = {
    marginTop: "30px",
  };
  return (
    <div style={rootStyle}>
      <h1>Hi there, {userName}!</h1>
      <p>Your codepium ban has been revoked.</p>
      <p>and all your accesses to codepium has now return to normal</p>
      <a href="#" style={buttonStyle}>
        Go to Codepium
      </a>
      <br />
      <br />
      <strong style={footerStyle}>Codepium Team</strong>
    </div>
  );
};
