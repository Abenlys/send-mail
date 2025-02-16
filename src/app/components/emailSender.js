import React, { useState } from "react";

const messageCandidature = "test"

const EmailSender = () => {
  const [emails, setEmails] = useState("");
  const [subject, setSubject] = useState("Candidature spontanée");
  const [message, setMessage] = useState(messageCandidature);
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const sendEmail = async (e) => {
    e.preventDefault();
    if (!emails || !subject || !file) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    const formData = new FormData();
    formData.append("emails", emails);
    formData.append("subject", subject);
    formData.append("message", message);
    formData.append("file", file);

    try {
      const response = await fetch("/api/route", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        alert("Email envoyé avec succès !");
      } else {
        alert("Erreur : " + result.error);
      }
    } catch (error) {
      console.error("Erreur :", error);
      alert("Une erreur est survenue.");
    }
  };

  return (
    <form onSubmit={sendEmail} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px" }}>
      <input type="text" placeholder="Emails (séparés par des virgules)" value={emails} onChange={(e) => setEmails(e.target.value)} />
      <input type="text" placeholder="Objet du mail" value={subject} onChange={(e) => setSubject(e.target.value)} />
      <textarea placeholder="Message (optionnel)" value={message} onChange={(e) => setMessage(e.target.value)} />
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button type="submit">Envoyer</button>
    </form>
  );
};

export default EmailSender;
