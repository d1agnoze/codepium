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
    textAlign: "center",
  };
  const buttonStyle: React.CSSProperties = {
    padding: "10px",
    background: "#81ed33",
    color: "black",
    borderRadius: "5px",
    textDecoration: "none",
    fontWeight: "bold",
    width: "300px",
    marginLeft: "auto",
    marginRight: "auto",
  };
  const textStyle: React.CSSProperties = { color: "white" };
  const footerStyle: React.CSSProperties = { marginTop: "30px" };
  return (
    <div style={rootStyle}>
      <h1>Hi there, {userName}!</h1>
      <p style={textStyle}>Your codepium ban has been revoked.</p>
      <p style={textStyle}>All your accesses to codepium has now return to normal</p>
      <a href="#" style={buttonStyle}>
        Go to Codepium
      </a>
      <br />
      <br />
      <footer style={footerStyle}>
        <strong style={textStyle}>Codepium Team</strong>
      </footer>
    </div>
  );
};
