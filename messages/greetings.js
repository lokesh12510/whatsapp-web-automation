

function createRegistrationMessage(data) {

  const {name, std, competitions} = data

  return `Hello ${name}! 👋
   
   We are happy to inform you that your registration for *Talent Chase* has been received. You're participating in the following competition(s): *${competitions}*.
   
   📚 Class: ${std}
   
   📅 Stay tuned for event updates via WhatsApp.
   
   Best wishes! ✨`;
}

function remainderForRegistrationMessage(data) {
  const { name, village } = data;

  return `Hello ${name}! 👋

Hope you're doing well. Here's a friendly reminder from the *Talent Chase* team! 🎉

🎯 *Talent Chase 2025 - Season 4* is officially open for registration!  
Organized by *Thambatty Vivekanandar Illaignar Narpani Mandram*, this is your chance to showcase your talent! 🏆

📌 *Registration is open only for students from LKG to VIII STD.*  
🗓️ *Last date to register: 10th May 2025*
Once registered, you'll be added to a WhatsApp group for all further updates.

📝 Fill out the registration form here:  
🔗 https://forms.gle/VfzohRmuXDhvyb286  
Or visit our website for full details:  
🌐 https://www.tvinm.com

📍We’d also love your support in spreading the word with your friends and family in *${village}*.

Don't miss out — register soon and be part of *Talent Chase 2025*! 🤩

Warm regards,  
Talent Chase Team ✨`;
}

module.exports = {
  createRegistrationMessage,
  remainderForRegistrationMessage
};
   